# Default settings
max_width := "1200"
quality := "85"
url_base := "/img/photography"

# Directory paths
photo_dir := "src_photos"
content_dir := "content/photography"
static_dir := "static/img/photography"
processor_dir := "photo-processor"

# List all available recipes
default:
    @just --list

# Create required directories
create-dirs:
    mkdir -p {{photo_dir}}
    mkdir -p {{content_dir}}
    mkdir -p {{static_dir}}

# Process all albums
album: create-dirs
    cd {{processor_dir}} && cargo run --quiet -- \
        --source-dir ../{{photo_dir}} \
        --target-dir ../{{static_dir}} \
        --content-dir ../{{content_dir}} \
        --url-base {{url_base}} \
        --max-width {{max_width}} \
        --quality {{quality}} \
        all