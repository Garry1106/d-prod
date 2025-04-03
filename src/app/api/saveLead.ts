import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

const client = new MongoClient(process.env.MONGODB_URL_2!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { tenantId, uuid, name, email } = req.body;

        if (!tenantId || !uuid || !name || !email) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        await client.connect();
        const db = client.db("Rag_doc");
        const leadsCollection = db.collection("lead");

        // Check if tenantId already exists
        const existingTenant = await leadsCollection.findOne({ tenantId });
        if (existingTenant) {
            // Check if the name, email, and uuid already exist
            const existingLead = existingTenant.leads?.find(
                (lead: { name: string; email: string; uuid: string }) => lead.name === name && lead.email === email && lead.uuid === uuid
            );
            if (existingLead) {
                return res.status(409).json({ message: 'Lead already exists' });
            }
            
            // Append new lead to the existing tenant's leads array
            await leadsCollection.updateOne(
                { tenantId },
                { $push: { leads: { name, email, uuid, createdAt: new Date() } } as any}
            );
        } else {
            // Create a new tenant entry with the lead
            const leadData = {
                tenantId,
                leads: [
                    {
                        name,
                        email,
                        uuid,
                        createdAt: new Date(),
                    },
                ],
                metadata: {
                    source: 'chat_widget',
                    status: 'new',
                },
            };

            await leadsCollection.insertOne(leadData);
        }

        res.status(201).json({ message: 'Lead saved successfully' });
    } catch (error) {
        console.error('Error saving lead:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await client.close();
    }
}
