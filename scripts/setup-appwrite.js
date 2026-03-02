const {
  Client,
  Databases,
  Storage,
  ID,
  Permission,
  Role,
} = require("node-appwrite");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

async function setupAppwrite() {
  console.log("🚀 Starting Appwrite setup...\n");

  try {
    // Create Database
    console.log("📦 Creating database...");
    const database = await databases.create(ID.unique(), "marketplace");
    console.log(`✅ Database created: ${database.$id}\n`);

    // Create Products Collection
    console.log("📋 Creating products collection...");
    const collection = await databases.createCollection(
      database.$id,
      ID.unique(),
      "products",
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any()),
      ],
    );
    console.log(`✅ Collection created: ${collection.$id}\n`);

    // Create Attributes
    console.log("🔧 Creating attributes...");

    await databases.createStringAttribute(
      database.$id,
      collection.$id,
      "title",
      255,
      true,
    );
    console.log("  ✓ title");

    await databases.createStringAttribute(
      database.$id,
      collection.$id,
      "description",
      5000,
      false,
    );
    console.log("  ✓ description");

    await databases.createIntegerAttribute(
      database.$id,
      collection.$id,
      "price",
      true,
    );
    console.log("  ✓ price");

    await databases.createStringAttribute(
      database.$id,
      collection.$id,
      "condition",
      50,
      true,
    );
    console.log("  ✓ condition");

    await databases.createStringAttribute(
      database.$id,
      collection.$id,
      "category",
      100,
      true,
    );
    console.log("  ✓ category");

    await databases.createStringAttribute(
      database.$id,
      collection.$id,
      "images",
      100,
      true,
      undefined,
      true,
    );
    console.log("  ✓ images (array)");

    await databases.createStringAttribute(
      database.$id,
      collection.$id,
      "seller_name",
      255,
      true,
    );
    console.log("  ✓ seller_name");

    await databases.createStringAttribute(
      database.$id,
      collection.$id,
      "seller_phone",
      20,
      true,
    );
    console.log("  ✓ seller_phone");

    await databases.createStringAttribute(
      database.$id,
      collection.$id,
      "location",
      255,
      true,
    );
    console.log("  ✓ location");

    await databases.createStringAttribute(
      database.$id,
      collection.$id,
      "status",
      20,
      true,
    );
    console.log("  ✓ status");

    await databases.createStringAttribute(
      database.$id,
      collection.$id,
      "edit_code",
      10,
      true,
    );
    console.log("  ✓ edit_code");

    await databases.createBooleanAttribute(
      database.$id,
      collection.$id,
      "reported",
      false,
    );
    console.log("  ✓ reported\n");

    // Wait for attributes to be available
    console.log("⏳ Waiting for attributes to be ready...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Create Indexes
    console.log("🔍 Creating indexes...");

    await databases.createIndex(
      database.$id,
      collection.$id,
      "status_idx",
      "key",
      ["status"],
    );
    console.log("  ✓ status index");

    await databases.createIndex(
      database.$id,
      collection.$id,
      "category_idx",
      "key",
      ["category"],
    );
    console.log("  ✓ category index");

    await databases.createIndex(
      database.$id,
      collection.$id,
      "created_idx",
      "key",
      ["$createdAt"],
      ["DESC"],
    );
    console.log("  ✓ created_at index\n");

    // Create Storage Bucket
    console.log("🖼️  Creating storage bucket...");
    const bucket = await storage.createBucket(
      ID.unique(),
      "product-images",
      [Permission.read(Role.any()), Permission.create(Role.any())],
      false, // fileSecurity
      true, // enabled
      5242880, // 5MB max file size
      ["jpg", "jpeg", "png", "webp"],
      "gzip",
      true, // encryption
      true, // antivirus
    );
    console.log(`✅ Storage bucket created: ${bucket.$id}\n`);

    // Update .env.local file
    console.log("📝 Updating .env.local file...");
    const envPath = path.join(process.cwd(), ".env.local");
    let envContent = fs.readFileSync(envPath, "utf8");

    // Add new environment variables
    const newVars = `
# Appwrite Database Configuration (Auto-generated)
EXPO_PUBLIC_APPWRITE_DATABASE_ID=${database.$id}
EXPO_PUBLIC_APPWRITE_COLLECTION_ID=${collection.$id}
EXPO_PUBLIC_APPWRITE_BUCKET_ID=${bucket.$id}
`;

    // Check if variables already exist
    if (!envContent.includes("EXPO_PUBLIC_APPWRITE_DATABASE_ID")) {
      envContent += newVars;
      fs.writeFileSync(envPath, envContent);
      console.log("✅ Environment variables added to .env.local\n");
    } else {
      console.log("⚠️  Environment variables already exist in .env.local\n");
    }

    // Print summary
    console.log("🎉 Setup completed successfully!\n");
    console.log("📋 Summary:");
    console.log(`   Database ID: ${database.$id}`);
    console.log(`   Collection ID: ${collection.$id}`);
    console.log(`   Bucket ID: ${bucket.$id}\n`);
    console.log("✨ Your app is ready to use!");
    console.log("   Run: npm run android or npm run ios\n");
  } catch (error) {
    console.error("❌ Error during setup:", error.message);
    if (error.response) {
      console.error("Response:", error.response);
    }
    process.exit(1);
  }
}

setupAppwrite();
