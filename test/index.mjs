//@ts-check
import { runTests } from '@vscode/test-electron';
import * as path from 'path';

const __dirname = new URL('.', import.meta.url).pathname;

async function go() {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '..');
        const extensionTestsPath = path.resolve(__dirname, 'suite');

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