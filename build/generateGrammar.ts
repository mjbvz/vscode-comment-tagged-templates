import fs from 'node:fs';
import path from 'node:path';
import { languages, type Language } from './languages.ts';

const targetScopes = ['source.js', 'source.jsx', 'source.js.jsx', 'source.ts', 'source.tsx']

const basicGrammarTemplate = {
    "fileTypes": [] as string[],
    "injectionSelector": getBasicGrammarInjectionSelector(),
    "patterns": [] as unknown[],
    "scopeName": "inline.template-tagged-languages",
    "repository": {} as Record<string, unknown>,
};

const reinjectGrammarTemplate = {
    "fileTypes": [] as string[],
    "injectionSelector": getReinjectGrammarInjectionSelector(),
    "patterns": [
        {
            "include": "source.ts#template-substitution-element"
        }
    ],
    "scopeName": "inline.template-tagged-languages.reinjection"
};

const getBasicGrammarPattern = (language: Language) => {
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

const getBasicGrammar = () => {
    const basicGrammar = basicGrammarTemplate;

    basicGrammar.repository = languages.reduce((repository: Record<string, unknown>, language) => {
        repository[getRepositoryName(language)] = getBasicGrammarPattern(language);
        return repository;
    }, {});

    const allLanguageIdentifiers = ([] as string[]).concat(...languages.map(x => x.identifiers));
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
            patterns: languages.map(language => ({ include: '#' + getRepositoryName(language) }))
        }
    ]

    return basicGrammar;
};

function getRepositoryName(language: Language): string {
    return 'commentTaggedTemplate-' + language.name;
}

function getBasicGrammarInjectionSelector(): string {
    return targetScopes
        .map(scope => `L:${scope} -comment -(string - meta.embedded)`)
        .join(', ');
}

function getReinjectGrammarInjectionSelector(): string {
    return targetScopes
        .map(scope => {
            const embeddedScopeSelectors = languages.map(language => `meta.embedded.block.${language.name}`);
            return `L:${scope} (${embeddedScopeSelectors.join(', ')})`
        })
        .join(', ');
}

function escapeRegExp(text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function writeJson(outFile: string, json: unknown): void {
    fs.writeFileSync(outFile, JSON.stringify(json, null, 4));
}

export function updateGrammars(): void {
    const outDir = path.join(import.meta.dirname, '..', 'syntaxes');
    fs.mkdirSync(outDir, { recursive: true });
    writeJson(path.join(outDir, 'grammar.json'), getBasicGrammar());

    writeJson(
        path.join(outDir, 'reinject-grammar.json'),
        reinjectGrammarTemplate);
}
