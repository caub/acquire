window.require = (()=>{

	const ROOT = location.origin + location.pathname.replace(/[^/]*\.[^/]+$/, ''); // cache against history.pushState mutation
	const REQUIRE_CACHE = Object.create(null);
	const RE_EXT = /\.js\w*$/;
	let AsyncFunction = (function*(){}).constructor;
	let exec = (MODULE, it) => Promise.resolve().then(function pump(v) {
			const {done, value} = it.next(v);
			if(done) return value;
			return Promise.resolve(value).then(pump, it.throw.bind(it));
		}).then(() => MODULE.exports);
	let replacer = [/\brequire\(/g, ' yield require('];
	try {
		AsyncFunction = eval('async()=>{}').constructor;
		exec = (MODULE, it) => it.then(() => MODULE.exports);
		replacer = [/\brequire\(/g, ' await require('];
	} catch(e) {}

	function require(...urls) {

		const requone = url => { // require one
			if (REQUIRE_CACHE[url]) {
				return Promise.resolve(REQUIRE_CACHE[url].exports);
			}
			const {href, host} = new URL( (url.startsWith('/')?ROOT:this.__dirname ) + url ),
				last = href.lastIndexOf('/'), dir = href.slice(0, last+1), name = href.slice(last+1),
				filename = name ? (RE_EXT.test(name)?name:name+'.js') : 'index.js',
				abs = dir+filename;

			if (REQUIRE_CACHE[abs]) {
				return Promise.resolve(REQUIRE_CACHE[abs].exports);
			}
			if (abs.endsWith('.json')) {
				return fetch(abs).then(r=>r.json()).then(code=>
					REQUIRE_CACHE[abs].exports = {exports: code}
				)
			}
			return fetch(abs).then(r=>r.text())
				.then(originalCode=>{
					const code = (abs.endsWith('.jsx')?Babel.transform(originalCode, { presets: ['react'] }).code:originalCode).replace(...replacer);
					const executableCode = new AsyncFunction('module', 'exports', '__dirname', 'require', code + '\n\n//# sourceURL=' + abs);
					const MODULE = REQUIRE_CACHE[abs] = {
						__dirname: dir,
						exports: {}
					};
					const it = executableCode.call(MODULE.exports, MODULE, MODULE.exports, dir, require.bind(MODULE));
					return exec(MODULE, it);
				});
		}
		return urls.length==1 ? requone(urls[0]) : Promise.all(urls.map(requone));
	}
	return Object.assign( require.bind({__dirname: ROOT}), {cache: REQUIRE_CACHE});
})();



