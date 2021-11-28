# Generated

Create generative art by using the Canvas api and Node.js.

![](https://github.com/tun43p/generated/blob/main/src/preview.png)

## Installation

```sh
git clone https://github.com/tun43p/generated.git
```

```sh
yarn install
```

## Usage

Create your different layers as folders in the 'layers' directory, and add all the layer assets in these directories. Optionally, append '\_r' and '\_sr' to the layer file names to make those layer files rare or super rare respectively.

_Example:_ If you had an ball layer you would create a ball directory, and then a file might be called:

- `red_eye_ball_sr.png`
- `red_eye_ball_r.png`
- `red_eye_ball.png`

> Rarity is customizable in `src/config.ts`.

Once you have all your layers, go into `src/config.ts` and update the `layers` array to be your layer folders name in order of the back layer to the front layer.

_Example:_ If you were creating a portrait design, you might have a background, then a head, a mouth, eyes, eyewear, and then headwear, so your `layers` would look something like this:

```js
const layers = [
  { name: "background", quantity: 1 },
  { name: "ball", quantity: 2 },
  { name: "eye color", quantity: 12 },
  { name: "iris", quantity: 3 },
  { name: "shine", quantity: 1 },
  { name: "bottom lid", quantity: 3 },
  { name: "top lid", quantity: 3 },
];
```

The `name` of each layer object represents the name of the folder (in `/layers/`) that the images reside in. The `quantity` of each layer object represents the total quantity of image files you want to select from (possibly including blanks.) For instance, if you have three images in a layer folder and want to pick one of those each time, the `quantity` should be `3`. If you have a single image in a layer that you want to increase the rarity of to 1 in 100, the `quantity` for that layer should be `100`. In this case, 99 times out of 100, you will get a completely transparent layer.

Then optionally, update your `format` size, ie the outputted image size, and the defaultEdition, which is the amount of variation outputted.

When you are all ready, run the following command and your outputted art will be in the `build` directory:

```sh
npm run build
```

## Authors

- [HashLips](https://github.com/HashLips) - _Initial Work_.
- [tun43p](https://github.com/tun43p) - _Forked work_.

## License
