/*
 * SPDX-FileCopyrightText: marie and other Sharkey contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export class RobotsTxt1738346484187 {
    name = 'RobotsTxt1738346484187'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meta" ADD "robotsTxt" text`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "robotsTxt"`);
    }
}
