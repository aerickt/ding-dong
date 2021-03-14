#!/bin/bash
ddhome="$HOME/ding-dong"
path="var ddhome = ***REMOVED***$ddhome***REMOVED***;"

echo "$path" > "$ddhome/index.js"
cat "$ddhome/index-nokey.js" >> "$ddhome/index.js"
cat "$ddhome/priv.txt" >> "$ddhome/index.js"

node "$ddhome/index.js"
