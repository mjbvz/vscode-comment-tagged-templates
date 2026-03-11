import { runTests } from '@vscode/test-electron';
import * as path from 'path';

async function go() {
    try {
        const extensionDevelopmentPath = path.resolve(import.meta.dirname, '..');
        const extensionTestsPath = path.resolve(import.meta.dirname, 'suite');

        /**
         * Basic usage
         */
        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
        });
    } catch (err) {
        console.error('Failed to run tests', err);
        process.exit(1);
    }
}

go();
