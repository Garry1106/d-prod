import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

dotenv.config();

// Define the structure of a document in the tenant collection (if known)
interface TenantDocument {
  _id: string;
  [key: string]: any; // Allow for other fields if the structure isn't fixed
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { tenantId } = req.query;

  console.log("Received request for tenant ID:", tenantId);

  if (!tenantId || typeof tenantId !== "string") {
    console.error("Invalid Tenant ID:", tenantId);
    res.status(400).json({ message: "Tenant ID is required and must be a string." });
    return;
  }

  let connection: MongoClient | undefined;

  try {
    console.log("Connecting to MongoDB...");
    connection = await MongoClient.connect(process.env.MONGODB_URL_2 as string);
    console.log("Connected to MongoDB");

    const database = connection.db("Rag_doc");
    console.log("Accessing database: Rag_doc");

    const tenantCollection = database.collection<TenantDocument>(tenantId);
    console.log("Accessing collection for tenant ID:", tenantId);

    // Fetch all documents for the given tenant ID
    const documents = await tenantCollection.find({}).toArray();

    console.log(`Fetched ${documents.length} documents for tenant ID:`, tenantId);

    if (documents.length === 0) {
      console.warn("No documents found for the given Tenant ID:", tenantId);
      res.status(404).json({ message: "No documents found for the given Tenant ID." });
      return;
    }

    res.status(200).json({
      message: "Documents fetched successfully.",
      data: documents,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ message: "Internal Server Error." });
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("MongoDB connection closed.");
      } catch (closeError) {
        console.error("Error closing MongoDB connection:", closeError);
      }
    }
  }
};

export default handler;
