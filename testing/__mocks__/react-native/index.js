/* eslint-env commonjs */
/* globals module */

const Appearance = {
  getColorScheme() {
    return 'dark';
  },
  addChangeListener() {
    return { remove() {} };
  },
};

const View = 'View';
const Text = 'Text';
const Pressable = 'Pressable';
const ScrollView = 'ScrollView';
const KeyboardAvoidingView = 'KeyboardAvoidingView';
const SafeAreaView = 'SafeAreaView';
const TextInput = 'TextInput';
const Switch = 'Switch';
const Modal = 'Modal';
const StatusBar = () => null;
const StyleSheet = {
  create(styles) {
    return styles;
  },
  flatten(style) {
    return style;
  },
  absoluteFillObject: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
};
const Platform = {
  OS: 'ios',
  select(map) {
    return map?.ios ?? map?.default;
  },
};
const Alert = {
  alert() {},
};
const AppState = {
  addEventListener() {
    return { remove() {} };
  },
};

module.exports = {
  Appearance,
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Platform,
  Alert,
  AppState,
  TextInput,
  Switch,
  Modal,
  default: {
    Appearance,
    View,
    Text,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Platform,
    Alert,
    AppState,
    TextInput,
    Switch,
    Modal,
  },
};
