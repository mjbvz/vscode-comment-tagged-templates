// @ts-check

const fs = require('fs');
const path = require('path');
const { languages } = require('./languages');

const getPattern = (language) => {
    const sources = Array.isArray(language.source) ? language.source : [language.source];
    return {
        'name': `string.js.taggedTemplate.commentTaggedTemplate.${language.name}`,
        'contentName': `meta.embedded.block.${language.name}`,
        'begin': `(?x)(/\\*\\s*(?:${language.identifiers.map(escapeRegExp).join('|')})\\s*\\*/)\\s*(\`)`,
        'beginCaptures': {
            '1': {
                'name': 'comment.block.ts'
            },
            '2': {
                'name': 'string.js'
            },
            '3': {
                'name': 'punctuation.definition.string.template.begin.js'
            }
        },
        'end': '(`)',
        'endCaptures': {
            '0': {
                'name': 'string.js'
            },
            '1': {
                'name': 'punctuation.definition.string.template.end.js'
            }
        },
        'patterns': sources.map(source => ({
            'include': source
        }))
    };
};

const getPatterns = () => {
    return languages.map(getPattern);
};

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const buildGrammar = () => {
    let text = fs.readFileSync(path.join(__dirname, 'grammar.base.json'), 'utf8');
    const json = JSON.parse(text);
    json.patterns = getPatterns();
    const out = JSON.stringify(json, null, 4);
    fs.writeFileSync(path.join(__dirname, '..', 'syntaxes', 'grammar.json'), out);
};

buildGrammar();
