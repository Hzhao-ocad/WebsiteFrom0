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
    console.error('Run: node --env-file=.env scripts/create-echoes-of-you.mjs')
    process.exit(1)
  }

  console.log('Creating Echoes of You...\n')

  // Upload images
  const coverImage = await uploadImage('Echoes of You – Creation & Computation 2024_files/unnamed.jpg')
  const systemDiagram = await uploadImage('Echoes of You – Creation & Computation 2024_files/unnamed.png')
  const circuitDiagram = await uploadImage('Echoes of You – Creation & Computation 2024_files/unnamed(2).png')
  const photo1 = await uploadImage('Echoes of You – Creation & Computation 2024_files/unnamed(3).jpg')
  const photo2 = await uploadImage('Echoes of You – Creation & Computation 2024_files/unnamed(4).jpg')
  const photo3 = await uploadImage('Echoes of You – Creation & Computation 2024_files/unnamed(5).jpg')
  const photo4 = await uploadImage('Echoes of You – Creation & Computation 2024_files/unnamed(6).jpg')

  const work = {
    _type: 'work',
    title: 'Echoes of You',
    slug: { _type: 'slug', current: 'echoes-of-you' },
    description: 'A body-tracking puppet that mirrors human movements, emphasizing body language as a critical mode of expression and bridging linguistic divides.',
    coverImage: coverImage ? { _type: 'image', asset: coverImage } : undefined,
    videoUrl: 'https://vimeo.com/1028670360',
    tags: ['Interactive', 'Physical Computing', 'Body Tracking', 'Arduino'],
    publishDate: '2024-11-12',
    isFeatured: false,
    body: [
      {
        _type: 'block',
        _key: 'authors',
        style: 'normal',
        children: [{ _type: 'span', _key: 'a1', text: 'By Mahnoor, Ziheng, Harry', marks: ['strong'] }],
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
        children: [{ _type: 'span', _key: 's1', text: "In the digital world body language can't be used as we communicate through social media, texting, video games and more. Instead we use gifs or emojis in place of body language to convey the same meaning. However body language is a key part of how we communicate with each other especially when a language barrier is involved. Therefore we wanted to highlight and bring to attention the importance of body language through this puppet. The puppet emphasizes body language as a critical mode of expression, by echoing the participants movements. By incorporating physical gestures in the puppet, we bring attention to the nuanced ways body language fosters connection, emphasizing its power to bridge linguistic divides.", marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p2',
        style: 'normal',
        children: [{ _type: 'span', _key: 's2', text: "The puppet's face and body are composed primarily of geometric shapes, distinguishing it from traditional puppets, which often feature more detailed facial expressions and body structures. The choice of simplified geometry gives the puppet a clean, futuristic appearance that aligns with our vision. Our work nods to the storytelling tradition in conveying emotion and narrative through simple, silent figures. Beyond its technological functions, the puppet also serves as a companion, quietly reflecting the movements and emotions of the person it mirrors.", marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p3',
        style: 'normal',
        children: [{ _type: 'span', _key: 's3', text: "The design of the puppet was created by using the laser cutter (cutting, engraving & etching) onto cardboard. We also used a 3D printer to create extra attachments to help secure the servo's securely to the cardboard. The reason we chose cardboard was because it isn't a material that evokes or reminds us of mirrors hence we don't expect to see our movements echoed on it. Additionally we were also intentional about the placement and hiding the components to ensure the main focus was the puppet so that people were not distracted and could feel immersed into the movements.", marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p4',
        style: 'normal',
        children: [{ _type: 'span', _key: 's4', text: "To create the movement of the puppet we used the body pose code to make the puppet mimic movements. More specifically we used the points elbow, head, waist, shoulder, nose and left eye. Essentially, Echoes of You analyzes the gesture of the participant from a live webcam with p5.js's ml5 library, then controls the puppet to do the same pose using arduino and servos.", marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'h2',
        style: 'h2',
        children: [{ _type: 'span', _key: 'sh2', text: 'System Diagram', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p5',
        style: 'normal',
        children: [{ _type: 'span', _key: 's5', text: "The system works by getting participant body pose data from webcam, process it through p5.js's ml5 library, which allows it to calculate rotations for different joints such as head, shoulders and elbows. Then the rotational data is sent to the arduino, which controls 5 servos, each for head, shoulders and elbows. It will rotate each servo to designated angle, which will echo the participant's pose on the puppet.", marks: [] }],
        markDefs: [],
      },
      ...(systemDiagram ? [{
        _type: 'imageBlock',
        _key: 'img1',
        asset: systemDiagram,
        caption: 'System Diagram',
      }] : []),
      {
        _type: 'block',
        _key: 'h3',
        style: 'h2',
        children: [{ _type: 'span', _key: 'sh3', text: 'Circuit Diagram & Description', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p6',
        style: 'normal',
        children: [{ _type: 'span', _key: 's6', text: 'This circuit uses 5 servos, 1 arduino IoT 33 Nano, 1 USB-C power module. The USB-C power module provides 5V power for all 5 servos, the arduino controls the servos with analog pins 2,3,4,5,6, which controls head, right shoulder, right elbow, left shoulder and left elbow movement.', marks: [] }],
        markDefs: [],
      },
      ...(circuitDiagram ? [{
        _type: 'imageBlock',
        _key: 'img2',
        asset: circuitDiagram,
        caption: 'Circuit Diagram',
      }] : []),
      {
        _type: 'block',
        _key: 'h4',
        style: 'h2',
        children: [{ _type: 'span', _key: 'sh4', text: 'Code', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'p7',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's7a', text: 'p5.js Editor: ', marks: [] },
          { _type: 'span', _key: 's7b', text: 'https://editor.p5js.org/zhao840839843/sketches/43d39_Vo-', marks: ['link1'] }
        ],
        markDefs: [{ _key: 'link1', _type: 'link', href: 'https://editor.p5js.org/zhao840839843/sketches/43d39_Vo-' }],
      },
      {
        _type: 'block',
        _key: 'h5',
        style: 'h2',
        children: [{ _type: 'span', _key: 'sh5', text: 'Photos', marks: [] }],
        markDefs: [],
      },
      ...(photo1 ? [{
        _type: 'imageBlock',
        _key: 'img3',
        asset: photo1,
      }] : []),
      ...(photo2 ? [{
        _type: 'imageBlock',
        _key: 'img4',
        asset: photo2,
      }] : []),
      ...(photo3 ? [{
        _type: 'imageBlock',
        _key: 'img5',
        asset: photo3,
      }] : []),
      ...(photo4 ? [{
        _type: 'imageBlock',
        _key: 'img6',
        asset: photo4,
        caption: '3D printed attachments to help secure the servos on to cardboard pieces',
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
