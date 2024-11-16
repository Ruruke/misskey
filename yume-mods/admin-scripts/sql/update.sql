CREATE TEMPORARY TABLE "user_avatar_update" (
    "id" CHARACTER VARYING(32) PRIMARY KEY NOT NULL,
    "updatedAvatarUrl" CHARACTER VARYING(512) NOT NULL
)

CREATE INDEX "user_avatar_update_url" ON "user_avatar_update" ("updatedAvatarUrl")

with typed as (
    select *, 
        case when "avatarUrl" ~ '%2Fproxy%2F' then 'nested'
        when "avatarUrl" ~ '^https://mproxy\.mi\.yumechi\.jp' then 'proxied'
        when "avatarUrl" ~ '^https://mi\.yumechi\.jp' then 'direct' 
        else 'unknown' end 
    AS proxy_type 
    FROM "user" WHERE "avatarUrl" IS NOT NULL)
INSERT INTO "user_avatar_update" ("id", "updatedAvatarUrl")
SELECT "id", 'https://mproxy.mi.yumechi.jp/' || SUBSTRING("avatarUrl" FROM 1 + LENGTH('https://mi.yumechi.jp/')) AS "updatedAvatarUrl" FROM typed WHERE proxy_type = 'direct'

UPDATE "user" SET "avatarUrl" = "user_avatar_update"."updatedAvatarUrl" FROM "user_avatar_update" WHERE "user"."id" = "user_avatar_update"."id"

SELECT typed."id",  "avatarUrl", 'https://mproxy.mi.yumechi.jp/' || SUBSTRING("avatarUrl" FROM 1 + LENGTH('https://mi.yumechi.jp/')) AS aft  from typed where proxy_type = 'direct'