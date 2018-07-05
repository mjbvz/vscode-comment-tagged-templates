// @ts-check

const fs = require('fs');
const path = require('path');
const { languages } = require('./languages');

const targetScopes = ['source.js', 'source.jsx', 'source.js.jsx', 'source.ts', 'source.tsx']

const grammarTemplate = {
    "fileTypes": [],
    "injectionSelector": targetScopes.map(scope=> `L:${scope} -comment -(string - meta.embedded)`).join(', '),
    "patterns": [ ],
    "scopeName": "inline.template-tagged-langauges"
};

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
        'patterns': [
            {
                "include": "source.ts#template-substitution-element"
            }
        ].concat(sources.map(source => ({
            'include': source
        })))
    };
};

const getPatterns = () => {
    return languages.map(getPattern);
};

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const buildGrammar = () => {
    const json = grammarTemplate;
    json.patterns = getPatterns();
    const out = JSON.stringify(json, null, 4);
    fs.writeFileSync(path.join(__dirname, '..', 'syntaxes', 'grammar.json'), out);
};

buildGrammar();
