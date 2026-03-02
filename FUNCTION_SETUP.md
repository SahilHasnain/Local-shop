# Function Setup Guide

## Hybrid Architecture Implemented

✅ **Fast reads** - Direct database calls
✅ **Reliable uploads** - Appwrite function handles file conversion
✅ **Fast writes** - Direct database calls for metadata

## Setup Steps:

### 1. Add Web Platform (Required)

Go to Appwrite Console → Settings → Platforms → Add Web Platform:

- **Name**: Local Shop Web
- **Hostname**: `localhost`

### 2. Create Upload Function

**Option A: Manual (Recommended)**

1. Go to Appwrite Console → Functions
2. Create Function:
   - **Function ID**: `upload-images`
   - **Name**: Upload Images
   - **Runtime**: Node.js 18
   - **Execute Access**: Any
3. Upload the `functions/upload-images` folder as a zip
4. Set environment variable:
   - `STORAGE_BUCKET_ID`: `69a53df9002ce52e226e`

**Option B: Script (Partial)**

```bash
npm run deploy-function
```

Then follow the manual steps shown.

### 3. Test Your App

```bash
npx expo start --clear
```

## How It Works:

1. **Image Upload**: Client → Function (converts to proper File objects)
2. **Create Product**: Client → Database (fast, with image IDs from step 1)
3. **Browse/Search**: Client → Database (fastest possible)
4. **Mark as Sold**: Client → Database (fast updates)

This gives you the best performance while solving the React Native file upload issues!
