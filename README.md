# generative-art-node

Create generative art by using the canvas api and node js

![](https://github.com/HashLips/generative-art-node/blob/master/src/preview.png)

## Installation

```
git clone https://github.com/HashLips/generative-art-node
npm i
```

## Usage

Create your different layers as folders in the 'layers' directory, and add all the layer assets in these directories. Optionally, append '_r' and '_sr' to the layer file names to make those layer files rare or super rare respectively. 

*Example:* If you had an ball layer you would create a ball directory, and then a file might be called:

- `red_eye_ball_sr.png`
- `red_eye_ball_r.png`
- `red_eye_ball.png`

> Rarity is customizable in `src/config.js`.

Once you have all your layers, go into `src/config.js` and update the `layersOrder` array to be your layer folders name in order of the back layer to the front layer.

*Example:* If you were creating a portrait design, you might have a background, then a head, a mouth, eyes, eyewear, and then headwear, so your `layersOrder` would look something like this:

```
const layersOrder = [
    'background',
    'head',
    'mouth',
    'eyes',
    'eyewear',
    'headwear',
];
```

Then optionally, update your `format` size, ie the outputted image size, and the defaultEdition, which is the amount of variation outputted.

When your are all ready, run the following command and your outputted art will be in the `build` directory:

```
npm run build
```
