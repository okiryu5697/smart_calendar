#!/bin/bash

# Navigate to the /public/pics folder first
# cd path/to/public/pics

# List all .jpg and .png files and format as JSON array
files=$(ls *.jpg *.png *.HIEC *.hiec 2>/dev/null | sed 's|^|"/pics/|' | sed 's|$|"|')

# Join with commas
json="["
json+=$(echo "$files" | paste -sd "," -)
json+="]"

# Save to /public/photos.json
echo "$json" > ../photos.json

echo "photos.json generated!"
