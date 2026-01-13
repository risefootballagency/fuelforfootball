import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ac8f5c3b6b5b4f199b616f9621e5d7ab',
  appName: 'Fuel For Football',
  webDir: 'dist',
  server: {
    url: 'https://ac8f5c3b-6b5b-4f19-9b61-6f9621e5d7ab.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
