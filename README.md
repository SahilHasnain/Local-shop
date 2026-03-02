# Local Marketplace App

A React Native marketplace app built with Expo and Appwrite backend where users can buy and sell used products locally.

## Features

- 📱 Browse products with search and category filters
- 📸 Post listings with multiple images (camera or gallery)
- 💬 Contact sellers via Call or WhatsApp
- 🏷️ Mark items as sold with edit codes
- 🔄 Pull to refresh
- 📍 Location-based listings
- 🎨 Clean, modern UI with NativeWind (Tailwind CSS)

## Tech Stack

- React Native (Expo)
- Appwrite (Backend)
- NativeWind (Styling)
- Expo Router (Navigation)
- TypeScript

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Appwrite (Automated)

The setup script will automatically create:

- Database
- Products collection with all attributes and indexes
- Storage bucket for images
- Update .env.local with generated IDs

```bash
npm run setup
```

### 3. Run the App

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## Project Structure

```
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx      # Browse listings
│   │   ├── post.tsx       # Create listing
│   │   └── _layout.tsx    # Tab navigation
│   ├── product/[id].tsx   # Product details
│   └── _layout.tsx        # Root layout
├── lib/
│   ├── appwrite.ts        # Appwrite config
│   ├── api.ts             # API functions
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
└── scripts/
    └── setup-appwrite.js  # Automated setup script
```

## Environment Variables

The `.env.local` file contains:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=your-endpoint
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
EXPO_PUBLIC_APPWRITE_DATABASE_ID=auto-generated
EXPO_PUBLIC_APPWRITE_COLLECTION_ID=auto-generated
EXPO_PUBLIC_APPWRITE_BUCKET_ID=auto-generated
```

## How It Works

### No Authentication (MVP)

- Users can browse and post without signing up
- Each listing gets a unique edit code
- Sellers use the edit code to mark items as sold
- Edit codes are stored locally and in the database

### Posting a Product

1. Take photos or select from gallery (up to 5 images)
2. Fill in product details (title, price, condition, etc.)
3. Add your contact info (name, phone, location)
4. Get a unique edit code to manage your listing

### Contacting Sellers

- Call button opens phone dialer
- WhatsApp button opens WhatsApp with pre-filled message
- Payment handled outside the app

## Future Enhancements

Once you reach 100 users:

- ✨ User authentication
- 👤 User profiles
- ⭐ Ratings and reviews
- 💬 In-app messaging
- 📍 Location-based filtering
- 🔔 Push notifications
- ❤️ Favorites/Wishlist

## Scripts

- `npm start` - Start Expo dev server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npm run setup` - Setup Appwrite (one-time)
- `npm run lint` - Run ESLint

## License

MIT
