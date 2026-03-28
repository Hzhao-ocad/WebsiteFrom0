import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

const client = createClient({
  projectId: 'o89ybnd0',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

// Upload image from ToBeConvert folder
async function uploadImage(relativePath) {
  const fullPath = join(rootDir, 'ToBeConvert', relativePath)
  console.log(`Uploading: ${relativePath}`)
  try {
    const fileBuffer = readFileSync(fullPath)
    const asset = await client.assets.upload('image', fileBuffer, {
      filename: relativePath.split('/').pop()
    })
    console.log(`  Uploaded: ${asset._id}`)
    return { _type: 'reference', _ref: asset._id }
  } catch (err) {
    console.error(`  Failed: ${err.message}`)
    return null
  }
}

async function main() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('Error: SANITY_WRITE_TOKEN not set')
    console.error('Run: node --env-file=.env scripts/create-pet-network.mjs')
    process.exit(1)
  }

  console.log('Creating Pet Network...\n')

  // Upload images from the Pet Network folder
  const coverImage = await uploadImage('Pet Network – Creation & Computation 2024_files/IMG_8498-1-1024x683.webp')
  const decorationImage = await uploadImage('Pet Network – Creation & Computation 2024_files/IMG_8496-2-1024x682.webp')
  const circlingImage = await uploadImage('Pet Network – Creation & Computation 2024_files/IMG_8500-3-1024x683.webp')
  const plinthImage = await uploadImage('Pet Network – Creation & Computation 2024_files/IMG_8504-2-1024x683.webp')

  const work = {
    _type: 'work',
    title: 'Pet Network',
    slug: { _type: 'slug', current: 'pet-network' },
    description: 'An interactive experience where cellphones become animated pets that communicate through pitched beeps, exploring our dependence on phones for communication.',
    coverImage: coverImage ? { _type: 'image', asset: coverImage } : undefined,
    videoUrl: 'https://www.youtube.com/watch?v=56IFiZA-4xE',
    tags: ['Interactive', 'p5.js', 'Audio', 'Social Experiment'],
    publishDate: '2024-10-22',
    isFeatured: false,
    body: [
      {
        _type: 'block',
        _key: 'authors',
        style: 'normal',
        children: [{ _type: 'span', _key: 'a1', text: 'By Harry, Olivia, JC', marks: ['strong'] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'h1',
        style: 'h2',
        children: [{ _type: 'span', _key: 'sh1', text: 'Project Description', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p1',
        style: 'normal',
        children: [{ _type: 'span', _key: 's1', text: '"Pet Networking" is an interactive experience made up of cellphones, costumes, and communication. The experience utilized 12 cellphones (and their owners) that ran a p5.js program to turn the phones into an animated pet. The program output pitch and a beeping language and took microphone input with the goal of finding a pitch to match one of three types. If it was placed down and heard a pitch that was a match, it would engage in conversation, but would otherwise ignore any language it didn\'t understand.', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p2',
        style: 'normal',
        children: [{ _type: 'span', _key: 's2', text: 'Each phone pet had expression movements matching the conversation state: shaky if in motion, still if listening, and talking if in conversation. The phone owners were given a cardboard wearable for their phone, as well as time to decorate it, to fully transform their phone into a new-and-improved version of itself. The goal of the experience was to get the phones to talk to each other, but there were also over a dozen humans walking around trying to talk to the phones. Using whistling, screeching, humming, and singing, the humans attempted to speak the phone\'s language.', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p3',
        style: 'normal',
        children: [{ _type: 'span', _key: 's3', text: 'Our intent behind "Pet Networking" was to create a metaphor for our current methods of communication. By emulating the interactions of a dog park, we wanted to demonstrate how we have become dependent on our phones for so much of our communication with each other in this increasingly digital age. We wanted to investigate the reliance and ownership we have over our phones and let them take the lead in this experience by being the only way users could communicate with each other.', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'h2',
        style: 'h2',
        children: [{ _type: 'span', _key: 'sh2', text: 'Conceptual References', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p4',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's4a', text: 'Talk to Me', marks: ['em'] },
          { _type: 'span', _key: 's4b', text: ' was an exhibition at the MoMA in 2011 which explored the communication between people and things. It focused on objects that involve a direct interaction, such as interfaces and communication devices.', marks: [] }
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p5',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's5a', text: 'Cellphone: Unseen Connections', marks: ['em'] },
          { _type: 'span', _key: 's5b', text: ' was a 2022 exhibition at the Smithsonian which explored the technological, environmental and cultural impact of cellphones.', marks: [] }
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p6',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's6a', text: 'Paw:sitive', marks: ['em'] },
          { _type: 'span', _key: 's6b', text: " was a 2017 exhibition in Singapore which was the world's first interactive art exhibition designed for cats and dogs.", marks: [] }
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'h3',
        style: 'h2',
        children: [{ _type: 'span', _key: 'sh3', text: 'Code', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p7',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's7a', text: 'p5.js Editor: ', marks: [] },
          { _type: 'span', _key: 's7b', text: 'https://editor.p5js.org/oliviapas/sketches/ffK2rhIJ3', marks: ['link1'] }
        ],
        markDefs: [{ _key: 'link1', _type: 'link', href: 'https://editor.p5js.org/oliviapas/sketches/ffK2rhIJ3' }],
      },
      {
        _type: 'block',
        _key: 'p8',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's8a', text: 'GitHub: ', marks: [] },
          { _type: 'span', _key: 's8b', text: 'https://github.com/Jaycee-Zh/OCAD-DIGF6037-2.git', marks: ['link2'] }
        ],
        markDefs: [{ _key: 'link2', _type: 'link', href: 'https://github.com/Jaycee-Zh/OCAD-DIGF6037-2.git' }],
      },
      {
        _type: 'block',
        _key: 'h4',
        style: 'h2',
        children: [{ _type: 'span', _key: 'sh4', text: 'Image Gallery', marks: [] }],
        markDefs: [],
      },
      ...(decorationImage ? [{
        _type: 'imageBlock',
        _key: 'img1',
        asset: decorationImage,
        caption: 'Decoration station. Customizing the phone costume added personality and built connection between the phone and owner.',
      }] : []),
      ...(circlingImage ? [{
        _type: 'imageBlock',
        _key: 'img2',
        asset: circlingImage,
        caption: 'Group of phone pets circling each other. This was not an interaction we expected but created interesting results.',
      }] : []),
      ...(plinthImage ? [{
        _type: 'imageBlock',
        _key: 'img3',
        asset: plinthImage,
        caption: 'Phone pet on a plinth with two people interacting with it, attempting to emulate the pitches to communicate.',
      }] : []),
    ],
  }

  try {
    const result = await client.create(work)
    console.log(`\nCreated: ${result._id}`)
  } catch (err) {
    console.error('Error:', err.message)
  }
}

main().catch(console.error)
