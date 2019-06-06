#!/bin/bash

echo dett.cc > build/CNAME
cp -r .circleci build
cp src/assets/favicon.ico build

mkdir -p build/assets/
cp src/assets/meta.png build/assets
