#!/bin/bash
ddhome="$HOME/ding-dong"
path="var ddhome = $ddhome;"

echo "$path" > "$ddhome/index.js"
cat "$ddhome/index-nokey.js" >> "$ddhome/index.js"
cat "$ddhome/priv.txt" >> "$ddhome/index.js"

node "$ddhome/index.js"
