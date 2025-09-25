# Hustle Ledger

## Run Book

### Custom Dev Client (recommended)

```bash
npm run fix:clean
npm i react-native-reanimated@4.1.2 react-native-worklets-core@1.6.2 --save-exact
eas login
eas build:configure
eas device:create
eas build -p ios --profile development --clear-cache
npx expo start --dev-client --tunnel
```

### Expo Go (fallback)

```bash
npm run fix:clean
npx expo install react-native-reanimated   # pins to Expo Go’s native version
npm i react-native-worklets-core@1.5.0 --save-exact
npx expo start -c
```

### Sanity checks

```bash
npm ls react-native-reanimated         # one version (4.1.x or Expo Go baseline)
npm ls react-native-worklets-core      # one version (1.6.x or Expo Go baseline)
npm ls react                           # matches react-native renderer exactly
npm ls react-native-renderer
```
