# Build an Android APK from this project (Capacitor)

## Prereqs (one-time)
- Install **Android Studio** (SDK + Platform Tools)
- Install **Node.js 18+**
- Install **Java 17** and set `JAVA_HOME` to it

## 1) Install packages
```bash
npm install
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli @capacitor/assets
```

## 2) Ensure Vite uses relative base (already set by the patched `vite.config.ts`)
```ts
export default defineConfig({
  base: './',
  // ...rest of your config
});
```

## 3) Initialize and add Android
```bash
npx cap init "Gemini Spark" com.example.geminispark --web-dir=dist
npx cap add android
```

## 4) Build web and copy to native
```bash
npm run build
npx cap copy
```

## 5) (Optional) Generate icons/splash
```bash
npx capacitor-assets generate
```

## 6) Open Android Studio
```bash
npx cap open android
```
- Let Gradle sync
- **Run ▶** to test (debug build)

## 7) Make a signed release APK
Android Studio → Build → **Generate Signed Bundle / APK** → APK  
Create/choose keystore → select `app` module → build **release**.  
Output: `android/app/release/app-release.apk`

---

### Network / HTTP notes
If your app calls **HTTP** (not HTTPS) endpoints, enable cleartext:
Create `android/app/src/main/res/xml/network_security_config.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <base-config cleartextTrafficPermitted="true" />
</network-security-config>
```
Then in `android/app/src/main/AndroidManifest.xml` inside `<application ...>`:
```xml
android:usesCleartextTraffic="true"
android:networkSecurityConfig="@xml/network_security_config"
```

Internet permission (usually present):
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

---

### One-liner dev cycle
When you change code:
```bash
npm run build && npx cap copy && npx cap open android
```
