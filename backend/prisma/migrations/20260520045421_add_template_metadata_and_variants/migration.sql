-- AlterTable
ALTER TABLE `builderpageversion` ADD COLUMN `activeFrom` DATETIME(3) NULL,
    ADD COLUMN `activeTo` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `setting` MODIFY `value` LONGTEXT NOT NULL;

-- CreateTable
CREATE TABLE `BuilderTemplatePack` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'locked',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BuilderTemplatePack_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BuilderTemplate` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `scope` VARCHAR(191) NOT NULL DEFAULT 'page',
    `pageType` VARCHAR(191) NOT NULL DEFAULT 'home',
    `themeKey` VARCHAR(191) NULL,
    `thumbnail` VARCHAR(191) NULL,
    `document` JSON NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `isSystem` BOOLEAN NOT NULL DEFAULT false,
    `packId` VARCHAR(191) NULL,
    `createdById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BuilderTemplate_key_key`(`key`),
    INDEX `BuilderTemplate_packId_idx`(`packId`),
    INDEX `BuilderTemplate_scope_pageType_idx`(`scope`, `pageType`),
    INDEX `BuilderTemplate_themeKey_idx`(`themeKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BuilderComponent` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BuilderComponent_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BuilderComponentContent` (
    `id` VARCHAR(191) NOT NULL,
    `componentId` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `BuilderComponentContent_componentId_idx`(`componentId`),
    UNIQUE INDEX `BuilderComponentContent_componentId_key_key`(`componentId`, `key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BuilderTemplate` ADD CONSTRAINT `BuilderTemplate_packId_fkey` FOREIGN KEY (`packId`) REFERENCES `BuilderTemplatePack`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BuilderComponentContent` ADD CONSTRAINT `BuilderComponentContent_componentId_fkey` FOREIGN KEY (`componentId`) REFERENCES `BuilderComponent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
