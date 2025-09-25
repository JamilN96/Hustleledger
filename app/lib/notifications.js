import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const CHANNEL_ID = 'recurring-transactions';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function configureNotifications() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Recurring Transactions',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const settings = await Notifications.getPermissionsAsync();
    if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
      return true;
    }
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted || requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  } catch (error) {
    if (__DEV__) {
      console.warn('Notification configuration failed', error);
    }
    return false;
  }
}

async function sendRecurringNotification({ title, amount }, occurrenceDate) {
  try {
    const currency = typeof amount === 'number' ? amount : Number(amount ?? 0);
    const formattedAmount = Number.isFinite(currency)
      ? new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(currency)
      : '$0.00';
    const dateLabel = occurrenceDate?.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Recurring Transaction Added',
        body: `${title} ${formattedAmount} added for ${dateLabel}`,
      },
      trigger: null,
    });
  } catch (error) {
    if (__DEV__) {
      console.warn('Failed to send recurring notification', error);
    }
  }
}

async function scheduleReminderNotification(transaction) {
  if (!transaction?.remindOneDayBefore || !transaction.nextOccurrence) {
    return null;
  }
  const occurrence = new Date(transaction.nextOccurrence);
  const reminderDate = new Date(occurrence.getTime());
  reminderDate.setDate(reminderDate.getDate() - 1);
  reminderDate.setHours(9, 0, 0, 0);

  if (reminderDate <= new Date()) {
    return null;
  }

  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Upcoming Recurring Transaction',
        body: `${transaction.title} is scheduled for tomorrow`,
      },
      trigger: reminderDate,
    });
  } catch (error) {
    if (__DEV__) {
      console.warn('Failed to schedule reminder notification', error);
    }
    return null;
  }
}

async function cancelScheduledNotification(identifier) {
  if (!identifier) {
    return;
  }
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch (error) {
    if (__DEV__) {
      console.warn('Failed to cancel notification', error);
    }
  }
}

export { cancelScheduledNotification, configureNotifications, scheduleReminderNotification, sendRecurringNotification };
