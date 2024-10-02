#!/bin/bash

# Define your file-collection mapping
declare -A files
files["capital.units.json"]="units"
files["capital.english_translations.json"]="english_translations"
files["capital.arabic_translations.json"]="arabic_translations"

# Loop through the files and import them
for file in "${!files[@]}"; do
    collection=${files[$file]}
    mongoimport --uri "mongodb://localhost:27017/capital_hills" --collection "$collection" --file "$file" --jsonArray
done
