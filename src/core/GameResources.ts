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

  public static readonly soundManifest: Manifest = {
    path: GameConfig.baseURL + '/sounds' ,
    manifest :[
      { name:'music',  url: 'music.mp3'},
      { name:'music_bonus', url:  'bonus_game_music.mp3'},
      { name:'intro',  url: '/intro.mp3'},
      { name:'big_win',  url: '/big_win.mp3'},
      { name:'instant_win', url:  'instant_win.mp3'},
      { name:'start_spin', url:  'button_spin.mp3'},
      { name:'reel_stop',  url: 'reel_stop.mp3'},
      { name:'reel_loop',  url: 'reel_loop.mp3'},
      { name:'reel_start', url:  'reel_start.mp3'},
      { name:'symbol_land', url:  'symbol_land.mp3'},
      { name:'counter_stop', url:  'counter_stop.mp3'},
      { name:'counter_loop', url:  'counter_loop.mp3'},
      { name:'counter_start', url:  'counter_start.mp3'},
      { name:'free_spin_end_popup', url:  'free_spin_end_popup.mp3'},
      { name:'freespin_start_popup', url:  'freespin_start_popup.mp3'},
      { name:'winline_1',  url: 'winline_1.mp3'},
      { name:'winline_2', url:  'winline_2.mp3'},
      { name:'winline_3', url:  'winline_3.mp3'},

      { name:'scatter_land_1', url:  'sc_land_1.mp3'},
      { name:'scatter_land_2', url:  'sc_land_2.mp3'},
      { name:'scatter_land_3', url:  'sc_land_3.mp3'},
      { name:'scatter_land_4', url:  'sc_land_4.mp3'},
      { name:'scatter_land_5',  url: 'sc_land_5.mp3'},

      { name:'scatter_activation', url:  'sc_activation.mp3'},
      { name:'winline_explode_1', url:  'line_explosion_1.mp3'},
      { name:'winline_explode_2', url:  'line_explosion_2.mp3'},
      { name:'winline_explode_3', url:  'line_explosion_3.mp3'},
      { name:'near_miss',  url: 'near_miss_riser.mp3'},
      { name:'near_miss_drop',  url: 'near_miss_drop.mp3'},
      { name:'ui_button',  url: 'ui.mp3'},
      { name:'extra_spins', url:  'extra_spins.mp3'}
    ]
  }
}


type Manifest = {
  path: string,
  manifest: Array<{ url: string, name: string }>
}