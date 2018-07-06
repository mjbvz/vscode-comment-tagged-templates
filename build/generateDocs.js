// @ts-check
const fs = require('fs');
const path = require('path');
const { languages } = require('./languages');

const generateLanguagesTable = () => {
    const entries = languages.map(language =>
        `| ${language.name} | ${language.identifiers.join(', ')} |`);
    return [
        '| Language      | Supported Identifiers|',
        '| ------------- | ---------------------|',
        entries.join('\n')
    ].join('\n')
};

exports.updateDocs = () => {
    const readmePath = path.join(__dirname, '..', 'README.md');
    let readme = fs.readFileSync(readmePath).toString();
    readme = readme.replace(
        /\<\!--BEGIN_LANG_TABLE--\>(.|\n)+\<\!--END_LANG_TABLE--\>/gm,
        `<!--BEGIN_LANG_TABLE-->\n${generateLanguagesTable()}\n<!--END_LANG_TABLE-->`);
    fs.writeFileSync(readmePath, readme)
}; 