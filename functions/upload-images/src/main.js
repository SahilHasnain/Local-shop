import { Buffer } from "buffer";
import { Client, ID, Storage } from "node-appwrite";
import { InputFile } from "node-appwrite/file"


export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const storage = new Storage(client);

  try {
    // Handle both string and object body
    let body;
    if (typeof req.body === "string") {
      body = JSON.parse(req.body);
    } else {
      body = req.body;
    }

    const { images } = body;

    if (!images || !Array.isArray(images)) {
      return res.json({ error: "Images array is required" }, 400);
    }

    log(`Processing ${images.length} images`);

    const uploadPromises = images.map(async (imageData) => {
      // Convert base64 to buffer
      const buffer = Buffer.from(imageData.data, "base64");
      const filename = imageData.filename || `image-${Date.now()}.jpg`;

      log(`Uploading ${filename}`);

      // Use InputFile.fromBuffer instead of raw buffer
      const inputFile = InputFile.fromBuffer(buffer, filename);

      const file = await storage.createFile(
        process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
        ID.unique(),
        inputFile,
      );

      return file.$id;
    });

    const fileIds = await Promise.all(uploadPromises);

    log(`Successfully uploaded ${fileIds.length} files`);

    return res.json({
      success: true,
      fileIds,
    });
  } catch (err) {
    error("Upload failed: " + err.message);
    return res.json(
      {
        error: "Upload failed: " + err.message,
      },
      500,
    );
  }
};
