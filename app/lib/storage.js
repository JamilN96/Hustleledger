import AsyncStorage from '@react-native-async-storage/async-storage';

async function getItem(key, fallback) {
  try {
    const stored = await AsyncStorage.getItem(key);
    if (stored == null) {
      return fallback;
    }
    return JSON.parse(stored);
  } catch (error) {
    if (__DEV__) {
      console.warn(`AsyncStorage getItem failed for ${key}`, error);
    }
    return fallback;
  }
}

async function setItem(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (__DEV__) {
      console.warn(`AsyncStorage setItem failed for ${key}`, error);
    }
    return false;
  }
}

async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    if (__DEV__) {
      console.warn(`AsyncStorage removeItem failed for ${key}`, error);
    }
    return false;
  }
}

export { getItem, setItem, removeItem };
