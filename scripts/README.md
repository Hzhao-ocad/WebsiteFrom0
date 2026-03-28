# Sanity Upload Script

Upload images or videos to Sanity CMS.

## Usage

```bash
node --env-file=.env scripts/sanity-upload.mjs <image|video> <path>
```

## Examples

```bash
# Upload image
node --env-file=.env scripts/sanity-upload.mjs image /images/work/new/cover.png

# Upload video
node --env-file=.env scripts/sanity-upload.mjs video /webm/works/thumbnails/new.webm
```

Returns JSON asset reference for use in Sanity documents.
