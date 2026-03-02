# Add Web Platform to Appwrite

Since we're using the web SDK, you need to add a Web platform in Appwrite Console:

## Steps:

1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Select your project: **Local Shop**
3. Go to **Settings** → **Platforms**
4. Click **Add Platform** → **Web**
5. Enter:
   - **Name**: Local Shop Web
   - **Hostname**: `localhost`
6. Click **Create**

## Additional Hostnames (Optional):

You can also add these for broader compatibility:

- `127.0.0.1`
- `*.localhost`
- `exp.host` (for Expo tunneling)
- `*.exp.direct` (for Expo tunneling)

## Test Your App:

After adding the web platform, restart your app:

```bash
npx expo start --clear
```

The web SDK should now work without platform restrictions!
