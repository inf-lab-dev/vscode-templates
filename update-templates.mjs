import fs from 'node:fs/promises';

/**
 * The sources for the templates, the key is a partial file-name for which a file is considered a template and
 * the value is the source-url for the file.
 */
const SOURCES = {
    'index.md':
        'https://raw.githubusercontent.com/inf-lab-dev/labs/refs/heads/feat/exercise-watermark/watermark/material/index.md',
};

/**
 * Fetches the given template from the given url and returns the content as tuple for {@link Object.fromEntries} usage.
 *
 * @param {string} fileName the filename
 * @param {string} url the url to the file
 * @returns {Promise<[fileName: string, lines: string[]]>} the result
 */
async function fetchTemplate(fileName, url) {
    const text = await (await fetch(url)).text();
    const lines = text
        .split('\n')
        // ignore empty lines and todo comments
        .filter(line => line.trim().length !== 0 && !line.includes('TODO'));

    return [fileName, lines];
}

const exportedTemplates = Object.fromEntries(
    await Promise.all(
        Object.entries(SOURCES).map(([fileName, url]) =>
            fetchTemplate(fileName, url)
        )
    )
);

await fs.writeFile(
    './src/templates.js',
    `// This file is generated automatically, do not change it!
module.exports = ${JSON.stringify(exportedTemplates)}`
);
