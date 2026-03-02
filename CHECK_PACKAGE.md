# Fix Android Platform Error

## The Problem

Appwrite needs the exact package name that your Android app uses. The error means the package name registered in Appwrite doesn't match your app's actual package name.

## Solution

### Option 1: Update Appwrite Console (Recommended)

1. Go to your Appwrite Console: https://cloud.appwrite.io
2. Select your project: **Local Shop**
3. Go to **Settings** → **Platforms**
4. Delete the existing Android platform if it's wrong
5. Click **Add Platform** → **Android**
6. Enter these details:
   - **Name**: Local Shop Android
   - **Package Name**: `com.sahilhasnain.localshop`
   - Leave hostname empty

### Option 2: Check Your Actual Package Name

If Option 1 doesn't work, your app might be using a different package name:

1. Run this command to generate the Android project:

   ```bash
   npx expo prebuild --platform android
   ```

2. Check the actual package name:

   ```bash
   cat android/app/build.gradle | grep "applicationId"
   ```

3. Use that package name in Appwrite Console

### Option 3: Use Expo Dev Client

For development, you can also use Expo Go or create a development build:

```bash
# Clear cache and restart
npx expo start --clear

# Or use tunnel mode (slower but works)
npx expo start --tunnel
```

## Quick Test

After updating the platform in Appwrite:

1. Close your app completely
2. Clear Expo cache: `npx expo start --clear`
3. Reopen the app

The error should be gone!
