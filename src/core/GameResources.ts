import * as PIXI from 'pixi.js';
import GameConfig from '../Config';

export class Resources {

  public static images: PIXI.utils.Dict<PIXI.LoaderResource>;
  public static sounds: PIXI.utils.Dict<PIXI.LoaderResource>;

  public static readonly imageManifest: Manifest = {
    path: GameConfig.baseURL + '/images',
    manifest: [
      { name: 'statics', url: 'statics.json' },
      { name: 'symbols', url: 'spine/symbols.json' },
      { name: 'background', url: 'spine/background.json' },
      { name: 'big_wins', url: 'spine/big wins.json' },
      { name: 'free_spins', url: 'spine/free spins pop up.json' },
      { name: 'puf', url: 'spine/PUF.json' },
      { name: 'reel_light', url: 'spine/Reel Light.json' }
    ]
  }
}


type Manifest = {
  path: string,
  manifest: Array<{ url: string, name: string }>
}