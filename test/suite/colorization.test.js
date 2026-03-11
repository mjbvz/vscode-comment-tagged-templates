/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
'use strict';

const assert = require('assert');
const { commands, Uri } = require('vscode');
const { join, basename, dirname } = require('path');
const fs = require('fs');

async function assertUnchangedTokens(testFixturePath) {
    const fileName = basename(testFixturePath);
    const data = await commands.executeCommand('_workbench.captureSyntaxTokens', Uri.file(testFixturePath));

    const resultsFolderPath = join(dirname(dirname(testFixturePath)), 'colorize-results');
    fs.mkdirSync(resultsFolderPath, { recursive: true });

    const resultPath = join(resultsFolderPath, fileName.replace('.', '_') + '.json');
    if (fs.existsSync(resultPath)) {
        const previousData = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
        try {
            assert.deepStrictEqual(data, previousData);
        } catch (e) {
            fs.writeFileSync(resultPath, JSON.stringify(data, null, '\t'));
            if (Array.isArray(data) && Array.isArray(previousData) && data.length === previousData.length) {
                for (let i = 0; i < data.length; i++) {
                    const d = data[i];
                    const p = previousData[i];
                    if (d.c !== p.c || hasThemeChange(d.r, p.r)) {
                        throw e;
                    }
                }
                // different but no tokenization or color change: no failure
            } else {
                throw e;
            }
        }
    } else {
        fs.writeFileSync(resultPath, JSON.stringify(data, null, '\t'));
    }
}

function hasThemeChange(d, p) {
    return Object.keys(d).some(key => d[key] !== p[key]);
}

suite('colorization', () => {
    const extensionColorizeFixturePath = join(__dirname, 'colorize-fixtures');
    if (fs.existsSync(extensionColorizeFixturePath)) {
        // define a test for each fixture
        for (const fixturesFile of fs.readdirSync(extensionColorizeFixturePath)) {
            test(fixturesFile, () => assertUnchangedTokens(join(extensionColorizeFixturePath, fixturesFile)));
        }
    }
});
