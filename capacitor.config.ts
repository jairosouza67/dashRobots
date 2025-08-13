import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.dee8e0b56fae437f832b1a7bfb719b7b',
  appName: 'A Lovable project',
  webDir: 'dist',
  server: {
    // Hot reload from Lovable sandbox preview
    url: 'https://dee8e0b5-6fae-437f-832b-1a7bfb719b7b.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
};

export default config;
