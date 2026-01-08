import 'dotenv/config';
import { PrismaClient } from "../generated/prisma/client.ts";
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pg;

const rawUrl = process.env.DATABASE_URL;
const connectionString = rawUrl ? rawUrl.replace('postgresql://', 'postgres://') : '';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;
