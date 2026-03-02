import AsyncStorage from "@react-native-async-storage/async-storage";

// Generate random edit code
export function generateEditCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Store edit code locally
export async function storeEditCode(productId: string, editCode: string) {
  try {
    const key = `edit_code_${productId}`;
    await AsyncStorage.setItem(key, editCode);
  } catch (error) {
    console.warn("Failed to store edit code locally:", error);
    // Continue without storing locally - not critical for functionality
  }
}

// Get stored edit code
export async function getEditCode(productId: string): Promise<string | null> {
  try {
    const key = `edit_code_${productId}`;
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.warn("Failed to get edit code from local storage:", error);
    return null;
  }
}

// Format price
export function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

// Format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
