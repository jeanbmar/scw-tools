# SCW Tools

This module is intended to convert `.scw` files from Supercell games to Collada (`.dae`) format.

For a better understanding of SCW file structures, look at the files in the lib/schemas directory.

## Quick Start

```js
const path = require('path');
const { SCW2DAE } = require('@ultrapowa/scw-tools');

const ROOT_DIR = 'path/to/apk/assets';
const MASTER_HASH = 'e30a1e4a93c76bea755877299ebebf535e1b3d73';
const DATA_DIR = path.join(ROOT_DIR, MASTER_HASH);
const RAW_ASSETS_DIR = path.join(DATA_DIR, 'sc3d');
const MODELS_DIR = 'path/to/collada'
const files = ['teleport_effect.scw', 'grass_town.scw', 'shelly_idle.scw', 'bo_mecha_geo.scw', 'bone_pile.scw', 'barrel1.scw', 'shelly_geo.scw', 'ruffs_geo.scw', 'character_materials.scw'];

// models only
files.forEach((filename) => {
  const name = `${path.basename(filename, '.scw')}.dae`;
  const filePath = path.join(RAW_ASSETS_DIR, 'sc3d', filename);
  const outputDir = path.join(MODELS_DIR, 'collada', name);
  SCW2DAE.convert(filePath, outputDir);
});

// shelly with texture
SCW2DAE.convert(
  path.join(RAW_ASSETS_DIR, 'sc3d/shelly_geo.scw'),
  path.join(MODELS_DIR, 'collada/shelly_geo.dae'),
  {
    diffuseTex: 'sc3d/shelly_v2_01.ktx',
    debug: true,
  },
);
```
