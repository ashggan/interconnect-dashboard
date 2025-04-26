/*
  Warnings:

  - The primary key for the `Partner` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `partner_id` on the `Partner` table. All the data in the column will be lost.
  - Added the required column `id` to the `Partner` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Partner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "partner_name" TEXT,
    "description" TEXT,
    "currency" TEXT,
    "country" TEXT
);
INSERT INTO "new_Partner" ("country", "currency", "description", "partner_name") SELECT "country", "currency", "description", "partner_name" FROM "Partner";
DROP TABLE "Partner";
ALTER TABLE "new_Partner" RENAME TO "Partner";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
