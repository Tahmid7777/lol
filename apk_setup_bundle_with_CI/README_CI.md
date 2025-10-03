# CI build: Get your APK from GitHub Actions

## One-time
1) Create a new **GitHub repo** and push this project (include all files).
2) Ensure the `.github/workflows/build-apk.yml` is in the repo.

## Build
- On GitHub → **Actions** tab → select **Build Android APK (Capacitor)** → **Run workflow**.
- Or push to `main`/`master`; it auto-triggers.

## Download
- When the job finishes, open the run → **Artifacts** → download **app-debug.apk**.

### Notes
- This produces a **debug** APK (no Play Store signing needed). It installs on devices with "Allow from unknown sources".
- For a **signed release** APK:
  - Add a keystore and Gradle signing config to `android/app/build.gradle`.
  - Store secrets (`KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`) in GitHub → Settings → Secrets and variables → Actions.
  - Extend the workflow to decode keystore and run `assembleRelease`, then upload the `app-release.apk`.
