import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const uri = 'mongodb+srv://shitolemukul47:dxatGqHzPfmu8jUv@clusternew.gfeis.mongodb.net/?retryWrites=true&w=majority&appName=Clusternew'; // Replace with your MongoDB connection string
  const client = new MongoClient(uri);

  try {
    // Parse the JSON body from the incoming request
    const userData = await req.json();
    console.log('Received user data:', userData);

    // Connect to MongoDB
    await client.connect();

    // Create or access the "business" database
    const database = client.db('business');

    // Create or access the "users" collection
    const collection = database.collection('users');

    // // Check if a document with the same clerkId already exists
    // const existingUser = await collection.findOne({ clerkId: userData.clerkId });

    // if (existingUser) {
    //   // If a document with the same clerkId exists, return an error response
    //   return NextResponse.json({ error: 'User with this clerkId already exists' }, { status: 400 });
    // }

    // If no document with the same clerkId exists, insert the new user data
    const result = await collection.insertOne(userData);
    return NextResponse.json({ message: `New user inserted with _id: ${result.insertedId}` });
  } catch (err) {
    console.error('Error inserting document:', err);
    return NextResponse.json({ error: 'Failed to insert user data' }, { status: 500 });
  } finally {
    await client.close();
  }
}