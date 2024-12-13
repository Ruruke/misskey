/*
 * SPDX-FileCopyrightText: ruru
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export class DisableNoLoginTL1734018897963 {
    name = 'DisableNoLoginTL1734018897963'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meta" ADD "disableNotloginToShowTL" boolean NOT NULL DEFAULT false`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "disableNotloginToShowTL"`);
    }
}
