import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.geminispark',
  appName: 'Gemini Spark',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
