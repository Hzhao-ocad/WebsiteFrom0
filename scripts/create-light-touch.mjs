import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'o89ybnd0',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const work = {
  _type: 'work',
  title: 'Light Touch',
  slug: { _type: 'slug', current: 'light-touch' },
  description: 'A project bridging virtual and material worlds using a custom FSR (force sensing resistor) to create interactive experiences.',
  coverImage: {
    _type: 'image',
    asset: { _type: 'reference', _ref: 'image-44499ad7424bcfa91c7b5420def47f18f571bea8-768x1024-webp' }
  },
  videoUrl: 'https://www.youtube.com/watch?v=N2HQFhhMZO0',
  tags: ['Interactive', 'Physical Computing', 'Arduino'],
  publishDate: '2024-09-24',
  isFeatured: false,
  body: [
    {
      _type: 'block',
      _key: 'p1',
      style: 'normal',
      children: [{ _type: 'span', _key: 's1', text: 'Light Touch is a project that aims to create a bridge between the virtual and material worlds, using an FSR (force sensing resistor) to interact with the material world and have an effect in the virtual space. For a very long time, the interface between the virtual and material has been limited to a mouse and keyboard, occasionally a controller—nothing more than just a few buttons. This project is an attempt to enrich the interfacing devices between these two vastly different worlds.', marks: [] }],
      markDefs: [],
    },
    {
      _type: 'block',
      _key: 'p2',
      style: 'normal',
      children: [{ _type: 'span', _key: 's2', text: 'There have been many attempts by others, ranging from face tracking, expression prediction to heart rate monitoring, and so on. Compared to heart rate monitors or face tracking, Light Touch takes a more active approach. Instead of passively collecting data, the user must interact with Light Touch for it to work. This is a very important part of my practice—to gain hands-on experience. Active participation means giving an output with a conscious mind, therefore making it more valuable than a purely biological reaction like increased heartrate due to a sudden audio/visual stimulus.', marks: [] }],
      markDefs: [],
    },
    {
      _type: 'block',
      _key: 'p3',
      style: 'normal',
      children: [{ _type: 'span', _key: 's3', text: 'Technically, this project uses a custom-made FSR to sense the pressure exerted by the user and reflect it via an LED indicator and through a serial port back to the PC, which can then be used for other purposes. In terms of code, the program maintains an array of forces sensed by the sensor—about 50 of them. Each new force sensed is pushed into the array, popping the oldest one off. With this array of forces, the program calculates the average and uses that as the actual force value to control the LEDs. In this way, the force output is much smoother, meaning the LEDs have no flickering and a fade-in and fade-out effect.', marks: [] }],
      markDefs: [],
    },
    {
      _type: 'imageBlock',
      _key: 'img1',
      asset: { _type: 'reference', _ref: 'image-51b67427d0c1f64cc672571eef3db89c73443afe-1024x768-webp' },
    },
    {
      _type: 'imageBlock',
      _key: 'img2',
      asset: { _type: 'reference', _ref: 'image-e1556a0953c785a64ba17dac104d88ae91d58222-1024x768-webp' },
    },
    {
      _type: 'block',
      _key: 'h1',
      style: 'h2',
      children: [{ _type: 'span', _key: 'sh1', text: 'Relevant Works', marks: [] }],
      markDefs: [],
    },
    {
      _type: 'block',
      _key: 'p4',
      style: 'normal',
      children: [{ _type: 'span', _key: 's4', text: 'Tomorrow Can Not Be Waited is a realtime performance recorded and edited into a music video by Howie Lee, a London/Beijing based music artist. In this work he explored the blurry border between virtual and material world. He created the entire scene in Unreal Engine, used a variety of input devices: controller, facecam, keyboard, midi keyboard, force sensor and hand-tracking.', marks: [] }],
      markDefs: [],
    },
    {
      _type: 'videoEmbed',
      _key: 'v1',
      url: 'https://www.youtube.com/watch?v=MBnjvtnxRUs',
    },
    {
      _type: 'block',
      _key: 'p5',
      style: 'normal',
      children: [{ _type: 'span', _key: 's5', text: 'BOB (Bag of Beliefs) by Ian Cheng is an attempt to explain and understand metabolism and lifecycle in a virtual space. He used a touch screen phone app where audiences can feed, contribute, and walk BOB. Without any interaction BOB won\'t do much because it lacks food and energy, but with people interacting, BOB becomes extremely active.', marks: [] }],
      markDefs: [],
    },
    {
      _type: 'videoEmbed',
      _key: 'v2',
      url: 'https://www.youtube.com/watch?v=PdGAG5_VKZA',
    },
    {
      _type: 'block',
      _key: 'p6',
      style: 'normal',
      children: [{ _type: 'span', _key: 's6', text: 'teamLab Borderless Shanghai is a giant museum of interactive art. Interactive artwork\'s strongest part is when interacting with an everyday object using an everyday action but it creates a very different result. teamLab reduced the interaction to just human hands and feet, making it highly accessible.', marks: [] }],
      markDefs: [],
    },
    {
      _type: 'videoEmbed',
      _key: 'v3',
      url: 'https://www.youtube.com/watch?v=xbgfMACpkw4',
    },
    {
      _type: 'block',
      _key: 'h2',
      style: 'h2',
      children: [{ _type: 'span', _key: 'sh2', text: 'Technical Details', marks: [] }],
      markDefs: [],
    },
    {
      _type: 'block',
      _key: 'p7',
      style: 'normal',
      children: [{ _type: 'span', _key: 's7', text: 'Software: Arduino IDE. Hardware: 3 LEDs (red, yellow, green), 2 alligator wires, some wires, cardboard, 1 Arduino Nano 33 IoT, 1 custom-made force sensing resistor, 1 100 Ohm resistor.', marks: [] }],
      markDefs: [],
    },
    {
      _type: 'imageBlock',
      _key: 'img3',
      asset: { _type: 'reference', _ref: 'image-a66d3446c036c93ed775aca107c52e64271e0ffd-374x374-webp' },
      caption: 'Circuit Diagram created using Fritzing',
    },
    {
      _type: 'block',
      _key: 'p8',
      style: 'normal',
      children: [{ _type: 'span', _key: 's8', text: 'The code reads values from A0 (connected to FSR), puts them in an array with historical force data, and averages them to get smoothed data. This smoothed data is fed into three LEDs as brightness values, mapped differently for each LED to create a fade-in and fade-out effect.', marks: [] }],
      markDefs: [],
    },
    {
      _type: 'block',
      _key: 'p9',
      style: 'normal',
      children: [
        { _type: 'span', _key: 's9a', text: 'GitHub: ', marks: [] },
        { _type: 'span', _key: 's9b', text: 'https://github.com/Hzhao-ocad/LightTouch', marks: ['link1'] }
      ],
      markDefs: [{ _key: 'link1', _type: 'link', href: 'https://github.com/Hzhao-ocad/LightTouch' }],
    },
  ],
}

client.create(work).then(result => {
  console.log('Created:', result._id)
}).catch(err => {
  console.error('Error:', err.message)
})
