#!/bin/bash

rm -rf dist
yarn nx run-many --target=build --projects=main,forum --prod --parallel
ts-node --dir tools scripts/local-build.ts
rm -rf ../dist
mkdir -p ../dist
mv dist ../
node ../dist/apps/main/main.js
