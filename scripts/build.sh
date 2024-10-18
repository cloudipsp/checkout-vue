#!/bin/bash

npm run submodule && echo "$(ls saas-config/)" && ./node_modules/gulp/bin/gulp.js $@ && vue-cli-service build --no-module $@
