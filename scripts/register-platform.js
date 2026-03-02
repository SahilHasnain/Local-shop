const { Client, Projects } = require("node-appwrite");
const appConfig = require("../app.json");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const projects = new Projects(client);

async function registerPlatforms() {
  console.log("🚀 Registering platforms in Appwrite...\n");

  try {
    const projectId = process.env.APPWRITE_PROJECT_ID;
    const packageName = appConfig.expo.android.package;
    const appName = appConfig.expo.name;

    // Register Android Platform
    console.log("📱 Registering Android platform...");
    try {
      await projects.createPlatform(projectId, "android", appName, packageName);
      console.log(`✅ Android platform registered: ${packageName}\n`);
    } catch (error) {
      if (error.code === 409) {
        console.log(
          `⚠️  Android platform already registered: ${packageName}\n`,
        );
      } else {
        throw error;
      }
    }

    // Register iOS Platform (optional, for future)
    if (appConfig.expo.ios?.bundleIdentifier) {
      console.log("🍎 Registering iOS platform...");
      try {
        await projects.createPlatform(
          projectId,
          "ios",
          appName,
          appConfig.expo.ios.bundleIdentifier,
        );
        console.log(
          `✅ iOS platform registered: ${appConfig.expo.ios.bundleIdentifier}\n`,
        );
      } catch (error) {
        if (error.code === 409) {
          console.log(
            `⚠️  iOS platform already registered: ${appConfig.expo.ios.bundleIdentifier}\n`,
          );
        } else {
          throw error;
        }
      }
    }

    console.log("🎉 Platform registration completed!\n");
    console.log("✨ You can now run your app:");
    console.log("   npm run android\n");
  } catch (error) {
    console.error("❌ Error during platform registration:", error.message);
    if (error.response) {
      console.error("Response:", error.response);
    }
    process.exit(1);
  }
}

registerPlatforms();
