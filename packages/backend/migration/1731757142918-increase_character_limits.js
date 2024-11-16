/*
 * SPDX-FileCopyrightText: hazelnoot and other Sharkey contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export class IncreaseCharacterLimits1731757142918 {
	name = 'IncreaseCharacterLimits1731757142918'

	async up(queryRunner) {
		await queryRunner.query(`DROP INDEX IF EXISTS "IDX_7cc8d9b0ee7861b4e5dc86ad85"`);
		await queryRunner.query(`ALTER TABLE "drive_file" ALTER COLUMN "comment" TYPE varchar(32768)`);
		await queryRunner.query(`ALTER TABLE "note" ALTER COLUMN "cw" TYPE text`);
		await queryRunner.query(`CREATE INDEX "IDX_7cc8d9b0ee7861b4e5dc86ad85" ON "note" USING "pgroonga" ("cw")`);
	}

	async down(queryRunner) {
		await queryRunner.query(`ALTER TABLE "note" ALTER COLUMN "cw" TYPE varchar(512)`);
		await queryRunner.query(`ALTER TABLE "drive_file" ALTER COLUMN "comment" TYPE varchar(8192)`);
		await queryRunner.query(`DROP INDEX "IDX_7cc8d9b0ee7861b4e5dc86ad85"`);
		await queryRunner.query(`CREATE INDEX "IDX_7cc8d9b0ee7861b4e5dc86ad85" ON "note" USING "pgroonga" ("cw" pgroonga_varchar_full_text_search_ops)`);
	}
}
