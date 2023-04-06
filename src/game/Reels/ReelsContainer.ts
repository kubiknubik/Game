import Config from './ReelsConfig'
import { GameReel } from "./GameReel";
import { AnimationName, AnimationType, GameType, SoundTypes } from "../types/enums";
import { getSpineData } from '../core/helpers';
import * as PIXI from "pixi.js";
import { Container } from 'pixi.js';
import { Spine } from 'pixi-spine'; 
import { GameMediator } from '../mediator/Mediator';
import { GameEvent } from '../events/Events';
import GameSounds from '../GameSounds';

export class ReelsContainer extends Container {

  private baseMask!: PIXI.Graphics;
  private reels: GameReel[] = [];
  private state: GameType = GameType.Normal;
  private explosionsContainer!: Container;
  private explosions: Spine[] = [];
  private isNearMiss: boolean = false;
  private firstIndex: number = 0;
  private scattersCount: number = 0;
  private symbolCounter: number = 0;

  constructor(x: number, y: number) {
    super();
    this.x = x
    this.y = y
    this.setupDisplayObjects();
    this.setupState(this.state);

    GameMediator.on(GameEvent.DropStop, this.reelDropStop)
    GameMediator.on(GameEvent.ScatterLand, this.scatterLand)
    GameMediator.on(GameEvent.SymbolStop, this.onSymbolStop);
  }

  public onSymbolStop = (evt: any) => {
    if (evt.event === AnimationType.Drop && evt.colIndex === Config.RowSymbolCount - 1) {
      let reel = this.reels[evt.reelId]
      if (reel.isNearMiss && !reel.containsScatter) {
        GameSounds.playSound(SoundTypes.NearMissEmptyDrop);
      }
    }

    if (evt.event === AnimationType.Drop || evt.event === AnimationType.Win) {
      this.symbolCounter++;
      if (this.symbolCounter % 2 === 1) {
        GameSounds.playSound(SoundTypes.SymbolLand);
      }
    }
  }

  public scatterLand = () => {
    this.scattersCount++;
    if (this.scattersCount > 5) {
      this.scattersCount = 5;
    }

    GameSounds.playSound(SoundTypes.ScatterLand + this.scattersCount)
  }

  public reelDropStop = (evt: any) => {
    if (this.isNearMiss && evt.id >= this.firstIndex) {
      this.explosionsContainer.visible = true;
      this.explosionsContainer.cacheAsBitmap = false;
      this.explosionsContainer.x = (evt.id + 1) * 180;

      this.animateNearMiss();
      if (evt.id > this.firstIndex) {
        this.setLogoIdleAnimation(evt.id);
      }

      if (evt.id === this.firstIndex) {
        GameSounds.playSound(SoundTypes.NearMiss, { volume: 0.85 });
      }
    } else {
      this.explosionsContainer.visible = false;
      this.explosionsContainer.cacheAsBitmap = true;
    }

    if (evt.id === 4) {
      this.explosionsContainer.visible = false;
      this.explosionsContainer.cacheAsBitmap = true;
      GameSounds.stopSound(SoundTypes.NearMiss);
    }
  }

  private setLogoIdleAnimation(reelId: number) {
    for (let i = 0; i <= this.firstIndex; i++) {
      this.reels[i].showBonusIdleAnimations();
    }
  }

  private animateNearMiss() {
    for (let i = 0; i < this.explosions.length; i++) {
      let animation = this.explosions[i];
      animation.state.addListener({
        complete: () => {
          animation.state.clearListeners();
          animation.state.setAnimation(0, AnimationName.ReelLightLoop, true);
          setTimeout(() => {
            animation.state.setAnimation(0, AnimationName.ReelLightOut, false);
          }, 350)
        }
      });

      animation.state.setAnimation(0, AnimationName.ReelLightIn, false)
    }
  }

  private setupDisplayObjects() {
    this.baseMask = new PIXI.Graphics();
    this.baseMask.beginFill(0x555555)
    this.baseMask.drawRoundedRect(this.x - Config.SymbolWidth / 2, this.y + Config.SymbolHeight / 2, 900, 1075, 30);
    this.baseMask.endFill()
    this.baseMask.x = -this.x;
    this.baseMask.y = -this.y;
    this.mask = this.baseMask;

    this.explosionsContainer = new Container();
    this.explosionsContainer.position.set(360, 150);

    for (var i = 0; i < 7; i++) {
      let animation = new Spine(getSpineData("reel_light"));
      animation.y = i * 178;
      this.explosionsContainer.addChild(animation);

      this.explosions.push(animation);
    }

    this.explosionsContainer.cacheAsBitmap = true;
    this.explosionsContainer.visible = false;
    this.addChild(this.explosionsContainer);

    this.setupReels();
  }

  public setupReels() {
    for (var i = 0; i < 5; i++) {
      var reel = new GameReel(i);
      reel.x = 0 + i * 180;
      this.reels.push(reel);
      this.addChild(reel);
    }
  }

  public setupState(state: GameType) {
    //setup state
  }

  public removeWinSymbols(state: number) {
    for (let i = 0; i < this.reels.length; i++) {
      this.reels[i].dropWinSymbols(state);
    }

    for (let i = 0; i < this.reels.length; i++) {
      this.reels[i].fillSpin();
    }
  }

  public setupReelState(offsets: number[], state: number, isFirstSpin: boolean) {
    let bonusesCounter = 0;
    this.firstIndex = 0;

    for (var i = 0; i < 5; i++) {
      let bonuses = this.reels[i].setupState(offsets[i], state, bonusesCounter > 1, this.firstIndex);
      this.isNearMiss = bonusesCounter > 1;

      if (isFirstSpin) {
        bonusesCounter += bonuses;
      }

      if (bonuses !== 0 && bonusesCounter === 2) {
        this.firstIndex = i;
      }
    }
  }

  public StartSpin() {
    this.scattersCount = 0;
    this.disableWinSymbols();
    for (var i = 0; i < this.reels.length; i++) {
      this.reels[i].clearBoard();
    }
  }

  public finishSpin() {
    for (var i = 0; i < this.reels.length; i++) {
      this.reels[i].finishSpin();
    }
  }

  public setAlphaToBoard() {
    for (var i = 0; i < this.reels.length; i++) {
      this.reels[i].disableWinFrameToSymbolsWithAlpha();
    }
  }

  public setWinSymbols(indexes: number[], winAmount: number) {
    let midSymbol = Math.floor(indexes.length / 2);
    for (var i = 0; i < indexes.length; i++) {
      let reelId = Math.floor(indexes[i] / 7);
      let symbolIndex = indexes[i] % 7;

      this.reels[reelId].setWinFrameToSymbol(symbolIndex, i === midSymbol, winAmount);
    }
  }

  public animateWinSymbols() {
    for (var i = 0; i < this.reels.length; i++) {
      this.reels[i].animateWinSymbols();
    }
  }

  public disableWinSymbols() {
    for (var i = 0; i < this.reels.length; i++) {
      this.reels[i].disableWinFrameToSymbols();
    }
  }

  public showBonusWinAnimations() {
    GameSounds.playSound(SoundTypes.ScatterActivation)
    for (var i = 0; i < this.reels.length; i++) {
      this.reels[i].showBonusWinAnimations();
    }
  }
}