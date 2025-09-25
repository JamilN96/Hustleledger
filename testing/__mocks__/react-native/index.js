export const Appearance = {
  getColorScheme() {
    return 'dark';
  },
  addChangeListener() {
    return { remove() {} };
  }
};

export const Platform = {
  OS: 'ios',
  select(options = {}) {
    return options.ios ?? options.default;
  }
};

export default { Appearance, Platform };
