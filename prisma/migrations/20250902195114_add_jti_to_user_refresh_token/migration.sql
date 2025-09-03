-- AlterTable
ALTER TABLE "user_refresh_token" ADD COLUMN     "jti" TEXT NOT NULL,
ADD COLUMN     "replaced_by_jti" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_refresh_token_jti_key" ON "user_refresh_token"("jti");
