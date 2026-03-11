const path = require('path');
const Mocha = require('mocha');
const { sync: findTestFiles } = require('glob');

module.exports.run = (testsRoot, cb) => {
	const mocha = new Mocha({ ui: 'tdd' });

	try {
		const files = findTestFiles('**/**.test.js', { cwd: testsRoot });
		files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));
		mocha.run(failures => cb(null, failures));
	} catch (err) {
		cb(err);
	}
};
