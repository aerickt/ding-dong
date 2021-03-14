#!/bin/bash
ddhome="$HOME/ding-dong"

sed -n ***REMOVED***1 p***REMOVED*** "$ddhome/priv.txt" > index.js
cat "$ddhome/index-nokey.js" >> "$ddhome/index.js"
sed -n ***REMOVED***2 p***REMOVED*** "$ddhome/priv.txt" >> index.js

node "$ddhome/index.js"
