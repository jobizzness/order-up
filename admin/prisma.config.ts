import path from 'path';
import type { PrismaConfig } from 'prisma';

// Prisma 7 configuration
// Connection URLs moved from schema.prisma to this config file
// https://pris.ly/d/config-datasource

export default {
  schema: path.join('..', 'prisma', 'schema.prisma'),

  // Datasource configuration for migrations
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },

  // Migration configuration
  migrations: {
    path: path.join('..', 'prisma', 'migrations'),
  },
} satisfies PrismaConfig;
