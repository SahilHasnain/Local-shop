import { appwriteConfig, databases, Query } from "./appwrite";
import { Product } from "./types";

export const api = {
  // Fetch all products (DIRECT - fastest)
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

  // Get single product (DIRECT - fastest)
  async getProduct(id: string) {
    const response = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      id,
    );
    return response as unknown as Product;
  },

  // Upload images via function (FUNCTION - reliable)
  async uploadImages(imageUris: string[]) {
    const imageData = await Promise.all(
      imageUris.map(async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = (reader.result as string).split(",")[1];
            resolve(base64String);
          };
          reader.readAsDataURL(blob);
        });

        const filename = uri.split("/").pop() || `image-${Date.now()}.jpg`;
        return { data: base64, filename };
      }),
    );

    const response = await fetch(
      "https://69a577a80022af92e06f.sgp.appwrite.run",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
        },
        body: JSON.stringify({ images: imageData }),
      },
    );

    if (!response.ok) {
      throw new Error(`Function call failed: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error);
    }

    return result.fileIds;
  },

  // Create product (DIRECT - fast)
  async createProduct(data: Omit<Product, "$id" | "$createdAt">) {
    return response as unknown as Product;
  },

  // Get image URL (DIRECT)
  getImageUrl(fileId: string) {
    const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
    return `${endpoint}/storage/buckets/${appwriteConfig.storageBucketId}/files/${fileId}/view?project=${projectId}`;
  },

  // Mark as sold (DIRECT - fast)
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
