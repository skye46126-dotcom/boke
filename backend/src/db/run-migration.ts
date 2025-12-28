import { readFileSync } from 'fs';
import { join } from 'path';
import { query } from './connection';

async function runMigration(migrationFile: string) {
  console.log(`Running migration: ${migrationFile}`);
  
  const migrationPath = join(__dirname, 'migrations', migrationFile);
  const sql = readFileSync(migrationPath, 'utf-8');
  
  try {
    await query(sql);
    console.log(`✓ Migration ${migrationFile} completed successfully`);
  } catch (error) {
    console.error(`✗ Migration ${migrationFile} failed:`, error);
    throw error;
  }
}

async function main() {
  try {
    // Run migrations in order
    await runMigration('001_add_tags.sql');
    await runMigration('003_create_gallery.sql');
    await runMigration('004_create_gallery_albums.sql');
    await runMigration('005_add_showcase_order.sql');
    
    console.log('\n✓ All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  }
}

main();
