import fs from 'node:fs';
import path from 'node:path';
import { languages } from './languages.ts';

const generateLanguagesTable = (): string => {
    const entries = languages.map(language =>
        `| ${language.name} | ${language.identifiers.join(', ')} |`);
    return [
        '| Language      | Supported Identifiers|',
        '| ------------- | ---------------------|',
        entries.join('\n')
    ].join('\n')
};

export function updateDocs(): void {
    const readmePath = path.join(import.meta.dirname, '..', 'README.md');
    let readme = fs.readFileSync(readmePath).toString();
    readme = readme.replace(
        /\<\!--BEGIN_LANG_TABLE--\>(.|\n)+\<\!--END_LANG_TABLE--\>/gm,
        `<!--BEGIN_LANG_TABLE-->\n${generateLanguagesTable()}\n<!--END_LANG_TABLE-->`);
    fs.writeFileSync(readmePath, readme)
}
