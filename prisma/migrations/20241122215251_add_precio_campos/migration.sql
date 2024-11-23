/*
  Warnings:

  - Added the required column `precioTotal` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precioUnitario` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pedido" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cliente" TEXT NOT NULL,
    "producto" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "precioUnitario" REAL NOT NULL,
    "precioTotal" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Pedido" ("cantidad", "cliente", "createdAt", "estado", "id", "producto") SELECT "cantidad", "cliente", "createdAt", "estado", "id", "producto" FROM "Pedido";
DROP TABLE "Pedido";
ALTER TABLE "new_Pedido" RENAME TO "Pedido";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
