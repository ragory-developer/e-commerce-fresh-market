-- AlterTable
ALTER TABLE `User` MODIFY `refreshToken` TEXT NULL;

### 2. Seeder Cleanup
- **Action**: Removed all products, categories, brands, and attributes from the seeder scripts (`prisma/seed.ts` and `scripts/seed-sidebar.ts`).
- **Result**: Running seeders now only populates essential data (Admin user, regular user, and Bangladesh locations/areas).
- **Manual Cleanup**: Cleaned the database of all existing records for these models to ensure a fresh start.

### 3. WordPress Import Fixes
- **Task Generation**: Fixed a Prisma validation error in `controller.ts` where an array was passed to a string field.
- **Product Import**: Fixed a similar error in `import.service.ts` where `images` and `seoData` were passed as non-string values. They are now correctly stringified using `JSON.stringify()`.
- **Log Preservation**: Updated `importQueue.ts` to correctly parse existing logs from the database, preventing log loss when tasks are restarted.

### 4. Dynamic Environment Variables
- **Action**: Installed `dotenv-expand` and updated `src/config/index.ts`.
- **Result**: The `.env` file now supports variable expansion. `API_URL` is set to `http://localhost:${PORT}`, meaning it will always match the current `PORT` automatically.

### 3. Wallet Payment URL Fix
- **Problem**: Payment callback URLs were hardcoded to port 5000, but the server was running on port 5001.
- **Solution**: Updated `API_URL` in `.env` to port 5001 and refactored `WalletController` to use dynamic URLs from the configuration.
- **Result**: SSLCommerz callbacks and redirects now use the correct ports for both backend and frontend.

### 3. Sidebar Menu Fix

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
