mkdir -p DEXON_BBS_Cache/gh-pages/
cp dist/cache.html DEXON_BBS_Cache/gh-pages/cache.html
npm run cache
cp -R DEXON_BBS_Cache/dist/s dist/
