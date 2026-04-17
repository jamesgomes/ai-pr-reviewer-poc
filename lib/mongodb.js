import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("MONGODB_URI nao foi definida no .env.local");
}

if (!dbName) {
  throw new Error("MONGODB_DB nao foi definida no .env.local");
}

type GlobalMongo = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as GlobalMongo;

let clientPromise: Promise<MongoClient>;

if (!globalForMongo._mongoClientPromise) {
  const client = new MongoClient(uri);
  globalForMongo._mongoClientPromise = client.connect();
}

clientPromise = globalForMongo._mongoClientPromise;

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
