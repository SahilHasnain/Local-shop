import { appwriteConfig, databases, ID, Query, storage } from "./appwrite";
import { Product } from "./types";

export const api = {
  // Fetch all products
  async getProducts(category?: string, searchQuery?: string) {
    const queries = [
      Query.equal("status", "available"),
      Query.orderDesc("$createdAt"),
    ];

    if (category && category !== "All") {
      queries.push(Query.equal("category", category));
    }

    if (searchQuery) {
      queries.push(Query.search("title", searchQuery));
    }

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      queries,
    );

    return response.documents as unknown as Product[];
  },

  // Get single product
  async getProduct(id: string) {
    const response = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      id,
    );
    return response as unknown as Product;
  },

  // Create product
  async createProduct(data: Omit<Product, "$id" | "$createdAt">) {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      ID.unique(),
      data,
    );
    return response as unknown as Product;
  },

  // Upload image
  async uploadImage(uri: string) {
    const response = await fetch(uri);
    const blob = await response.blob();

    // Convert Blob to File for web SDK
    const filename = uri.split("/").pop() || "image.jpg";
    const file = new File([blob], filename, {
      type: blob.type || "image/jpeg",
    });

    const uploadedFile = await storage.createFile(
      appwriteConfig.storageBucketId,
      ID.unique(),
      file,
    );

    return uploadedFile.$id;
  },

  // Get image URL
  getImageUrl(fileId: string) {
    return `${storage.client.config.endpoint}/storage/buckets/${appwriteConfig.storageBucketId}/files/${fileId}/view?project=${storage.client.config.project}`;
  },

  // Mark as sold
  async markAsSold(productId: string, editCode: string) {
    const product = await this.getProduct(productId);

    if (product.edit_code !== editCode) {
      throw new Error("Invalid edit code");
    }

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      productId,
      { status: "sold" },
    );
  },
};
