import { pipeline } from "@xenova/transformers";
import dotenv from "dotenv";
import { Groq } from "groq-sdk";
import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

dotenv.config();

let embeddingExtractor: any;

pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2")
  .then((extractor) => {
    embeddingExtractor = extractor;
    console.log("Embedding extractor initialized");
  })
  .catch((error) => {
    console.error("Failed to initialize embedding extractor:", error);
  });

  const getVectorCollectionForTenant = async (metadataCollection: any, database: any, tenantId: string) => {
    const metadata = await metadataCollection.findOne({});
    const { totalTenants } = metadata; // Use `const` for `totalTenants` since it's not reassigned
    const { currentCollection, tenantMappings } = metadata; // Use `const` for `tenantMappings` since it's not reassigned

    // Check if the tenant already has a mapped collection
    if (tenantMappings && tenantMappings[tenantId]) {
        return tenantMappings[tenantId];
    }

    let updatedCurrentCollection = currentCollection; // Use `let` for reassigned variable

    // Check if a new collection is needed
    if (totalTenants % 10 === 0 && totalTenants !== 0) {
        const nextCollectionNumber = Math.floor(totalTenants / 10) + 1;
        updatedCurrentCollection = `vector_${nextCollectionNumber}`; // Reassign `updatedCurrentCollection`

        // Ensure the new collection exists
        const collectionExists = await database.listCollections({ name: updatedCurrentCollection }).hasNext();
        if (!collectionExists) {
            await database.createCollection(updatedCurrentCollection);
        }
    }

    // Update tenant mappings and metadata
    tenantMappings[tenantId] = updatedCurrentCollection; // Modify `tenantMappings` (not reassigning the variable)
    await metadataCollection.updateOne({}, {
        $set: { currentCollection: updatedCurrentCollection, tenantMappings },
        $inc: { totalTenants: 1 },
    });

    return updatedCurrentCollection;
};
const getPreviousMessages = async (database: any, tenantId: string, uuid: string, limit = 5) => {
    try {
        const tenantCollection = database.collection(tenantId);
        const conversation = await tenantCollection.findOne({ tenantId, uuid });
        
        if (!conversation || !conversation.messages) {
            return "";
        }

        // Get the last 'limit' messages
        const recentMessages = conversation.messages
            .slice(-limit)
            .map((msg: { question: string; answer: string }) => 
                `User: ${msg.question}\nAssistant: ${msg.answer}`
            )
            .join("\n\n");

        return recentMessages;
    } catch (error) {
        console.error("Error fetching previous messages:", error);
        return "";
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        res.status(405).json({ message: "Method Not Allowed" });
        return;
    }

    const { uuid, tenantId, message } = req.body;

    if (!tenantId || !uuid || !message) {
        res.status(400).json({ message: "Tenant ID, UUID, and message are required." });
        return;
    }

    let connection: MongoClient | undefined;

    try {
        connection = await MongoClient.connect(process.env.MONGODB_URL_2 as string);
        const database = connection.db("Rag_doc");

        // Get previous conversation history
        const conversationHistory = await getPreviousMessages(database, tenantId, uuid);
        
        const metadataCollection = database.collection("metadata");
        const vectorCollectionName = await getVectorCollectionForTenant(metadataCollection, database, tenantId);
        console.log(`Tenant ${tenantId} is using collection ${vectorCollectionName}`);

        const vectorCollection = database.collection(vectorCollectionName);

        if (!embeddingExtractor) {
            throw new Error("Embedding extractor is not initialized.");
        }

        console.log("Generating embedding for the user query...");
        const messageEmbedding = await embeddingExtractor(message, { pooling: "mean", normalize: true });
        const queryEmbeddingArray = Array.from(messageEmbedding.data);

        console.log("Performing vector search in", vectorCollectionName);
        const vectorSearch = await vectorCollection
            .aggregate([
                {
                    $vectorSearch: {
                        index: `${vectorCollectionName}_index`,
                        queryVector: queryEmbeddingArray,
                        path: "embedding",
                        exact: false,
                        limit: 3,
                        numCandidates: 3,
                        filter: { tenantId },
                    },
                },
            ])
            .toArray();

        if (vectorSearch.length === 0) {
            res.json({
                chatResponse: "No relevant documents found for your query.",
            });
            return;
        }

        const vectorSearchContext = vectorSearch
            .filter((doc: any) => typeof doc.text === "string" && doc.text.trim().length > 10)
            .map((doc: any) => doc.text)
            .join("\n");

        // Combine vector search results with conversation history
        const fullContext = `Previous conversation:\n${conversationHistory}\n\nRelevant documents:\n${vectorSearchContext}`;

        const GROQ_KEYS = [
            process.env.GROQ_API_KEY_1,
            process.env.GROQ_API_KEY_2,
            process.env.GROQ_API_KEY_3,
        ].filter(Boolean) as string[];

        const getRandomAPIKey = (keys: string[]) => keys[Math.floor(Math.random() * keys.length)];

        const groq = new Groq({ apiKey: getRandomAPIKey(GROQ_KEYS) });

        console.log("Sending query to Groq with full context...");
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are DuneFox, a professional and knowledgeable assistant. Your role is to assist users by providing concise, accurate, and contextually relevant answers to their queries. Maintain a professional and friendly tone. Consider both the conversation history and relevant documents when formulating your response give the highest prioity to the question asked right now then talk about the recent questions.",
                },
                {
                    role: "user",
                    content: `User query: ${message}\n\nContext: ${fullContext}`,
                },
            ],
            model: "llama3-8b-8192",
            max_tokens: 4000,
            temperature: 0.6,
        });

        const aiResponse = completion.choices?.[0]?.message?.content || "No response from AI.";
        console.log("AI Response:", aiResponse);

        const messageDocument = {
            question: message,
            answer: aiResponse,
            timestamp: new Date().toISOString(),
        };

        const tenantCollection = database.collection(tenantId);

        const result = await tenantCollection.updateOne(
            { tenantId, uuid },
            {
                $set: { tenantId, uuid },
                $push: { messages: messageDocument as any },
            },
            { upsert: true }
        );

        res.status(200).json({
            message: "Message added successfully.",
            aiResponse,
            documentId: result.upsertedId || `${tenantId}-${uuid}`,
        });
    } catch (error) {
        console.error("Error in conversation route:", error);
        res.status(500).json({ message: "Internal Server Error." });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeError) {
                console.error("Error closing MongoDB connection:", closeError);
            }
        }
    }
};

export default handler;