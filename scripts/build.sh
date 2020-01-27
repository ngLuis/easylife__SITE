#!/usr/bin/env bash

echo "********** build.sh - Inicio ejecución **********"
echo "... Borrando y recreando dist/ ..."
rm -rf ./dist/
mkdir ./dist/

echo "... Copiando contenido de src/ a dist/ ..."
cp -r ./src/* ./dist/

echo "... Compilando SCSS a CSS ..."
node-sass ./dist/assets/scss/main.scss > ./dist/assets/css/main.css
echo "********** build.sh - Fin ejecución **********"