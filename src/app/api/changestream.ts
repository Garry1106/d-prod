import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

dotenv.config();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== "string") {
    res.status(400).json({ message: "Tenant ID is required and must be a string." });
    return;
  }

  let connection: MongoClient | undefined;

  try {
    console.log("Connecting to MongoDB...");
    connection = new MongoClient(process.env.MONGODB_URL_2 as string);
    await connection.connect();
    console.log("Connected to MongoDB");

    const database = connection.db("Rag_doc");
    const tenantCollection = database.collection(tenantId);

    // Set up Server-Sent Events headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Send an initial event to confirm the connection
    res.write(`data: Connection established for tenant ${tenantId}\n\n`);

    // Create a MongoDB change stream for the specific tenant's collection
    const changeStream = tenantCollection.watch();

    console.log(`Watching changes for tenant ID: ${tenantId}`);

    // Listen for change events and send updates to the client
    changeStream.on("change", (change) => {
      console.log(`Change detected for tenant ${tenantId}:`, change);

      // Send the change event to the client
      res.write(`data: ${JSON.stringify(change)}\n\n`);
    });

    // Handle client disconnection
    req.on("close", () => {
      console.log("Client disconnected. Closing change stream...");
      changeStream.close();
      connection?.close();
    });
  } catch (error) {
    console.error("Error in change stream:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export default handler;
