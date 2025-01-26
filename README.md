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
© 2010 Guillermo Galán Olleros. All rights reserved.

All content in the `content/` directory and all images (including those in `static/img/`) are copyrighted. However, I'm happy to share with attribution for personal use! This includes:
- Blog posts
- Photography
- Personal information
- Site copy and text

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