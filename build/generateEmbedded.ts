import fs from 'node:fs';
import path from 'node:path';
import { languages } from './languages.ts';

const getEmbedded = (): Record<string, string | undefined> => {
    return languages.reduce<Record<string, string | undefined>>((out, language) => {
        out[`meta.embedded.block.${language.name}`] = language.language;
        return out;
    }, {});
};

export function updateEmbedded(): void {
    const packageJsonPath = path.join(import.meta.dirname, '..', 'package.json');
    const json = JSON.parse(fs.readFileSync(packageJsonPath).toString());
    json.contributes.grammars[0].embeddedLanguages = getEmbedded();
    fs.writeFileSync(packageJsonPath, JSON.stringify(json, null, 4));
}
