#!/bin/bash

# Loop through all YAML files in the current directory
for file in *.yaml; do
  if [ -f "$file" ]; then
    echo "Deleting resources defined in $file..."
    kubectl delete -f "$file"
  else
    echo "No YAML files found in the current directory."
  fi
done

echo "Deletion complete."
