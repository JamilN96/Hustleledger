import React from 'react';
import test from 'node:test';
import assert from 'node:assert/strict';
import { render, fireEvent } from '@testing-library/react-native';

const NavigationContainer = ({ children }) => React.createElement(React.Fragment, null, children);

const DummyStack = {
  Navigator: ({ children }) => React.createElement(React.Fragment, null, children),
  Screen: ({ name, children, component: Component }) => {
    const navigation = {
      navigate: () => {},
      replace: () => {},
      push: () => {},
      pop: () => {},
      popToTop: () => {},
      goBack: () => {},
      setParams: () => {},
      setOptions: () => {},
    };
    const route = { key: name ?? 'screen', name: name ?? 'Screen', params: {} };

    if (typeof children === 'function') {
      return children({ navigation, route });
    }

    if (Component) {
      return React.createElement(Component, { navigation, route });
    }

    return null;
  },
};

const Placeholder = () => null;

test('Welcome shows auth actions and navigates to sign in', async (t) => {
  const module = await import('../screens/Welcome.js');
  const Welcome = module.default ?? module;

  const navigate = t.mock.fn();

  const { findByText, getByText } = render(
    React.createElement(
      NavigationContainer,
      null,
      React.createElement(
        DummyStack.Navigator,
        null,
        React.createElement(DummyStack.Screen, {
          name: 'Welcome',
          children: (props) =>
            React.createElement(Welcome, {
              ...props,
              navigation: { ...props.navigation, navigate },
            }),
        }),
        React.createElement(DummyStack.Screen, { name: 'SignIn', component: Placeholder }),
        React.createElement(DummyStack.Screen, { name: 'SignUp', component: Placeholder }),
      ),
    ),
  );

  const signInButton = await findByText('Sign In');
  const createAccountButton = getByText('Create account');

  assert.ok(signInButton);
  assert.ok(createAccountButton);

  fireEvent.press(signInButton);

  assert.equal(navigate.mock.callCount(), 1);
  assert.deepEqual(navigate.mock.calls[0].arguments, ['SignIn']);
});
