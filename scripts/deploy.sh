#!/usr/bin/env bash

echo "********** deploy.sh - Inicio ejecución **********"
echo "... Borrando y recreando htdocs/site/ ..."
rm -rf C:/xampp/htdocs/site
mkdir C:/xampp/htdocs/site

echo "... Copiando contenido de dist/ a htdocs/site/ ..."
cp -r ./dist/* C:/xampp/htdocs/site

echo "********** deploy.sh - Fin ejecución **********"