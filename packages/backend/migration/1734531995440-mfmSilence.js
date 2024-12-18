/*
 * SPDX-FileCopyrightText: ruru
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export class MfmSilence1734531995440 {
    name = 'MfmSilence1734531995440'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" DROP CONSTRAINT "FK_abuse_report_notification_recipient_systemWebhookId"`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" DROP CONSTRAINT "FK_abuse_report_notification_recipient_userId2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_abuse_report_notification_recipient_isActive"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_abuse_report_notification_recipient_method"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_abuse_report_notification_recipient_userId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_abuse_report_notification_recipient_systemWebhookId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7cc8d9b0ee7861b4e5dc86ad85"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_EMOJI_ROLE_IDS"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_EMOJI_CATEGORY"`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "mfmSilencedHosts" character varying(1024) array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "drive_file" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "drive_file" ADD "comment" character varying(512)`);
        await queryRunner.query(`COMMENT ON COLUMN "drive_file"."comment" IS 'The comment of the DriveFile.'`);
        await queryRunner.query(`ALTER TABLE "system_webhook" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "user_profile"."listenbrainz" IS 'The ListenBrainz username of the User.'`);
        await queryRunner.query(`ALTER TYPE "public"."user_profile_followersVisibility_enum" RENAME TO "user_profile_followersVisibility_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_profile_followersvisibility_enum" AS ENUM('public', 'followers', 'private')`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "followersVisibility" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "followersVisibility" TYPE "public"."user_profile_followersvisibility_enum" USING "followersVisibility"::"text"::"public"."user_profile_followersvisibility_enum"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "followersVisibility" SET DEFAULT 'public'`);
        await queryRunner.query(`DROP TYPE "public"."user_profile_followersVisibility_enum_old"`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" DROP CONSTRAINT "FK_abuse_report_notification_recipient_userId1"`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ALTER COLUMN "userId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ALTER COLUMN "systemWebhookId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "note" DROP COLUMN "cw"`);
        await queryRunner.query(`ALTER TABLE "note" ADD "cw" character varying(512)`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "disableRegistration" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "preservedUsernames" SET DEFAULT '{ "admin", "administrator", "root", "system", "maintainer", "host", "mod", "moderator", "owner", "superuser", "staff", "auth", "i", "me", "everyone", "all", "mention", "mentions", "example", "user", "users", "account", "accounts", "official", "help", "helps", "support", "supports", "info", "information", "informations", "announce", "announces", "announcement", "announcements", "notice", "notification", "notifications", "dev", "developer", "developers", "tech", "misskey" }'`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "urlPreviewRequireContentLength" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "urlPreviewUserAgent" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "flash" ALTER COLUMN "visibility" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_58699f75b9cf904f5f007909cb" ON "user_profile" ("birthday") `);
        await queryRunner.query(`CREATE INDEX "IDX_bd5de500bac2e158a7bf8426e8" ON "abuse_report_notification_recipient" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_7c8ef2211cf3cee665d75d5e90" ON "abuse_report_notification_recipient" ("method") `);
        await queryRunner.query(`CREATE INDEX "IDX_ffb3900031cf2fa6af1e1cb3e3" ON "abuse_report_notification_recipient" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5e0740f3b5b4290103ecf33b72" ON "abuse_report_notification_recipient" ("systemWebhookId") `);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ADD CONSTRAINT "FK_abuse_report_notification_recipient_userId1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ADD CONSTRAINT "FK_abuse_report_notification_recipient_userId2" FOREIGN KEY ("userId") REFERENCES "user_profile"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ADD CONSTRAINT "FK_5e0740f3b5b4290103ecf33b722" FOREIGN KEY ("systemWebhookId") REFERENCES "system_webhook"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" DROP CONSTRAINT "FK_5e0740f3b5b4290103ecf33b722"`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" DROP CONSTRAINT "FK_abuse_report_notification_recipient_userId2"`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" DROP CONSTRAINT "FK_abuse_report_notification_recipient_userId1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5e0740f3b5b4290103ecf33b72"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ffb3900031cf2fa6af1e1cb3e3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7c8ef2211cf3cee665d75d5e90"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bd5de500bac2e158a7bf8426e8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_58699f75b9cf904f5f007909cb"`);
        await queryRunner.query(`ALTER TABLE "flash" ALTER COLUMN "visibility" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "urlPreviewUserAgent" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "urlPreviewRequireContentLength" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "preservedUsernames" SET DEFAULT '{admin,administrator,root,system,maintainer,host,mod,moderator,owner,superuser,staff,auth,i,me,everyone,all,mention,mentions,example,user,users,account,accounts,official,help,helps,support,supports,info,information,informations,announce,announces,announcement,announcements,notice,notification,notifications,dev,developer,developers,tech,misskey}'`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "disableRegistration" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "note" DROP COLUMN "cw"`);
        await queryRunner.query(`ALTER TABLE "note" ADD "cw" text`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ALTER COLUMN "systemWebhookId" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ALTER COLUMN "userId" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ADD CONSTRAINT "FK_abuse_report_notification_recipient_userId1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TYPE "public"."user_profile_followersVisibility_enum_old" AS ENUM('public', 'followers', 'private')`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "followersVisibility" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "followersVisibility" TYPE "public"."user_profile_followersVisibility_enum_old" USING "followersVisibility"::"text"::"public"."user_profile_followersVisibility_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "followersVisibility" SET DEFAULT 'public'`);
        await queryRunner.query(`DROP TYPE "public"."user_profile_followersvisibility_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_profile_followersVisibility_enum_old" RENAME TO "user_profile_followersVisibility_enum"`);
        await queryRunner.query(`COMMENT ON COLUMN "user_profile"."listenbrainz" IS 'listenbrainz username to fetch currently playing.'`);
        await queryRunner.query(`ALTER TABLE "system_webhook" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`COMMENT ON COLUMN "drive_file"."comment" IS 'The comment of the DriveFile.'`);
        await queryRunner.query(`ALTER TABLE "drive_file" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "drive_file" ADD "comment" character varying(32768)`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "mfmSilencedHosts"`);
        await queryRunner.query(`CREATE INDEX "IDX_EMOJI_CATEGORY" ON "emoji" ("category") `);
        await queryRunner.query(`CREATE INDEX "IDX_EMOJI_ROLE_IDS" ON "emoji" ("roleIdsThatCanBeUsedThisEmojiAsReaction") `);
        await queryRunner.query(`CREATE INDEX "IDX_7cc8d9b0ee7861b4e5dc86ad85" ON "note" ("cw") `);
        await queryRunner.query(`CREATE INDEX "IDX_abuse_report_notification_recipient_systemWebhookId" ON "abuse_report_notification_recipient" ("systemWebhookId") `);
        await queryRunner.query(`CREATE INDEX "IDX_abuse_report_notification_recipient_userId" ON "abuse_report_notification_recipient" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_abuse_report_notification_recipient_method" ON "abuse_report_notification_recipient" ("method") `);
        await queryRunner.query(`CREATE INDEX "IDX_abuse_report_notification_recipient_isActive" ON "abuse_report_notification_recipient" ("isActive") `);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ADD CONSTRAINT "FK_abuse_report_notification_recipient_userId2" FOREIGN KEY ("userId") REFERENCES "user_profile"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ADD CONSTRAINT "FK_abuse_report_notification_recipient_systemWebhookId" FOREIGN KEY ("systemWebhookId") REFERENCES "system_webhook"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
