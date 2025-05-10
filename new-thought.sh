#!/bin/bash

# Function to create a slug from text
create_slug() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//' | cut -c 1-50
}

# Parse command line options
TAGS=""
MESSAGE=""
AUTO_COMMIT=false
LANGUAGE=""
IMAGES=()
ALT_TEXTS=()

function show_help {
  echo "Usage: $0 [options]"
  echo "  -t TAGS      Comma-separated list of tags"
  echo "  -m MESSAGE   Direct message content (skip editor)"
  echo "  -y           Auto-commit without asking"
  echo "  -l LANG      Language code (e.g. 'en-US' or comma-separated list like 'en-US,es')"
  echo "  -i IMAGE     Path to an image to attach (can be used multiple times)"
  echo "  -a ALT       Alt text for the most recently specified image"
  echo "  -h           Show this help"
  exit 0
}

# Process options
while [[ $# -gt 0 ]]; do
  key="$1"
  case "$key" in
    -t)
      TAGS="$2"
      shift 2
      ;;
    -m)
      shift
      MESSAGE="$1"
      shift
      ;;
    -y)
      AUTO_COMMIT=true
      shift
      ;;
    -l)
      LANGUAGE="$2"
      shift 2
      ;;
    -i)
      IMAGES+=("$2")
      ALT_TEXTS+=("")  # Add empty alt text by default
      shift 2
      ;;
    -a)
      # Replace the most recent alt text
      if [ ${#IMAGES[@]} -gt 0 ]; then
        ALT_TEXTS[${#ALT_TEXTS[@]}-1]="$2"
      else
        echo "Warning: Alt text provided without a preceding image"
      fi
      shift 2
      ;;
    -h)
      show_help
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      ;;
  esac
done

# Format tags for frontmatter
TAGS_FORMATTED=""
if [ -n "$TAGS" ]; then
  IFS=',' read -ra TAG_ARRAY <<< "$TAGS"
  for tag in "${TAG_ARRAY[@]}"; do
    TAGS_FORMATTED="$TAGS_FORMATTED\"$(echo "$tag" | tr -d '[:space:]')\", "
  done
  # Remove trailing comma and space
  TAGS_FORMATTED=${TAGS_FORMATTED%, }
fi

# Format language for frontmatter
LANGUAGE_FORMATTED=""
if [ -n "$LANGUAGE" ]; then
  if [[ "$LANGUAGE" == *","* ]]; then
    # Multiple languages
    IFS=',' read -ra LANG_ARRAY <<< "$LANGUAGE"
    LANGUAGE_FORMATTED="["
    for lang in "${LANG_ARRAY[@]}"; do
      LANGUAGE_FORMATTED="$LANGUAGE_FORMATTED\"$(echo "$lang" | tr -d '[:space:]')\", "
    done
    # Remove trailing comma and space
    LANGUAGE_FORMATTED=${LANGUAGE_FORMATTED%, }
    LANGUAGE_FORMATTED="$LANGUAGE_FORMATTED]"
  else
    # Single language
    LANGUAGE_FORMATTED="\"$LANGUAGE\""
  fi
fi

# Format images for frontmatter
IMAGES_FORMATTED=""
if [ ${#IMAGES[@]} -gt 0 ]; then
  # Check if any alt text is provided
  HAS_ALT=false
  for alt in "${ALT_TEXTS[@]}"; do
    if [ -n "$alt" ]; then
      HAS_ALT=true
      break
    fi
  done

  if [ "$HAS_ALT" = true ]; then
    # Complex format with alt text
    IMAGES_FORMATTED="[\n"
    for i in "${!IMAGES[@]}"; do
      IMAGES_FORMATTED="$IMAGES_FORMATTED  { path = \"${IMAGES[$i]}\", alt = \"${ALT_TEXTS[$i]}\" },\n"
    done
    # Remove trailing comma and newline
    IMAGES_FORMATTED=${IMAGES_FORMATTED%,\\n}
    IMAGES_FORMATTED="$IMAGES_FORMATTED\n]"
  else
    # Simple format without alt text
    IMAGES_FORMATTED="["
    for img in "${IMAGES[@]}"; do
      IMAGES_FORMATTED="$IMAGES_FORMATTED\"$img\", "
    done
    # Remove trailing comma and space
    IMAGES_FORMATTED=${IMAGES_FORMATTED%, }
    IMAGES_FORMATTED="$IMAGES_FORMATTED]"
  fi
fi

# Get content either from message or editor
CONTENT=""
if [ -z "$MESSAGE" ]; then
  # No direct message provided, use editor
  # Check if text editor is available
  if [ -z "$EDITOR" ]; then
    EDITOR="nano"
  fi

  # Create temporary file for content
  TEMP_FILE=$(mktemp)
  echo "Write your thought below (save and exit when done):" > $TEMP_FILE
  echo "" >> $TEMP_FILE

  # Open editor for user to write content
  $EDITOR "$TEMP_FILE"

  # Get the content (excluding the first line which is the prompt)
  CONTENT=$(tail -n +3 "$TEMP_FILE")
  
  # Clean up temporary file
  rm "$TEMP_FILE"
else
  # Use the message provided via command line
  CONTENT="$MESSAGE"
fi

# Check if content is not empty
if [ -z "$(echo "$CONTENT" | tr -d '[:space:]')" ]; then
  echo "Thought is empty. Aborting."
  exit 1
fi

# Create timestamp in ISO format
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S+00:00")
DATE_SLUG=$(date +"%Y-%m-%d")

# Create slug from first few words
FIRST_LINE=$(echo "$CONTENT" | head -n 1)
FIRST_WORDS=$(echo "$FIRST_LINE" | awk '{print $1" "$2" "$3" "$4}')
SLUG=$(create_slug "$FIRST_WORDS")

# Create filename with date and slug
FILENAME="${DATE_SLUG}-${SLUG}.md"
TARGET_PATH="content/thoughts/$FILENAME"

# Create the frontmatter start
cat > "$TARGET_PATH" << EOF
+++
date = ${TIMESTAMP}
[taxonomies]
tags = [${TAGS_FORMATTED}]

[extra]
EOF

# Add language if provided
if [ -n "$LANGUAGE_FORMATTED" ]; then
  echo "language = ${LANGUAGE_FORMATTED}" >> "$TARGET_PATH"
fi

# Add images if provided
if [ -n "$IMAGES_FORMATTED" ]; then
  echo -e "images = ${IMAGES_FORMATTED}" >> "$TARGET_PATH"
fi

# Close the frontmatter
echo "+++" >> "$TARGET_PATH"

# Add blank line and content
echo "" >> "$TARGET_PATH"
echo "${CONTENT}" >> "$TARGET_PATH"

echo "Thought created at $TARGET_PATH"
echo "Preview:"
echo "-----------------------------------"
cat "$TARGET_PATH"
echo "-----------------------------------"

# Handle commit
if [ "$AUTO_COMMIT" = true ]; then
  jj commit -m "Add thought: $SLUG" "$TARGET_PATH"
  echo "Committed successfully."
else
  # Ask if user wants to commit
  read -p "Add and commit this thought? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]
  then
    jj commit -m "Add thought: $SLUG" "$TARGET_PATH"
    echo "Committed successfully."
  else
    echo "File created but not committed."
  fi
fi 