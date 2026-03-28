# Sanity CMS Content Management

This document describes how to manage content in the Harry Zhao Portfolio using the Sanity CMS API.

## Overview

The portfolio uses [Sanity CMS](https://sanity.io) to store and manage work/project content. Content can be managed via:
1. **Sanity Studio** (web UI) at `http://localhost:3333` when running `npm run dev` in `/studio`
2. **CLI Script** at `scripts/sanity-cms.mjs` for programmatic access

## Configuration

### Environment Variables

Required in `.env` file:
```
SANITY_PROJECT_ID=o89ybnd0
SANITY_DATASET=production
SANITY_WRITE_TOKEN=<your-write-token>
```

### Running Commands

All commands use this format:
```bash
node --env-file=.env scripts/sanity-cms.mjs <command> [arguments]
```

---

## Data Schema

### Work Document

Each portfolio work has the following structure:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Display title of the work |
| `slug` | string | ✅ | URL identifier (auto-generated from title if not provided) |
| `description` | string | ✅ | Short description shown on cards |
| `coverImage` | ImageAsset | ✅ | Main image for card and hero background |
| `previewVideo` | FileAsset | ❌ | Looping video shown on hover (webm/mp4) |
| `videoUrl` | string | ❌ | YouTube URL displayed in hero section |
| `heroDescription` | string | ❌ | Text shown in hero when no video |
| `tags` | string[] | ❌ | Categorization tags |
| `publishDate` | string | ✅ | Date in YYYY-MM-DD format |
| `isFeatured` | boolean | ✅ | If true, appears on homepage |
| `body` | PortableText[] | ❌ | Rich content (text, images, video embeds) |

### Asset References

When creating/updating works with images or videos, you need asset references:

```json
{
  "coverImage": {
    "_type": "image",
    "asset": { "_type": "reference", "_ref": "image-abc123-800x600-png" }
  }
}
```

Use `upload-image` or `upload-video` commands to get these references.

---

## Commands Reference

### `list` - List All Works

Returns a summary of all works in the database.

```bash
node --env-file=.env scripts/sanity-cms.mjs list
```

**Output:**
```json
[
  {
    "_id": "abc123",
    "title": "Evolution",
    "slug": "evolution",
    "description": "An interactive art piece",
    "tags": ["Interactive", "Art"],
    "publishDate": "2024-01-15",
    "isFeatured": true,
    "hasVideo": true,
    "hasPreviewVideo": true
  }
]
```

---

### `get <slug>` - Get Work Details

Returns full details of a specific work.

```bash
node --env-file=.env scripts/sanity-cms.mjs get evolution
```

**Output:** Full work document including body content and asset URLs.

---

### `create '<json>'` - Create New Work

Creates a new work document.

```bash
node --env-file=.env scripts/sanity-cms.mjs create '{
  "title": "New Project",
  "description": "A brief description",
  "publishDate": "2024-03-15",
  "tags": ["Web", "Interactive"],
  "isFeatured": false
}'
```

**Required fields:** `title`, `description`, `publishDate`

**Output:**
```json
{
  "success": true,
  "id": "xyz789",
  "slug": "new-project"
}
```

---

### `update <slug> '<json>'` - Update Existing Work

Updates specific fields on an existing work.

```bash
# Update title
node --env-file=.env scripts/sanity-cms.mjs update evolution '{"title": "Evolution 2.0"}'

# Update multiple fields
node --env-file=.env scripts/sanity-cms.mjs update evolution '{
  "description": "Updated description",
  "isFeatured": true,
  "tags": ["Art", "Interactive", "Award-winning"]
}'
```

**Output:**
```json
{
  "success": true,
  "id": "abc123"
}
```

---

### `delete <slug>` - Delete Work

Permanently deletes a work.

```bash
node --env-file=.env scripts/sanity-cms.mjs delete old-project
```

**Output:**
```json
{
  "success": true,
  "deleted": "Old Project",
  "id": "abc123"
}
```

---

### `upload-image <path>` - Upload Image

Uploads an image and returns an asset reference for use in create/update.

```bash
# Path relative to public/ folder
node --env-file=.env scripts/sanity-cms.mjs upload-image /images/work/new/cover.png

# Or absolute path
node --env-file=.env scripts/sanity-cms.mjs upload-image "C:/path/to/image.png"
```

**Output:**
```json
{
  "_type": "image",
  "asset": { "_type": "reference", "_ref": "image-abc123-800x600-png" }
}
```

---

### `upload-video <path>` - Upload Video

Uploads a video file and returns an asset reference.

```bash
node --env-file=.env scripts/sanity-cms.mjs upload-video /webm/works/thumbnails/new.webm
```

**Output:**
```json
{
  "_type": "file",
  "asset": { "_type": "reference", "_ref": "file-xyz789-webm" }
}
```

---

### `set-featured <slug> <true|false>` - Toggle Featured

Quick command to feature/unfeature a work on the homepage.

```bash
# Feature on homepage
node --env-file=.env scripts/sanity-cms.mjs set-featured evolution true

# Remove from homepage
node --env-file=.env scripts/sanity-cms.mjs set-featured evolution false
```

---

## Common Workflows

### Add a New Work with Image

```bash
# 1. Upload the cover image
node --env-file=.env scripts/sanity-cms.mjs upload-image /images/work/newproject/cover.png
# Returns: {"_type":"image","asset":{"_type":"reference","_ref":"image-abc123..."}}

# 2. Create the work with the image reference
node --env-file=.env scripts/sanity-cms.mjs create '{
  "title": "New Project",
  "description": "An amazing new work",
  "publishDate": "2024-03-20",
  "coverImage": {"_type":"image","asset":{"_type":"reference","_ref":"image-abc123..."}},
  "isFeatured": true
}'
```

### Update Work to Add Video

```bash
# 1. Upload preview video
node --env-file=.env scripts/sanity-cms.mjs upload-video /webm/works/thumbnails/project.webm
# Returns asset reference

# 2. Update work with video and YouTube link
node --env-file=.env scripts/sanity-cms.mjs update new-project '{
  "previewVideo": {"_type":"file","asset":{"_type":"reference","_ref":"file-xyz..."}},
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}'
```

### Batch Feature Multiple Works

```bash
node --env-file=.env scripts/sanity-cms.mjs set-featured evolution true
node --env-file=.env scripts/sanity-cms.mjs set-featured gearland true
node --env-file=.env scripts/sanity-cms.mjs set-featured moo-moo-cow true
```

---

## Error Handling

All commands return JSON. Errors have this format:

```json
{
  "error": true,
  "message": "Work not found: nonexistent-slug",
  "details": "Additional error information if available"
}
```

Common errors:
- `SANITY_WRITE_TOKEN environment variable not set` - Add token to `.env`
- `Work not found: <slug>` - Check slug spelling with `list` command
- `Missing required field: <field>` - Include all required fields in create
- `File not found: <path>` - Check file path exists

---

## For LLM Agents

When operating this CMS programmatically:

1. **Always run `list` first** to see current content state
2. **Use `get <slug>`** to retrieve full details before updating
3. **Upload assets before creating/updating** works that need them
4. **JSON must be valid** - use single quotes around the JSON argument
5. **Slugs are lowercase with hyphens** - "Moo Moo Cow" becomes "moo-moo-cow"
6. **Featured works appear on homepage** - use `set-featured` to control visibility

### Quick Reference for Agents

```bash
# See what exists
node --env-file=.env scripts/sanity-cms.mjs list

# Get details
node --env-file=.env scripts/sanity-cms.mjs get <slug>

# Create (minimum fields)
node --env-file=.env scripts/sanity-cms.mjs create '{"title":"X","description":"Y","publishDate":"YYYY-MM-DD"}'

# Update any field
node --env-file=.env scripts/sanity-cms.mjs update <slug> '{"field":"value"}'

# Delete
node --env-file=.env scripts/sanity-cms.mjs delete <slug>

# Toggle homepage visibility
node --env-file=.env scripts/sanity-cms.mjs set-featured <slug> true
```
