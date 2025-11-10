/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

// Paths
const migrationsPath = path.join(process.cwd(), 'src/db/postgreSql/scripts/migrations');
const seedersPath = path.join(process.cwd(), 'src/db/postgreSql/scripts/seeders');

// Helper function to rename .js files to .ts
function renameJsToTs(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return;
  }

  fs.readdirSync(dirPath).forEach((file) => {
    if (file.endsWith('.js')) {
      const oldPath = path.join(dirPath, file);
      const newPath = path.join(dirPath, file.replace('.js', '.ts'));
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed ${file} → ${file.replace('.js', '.ts')}`);
    }
  });
}

// Rename migrations
console.log('Renaming migrations...');
renameJsToTs(migrationsPath);

// Rename seeders
console.log('Renaming seeders...');
renameJsToTs(seedersPath);

console.log('✅ All migrations and seeders renamed to .ts');
