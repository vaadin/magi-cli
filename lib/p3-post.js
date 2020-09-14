const fixme = `
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
;`

const tsDefs = `"scripts": {
  "generate-typings": "gen-typescript-declarations --outDir . --verify"
},
"devDependencies": {
  "@web-padawan/gen-typescript-declarations": "^1.6.2",`;

const resolutions = `"resolutions": {
    "es-abstract": "1.17.6",
    "@types/doctrine": "0.0.3",`;

 module.exports = {
  files: [
    "package.json",
    "theme/**/*-styles.js"
  ],
  from: [
    '"devDependencies": {',
    '"resolutions": {',
    "const $_documentContainer = document.createElement('template');",
    "$_documentContainer.innerHTML = `",
    fixme
  ],
  to: [
    tsDefs,
    resolutions,
    "import { html } from '@polymer/polymer/lib/utils/html-tag.js';",
    "const $_documentContainer = html`",
    ""
  ]
}
