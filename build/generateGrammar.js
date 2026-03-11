// @ts-check

const fs = require('fs');
const path = require('path');
const { languages } = require('./languages');

const targetScopes = ['source.js', 'source.jsx', 'source.js.jsx', 'source.ts', 'source.tsx']

const basicGrammarTemplate = {
    "fileTypes": [],
    "injectionSelector": getBasicGrammarInjectionSelector(),
    "patterns": [],
    "scopeName": "inline.template-tagged-languages"
};

const reinjectGrammarTemplate = {
    "fileTypes": [],
    "injectionSelector": getReinjectGrammarInjectionSelector(),
    "patterns": [
        {
            "include": "source.ts#template-substitution-element"
        }
    ],
    "scopeName": "inline.template-tagged-languages.reinjection"
};

const getCommentTaggedGrammarPattern = (language) => {
    const sources = Array.isArray(language.source) ? language.source : [language.source];
    return {
        name: `string.js.taggedTemplate.commentTaggedTemplate.${language.name}`,
        contentName: `meta.embedded.block.${language.name}`,

        // The leading '/' was consumed by outer rule
        begin: `(?i)(\\*\\s*\\b(?:${language.identifiers.map(escapeRegExp).join('|')})\\b\\s*\\*/)\\s*(\`)`,
        beginCaptures: {
            1: { name: 'comment.block.ts' },
            2: { name: 'punctuation.definition.string.template.begin.js' }
        },
        end: '(?=`)',
        patterns: [
            ...sources.map(source => ({ 'include': source })),
            // When a language grammar is not installed, insert a phony pattern
            // so that we still match all the inner text but don't highlight it
            {
                match: "."
            }
        ]
    };
};

const getDirectTaggedGrammarPattern = (language) => {
    const sources = Array.isArray(language.source) ? language.source : [language.source];
    return {
        name: `string.js.taggedTemplate.directTaggedTemplate.${language.name}`,
        contentName: `meta.embedded.block.${language.name}`,
        begin: `(?i)(\\b(?:${language.identifiers.map(escapeRegExp).join('|')})\\b\)\\s*(\`)`,
        beginCaptures: {
            1: { name: 'entity.name.function.tagged-template.js' },
            2: { name: 'punctuation.definition.string.template.begin.js' }
        },
        end: '`',
        endCaptures: {
            0: { name: 'punctuation.definition.string.template.end.js' }
        },
        patterns: [
            ...sources.map(source => ({ 'include': source })),
            { match: "." }
        ]
    };
};

const getBasicGrammar = () => {
    const basicGrammar = basicGrammarTemplate;

    basicGrammar.repository = languages.reduce((repository, language) => {
        repository[getCommentTaggedRepositoryName(language)] = getCommentTaggedGrammarPattern(language);
        return repository;
    }, {});

    const allLanguageIdentifiers = [].concat(...languages.map(x => x.identifiers));
    basicGrammar.patterns = [
        {
            // Match entire language comment identifier but only consume '/'
            begin: `(?i)(/)(?=(\\*\\s*\\b(?:${allLanguageIdentifiers.map(escapeRegExp).join('|')})\\b\\s*\\*/)\\s*\`)`,
            beginCaptures: {
                1: { name: 'comment.block.ts' }
            },
            end: '(`)',
            endCaptures: {
                0: { name: 'string.js' },
                1: { name: 'punctuation.definition.string.template.end.js' }
            },
            patterns: languages.map(language => ({ include: '#' + getCommentTaggedRepositoryName(language) }))
        },
        ...languages.map(getDirectTaggedGrammarPattern)
    ];

    return basicGrammar;
};

function getCommentTaggedRepositoryName(language) {
    return 'commentTaggedTemplate-' + language.name;
}

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
    writeJson(path.join(outDir, 'grammar.json'), getBasicGrammar());

    writeJson(
        path.join(outDir, 'reinject-grammar.json'),
        reinjectGrammarTemplate);
};
