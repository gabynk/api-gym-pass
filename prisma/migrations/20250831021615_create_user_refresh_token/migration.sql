-- CreateTable
CREATE TABLE "user_refresh_token" (
    "id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "revoked_by_id" TEXT,

    CONSTRAINT "user_refresh_token_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_refresh_token" ADD CONSTRAINT "user_refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_refresh_token" ADD CONSTRAINT "user_refresh_token_revoked_by_id_fkey" FOREIGN KEY ("revoked_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
