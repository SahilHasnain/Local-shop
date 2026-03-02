const { Client, Functions } = require("node-appwrite");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const functions = new Functions(client);

async function deployFunction() {
  console.log("🚀 Deploying upload-images function...\n");

  try {
    // Create function
    console.log("📦 Creating function...");
    const func = await functions.create(
      "upload-images",
      "Upload Images",
      "node-18.0",
      ["any"],
      [],
      30, // timeout
      true, // enabled
    );
    console.log(`✅ Function created: ${func.$id}\n`);

    // Create deployment
    console.log("📤 Creating deployment...");
    const functionPath = path.join(process.cwd(), "functions/upload-images");

    // Note: You'll need to zip the function folder manually or use Appwrite CLI
    console.log("⚠️  Manual step required:");
    console.log("1. Zip the functions/upload-images folder");
    console.log("2. Go to Appwrite Console → Functions → upload-images");
    console.log("3. Upload the zip file as a deployment");
    console.log("4. Set environment variables:");
    console.log(
      "   - STORAGE_BUCKET_ID:",
      process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
    );
    console.log("\n✨ Function setup completed!");
  } catch (error) {
    if (error.code === 409) {
      console.log("⚠️  Function already exists. Update via Appwrite Console.");
    } else {
      console.error("❌ Error:", error.message);
    }
  }
}

deployFunction();
