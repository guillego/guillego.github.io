mod cli;
mod image;
mod markdown;

use anyhow::Result;
use std::{fs, path::Path};

use clap::Parser;
use cli::{Args, Commands};

use image::process_images;
use markdown::update_markdown_file;

fn main() -> Result<()> {
    let args = Args::parse();

    match &args.command {
        Commands::Album { name } => {
            process_album(
                name,
                &args.source_dir,
                &args.target_dir,
                &args.content_dir,
                &args.url_base,
                args.max_width,
                args.quality,
            )?;
        }
        Commands::All => {
            for entry in fs::read_dir(&args.source_dir)? {
                let entry = entry?;
                if entry.file_type()?.is_dir() {
                    if let Some(album_name) = entry.file_name().to_str() {
                        println!("Processing album: {}", album_name);
                        process_album(
                            album_name,
                            &args.source_dir,
                            &args.target_dir,
                            &args.content_dir,
                            &args.url_base,
                            args.max_width,
                            args.quality,
                        )?;
                    }
                }
            }
        }
    }

    Ok(())
}

fn process_album(
    album_name: &str,
    source_base: &Path,
    target_base: &Path,
    content_base: &Path,
    url_base: &str,
    max_width: u32,
    quality: u8,
) -> Result<()> {
    let source_dir = source_base.join(album_name);
    let target_dir = target_base.join(album_name);
    fs::create_dir_all(&target_dir)?;

    let new_images = process_images(
        &source_dir,
        &target_dir,
        album_name,
        url_base,
        max_width,
        quality,
    )?;
    update_markdown_file(album_name, content_base, new_images)?;

    Ok(())
}
