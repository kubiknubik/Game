import GameConfig from "../Reels/ReelsConfig";
import { AnimationName, BigWinType, SoundTypes } from "../types/enums";
import { WinFrame } from "./WinFrame";
import { Spine } from "pixi-spine";
import { GameMediator } from "../mediator/Mediator";
import { GameEvent, PopupEvents } from "../events/Events";
import { Container } from "pixi.js";
import GameSounds from "../GameSounds";
import { getSpineData } from "../core/helpers";
import { ShowPopupInfo } from "../types/GameTypes";

export class BigWinPopup extends Container {
  private mainSpine!: Spine;
  private winFrame: WinFrame;
  private animationName!: AnimationName;
  private winType!: BigWinType;
  private winAmount!: number;
  private timeOut!: NodeJS.Timeout;
  private isInstantWin: boolean = false;

  constructor() {
    super();
    this.visible = false;

    this.winFrame = new WinFrame();
    this.winFrame.x = 540;
    this.winFrame.y = 800;
    this.addChild(this.winFrame);

    this.mainSpine = new Spine(getSpineData("big_wins")!)
    this.mainSpine.x = 540;
    this.mainSpine.y = 580;
    this.addChild(this.mainSpine);

    this.on('tap', this.setFinalWin)
    this.on('click', this.setFinalWin)
  }

  public setFinalWin = () => {
    clearTimeout(this.timeOut)
    this.hidePopup();
    this.winFrame.setFinalWin(this.winAmount);
  }

  public setBigWin() {
    this.mainSpine.visible = true;
    this.mainSpine.state.timeScale = 1.0
    this.mainSpine.state.addListener({
      complete: () => {
        this.mainSpine.state.clearListeners();
        this.mainSpine.state.setAnimation(0, this.animationName, true);
      }
    });

    this.mainSpine.state.setAnimation(0, this.animationName + " a", false);

    this.winFrame.x = 540;
    this.winFrame.y = 800;
  }

  public setNormalWin() {
    this.mainSpine.visible = false;
    this.winFrame.x = 540;
    this.winFrame.y = 600;
  }

  public setWin(amount: number, bet: number): void {
    this.winAmount = amount;

    let factor = amount / bet;
    let showOverlay = true;
    if (factor < GameConfig.BigWins[0].factor) {
      this.winType = BigWinType.Normal;
    } else if (factor < GameConfig.BigWins[1].factor) {
      this.winType = BigWinType.Big;
      this.animationName = AnimationName.bigWin
    } else if (factor < GameConfig.BigWins[2].factor) {
      this.winType = BigWinType.Mega;
      this.animationName = AnimationName.megaWin
    } else {
      this.winType = BigWinType.Epic;
      this.animationName = AnimationName.epicWin;
    }

    GameMediator.emit(PopupEvents.Show, { showOverlay: showOverlay, showPopup: true } as ShowPopupInfo);
    this.showWin(factor);
  }

  public showWin(factor: number) {
    this.visible = true;
    this.interactive = true;
    let animationDuration = GameConfig.BigWinDuration;
    this.isInstantWin = false
    if (this.winType === BigWinType.Normal) {
      this.setNormalWin()
      animationDuration = GameConfig.NormalWinDuration;
      GameSounds.playSound(SoundTypes.InstantWin);
      if (factor < 1) {
        this.isInstantWin = true;
        animationDuration = 0;
      }
    } else {
      GameSounds.playSound(SoundTypes.BigWin);
      this.setBigWin()
    }

    this.winFrame.setWinAmount(this.winAmount, animationDuration / 1000);

    if (!this.isInstantWin) {
      GameSounds.playSound(SoundTypes.CounterStart)
      setTimeout(() => {
        GameSounds.playSound(SoundTypes.CounterLoop, { volume: 1, loop: true })
      }, 100);
    }

    this.timeOut = setTimeout(() => {
      this.interactive = false;
      this.hidePopup();
    }, animationDuration)
  }

  public hidePopup() {
    this.interactive = false;
    if (!this.isInstantWin) {
      GameSounds.stopSound(SoundTypes.CounterLoop);
      GameSounds.playSound(SoundTypes.CounterEnd);
    }

    setTimeout(() => {
      this.visible = false;
      GameMediator.emit(PopupEvents.Show, { showController: true, showOverlay: false, showPopup: false } as ShowPopupInfo);
      GameMediator.emit(GameEvent.WinAnimationCompleted);
    }, GameConfig.BigWinDelay);
  }
}