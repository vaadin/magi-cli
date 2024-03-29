const fixme = `
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
;`

const tsDefs = `"devDependencies": {
    "@web-padawan/gen-typescript-declarations": "^1.6.2",
    "web-component-tester": "6.9.2",`;

 module.exports = {
  files: [
    "package.json",
    "theme/**/*-styles.js"
  ],
  from: [
    '"devDependencies": {',
    "const $_documentContainer = document.createElement('template');",
    "$_documentContainer.innerHTML = `",
    fixme
  ],
  to: [
    tsDefs,
    "import { html } from '@polymer/polymer/lib/utils/html-tag.js';",
    "const $_documentContainer = html`",
    ""
  ]
}
