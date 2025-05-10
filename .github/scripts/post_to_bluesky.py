# /// script
# dependencies = [
#   "requests",
#   "python-frontmatter",
#   "toml",
#   "validators",
# ]
# ///

import os
import sys
import time
import datetime
import re
from dataclasses import dataclass, field
from typing import Optional, Dict, List, Any, TypedDict, Protocol, Union, Callable, Iterator, TypeVar, cast
from functools import partial
import requests
import frontmatter
import validators

# Constants
MAX_POST_LENGTH = 300  # Maximum character length for Bluesky posts
POST_SPACING = 5  # Characters reserved for spacing and ellipsis
MAX_IMAGES_PER_POST = 4  # Maximum images allowed by Bluesky
MAX_IMAGE_SIZE_BYTES = 1_000_000  # 1MB maximum image size
REQUEST_DELAY_SECONDS = 1  # Delay between API requests to avoid rate limiting
BSKY_API_ENDPOINT = "https://bsky.social/xrpc"
BSKY_POST_RECORD_TYPE = "app.bsky.feed.post"
BSKY_IMAGE_EMBED_TYPE = "app.bsky.embed.images"

# Simple word boundary regex for splitting text into potential URLs and words
WORD_SPLIT_PATTERN = r'\S+'

# Type variables for generics
T = TypeVar('T')
R = TypeVar('R')

# Type definitions for better structure
class ImageMetadata(TypedDict):
    path: str
    alt: str

class BskyImageData(TypedDict):
    alt: str
    image: Dict[str, Any]  # Blob reference from upload

class BskyEmbed(TypedDict):
    "$type"
    images: List[BskyImageData]

class BskyFacetFeature(TypedDict):
    "$type"
    uri: str

class BskyFacet(TypedDict):
    index: Dict[str, int]
    features: List[Dict[str, Any]]

class BskyPostRecord(TypedDict):
    "$type"
    text: str
    createdAt: str
    langs: Optional[List[str]]
    embed: Optional[BskyEmbed]
    facets: Optional[List[BskyFacet]]

class BlobUploader(Protocol):
    def upload_blob(self, img_bytes: bytes, mime_type: str) -> Optional[Dict[str, Any]]:
        ...

@dataclass
class BlueskyConfig:
    service_url: str = BSKY_API_ENDPOINT
    identifier: str = ""
    password: str = ""
    base_url: str = ""
    
    @classmethod
    def from_env(cls) -> 'BlueskyConfig':
        """
        Required variables:
        - BLUESKY_IDENTIFIER: Your Bluesky handle
        - BLUESKY_PASSWORD: Your Bluesky password or app password
        - BASE_URL: Base URL for permalinks
        """
        required_vars = ["BLUESKY_IDENTIFIER", "BLUESKY_PASSWORD", "BASE_URL"]
        missing = [var for var in required_vars if var not in os.environ]
        
        if missing:
            raise KeyError(f"Missing required environment variables: {', '.join(missing)}")
            
        return cls(
            identifier=os.environ["BLUESKY_IDENTIFIER"],
            password=os.environ["BLUESKY_PASSWORD"],
            base_url=os.environ["BASE_URL"]
        )

@dataclass
class BlueskySession:
    config: BlueskyConfig
    access_token: str
    did: str  # Decentralized identifier
    
    @classmethod
    def create(cls, config: BlueskyConfig) -> 'BlueskySession':
        print(f"Authenticating as {config.identifier}")
        resp = requests.post(
            f"{config.service_url}/com.atproto.server.createSession",
            json={"identifier": config.identifier, "password": config.password}
        )
        resp.raise_for_status()
        session_data = resp.json()
        return cls(
            config=config,
            access_token=session_data["accessJwt"],
            did=session_data["did"]
        )

@dataclass
class PostContent:
    text: str
    permalink: str
    language: Optional[Union[str, List[str]]] = None
    images: List[ImageMetadata] = field(default_factory=list)
    
    def to_post_text(self, max_chars: int = MAX_POST_LENGTH) -> str:
        # Reserve space for permalink and spacing
        max_length = max_chars - len(self.permalink) - POST_SPACING
        truncated = (
            self.text[:max_length] + "..." 
            if len(self.text) > max_length 
            else self.text
        )
        return f"{truncated}\n\n{self.permalink}"
    
    def to_bsky_record(self, uploaded_images: List[BskyImageData]) -> BskyPostRecord:
        now = datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")
        
        post_text = self.to_post_text()
        
        record: BskyPostRecord = {
            "$type": BSKY_POST_RECORD_TYPE,
            "text": post_text,
            "createdAt": now,
        }
        
        # Create facets for URLs in the post
        facets = create_link_facets(post_text)
        if facets:
            record["facets"] = facets
        
        # Add language if available
        if self.language:
            langs = [self.language] if isinstance(self.language, str) else self.language
            record["langs"] = langs
        
        # Add images if available
        if uploaded_images:
            record["embed"] = {
                "$type": BSKY_IMAGE_EMBED_TYPE,
                "images": uploaded_images
            }
            
        return record

def create_link_facets(text: str) -> List[BskyFacet]:
    """Find all URLs in the text and create facets for them using validators library"""
    facets = []
    
    # Find potential URLs by splitting on word boundaries
    for match in re.finditer(WORD_SPLIT_PATTERN, text):
        start, end = match.span()
        potential_url = match.group(0)
        
        # Check if this is a valid URL using the validators library
        if validators.url(potential_url):
            facet: BskyFacet = {
                "index": {
                    "byteStart": start,
                    "byteEnd": end
                },
                "features": [
                    {
                        "$type": "app.bsky.richtext.facet#link",
                        "uri": potential_url
                    }
                ]
            }
            facets.append(facet)
    
    return facets

def extract_post_content(file_path: str, base_url: str) -> PostContent:
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
        
    # Parse the markdown file
    post = frontmatter.load(file_path)
    text_content = post.content.strip()
    
    if not text_content:
        raise ValueError(f"No content found in {file_path}")
    
    # Extract metadata
    meta = post.metadata
    if not meta:
        raise ValueError(f"No frontmatter metadata found in {file_path}")
    
    # Clean base URL to ensure it doesn't end with a slash
    clean_base_url = base_url.rstrip('/')
    
    # Use custom path from frontmatter if available, otherwise derive from file path
    if "path" in meta and meta["path"]:
        # Remove leading slash from path if present
        path = meta["path"]
        path = path.lstrip('/')
        permalink = f"{clean_base_url}/{path}"
    else:
        raise ValueError("No path found in frontmatter")
        
    taxonomies = meta.get("taxonomies", {})
    extra = meta.get("extra", {})
    
    # Get language from either direct property, extra, or taxonomies
    language = meta.get("language") or extra.get("language") or taxonomies.get("language")
    
    # Get images from either direct property, extra, or taxonomies
    raw_images = meta.get("images") or extra.get("images") or taxonomies.get("images") or []
    images = parse_images(raw_images)
    
    return PostContent(
        text=text_content,
        permalink=permalink,
        language=language,
        images=images
    )

def parse_images(images_data: List[Any]) -> List[ImageMetadata]:
    """
    Parse image data from frontmatter.
    Expected format is either:
    1. List of dicts with 'path' key and optional 'alt' key
    2. List of strings representing paths
    """
    if not images_data:
        return []
        
    result: List[ImageMetadata] = []
    
    for idx, img_item in enumerate(images_data):
        if isinstance(img_item, dict):
            # Must have a 'path' key
            if "path" not in img_item:
                raise ValueError(f"Image at index {idx} missing required 'path' field: {img_item}")
                
            path = img_item["path"]
            if not path or not isinstance(path, str):
                raise ValueError(f"Image at index {idx} has invalid path: {path}")
                
            # Alt text is optional but must be a string if present
            alt = img_item.get("alt", "")
            if not isinstance(alt, str):
                raise ValueError(f"Image at index {idx} has invalid alt text type: {type(alt)}")
                
            result.append({"path": path, "alt": alt})
                
        elif isinstance(img_item, str):
            if not img_item:
                raise ValueError(f"Empty image path at index {idx}")
                
            result.append({"path": img_item, "alt": ""})
        else:
            raise ValueError(f"Invalid image format at index {idx}: expected dict or string, got {type(img_item)}")
    
    return result

def read_image_file(img_path: str) -> Optional[tuple[bytes, str]]:
    # Resolve full path
    if not img_path.startswith("/"):
        full_path = f"{os.getcwd()}/{img_path}"
    else:
        full_path = img_path
        
    if not os.path.exists(full_path):
        raise FileNotFoundError(f"Image file not found: {full_path}")
    
    mime_type = get_mime_type(full_path)
    
    try:
        with open(full_path, "rb") as f:
            img_bytes = f.read()
        
        # Check size limit
        if len(img_bytes) > MAX_IMAGE_SIZE_BYTES:
            print(f"Image too large, skipping: {full_path} ({len(img_bytes)} bytes)")
            return None
            
        return img_bytes, mime_type
    except Exception as e:
        print(f"Error reading image {full_path}: {e}")
        raise

def process_image(image_data: ImageMetadata, upload_fn: Callable[[bytes, str], Optional[Dict[str, Any]]]) -> Optional[BskyImageData]:
    img_path = image_data["path"]
    alt_text = image_data.get("alt", "")
    
    try:
        read_result = read_image_file(img_path)
        if not read_result:
            return None
            
        img_bytes, mime_type = read_result
        
        blob = upload_fn(img_bytes, mime_type)
        if not blob:
            print(f"Failed to upload image: {img_path}")
            return None
            
        print(f"Successfully uploaded image: {img_path}")
        return {
            "alt": alt_text,
            "image": blob
        }
    except FileNotFoundError as e:
        # Re-raise file not found errors
        raise
    except Exception as e:
        print(f"Error processing image {img_path}: {e}")
        return None

def process_images(images: List[ImageMetadata], upload_fn: Callable[[bytes, str], Optional[Dict[str, Any]]]) -> List[BskyImageData]:
    # Process only up to the maximum allowed
    if len(images) > MAX_IMAGES_PER_POST:
        print(f"Note: Only using first {MAX_IMAGES_PER_POST} of {len(images)} images (Bluesky limit)")
        
    limited_images = images[:MAX_IMAGES_PER_POST]
    
    processor = partial(process_image, upload_fn=upload_fn)
    
    results = []
    for image in limited_images:
        try:
            result = processor(image)
            if result:
                results.append(result)
        except FileNotFoundError as e:
            print(f"Warning: {e}")
            
    return results

def get_mime_type(file_path: str) -> str:
    lower_path = file_path.lower()
    if lower_path.endswith(".png"):
        return "image/png"
    elif lower_path.endswith(".webp"):
        return "image/webp"
    elif lower_path.endswith(".gif"):
        return "image/gif"
    else:
        return "image/jpeg"  # Default for jpg/jpeg/other

def filter_md_files(files: List[str]) -> List[str]:
    result = []
    for file_path in files:
        if not file_path or not file_path.endswith(".md"):
            continue
            
        if not os.path.exists(file_path):
            print(f"Warning: File does not exist: {file_path}")
            continue
            
        result.append(file_path)
        
    return result

class BlueskyPoster:
    def __init__(self):
        self.config = BlueskyConfig.from_env()
        self.session: Optional[BlueskySession] = None
    
    def authenticate(self) -> None:
        self.session = BlueskySession.create(self.config)
    
    def upload_blob(self, img_bytes: bytes, mime_type: str) -> Optional[Dict[str, Any]]:
        if not self.session:
            raise ValueError("Not authenticated")
            
        try:
            resp = requests.post(
                f"{self.config.service_url}/com.atproto.repo.uploadBlob",
                headers={
                    "Content-Type": mime_type,
                    "Authorization": f"Bearer {self.session.access_token}"
                },
                data=img_bytes
            )
            resp.raise_for_status()
            return resp.json()["blob"]
        except Exception as e:
            print(f"Error uploading blob: {e}")
            return None
    
    def create_post(self, record: BskyPostRecord) -> bool:
        if not self.session:
            raise ValueError("Not authenticated")
            
        try:
            resp = requests.post(
                f"{self.config.service_url}/com.atproto.repo.createRecord",
                headers={"Authorization": f"Bearer {self.session.access_token}"},
                json={
                    "repo": self.session.did,
                    "collection": BSKY_POST_RECORD_TYPE,
                    "record": record
                }
            )
            resp.raise_for_status()
            # Add a small delay to avoid rate limiting
            time.sleep(REQUEST_DELAY_SECONDS)
            return True
        except Exception as e:
            print(f"Error creating post: {e}")
            print(f"Response: {resp.text if 'resp' in locals() else 'No response'}")
            return False
    
    def process_thought(self, file_path: str) -> bool:
        print(f"Processing {file_path}")
        
        if not self.session:
            raise ValueError("Not authenticated")
        
        try:
            post_content = extract_post_content(file_path, self.config.base_url)
            uploaded_images = process_images(post_content.images, self.upload_blob)
            post_record = post_content.to_bsky_record(uploaded_images)
            success = self.create_post(post_record)
            
            if success:
                print(f"Posted to Bluesky: {post_content.permalink}")
                return True
            else:
                print(f"Failed to post to Bluesky: {post_content.permalink}")
                return False
                
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            raise
        
    def process_files(self, files: List[str]) -> int:
        if not files:
            print("No files to process")
            return 0
        
        print(f"Files to process: {len(files)}")
        
        if not self.session:
            raise ValueError("Not authenticated")
        
        valid_files = filter_md_files(files)
        
        if not valid_files:
            print("No valid markdown files to process")
            return 0
            
        success_count = 0
        for file_path in valid_files:
            try:
                if self.process_thought(file_path):
                    success_count += 1
            except Exception as e:
                print(f"Error processing {file_path}: {e}")
                
        print(f"Successfully posted {success_count} of {len(valid_files)} files")
        return success_count

def main() -> int:
    # Get the changed files
    changed_files = os.environ.get("CHANGED_FILES", "").split()
    
    if not changed_files:
        print("No files to process. Set CHANGED_FILES environment variable.")
        return 0
    
    try:
        poster = BlueskyPoster()
        poster.authenticate()
        success_count = poster.process_files(changed_files)
        return 0 if success_count > 0 else 1
    except KeyError as e:
        print(f"Configuration error: {e}")
        return 1
    except requests.exceptions.HTTPError as e:
        print(f"API error: {e}")
        return 1
    except Exception as e:
        print(f"Unexpected error: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 