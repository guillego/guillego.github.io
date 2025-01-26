use clap::{Parser, Subcommand};
use std::path::PathBuf;

#[derive(Parser, Debug)]
pub struct Args {
    #[command(subcommand)]
    pub command: Commands,

    #[arg(short, long, default_value_t = 1200)]
    pub max_width: u32,

    #[arg(short, long, default_value_t = 85)]
    pub quality: u8,

    #[arg(long)]
    pub source_dir: PathBuf,

    #[arg(long)]
    pub target_dir: PathBuf,

    #[arg(long)]
    pub content_dir: PathBuf,

    /// Base URL path for images in markdown files ("/img/photography")
    #[arg(long, default_value = "/img/photography")]
    pub url_base: String,
}

#[derive(Subcommand, Debug)]
pub enum Commands {
    Album { name: String },
    All,
}
