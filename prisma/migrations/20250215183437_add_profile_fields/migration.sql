-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "taskReminders" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "theme" TEXT DEFAULT 'system';
