const path = require('path');
const Mocha = require('mocha');
const { globSync } = require('glob');

module.exports.run = (testsRoot, cb) => {
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd'
	});

	try {
		const files = globSync('**/**.test.js', { cwd: testsRoot });

		// Add files to the test suite
		files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

		// Run the mocha test
		mocha.run(failures => {
			cb(null, failures);
		});
	} catch (err) {
		cb(err);
	}
}