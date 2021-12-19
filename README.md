# Welcome to HashLips 👄

Important: There is a new repo for this code.
[https://github.com/HashLips/hashlips_art_engine](https://github.com/HashLips/hashlips_art_engine)

All the code in these repos was created and explained by HashLips on the main YouTube channel.

To find out more please visit:

[📺 YouTube](https://www.youtube.com/channel/UC1LV4_VQGBJHTJjEWUmy8nA)

[👄 Discord](https://discord.com/invite/qh6MWhMJDN)

[💬 Telegram](https://t.me/hashlipsnft)

[🐦 Twitter](https://twitter.com/hashlipsnft)

[ℹ️ Website](https://hashlips.online/HashLips)

# generative-art-node

Create generative art by using the canvas api and node js

![](https://github.com/HashLips/generative-art-node/blob/main/src/preview.png)

## Installation

```sh
git clone https://github.com/HashLips/generative-art-node

yarn install
```

## Usage

Create your different layers as folders in the 'layers' directory, and add all the layer assets in these directories. Optionally, append '\_r' and '\_sr' to the layer file names to make those layer files rare or super rare respectively.

_Example:_ If you had an ball layer you would create a ball directory, and then a file might be called:

- `red_eye_ball_sr.png`
- `red_eye_ball_r.png`
- `red_eye_ball.png`

Once you have all your layers, go into `src/config.js` and update the `layersOrder` array to be your layer folders name in order of the back layer to the front layer.

_Example:_ If you were creating a portrait design, you might have a background, then a head, a mouth, eyes, eyewear, and then headwear, so your `layersOrder` would look something like this:

```js
const layersOrder = [
  { name: "background" },
  { name: "ball" },
  { name: "eye color" },
  { name: "iris", drawRate: 0.4 },
  { name: "shine" },
  { name: "shine" },
  { name: "bottom lid" },
  { name: "top lid" },
];
```

The `name` of each layer object represents the name of the folder (in `/layers/`) that the images reside in. The optional `drawRate` field can be filled in if the layer should not render on each variation, it accepts float values between 0.0 - 1.0. ( 0.5 being 50% render rate ).

Rarity groups, porportions and suffices can be further defined and changed in the config file.

```js
const rarity = [
  { key: "", val: 16 },
  { key: "_r", val: 8 },
  { key: "_sr", val: 2 },
];
```

The `key` field is the filename suffix of which you use for the layer assets and the `val` fields, together, create the difference in renderrate between layer assets.

_Example:_ in the config snippet above, \_sr val: 2 ( super rare ) renders 4 times fewer than \_r val: 8 ( rare ) because 2 is 4 times smaller than 8.

Then optionally, update your `format` size, ie the outputted image size, and the defaultEdition, which is the amount of variation outputted.

When you are all ready, run the following command and your outputted art will be in the `build` directory:

```sh
npm run build
```
