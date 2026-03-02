import { Client, Databases, Functions, ID, Query, Storage } from "appwrite";

const APPWRITE_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
const APPWRITE_PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const PRODUCTS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const STORAGE_BUCKET_ID = process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!;

// Debug log
console.log("Appwrite Config:", {
  endpoint: APPWRITE_ENDPOINT,
  projectId: APPWRITE_PROJECT_ID,
  databaseId: DATABASE_ID,
  collectionId: PRODUCTS_COLLECTION_ID,
  bucketId: STORAGE_BUCKET_ID,
});

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export const appwriteConfig = {
  databaseId: DATABASE_ID,
  productsCollectionId: PRODUCTS_COLLECTION_ID,
  storageBucketId: STORAGE_BUCKET_ID,
};

export { ID, Query };
