// Acceptance checks: No ESLint/TypeScript errors; App compiles with Expo; Tabs scale on press; HLButton scales on press; Dashboard balance animates; No nested VirtualizedLists warnings; Colors react to iOS light/dark mode.

module.exports = {
  root: true,
  extends: ['expo'],
  env: {
    jest: true,
    node: true,
  },
};
