/*
 * SPDX-FileCopyrightText: ruru
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export class MfmSilence1734531995440 {
    name = 'MfmSilence1734531995440'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meta" ADD "mfmSilencedHosts" character varying(1024) array NOT NULL DEFAULT '{}'`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "mfmSilencedHosts"`);
    }
}
