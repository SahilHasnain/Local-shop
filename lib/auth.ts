import { account, ID } from "./appwrite";

const APP_SECRET = "localshop-secret-2024"; // In production, use env variable

// Simple hash function (deterministic)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

// Generate deterministic password from phone number
function generatePassword(phone: string): string {
  const data = phone + APP_SECRET;
  const hash1 = simpleHash(data);
  const hash2 = simpleHash(data + "salt");
  return (hash1 + hash2).substring(0, 16);
}

// Convert phone to email format
function phoneToEmail(phone: string): string {
  return `${phone}@localshop.app`;
}

export const auth = {
  // Authenticate user with phone number (create account if needed)
  async authenticateWithPhone(phone: string): Promise<boolean> {
    try {
      const email = phoneToEmail(phone);
      const password = generatePassword(phone);

      try {
        // Try to login first
        await account.createEmailPasswordSession(email, password);
        console.log("User logged in successfully");
      } catch (loginError: any) {
        // Check if it's a "user not found" error
        if (
          loginError.code === 401 ||
          loginError.message?.includes("Invalid credentials") ||
          loginError.message?.includes("user")
        ) {
          // Account doesn't exist, create it
          console.log("Creating new account for phone:", phone);
          try {
            await account.create(ID.unique(), email, password, phone);
            await account.createEmailPasswordSession(email, password);
            console.log("New account created and logged in");
          } catch (createError: any) {
            // If account already exists, try to login again
            if (createError.message?.includes("already exists")) {
              console.log("Account exists, attempting login again");
              await account.createEmailPasswordSession(email, password);
              console.log("Logged in with existing account");
            } else {
              throw createError;
            }
          }
        } else {
          throw loginError;
        }
      }

      // Store phone for future auto-login
      await SecureStore.setItemAsync("user_phone", phone);
      return true;
    } catch (error) {
      console.error("Authentication failed:", error);
      return false;
    }
  },

  // Auto-login on app start
  async autoLogin(): Promise<boolean> {
    try {
      // Check if user is already logged in
      const user = await account.get();
      if (user) {
        console.log("User already logged in:", user.email);
        return true;
      }
    } catch {
      // No active session, try auto-login with stored phone
      try {
        const storedPhone = await SecureStore.getItemAsync("user_phone");
        if (storedPhone) {
          console.log("Attempting auto-login with stored phone");
          return await this.authenticateWithPhone(storedPhone);
        }
      } catch (error) {
        console.warn("Auto-login failed:", error);
      }
    }
    return false;
  },

  // Get current user
  async getCurrentUser() {
    try {
      return await account.get();
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      await account.get();
      return true;
    } catch {
      return false;
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await account.deleteSession("current");
      await SecureStore.deleteItemAsync("user_phone");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },

  // Get user's phone number
  async getUserPhone(): Promise<string | null> {
    try {
      const user = await this.getCurrentUser();
      if (user?.name) {
        return user.name; // We store phone as name during account creation
      }
      // Fallback to stored phone
      return await SecureStore.getItemAsync("user_phone");
    } catch {
      return null;
    }
  },
};
