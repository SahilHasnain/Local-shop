# Platform Setup for Appwrite Web SDK

Since we're now using the Appwrite Web SDK, you need to register a Web platform in Appwrite Console.

## Steps:

1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Select your project: **Local Shop**
3. Go to **Settings** → **Platforms**
4. Click **Add Platform** → **Web**
5. Enter:
   - **Name**: Local Shop Web
   - **Hostname**: `localhost`
6. Click **Create**

## For Production (Later):

When you deploy your app, add additional web platforms with your production domains:

- `yourapp.com`
- `*.yourapp.com` (for subdomains)

## Why Web SDK?

The Web SDK works across all platforms (iOS, Android, Web) without platform-specific restrictions. It's perfect for React Native apps using Expo.

## Test Your App

After adding the web platform:

```bash
# Clear cache and restart
npx expo start --clear
```

The app should now work without any platform errors!
