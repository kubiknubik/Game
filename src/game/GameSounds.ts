import { PlayOptions, Sound, sound } from '@pixi/sound';
import gsap from "gsap";
import Config from "../Config";


var mute: boolean = !Config.sound || Config.omitSounds;

export default class GameSounds {

  public static soundFadeIn = (snd: string, options: PlayOptions, d: number) => {
    if (Config.omitSounds) {
      return;
    }
    let vol = options.volume;
    options!.volume = 0;

    let s = sound.play(snd, options);
    gsap.to(s, { duration: d, volume: vol });
  }

  public static soundFadeOut = (s: Sound, d: number) => {
    if (Config.omitSounds) {
      return;
    }
    gsap.to(s, { duration: d, volume: 0, onComplete: () => { s.stop(); s.volume = 1 } })
  }

  public static playSound = (snd: string, options?: PlayOptions) => {
    if (Config.omitSounds) {
      return;
    }
    sound.play(snd, options)
  }

  public static stopSound = (snd: string) => {
    if (Config.omitSounds) {
      return;
    }
    sound.stop(snd);
  }

  public static toggle = (): number => {
    if (Config.omitSounds) {
      return 0;
    }
    mute = !mute;
    sound.volumeAll = mute ? 0 : 1;
    return +!mute;
  }

}