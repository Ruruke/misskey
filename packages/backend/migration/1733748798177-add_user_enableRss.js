export class AddUserEnableRss1733748798177 {
    name = 'AddUserEnableRss1733748798177'

    async up(queryRunner) {
				// Disable by default, then specifically enable for all existing local users.
				await queryRunner.query(`ALTER TABLE "user" ADD "enable_rss" boolean NOT NULL DEFAULT false`);
				await queryRunner.query(`UPDATE "user" SET "enable_rss" = true WHERE host IS NULL;`)
		}

    async down(queryRunner) {
				await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "enable_rss"`);
		}
}
