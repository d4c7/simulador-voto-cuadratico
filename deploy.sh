#!/bin/bash
set -e
#require npm i html-minifier -g
#require  npm install uglify-js -g

html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true  index.html -o dist/index.html
uglifyjs --compress  -- index.js  > dist/index.js

