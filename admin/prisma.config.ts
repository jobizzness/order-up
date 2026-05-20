import path from 'path';
import type { PrismaConfig } from 'prisma';
import { loadEnvFile } from 'process';

// Prisma 7 configuration
// Connection URLs moved from schema.prisma to this config file
// https://pris.ly/d/config-datasource

try { loadEnvFile('.env.local'); } catch { /* file may not exist in CI */ }
try { loadEnvFile('.env'); } catch { /* file may not exist */ }

export default {
  schema: path.join('prisma', 'schema.prisma'),

  // Datasource configuration for migrations
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },

  // Migration configuration
  migrations: {
    path: path.join('..', 'prisma', 'migrations'),
  },
} satisfies PrismaConfig;
