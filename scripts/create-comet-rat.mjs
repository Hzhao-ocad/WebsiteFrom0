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
    console.error('Run: node --env-file=.env scripts/create-comet-rat.mjs')
    process.exit(1)
  }

  console.log('Creating Play Safari: Comet RAT...\n')

  // Upload images
  const coverImage = await uploadImage('Play Safari_ Comet RAT – Creation & Computation 2024_files/37a4d9a725fd95daff5e245a3f85ae6f-1024x682.webp')
  const instructionImage = await uploadImage('Play Safari_ Comet RAT – Creation & Computation 2024_files/Instruction-791x1024.webp')
  const roamingImage = await uploadImage('Play Safari_ Comet RAT – Creation & Computation 2024_files/0c3d934a530ed69a0c005084e04a9065-1024x682.webp')
  const whiskersImage = await uploadImage('Play Safari_ Comet RAT – Creation & Computation 2024_files/IMG_3194-768x1024.webp')
  const devImage = await uploadImage('Play Safari_ Comet RAT – Creation & Computation 2024_files/image-9-1024x603.webp')
  const wiringImage = await uploadImage('Play Safari_ Comet RAT – Creation & Computation 2024_files/IMG_3206-768x1024.webp')
  const circuitImage = await uploadImage('Play Safari_ Comet RAT – Creation & Computation 2024_files/image-8-1024x553.webp')

  const work = {
    _type: 'work',
    title: 'Play Safari: Comet RAT',
    slug: { _type: 'slug', current: 'comet-rat' },
    description: 'A custom Pong game controller designed as an autonomous "rat" that roams and sabotages your game, reimagining the relationship between player and controller.',
    coverImage: coverImage ? { _type: 'image', asset: coverImage } : undefined,
    videoUrl: 'https://vimeo.com/1035680712',
    tags: ['Interactive', 'Physical Computing', 'Game Controller', 'Arduino', 'IMU'],
    publishDate: '2024-12-03',
    isFeatured: false,
    body: [
      {
        _type: 'block',
        _key: 'h0',
        style: 'h2',
        children: [{ _type: 'span', _key: 'sh0', text: 'Welcome to Play Safari!', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p0',
        style: 'normal',
        children: [{ _type: 'span', _key: 's0', text: 'Step into a wild adventure where games come to life through the unique behaviors of animals! In Play Safari, each controller is inspired by the spirit of a different creature, blending fun, motion, and creativity. Whether you\'re doing push-ups with the mighty BearFit, clapping to guide the graceful Flutter High, adjusting light for the mysterious Lantern Angler, or scurrying with precision as Comet RAT, every interaction brings you closer to the animal kingdom.', marks: [] }],
        markDefs: [],
      },
      ...(instructionImage ? [{
        _type: 'imageBlock',
        _key: 'imgInst',
        asset: instructionImage,
        caption: 'Play Safari Instructions',
      }] : []),
      {
        _type: 'block',
        _key: 'h1',
        style: 'h2',
        children: [{ _type: 'span', _key: 'sh1', text: 'Comet RAT', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p1',
        style: 'normal',
        children: [{ _type: 'span', _key: 's1', text: 'Comet RAT is a controller specifically designed for Pong Game. Aiming to provide a set of new challenges to the pong game by adding a whole new layer of interface between the game and the player. The concept is to re-think the relationship between the player and the controller, making the controller more than just a input interface, giving it some personality traits and some form of autonomy.', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p2',
        style: 'normal',
        children: [{ _type: 'span', _key: 's2', text: 'While the Comet RAT provides a more intuitive way of input, as a trade off it will actively try to sabotage your game session by roaming on the table, which will make the paddle roam on the screen, the player needs to reorient the RAT constantly so the paddle can hit the ball.', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'h2',
        style: 'h2',
        children: [{ _type: 'span', _key: 'sh2', text: 'Images', marks: [] }],
        markDefs: [],
      },
      ...(roamingImage ? [{
        _type: 'imageBlock',
        _key: 'img1',
        asset: roamingImage,
        caption: 'Comet RAT roaming',
      }] : []),
      ...(whiskersImage ? [{
        _type: 'imageBlock',
        _key: 'img2',
        asset: whiskersImage,
        caption: 'Reversed whiskers!',
      }] : []),
      {
        _type: 'block',
        _key: 'h3',
        style: 'h2',
        children: [{ _type: 'span', _key: 'sh3', text: 'Development', marks: [] }],
        markDefs: [],
      },
      ...(devImage ? [{
        _type: 'imageBlock',
        _key: 'img3',
        asset: devImage,
        caption: 'Iterations of the internal structure and external case in 3D software',
      }] : []),
      ...(wiringImage ? [{
        _type: 'imageBlock',
        _key: 'img4',
        asset: wiringImage,
        caption: 'Internal wiring, battery, charging port and 5v transmitter',
      }] : []),
      {
        _type: 'block',
        _key: 'h4',
        style: 'h2',
        children: [{ _type: 'span', _key: 'sh4', text: 'Code Narrative', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p3',
        style: 'normal',
        children: [{ _type: 'span', _key: 's3', text: "This project is split into two parts, one will map the IMU's yaw reading to the distance the paddle could travel on screen (700 pixels) and give a target position on screen as output. The other part will take that position and automatically try to move the paddle to it. This system effectively narrows the input to one positional input, then the system will try to figure out how long the paddle needs to go up or down to reach the target position.", marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p4',
        style: 'normal',
        children: [{ _type: 'span', _key: 's4', text: "The IMU reading goes from 0 to 360 degrees. The value will be mapped to a 0-700 value corresponding to the paddle's location on screen. The outgoing command (0,1 or 2) is controlled automatically based on current time, yaw, estimation of the paddle's location and framerate. Because Pong is a closed system there's no way to know exactly where the paddle current is. But with known information it is possible to estimate roughly where the paddle will be after certain actions.", marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'h5',
        style: 'h2',
        children: [{ _type: 'span', _key: 'sh5', text: 'Arduino Code', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p5',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's5a', text: 'GitHub: ', marks: [] },
          { _type: 'span', _key: 's5b', text: 'https://github.com/Hzhao-ocad/Comet-Rat', marks: ['link1'] }
        ],
        markDefs: [{ _key: 'link1', _type: 'link', href: 'https://github.com/Hzhao-ocad/Comet-Rat' }],
      },
      {
        _type: 'block',
        _key: 'h6',
        style: 'h2',
        children: [{ _type: 'span', _key: 'sh6', text: 'Circuit Diagram', marks: [] }],
        markDefs: [],
      },
      ...(circuitImage ? [{
        _type: 'imageBlock',
        _key: 'img5',
        asset: circuitImage,
        caption: 'Circuit Diagram',
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
