use anyhow::Result;
use chrono::Local;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;

use crate::image::ImageMeta;

#[derive(Debug, Serialize, Deserialize)]
pub struct FrontMatter {
    pub title: String,
    pub date: String,
    #[serde(rename = "extra")]
    pub extra_content: ExtraContent,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ExtraContent {
    pub images: Vec<ImageMeta>,
}

pub fn update_markdown_file(
    album_name: &str,
    content_base: &Path,
    new_images: Vec<ImageMeta>,
) -> Result<()> {
    let md_path = content_base.join(format!("{}.md", album_name));

    let front_matter = if md_path.exists() {
        let mut content = String::new();
        File::open(&md_path)?.read_to_string(&mut content)?;

        let front_matter_content = content
            .split("+++")
            .nth(1)
            .ok_or_else(|| anyhow::anyhow!("Invalid markdown format"))?;

        let mut front_matter: FrontMatter = toml::from_str(front_matter_content)?;
        front_matter.extra_content.images.extend(new_images);
        front_matter
    } else {
        FrontMatter {
            title: album_name.replace('-', " ").to_string(),
            date: Local::now().format("%Y-%m-%d").to_string(),
            extra_content: ExtraContent { images: new_images },
        }
    };

    let mut file = File::create(&md_path)?;
    writeln!(file, "+++")?;
    let toml_string = toml::to_string_pretty(&front_matter)?;
    write!(file, "{}", toml_string)?;
    writeln!(file, "+++")?;
    writeln!(file)?;
    writeln!(file, "Photos from {}.", album_name.replace('-', " "))?;

    Ok(())
}
