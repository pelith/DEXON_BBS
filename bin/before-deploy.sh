#!/bin/bash

echo dett.cc > build/CNAME
cp -r .circleci build
cp src/assets/favicon.ico build
cp src/assets/robots.txt build

mkdir -p build/assets/
cp src/assets/meta.png build/assets
