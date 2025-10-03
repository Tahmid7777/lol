# Build and open Android project (Windows)
npm install
npm run build
npx cap init "Gemini Spark" com.example.geminispark --web-dir=dist
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli @capacitor/assets
npx cap add android
npx cap copy
npx cap open android
