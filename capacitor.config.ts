import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.matiasgaleano.foodlynotes',
  appName: 'Foodly Notes',
  webDir: 'www',
  android: {
    allowMixedContent: true,
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      backgroundColor: '#4caf50',
    },
  },
};

export default config;
