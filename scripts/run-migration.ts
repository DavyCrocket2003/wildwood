#!/usr/bin/env tsx

// Migration runner for Cloudflare D1 database
// Usage: npx tsx scripts/run-migration.ts <migration-file>

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const migrationFile = process.argv[2];
const isRemote = process.argv.includes('--remote');

if (!migrationFile) {
  console.error('Usage: npx tsx scripts/run-migration.ts <migration-file>');
  process.exit(1);
}

const migrationPath = path.join(process.cwd(), 'migrations', migrationFile);

if (!fs.existsSync(migrationPath)) {
  console.error(`Migration file not found: ${migrationPath}`);
  process.exit(1);
}

console.log(`Running migration: ${migrationFile}`);

try {
  // Read the migration SQL
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  
  // Execute the migration using wrangler
  const remoteFlag = isRemote ? '--remote' : '';
  const command = `npx wrangler d1 execute wildwood-db ${remoteFlag} --file="${migrationPath}"`;
  console.log(`Executing: ${command}`);
  
  const output = execSync(command, { 
    encoding: 'utf8',
    stdio: 'inherit'
  });
  
  console.log(`✅ Migration ${migrationFile} completed successfully`);
} catch (error) {
  console.error(`❌ Migration ${migrationFile} failed:`, error);
  process.exit(1);
}
