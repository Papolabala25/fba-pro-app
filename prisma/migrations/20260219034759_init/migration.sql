-- CreateTable
CREATE TABLE "Analysis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "asin" TEXT NOT NULL,
    "buyBoxPrice" REAL,
    "currentRank" INTEGER,
    "avg30dRank" INTEGER,
    "estimatedMonthlySales" INTEGER,
    "offersCount" INTEGER,
    "pressureIndex" REAL,
    "trend" TEXT,
    "arogaScore" INTEGER NOT NULL,
    "verdict" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
