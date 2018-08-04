#!/bin/bash

set -e

npm install jshint
npm install PrettyCSS
npm install js-beautify
npm install html-linter

PATH=${PATH}:node_modules/.bin/

jshint main.js
prettycss style.css
html-linter --config html-linter.json *.html
js-beautify \
    --type js \
    --indent-size 2 \
    --end-with-newline \
    --outfile main.js.beautified \
    main.js
diff -Naur main.js main.js.beautified
js-beautify \
    --type css \
    --indent-size 4 \
    --end-with-newline \
    --outfile style.css.beautified \
    style.css
diff -Naur style.css style.css.beautified
html-beautify \
    --type html \
    --indent-size 2 \
    --indent-inner-html \
    --end-with-newline \
    --outfile game.html.beautified \
    game.html
diff -Naur game.html game.html.beautified
