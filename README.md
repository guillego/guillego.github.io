# guillego.com
My personal website built with [Zola](https://www.getzola.org/), using a customized version of the [Archie-Zola theme](https://github.com/XXXMrG/archie-zola) that I called Archioki for now since it also borrow's heavily from [Steph Ango's flexoki](https://stephango.com/flexoki) theme. Deployed to GitHub Pages.

Visit at: [https://guillego.com](https://guillego.com)

## Development Setup

### Prerequisites
- [Nix](https://nixos.org/) for development environment
(These below should be set up by nix)

- [Just](https://github.com/casey/just) for command running
- [Zola](https://www.getzola.org/) for static site generation
- [Rust](https://www.rust-lang.org/) for photo processing

### Local Development
1. Enter the development environment
```bash
nix develop
```
2. Start the zola development server
```bash
zola serve
```
The site will be available at `http://127.0.0.1:1111`

## Adding Content
### Blog Posts
1. Create a new markdown file in `content/posts/`
2. Add frontmatter with title, date, and tags
3. Write post content

### Photo Albums
1. Create a new directory in `src_photos/` with the album name (like `summer-2024`)
2. Add your high-resolution photos to this directory
3. Process the album using just commands:
```bash
just process-album album-name # Process a single album
```

```bash
just album # Process all albums
```

### Thoughts (Microblogging)
The site includes a microblogging feature called "Thoughts" that follows the POSSE (Publish on your Own Site, Syndicate Elsewhere) principle.

#### Creating New Thoughts
The easiest way to create thoughts is using the provided just recipe:
```bash
# Basic usage - opens your default editor to compose your thought
just thought

# With tags - add comma-separated tags
just thought -t "tag1,tag2,thoughts"

# Direct posting without opening editor
just thought -m "This is my quick thought about something interesting!"

# Auto-commit after creating the thought (uses jj for version control)
just thought -m "Auto-commit this thought" -y

# Show help for all options
just thought -h
```

You can also create thoughts manually:
1. Create a file in `content/thoughts/` with a name like `YYYY-MM-DD-some-description.md`
2. Add the following frontmatter:
```
+++
date = YYYY-MM-DDThh:mm:ss+00:00
[taxonomies]
tags = ["tag1", "tag2"]
+++

Your thought content here.
```

#### Advanced Thought Features

##### Language Tags
To specify the language of your thought for Bluesky syndication, add a `language` field to your frontmatter:

```
+++
date = YYYY-MM-DDThh:mm:ss+00:00
[taxonomies]
tags = ["tag1", "tag2"]
+++
language = "en-US"  # Single language

# Or multiple languages
language = ["en-US", "es"]

Your multilingual thought here.
```

##### Images
You can attach images to your thoughts which will be syndicated to Bluesky (up to 4 images per thought):

```
+++
date = YYYY-MM-DDThh:mm:ss+00:00
[taxonomies]
tags = ["tag1", "tag2"]
+++
# Simple way - just paths to images
images = ["static/img/photo1.jpg", "static/img/photo2.png"]

# With alt text for accessibility
images = [
  { path = "static/img/photo1.jpg", alt = "Description of first image" },
  { path = "static/img/photo2.png", alt = "Description of second image" }
]

Your thought with images here.
```

#### Syndication
When you push changes to the `main` branch, new or modified thoughts are automatically posted to:
- Bluesky (via GitHub Actions using Python)

Each syndicated post includes:
- Your thought text (truncated to fit Bluesky's limits if necessary)
- Any attached images (up to 4)
- Language tags
- A permalink back to your original post on your website

Thoughts are also included in the site's Atom feed at `/thoughts/atom.xml`.

## Deployment
The site is automatically deployed to GitHub Pages when changes are pushed to the main branch.


## Photo Processor

The `photo-processor` tool is a Rust application that:
- Resizes images to a maximum width while maintaining aspect ratio
- Optimizes JPEG quality for web
- Generates markdown files with image metadata


## License

### Code License
All code in this repository (including the photo processor, theme modifications, and build scripts) is licensed under the Apache License, Version 2.0. You can find a copy of the license in the [LICENSE](LICENSE) file or at http://www.apache.org/licenses/LICENSE-2.0

You are free to:
- Use, copy, and modify the code
- Distribute the code
- Submit contributions
- Use the code commercially

### Content License
© 2010-2024 Guillermo Galán Olleros. 
Content is licensed under [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).

Content refers to all files in  `content/` directory and all images (including those in `static/img/`

You are welcome to:
- Quote or cite blog posts with attribution
- Use photos for personal, non-commercial purposes with attribution
- Share and link to content
- Take inspiration from the site

I'd love to hear from you if you find something useful or inspiring! Feel free to:
- Reach out and tell me how you're using the content
- Share what resonated with you
- Ask questions about any of the content

For commercial use or other permissions, please contact me directly.

mail [at] guillego.com

Attribution example:
> Photo by [Guillermo Galán](https://guillego.com) / [Blog post](https://guillego.com/posts/example) by Guillermo Galán
