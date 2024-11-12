export const commonPugFilters = {
    dataTag: (data: string, options: { tagName: string, mimeType: string }) => {
        if (!/^[a-z]+$/.test(options.tagName)) {
            throw new Error('Invalid tagName');
        }
        if (/[;'"]/.test(options.mimeType)) {
            throw new Error('Invalid mimeType');
        }
        const dataURI = `data:${options.mimeType};base64,${Buffer.from(data).toString('base64')}`;
        return `<${options.tagName} data="${dataURI}"></${options.tagName}>`;
    }
} as const;
