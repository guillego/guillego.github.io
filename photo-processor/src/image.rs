use anyhow::Result;
use image::codecs::jpeg::JpegEncoder;
use image::imageops::FilterType;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::path::Path;
use walkdir::{DirEntry, WalkDir};

#[derive(Debug)]
pub enum ImageType {
    Jpeg,
    Png,
}

impl ImageType {
    pub fn from_extension(ext: &str) -> Option<Self> {
        match ext.to_lowercase().as_str() {
            "jpg" | "jpeg" => Some(ImageType::Jpeg),
            "png" => Some(ImageType::Png),
            _ => None,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ImageMeta {
    pub src: String,
    pub alt: String,
    pub caption: String,
}

pub fn process_images(
    source_dir: &Path,
    target_dir: &Path,
    album_name: &str,
    url_base: &str,
    max_width: u32,
    quality: u8,
) -> Result<Vec<ImageMeta>> {
    WalkDir::new(source_dir)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| !is_hidden(e))
        .filter(|e| e.file_type().is_file())
        .filter_map(|entry| {
            let path = entry.path();
            let image_type = path
                .extension()
                .and_then(|ext| ext.to_str())
                .and_then(ImageType::from_extension)?;

            Some((path.to_owned(), image_type))
        })
        .filter_map(|(path, _image_type)| {
            let filename = path.file_name()?.to_str()?;
            let target_path = target_dir.join(filename);

            if target_path.exists() {
                return None;
            }

            Some(process_single_image(
                &path,
                &target_path,
                album_name,
                filename,
                url_base,
                max_width,
                quality,
            ))
        })
        .collect()
}

fn process_single_image(
    source_path: &Path,
    target_path: &Path,
    album_name: &str,
    filename: &str,
    url_base: &str,
    max_width: u32,
    quality: u8,
) -> Result<ImageMeta> {
    let img = image::open(source_path)
        .map_err(|e| anyhow::anyhow!("Failed to open image {}: {}", source_path.display(), e))?;

    let resized = if img.width() > max_width {
        img.resize(max_width, u32::MAX, FilterType::Lanczos3)
    } else {
        img
    };

    // Save with specified quality
    let output = std::io::BufWriter::new(File::create(target_path)?);
    let mut encoder = JpegEncoder::new_with_quality(output, quality);
    encoder.encode(
        resized.as_bytes(),
        resized.width(),
        resized.height(),
        resized.color().into(),
    )?;

    Ok(ImageMeta {
        src: format!("{}/{}/{}", url_base, album_name, filename),
        alt: filename.to_string(),
        caption: String::new(),
    })
}

fn is_hidden(entry: &DirEntry) -> bool {
    entry
        .file_name()
        .to_str()
        .map(|s| s.starts_with('.'))
        .unwrap_or(false)
}
