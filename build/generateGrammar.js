// @ts-check

const fs = require('fs');
const path = require('path');
const { languages } = require('./languages');

const targetScopes = ['source.js', 'source.jsx', 'source.js.jsx', 'source.ts', 'source.tsx']

const basicGrammarTemplate = {
    "fileTypes": [],
    "injectionSelector": getBasicGrammarInjectionSelector(),
    "patterns": [],
    "scopeName": "inline.template-tagged-langauges"
};

const reinjectGrammarTemplate = {
    "fileTypes": [],
    "injectionSelector": getReinjectGrammarInjectionSelector(),
    "patterns": [
        {
            "include": "source.ts#template-substitution-element"
        }
    ],
    "scopeName": "inline.template-tagged-langauges.reinjection"
};

const getBasicGrammarPattern = (language) => {
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

const getBasicGrammarPatterns = () =>
    languages.map(getBasicGrammarPattern);

function getBasicGrammarInjectionSelector() {
    return targetScopes
        .map(scope => `L:${scope} -comment -(string - meta.embedded)`)
        .join(', ');
}

function getReinjectGrammarInjectionSelector() {
    return targetScopes
        .map(scope => {
            const embeddedScopeSelectors = languages.map(language => `meta.embedded.block.${language.name}`);
            return `L:${scope} (${embeddedScopeSelectors.join(', ')})`
        })
        .join(', ');
}

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function writeJson(outFile, json) {
    fs.writeFileSync(outFile, JSON.stringify(json, null, 4));
}

exports.updateGrammars = () => {
    const outDir = path.join(__dirname, '..', 'syntaxes');
    const basicGrammar = basicGrammarTemplate;
    basicGrammar.patterns = getBasicGrammarPatterns();
    writeJson(path.join(outDir, 'grammar.json'), basicGrammar);

    writeJson(
        path.join(outDir, 'reinject-grammar.json'),
        reinjectGrammarTemplate);
};

