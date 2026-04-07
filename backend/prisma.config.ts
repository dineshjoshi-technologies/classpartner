import { defineConfig } from 'prisma/config';
import dotenv from 'dotenv';

// Load env vars (needed when running via ts-node)
dotenv.config();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
