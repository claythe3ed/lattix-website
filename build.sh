#!/bin/bash
# LATTIX site builder – hooks loop
# Run from the LATTIX_Website directory

KG="knowledge_graph.json"

# Check if jq is installed (for JSON parsing)
if ! command -v jq &> /dev/null; then
    echo "jq is required. Install with: pkg install jq"
    exit 1
fi

# Loop through pending pages
jq -r '.pages | to_entries[] | select(.value.status=="pending") | [.key, .value.file, .value.template] | @tsv' "$KG" |
while IFS=$'\t' read -r key file template; do
    echo "Processing: $key -> $file (template: $template)"
    # Skip if file already exists (safety)
    if [ -f "$file" ]; then
        echo "  File already exists. Skipping."
        continue
    fi
    # Placeholder: call a generator (to be replaced with actual logic)
    echo "  Generating $file from knowledge_graph.json entry..."
    # Example: python3 generate_page.py --key "$key" --template "$template" --output "$file"
    # For now we just create a minimal stub
    mkdir -p "$(dirname "$file")"
    cat > "$file" << HEREDOC
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <title>LATTIX | $(jq -r ".pages.\"$key\".title" "$KG")</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <p>Placeholder for $key – content coming soon.</p>
</body>
</html>
HEREDOC
    echo "  Done."
done

echo "Build complete."
