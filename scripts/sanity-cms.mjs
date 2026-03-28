/**
 * Sanity CMS Management Script
 *
 * This script provides CRUD operations for managing content in Sanity CMS.
 * It can be used by humans or LLM agents to manage the portfolio content.
 *
 * Usage: node --env-file=.env scripts/sanity-cms.mjs <command> [options]
 *
 * Commands:
 *   list                    - List all works
 *   get <slug>              - Get a specific work by slug
 *   create <json>           - Create a new work from JSON
 *   update <slug> <json>    - Update an existing work
 *   delete <slug>           - Delete a work by slug
 *   upload-image <path>     - Upload an image and return asset reference
 *   upload-video <path>     - Upload a video and return asset reference
 *   set-featured <slug> <true|false> - Set featured status
 *
 * Environment variables required:
 *   SANITY_PROJECT_ID       - Sanity project ID
 *   SANITY_DATASET          - Dataset name (default: production)
 *   SANITY_WRITE_TOKEN      - API token with write permissions
 */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'fs'
import { join, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// ============================================================================
// CONFIGURATION
// ============================================================================

const config = {
  projectId: process.env.SANITY_PROJECT_ID || 'o89ybnd0',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
}

const client = createClient({
  ...config,
  useCdn: false, // Must be false for mutations
})

// ============================================================================
// SCHEMA REFERENCE
// ============================================================================

/**
 * Work Document Schema:
 * {
 *   _type: 'work',                     // Required: always 'work'
 *   title: string,                     // Required: work title
 *   slug: { current: string },         // Required: URL-friendly identifier
 *   description: string,               // Required: short description for cards
 *   coverImage: SanityImageAsset,      // Required: main image
 *   previewVideo?: SanityFileAsset,    // Optional: hover preview video (webm/mp4)
 *   videoUrl?: string,                 // Optional: YouTube URL for hero
 *   heroDescription?: string,          // Optional: description shown in hero
 *   tags: string[],                    // Optional: array of tag strings
 *   publishDate: string,               // Required: YYYY-MM-DD format
 *   isFeatured: boolean,               // Required: show on homepage
 *   body?: PortableTextBlock[],        // Optional: rich content body
 * }
 */

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function output(data) {
  console.log(JSON.stringify(data, null, 2))
}

function error(message, details = null) {
  const err = { error: true, message }
  if (details) err.details = details
  console.error(JSON.stringify(err, null, 2))
  process.exit(1)
}

// ============================================================================
// ASSET OPERATIONS
// ============================================================================

/**
 * Upload an image to Sanity
 * @param {string} filePath - Path to image file (relative to public/ or absolute)
 * @returns {object} Sanity image asset reference
 */
async function uploadImage(filePath) {
  let fullPath = filePath
  if (!existsSync(fullPath)) {
    fullPath = join(rootDir, 'public', filePath)
  }
  if (!existsSync(fullPath)) {
    error(`File not found: ${filePath}`)
  }

  const fileBuffer = readFileSync(fullPath)
  const filename = basename(fullPath)

  const asset = await client.assets.upload('image', fileBuffer, { filename })

  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id }
  }
}

/**
 * Upload a video/file to Sanity
 * @param {string} filePath - Path to video file (relative to public/ or absolute)
 * @returns {object} Sanity file asset reference
 */
async function uploadVideo(filePath) {
  let fullPath = filePath
  if (!existsSync(fullPath)) {
    fullPath = join(rootDir, 'public', filePath)
  }
  if (!existsSync(fullPath)) {
    error(`File not found: ${filePath}`)
  }

  const fileBuffer = readFileSync(fullPath)
  const filename = basename(fullPath)

  const asset = await client.assets.upload('file', fileBuffer, { filename })

  return {
    _type: 'file',
    asset: { _type: 'reference', _ref: asset._id }
  }
}

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

/**
 * List all works
 * @returns {array} Array of work documents
 */
async function listWorks() {
  const works = await client.fetch(`
    *[_type == "work"] | order(publishDate desc) {
      _id,
      title,
      "slug": slug.current,
      description,
      tags,
      publishDate,
      isFeatured,
      "hasVideo": defined(videoUrl),
      "hasPreviewVideo": defined(previewVideo)
    }
  `)
  return works
}

/**
 * Get a specific work by slug
 * @param {string} slug - The work's slug
 * @returns {object} Full work document
 */
async function getWork(slug) {
  const work = await client.fetch(`
    *[_type == "work" && slug.current == $slug][0] {
      _id,
      _createdAt,
      _updatedAt,
      title,
      "slug": slug.current,
      description,
      coverImage,
      "previewVideoUrl": previewVideo.asset->url,
      videoUrl,
      heroDescription,
      tags,
      publishDate,
      isFeatured,
      body[] {
        ...,
        _type == "imageBlock" => { ..., "url": asset->url }
      }
    }
  `, { slug })

  if (!work) {
    error(`Work not found: ${slug}`)
  }
  return work
}

/**
 * Create a new work
 * @param {object} data - Work data (see schema reference)
 * @returns {object} Created document
 */
async function createWork(data) {
  // Validate required fields
  if (!data.title) error('Missing required field: title')
  if (!data.description) error('Missing required field: description')
  if (!data.publishDate) error('Missing required field: publishDate')

  const doc = {
    _type: 'work',
    title: data.title,
    slug: data.slug || { _type: 'slug', current: slugify(data.title) },
    description: data.description,
    coverImage: data.coverImage || null,
    previewVideo: data.previewVideo || undefined,
    videoUrl: data.videoUrl || undefined,
    heroDescription: data.heroDescription || undefined,
    tags: data.tags || [],
    publishDate: data.publishDate,
    isFeatured: data.isFeatured || false,
    body: data.body || undefined,
  }

  // Handle slug format
  if (typeof doc.slug === 'string') {
    doc.slug = { _type: 'slug', current: doc.slug }
  }

  const result = await client.create(doc)
  return { success: true, id: result._id, slug: doc.slug.current }
}

/**
 * Update an existing work
 * @param {string} slug - The work's slug
 * @param {object} updates - Fields to update
 * @returns {object} Updated document info
 */
async function updateWork(slug, updates) {
  // Get existing document ID
  const existing = await client.fetch(
    `*[_type == "work" && slug.current == $slug][0]{ _id }`,
    { slug }
  )

  if (!existing) {
    error(`Work not found: ${slug}`)
  }

  // Handle slug update
  if (updates.slug && typeof updates.slug === 'string') {
    updates.slug = { _type: 'slug', current: updates.slug }
  }

  const result = await client.patch(existing._id).set(updates).commit()
  return { success: true, id: result._id }
}

/**
 * Delete a work
 * @param {string} slug - The work's slug
 * @returns {object} Deletion confirmation
 */
async function deleteWork(slug) {
  const existing = await client.fetch(
    `*[_type == "work" && slug.current == $slug][0]{ _id, title }`,
    { slug }
  )

  if (!existing) {
    error(`Work not found: ${slug}`)
  }

  await client.delete(existing._id)
  return { success: true, deleted: existing.title, id: existing._id }
}

/**
 * Set featured status for a work
 * @param {string} slug - The work's slug
 * @param {boolean} featured - Whether to feature the work
 * @returns {object} Update confirmation
 */
async function setFeatured(slug, featured) {
  return updateWork(slug, { isFeatured: featured })
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  if (!config.token) {
    error('SANITY_WRITE_TOKEN environment variable not set')
  }

  try {
    switch (command) {
      case 'list':
        output(await listWorks())
        break

      case 'get':
        if (!args[1]) error('Usage: get <slug>')
        output(await getWork(args[1]))
        break

      case 'create':
        if (!args[1]) error('Usage: create <json>')
        output(await createWork(JSON.parse(args[1])))
        break

      case 'update':
        if (!args[1] || !args[2]) error('Usage: update <slug> <json>')
        output(await updateWork(args[1], JSON.parse(args[2])))
        break

      case 'delete':
        if (!args[1]) error('Usage: delete <slug>')
        output(await deleteWork(args[1]))
        break

      case 'upload-image':
        if (!args[1]) error('Usage: upload-image <path>')
        output(await uploadImage(args[1]))
        break

      case 'upload-video':
        if (!args[1]) error('Usage: upload-video <path>')
        output(await uploadVideo(args[1]))
        break

      case 'set-featured':
        if (!args[1] || !args[2]) error('Usage: set-featured <slug> <true|false>')
        output(await setFeatured(args[1], args[2] === 'true'))
        break

      case 'help':
      default:
        console.log(`
Sanity CMS Management Script

Usage: node --env-file=.env scripts/sanity-cms.mjs <command> [options]

Commands:
  list                              List all works (summary view)
  get <slug>                        Get full details of a work
  create '<json>'                   Create a new work
  update <slug> '<json>'            Update fields on existing work
  delete <slug>                     Delete a work
  upload-image <path>               Upload image, returns asset reference
  upload-video <path>               Upload video, returns asset reference
  set-featured <slug> <true|false>  Toggle featured status

Examples:
  # List all works
  node --env-file=.env scripts/sanity-cms.mjs list

  # Get a specific work
  node --env-file=.env scripts/sanity-cms.mjs get evolution

  # Create a new work
  node --env-file=.env scripts/sanity-cms.mjs create '{"title":"New Work","description":"A new project","publishDate":"2024-01-01"}'

  # Update a work's title
  node --env-file=.env scripts/sanity-cms.mjs update evolution '{"title":"Evolution 2.0"}'

  # Feature a work on homepage
  node --env-file=.env scripts/sanity-cms.mjs set-featured evolution true

  # Upload an image for use in content
  node --env-file=.env scripts/sanity-cms.mjs upload-image /images/work/new/cover.png
        `)
        break
    }
  } catch (err) {
    error('Operation failed', err.message)
  }
}

main()
