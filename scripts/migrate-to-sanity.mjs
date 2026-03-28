import { createClient } from '@sanity/client'
import { readFileSync, readdirSync } from 'fs'
import { join, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Sanity client with write access
const client = createClient({
  projectId: 'o89ybnd0',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

// Parse frontmatter from markdown
function parseFrontmatter(content) {
  // Normalize line endings
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) {
    console.error('  No frontmatter found')
    return {}
  }

  const frontmatter = {}
  const lines = match[1].split('\n')
  let currentKey = null

  for (const line of lines) {
    // Skip empty lines
    if (!line.trim()) continue

    // Array item
    if (line.match(/^\s+-\s/)) {
      const value = line.replace(/^\s+-\s/, '').replace(/^"(.*)"$/, '$1').trim()
      if (currentKey && Array.isArray(frontmatter[currentKey])) {
        frontmatter[currentKey].push(value)
      }
      continue
    }

    // Key-value pair
    const kvMatch = line.match(/^(\w+):\s*(.*)$/)
    if (kvMatch) {
      const [, key, value] = kvMatch
      currentKey = key

      if (value === '') {
        // Start of array
        frontmatter[key] = []
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // Inline array
        frontmatter[key] = value
          .slice(1, -1)
          .split(',')
          .map(v => v.trim().replace(/^"(.*)"$/, '$1'))
      } else if (value === 'true') {
        frontmatter[key] = true
      } else if (value === 'false') {
        frontmatter[key] = false
      } else {
        frontmatter[key] = value.replace(/^"(.*)"$/, '$1').trim()
      }
    }
  }

  return frontmatter
}

// Upload asset to Sanity
async function uploadAsset(filePath, type = 'image') {
  const fullPath = join(rootDir, 'public', filePath)
  console.log(`  Uploading ${type}: ${filePath}`)

  try {
    const fileBuffer = readFileSync(fullPath)
    const filename = basename(filePath)

    if (type === 'image') {
      const asset = await client.assets.upload('image', fileBuffer, { filename })
      return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
    } else {
      const asset = await client.assets.upload('file', fileBuffer, { filename })
      return { _type: 'file', asset: { _type: 'reference', _ref: asset._id } }
    }
  } catch (err) {
    console.error(`  Failed to upload ${filePath}:`, err.message)
    return null
  }
}

// Create slug from title
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Migrate a single work
async function migrateWork(filename) {
  const filePath = join(rootDir, 'src/content/works', filename)
  const content = readFileSync(filePath, 'utf-8')
  const data = parseFrontmatter(content)

  console.log(`\nMigrating: ${data.title}`)

  // Upload cover image
  const coverImage = data.coverImage ? await uploadAsset(data.coverImage, 'image') : null

  // Upload preview video
  const previewVideo = data.previewWebm ? await uploadAsset(data.previewWebm, 'file') : null

  // Build body content from detailDescription and gallery images
  const body = []

  // Add detail descriptions as paragraphs
  if (data.detailDescription && Array.isArray(data.detailDescription)) {
    for (const desc of data.detailDescription) {
      body.push({
        _type: 'block',
        _key: Math.random().toString(36).slice(2, 10),
        style: 'normal',
        children: [{ _type: 'span', _key: Math.random().toString(36).slice(2, 10), text: desc, marks: [] }],
        markDefs: [],
      })
    }
  }

  // Add gallery images to body
  if (data.galleryImages && Array.isArray(data.galleryImages)) {
    for (const imgPath of data.galleryImages) {
      const imgAsset = await uploadAsset(imgPath, 'image')
      if (imgAsset) {
        body.push({
          _type: 'imageBlock',
          _key: Math.random().toString(36).slice(2, 10),
          asset: imgAsset.asset,
        })
      }
    }
  }

  // Create work document
  const doc = {
    _type: 'work',
    title: data.title,
    slug: { _type: 'slug', current: slugify(data.title) },
    description: data.description || '',
    coverImage: coverImage,
    previewVideo: previewVideo,
    videoUrl: data.videoUrl && !data.videoUrl.includes('xxx') ? data.videoUrl : undefined,
    heroDescription: data.heroDescription || undefined,
    tags: data.tags || [],
    publishDate: data.publishDate || new Date().toISOString().split('T')[0],
    isFeatured: data.isFeatured || false,
    body: body.length > 0 ? body : undefined,
  }

  try {
    const result = await client.create(doc)
    console.log(`  Created: ${result._id}`)
    return result
  } catch (err) {
    console.error(`  Failed to create document:`, err.message)
    return null
  }
}

// Main migration
async function main() {
  console.log('Starting migration to Sanity...\n')

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('Error: SANITY_WRITE_TOKEN environment variable not set')
    console.error('Run with: SANITY_WRITE_TOKEN=your_token node scripts/migrate-to-sanity.mjs')
    process.exit(1)
  }

  const worksDir = join(rootDir, 'src/content/works')
  const files = readdirSync(worksDir).filter(f => f.endsWith('.md'))

  console.log(`Found ${files.length} works to migrate:`)
  files.forEach(f => console.log(`  - ${f}`))

  for (const file of files) {
    await migrateWork(file)
  }

  console.log('\n✅ Migration complete!')
}

main().catch(console.error)
