/**
 * Upload assets to Sanity CMS
 *
 * Usage:
 *   node --env-file=.env scripts/sanity-upload.mjs <image|video> <path>
 *
 * Examples:
 *   node --env-file=.env scripts/sanity-upload.mjs image /images/work/new/cover.png
 *   node --env-file=.env scripts/sanity-upload.mjs video /webm/works/thumbnails/new.webm
 */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'fs'
import { join, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'o89ybnd0',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

async function upload(type, filePath) {
  let fullPath = filePath
  if (!existsSync(fullPath)) {
    fullPath = join(rootDir, 'public', filePath)
  }
  if (!existsSync(fullPath)) {
    console.error(`File not found: ${filePath}`)
    process.exit(1)
  }

  const fileBuffer = readFileSync(fullPath)
  const filename = basename(fullPath)
  const assetType = type === 'image' ? 'image' : 'file'

  const asset = await client.assets.upload(assetType, fileBuffer, { filename })

  console.log(JSON.stringify({
    _type: assetType === 'image' ? 'image' : 'file',
    asset: { _type: 'reference', _ref: asset._id }
  }, null, 2))
}

const [type, path] = process.argv.slice(2)
if (!type || !path) {
  console.log('Usage: node --env-file=.env scripts/sanity-upload.mjs <image|video> <path>')
  process.exit(1)
}

upload(type, path).catch(err => {
  console.error('Upload failed:', err.message)
  process.exit(1)
})
