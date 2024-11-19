/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createHash } from 'crypto';
import { readFileSync } from 'fs';

export type CSPHashed = {
    content: string,
    integrity: string,
};

export function generateCSP(hashedMap: Map<string, CSPHashed>, options: {
    mediaProxy?: string,
}) {
    const keys = Array.from(hashedMap.keys());
    const scripts = keys
        .filter(name => name.endsWith('.js'))
        .map(name => `'${hashedMap.get(name)!.integrity}'`);
    const styles = keys
        .filter(name => name.endsWith('.css'))
        .map(name => `'${hashedMap.get(name)!.integrity}'`);

    return ([
        ['default-src', ['\'self\'']],
        ['img-src',
            [
                '\'self\'',
                'data:',
                'blob:',
                // 'https://avatars.githubusercontent.com', // uncomment this for contributor avatars to work
                options.mediaProxy
            ].filter(Boolean)],
        ['media-src', ['\'self\'', 'data:', options.mediaProxy].filter(Boolean)],
        ['font-src', ['\'self\'']],
        ['style-src', ['\'self\'', ...styles]],
        // remove below line if you do not use code highlighting.
        // shiki is not designed to work with CSP, so we need to allow unsafe-inline for now.
        //
        // Allowing inline style attributes is a very small risk, so I will allow by default.
        // Since you can not write CSS selectors or cascading rules in the inline style attributes.
        //
        // ref: https://github.com/shikijs/shiki/issues/671
        ['style-src-attr', ['\'self\'', '\'unsafe-inline\'']],
        ['script-src', ['\'self\'', '\'wasm-unsafe-eval\'', ...scripts]],
        ['object-src', ['\'none\'']],
        ['frame-src', ['\'none\'']],
        ['base-uri', ['\'self\'']],
        ['form-action', ['\'self\'']],
        ['child-src', ['\'self\'']],
        ['manifest-src', ['\'self\'']],
        ...(process.env.NODE_ENV === 'production' ?
            [
                ['upgrade-insecure-requests', []],
            ] : []),
    ] as [string, string[]][])
        .map(([name, values]) => {
            return `${name} ${values.join(' ')}`;
        }).join('; ');
}

export function hashResource(res: string): CSPHashed {
    const sha256 = createHash('sha256');

    sha256.update(res);

    const content = res;
    const integrity = `sha256-${sha256.digest('base64')}`;
    return { content, integrity };
}

export function hashSourceFile(file: string): CSPHashed {
    const content = readFileSync(file, 'utf8');

    return hashResource(content);
}
