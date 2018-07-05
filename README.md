[![](https://vsmarketplacebadge.apphb.com/version/bierner.comment-tagged-templates.svg)](https://marketplace.visualstudio.com/items?itemName=bierner.comment-tagged-templates)

Adds basic syntax highlighting for JavaScript and TypeScript tagged template strings using language identifier comments:

```ts
const cssString = /* css */ `
    button {
        color: hotpink !important;
    }
`;

const htmlString = /* html */`
    <button class="my-button">
        Click me!
    </button>
`;
```

![](https://github.com/mjbvz/vscode-comment-tagged-templates/raw/master/docs/example.png)


## Usage
The language identifier comment must appear before the opening backtick for the template string. Here is basic list of valid identifiers:

| Language        | Supported Identifiers|
| ------------- | -----|
| css | css, css.erb |
| basic | html, htm, shtml, xhtml, inc, tmpl, tpl |
| ini | ini, conf |
| java | java, bsh |
| lua | lua |
| makefile | Makefile, makefile, GNUmakefile, OCamlMakefile |
| perl | perl, pl, pm, pod, t, PL, psgi, vcl |
| r | R, r, s, S, Rprofile |
| ruby | ruby, rb, rbx, rjs, Rakefile, rake, cgi, fcgi, gemspec, irbrc, Capfile, ru, prawn, Cheffile, Gemfile, Guardfile, Hobofile, Vagrantfile, Appraisals, Rantfile, Berksfile, Berksfile.lock, Thorfile, Puppetfile |
| php | php, php3, php4, php5, phpt, phtml, aw, ctp |
| sql | sql, ddl, dml |
| vs_net | vb |
| xml | xml, xsd, tld, jsp, pt, cpt, dtml, rss, opml |
| xsl | xsl, xslt |
| yaml | yaml, yml |
| dosbatch | bat, batch |
| clojure | clj, cljs, clojure |
| coffee | coffee, Cakefile, coffee.erb |
| c | c, h |
| cpp | cpp, c\+\+, cxx |
| diff | patch, diff, rej |
| dockerfile | dockerfile, Dockerfile |
| git_commit | COMMIT_EDITMSG, MERGE_MSG |
| git_rebase | git-rebase-todo |
| go | go, golang |
| groovy | groovy, gvy |
| jade | jade, pug |
| js | js, jsx, javascript, es6, mjs |
| js_regexp | regexp |
| json | json, sublime-settings, sublime-menu, sublime-keymap, sublime-mousemap, sublime-theme, sublime-build, sublime-project, sublime-completions |
| less | less |
| objc | objectivec, objective-c, mm, objc, obj-c, m, h |
| scss | scss |
| perl6 | perl6, p6, pl6, pm6, nqp |
| powershell | powershell, ps1, psm1, psd1 |
| python | python, py, py3, rpy, pyw, cpy, SConstruct, Sconstruct, sconstruct, SConscript, gyp, gypi |
| regexp_python | re |
| rust | rust, rs |
| scala | scala, sbt |
| shell | shell, sh, bash, zsh, bashrc, bash_profile, bash_login, profile, bash_logout, .textmate_init |
| ts | typescript, ts |
| tsx | tsx |
| csharp | cs, csharp, c# |
| fsharp | fs, fsharp, f# |
| dart | dart |
| glsl | glsl |


## Advanced language support
For IntelliSense and more advanced embedded language support, checkout these extensions:

* [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) — Html template intellisense
* [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components) — CSS template Intellisense


# Contributing

To built this extension, you'll need [Git](https://git-scm.com/downloads) and [Node.js](https://nodejs.org/).

First, [fork](https://help.github.com/articles/fork-a-repo/) this repo and clone your fork:

```bash
git clone https://github.com/YOUR_GITHUB_ACCOUNT_NAME/vscode-comment-tagged-templates.git
cd vscode-comment-tagged-templates
```

Then install dev dependencies:

```bash
npm install
```

The main grammar is generated using the script in `build/build.js`. To run it:

```bash
npm run build
```

The supported languages are defined in `build/languages.js`


