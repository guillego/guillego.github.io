# /// script
# dependencies = [
#   "requests",
#   "python-frontmatter",
# ]
# ///

import os
import sys
import time
import datetime
import requests
import frontmatter
from typing import Optional, Dict, List, Any

class BlueskyPoster:
    def __init__(self):
        self.service_url = "https://bsky.social/xrpc"
        self.identifier = os.environ["BLUESKY_IDENTIFIER"]
        self.password = os.environ["BLUESKY_PASSWORD"]
        self.base_url = os.environ["BASE_URL"]
        self.access_token = None
        self.did = None

    def authenticate(self) -> None:
        """Create a session with Bluesky"""
        resp = requests.post(
            f"{self.service_url}/com.atproto.server.createSession",
            json={"identifier": self.identifier, "password": self.password}
        )
        resp.raise_for_status()
        session = resp.json()
        self.access_token = session["accessJwt"]
        self.did = session["did"]
        print(f"Authenticated as {self.identifier}")

    def process_thought(self, file_path: str) -> None:
        """Process a thought file and post to Bluesky"""
        print(f"Processing {file_path}")
        
        # Extract permalink from file path
        permalink_path = file_path.replace("content", "").replace(".md", "")
        permalink = f"{self.base_url}{permalink_path}"
        
        # Read and parse the markdown file
        post = frontmatter.load(file_path)
        
        # Extract text content
        text_content = post.content.strip()
        
        # Limit to 300 characters and add permalink
        max_length = 300 - len(permalink) - 5  # 5 for spaces and ellipsis
        truncated_content = (
            text_content[:max_length] + "..." 
            if len(text_content) > max_length 
            else text_content
        )
        
        post_text = f"{truncated_content}\n\n{permalink}"
        
        # Prepare the post record
        now = datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")
        post_record = {
            "$type": "app.bsky.feed.post",
            "text": post_text,
            "createdAt": now,
        }
        
        # Add language tags if present in frontmatter
        if "language" in post.metadata:
            langs = post.metadata["language"]
            if isinstance(langs, str):
                langs = [langs]
            post_record["langs"] = langs
            print(f"Added language tags: {langs}")
            
        # Check for images in frontmatter
        if "images" in post.metadata and post.metadata["images"]:
            images = self._process_images(post.metadata["images"])
            if images:
                post_record["embed"] = {
                    "$type": "app.bsky.embed.images",
                    "images": images
                }
                print(f"Added {len(images)} images to the post")
        
        # Create the post
        self._create_post(post_record)
        print(f"Posted to Bluesky: {permalink}")

    def _process_images(self, image_paths: List[str]) -> List[Dict[str, Any]]:
        """Process images and upload them as blobs"""
        images = []
        for img_path in image_paths[:4]:  # Maximum of 4 images allowed
            # Determine full path to image (relative to repo root)
            alt_text = ""
            
            # If the image path is a dict with path and alt_text
            if isinstance(img_path, dict):
                alt_text = img_path.get("alt", "")
                img_path = img_path.get("path", "")
                
            if not img_path:
                continue
                
            # Handle both relative and absolute paths
            if not img_path.startswith("/"):
                img_path = f"{os.getcwd()}/{img_path}"
                
            # Determine mimetype based on file extension
            mime_type = "image/jpeg"  # Default
            if img_path.lower().endswith(".png"):
                mime_type = "image/png"
            elif img_path.lower().endswith(".webp"):
                mime_type = "image/webp"
            elif img_path.lower().endswith(".gif"):
                mime_type = "image/gif"
                
            try:
                # Read the image file
                with open(img_path, "rb") as f:
                    img_bytes = f.read()
                    
                # Check size limit (1MB)
                if len(img_bytes) > 1000000:
                    print(f"Image too large, skipping: {img_path} ({len(img_bytes)} bytes)")
                    continue
                    
                # Upload image as blob
                blob = self._upload_blob(img_bytes, mime_type)
                if blob:
                    images.append({
                        "alt": alt_text,
                        "image": blob
                    })
            except Exception as e:
                print(f"Error processing image {img_path}: {e}")
                
        return images

    def _upload_blob(self, img_bytes: bytes, mime_type: str) -> Optional[Dict[str, Any]]:
        """Upload an image as a blob"""
        try:
            resp = requests.post(
                f"{self.service_url}/com.atproto.repo.uploadBlob",
                headers={
                    "Content-Type": mime_type,
                    "Authorization": f"Bearer {self.access_token}"
                },
                data=img_bytes
            )
            resp.raise_for_status()
            return resp.json()["blob"]
        except Exception as e:
            print(f"Error uploading blob: {e}")
            return None

    def _create_post(self, record: Dict[str, Any]) -> None:
        """Create a post on Bluesky"""
        try:
            resp = requests.post(
                f"{self.service_url}/com.atproto.repo.createRecord",
                headers={"Authorization": f"Bearer {self.access_token}"},
                json={
                    "repo": self.did,
                    "collection": "app.bsky.feed.post",
                    "record": record
                }
            )
            resp.raise_for_status()
            # Add a small delay between posts to avoid rate limiting
            time.sleep(1)
        except Exception as e:
            print(f"Error creating post: {e}")
            print(f"Response: {resp.text if 'resp' in locals() else 'No response'}")
            sys.exit(1)

def main():
    # Get the changed files
    changed_files = os.environ.get("CHANGED_FILES", "").split()
    if not changed_files:
        print("No thought files to process")
        return
        
    # Initialize the BlueskyPoster
    poster = BlueskyPoster()
    poster.authenticate()
    
    # Process each file
    for file in changed_files:
        if file and file.endswith(".md"):
            poster.process_thought(file)

if __name__ == "__main__":
    main() 