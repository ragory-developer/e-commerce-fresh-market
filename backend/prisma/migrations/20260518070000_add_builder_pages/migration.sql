CREATE TABLE `BuilderPage` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'builder',
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `draftVersionId` VARCHAR(191) NULL,
    `publishedVersionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BuilderPage_key_key`(`key`),
    UNIQUE INDEX `BuilderPage_slug_key`(`slug`),
    INDEX `BuilderPage_key_idx`(`key`),
    INDEX `BuilderPage_slug_idx`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `BuilderPageVersion` (
    `id` VARCHAR(191) NOT NULL,
    `pageId` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `document` JSON NOT NULL,
    `createdById` VARCHAR(191) NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BuilderPageVersion_pageId_status_idx`(`pageId`, `status`),
    UNIQUE INDEX `BuilderPageVersion_pageId_version_key`(`pageId`, `version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `BuilderPageVersion`
ADD CONSTRAINT `BuilderPageVersion_pageId_fkey`
FOREIGN KEY (`pageId`) REFERENCES `BuilderPage`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;
