// @ts-check
const { languages } = require('./languages');

const getEmbedded = () => {
    const entries = languages.map(language => {
        return `| ${language.name} | ${language.identifiers.join(', ')} |`;
    });
    return `| Language        | Supported Identifiers|
| ------------- | -----|
${entries.join('\n')}`;
};

console.log(getEmbedded());