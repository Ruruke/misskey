/*
 * SPDX-FileCopyrightText: ruru
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export class SigninButtonToToggle1733996957482 {
    name = 'SigninButtonToToggle1733996957482'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meta" ADD "disableSignup" boolean NOT NULL DEFAULT false`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "disableSignup"`);
    }
}
