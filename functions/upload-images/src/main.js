import { Client, ID, Storage } from "node-appwrite";

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const storage = new Storage(client);

  try {
    const { images } = JSON.parse(req.body);

    if (!images || !Array.isArray(images)) {
      return res.json({ error: "Images array is required" }, 400);
    }

    const uploadPromises = images.map(async (imageData) => {
      // imageData should be base64 string
      const buffer = Buffer.from(imageData.data, "base64");
      const filename = imageData.filename || `image-${Date.now()}.jpg`;

      const file = await storage.createFile(
        process.env.STORAGE_BUCKET_ID,
        ID.unique(),
        buffer,
        filename,
      );

      return file.$id;
    });

    const fileIds = await Promise.all(uploadPromises);

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
