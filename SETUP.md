# Marketplace App Setup Guide

## 1. Appwrite Setup

### Create Appwrite Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io) or your self-hosted instance
2. Create a new project
3. Note down your Project ID

### Create Database

1. Go to Databases → Create Database
2. Name it `marketplace` (or any name you prefer)
3. Note down the Database ID

### Create Products Collection

1. Inside your database, create a new collection named `products`
2. Note down the Collection ID
3. Add the following attributes:

| Attribute Name | Type    | Size | Required | Array |
| -------------- | ------- | ---- | -------- | ----- |
| title          | String  | 255  | Yes      | No    |
| description    | String  | 5000 | No       | No    |
| price          | Integer | -    | Yes      | No    |
| condition      | String  | 50   | Yes      | No    |
| category       | String  | 100  | Yes      | No    |
| images         | String  | 100  | Yes      | Yes   |
| seller_name    | String  | 255  | Yes      | No    |
| seller_phone   | String  | 20   | Yes      | No    |
| location       | String  | 255  | Yes      | No    |
| status         | String  | 20   | Yes      | No    |
| edit_code      | String  | 10   | Yes      | No    |
| reported       | Boolean | -    | No       | No    |

4. Create indexes:
   - Key: `status`, Type: `key`, Attributes: `status`
   - Key: `category`, Type: `key`, Attributes: `category`
   - Key: `created_at`, Type: `key`, Attributes: `$createdAt`

5. Set Permissions:
   - Read: `Any`
   - Create: `Any`
   - Update: `Any` (needed for mark as sold)
   - Delete: `Any` (optional, for moderation)

### Create Storage Bucket

1. Go to Storage → Create Bucket
2. Name it `product-images`
3. Note down the Bucket ID
4. Set Permissions:
   - Read: `Any`
   - Create: `Any`
5. Configure:
   - Maximum file size: 5MB (or as needed)
   - Allowed file extensions: `jpg, jpeg, png, webp`
   - Enable compression: Yes
   - Image quality: 80

## 2. Configure App

Update `lib/appwrite.ts` with your credentials:

```typescript
const APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1"; // or your endpoint
const APPWRITE_PROJECT_ID = "your-project-id";
const DATABASE_ID = "your-database-id";
const PRODUCTS_COLLECTION_ID = "your-collection-id";
const STORAGE_BUCKET_ID = "your-bucket-id";
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Run the App

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Features Implemented

✅ Browse products with search and category filters
✅ Post new listings with multiple images
✅ Product detail view with image carousel
✅ Contact seller via Call or WhatsApp
✅ Mark items as sold with edit code
✅ Local storage of edit codes
✅ Responsive grid layout
✅ Pull to refresh

## Next Steps (Post-MVP)

- Add user authentication when you reach 100 users
- Implement user profiles
- Add favorites/wishlist
- Add location-based filtering
- Implement reporting system
- Add image optimization
- Add push notifications
- Implement chat system

## Notes

- No authentication required for MVP
- Edit codes are stored locally and in the database
- Users can mark their own items as sold using the edit code
- Payment handling is external (as per requirements)
