#!/usr/bin/env bash

rm -rf ./dist/
mkdir ./dist/
cp -r ./src/* ./dist/

node-sass ./dist/assets/scss/main.scss > ./dist/assets/css/main.css