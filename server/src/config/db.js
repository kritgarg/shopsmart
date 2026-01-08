import { PrismaClient } from "../generated/prisma/client.ts";
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';


neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);


const prisma = new PrismaClient({ adapter });

export default prisma;
