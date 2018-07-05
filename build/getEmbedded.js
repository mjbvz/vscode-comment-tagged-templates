// @ts-check
const { languages } = require('./languages');

const getEmbedded = () => {
    return JSON.stringify(
        languages.reduce((out, language) => {
            out[`meta.embedded.block.${language.name}`] = language.language;
            return out;
        }, {}),
        null,
        4);
};

console.log(getEmbedded());