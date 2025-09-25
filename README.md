# Hustle Ledger

## Run Book

### Custom Dev Client (recommended)

> **Note:** `react-native-reanimated@4.1.0` bundles the native Worklets runtime `0.6.x`. Pair it with `react-native-worklets-core@1.6.x` when building the custom dev client to match the native binaries shipped with our iOS build.

```bash
npm run fix:clean
npm i react-native-reanimated@4.1.0 react-native-worklets-core@1.6.0 --save-exact
eas login
eas build:configure
eas device:create
eas build -p ios --profile development --clear-cache
npx expo start --dev-client --tunnel
```

### Expo Go (fallback)

```bash
npm run fix:clean
npx expo install react-native-reanimated   # pins to Expo Go’s native runtime (0.5.x)
npm i react-native-worklets-core@0.5.1 --save-exact
npx expo start -c
```

### Sanity checks

```bash
npm ls react-native-reanimated         # one version (4.1.x or 0.5.1 for Go)
npm ls react-native-worklets-core      # one version (1.6.x or 0.5.1 for Go)
npm ls react                           # matches react-native renderer exactly
npm ls react-native-renderer
```
