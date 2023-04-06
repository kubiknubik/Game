import * as PIXI from "pixi.js";
import { Spine } from 'pixi-spine';
import Config from './ReelsConfig'
import { GameMediator } from "../mediator/Mediator";
import { GameEvent } from "../events/Events";
import { AnimationName, AnimationType } from "../types/enums";
import { getDisplayAmount, getSpineData } from "../core/helpers";
import gsap from "gsap";
import { Container } from "pixi.js";
import GameFonts from "../core/Fonts";
import { getStaticTexture } from "../core/helpers";
import { SymbolData, SymbolState } from "../types/GameTypes";

export class ReelSymbol extends Container {

   private baseSpine!: Spine;
   private winFrame!: PIXI.Sprite;
   private background!: PIXI.Sprite;
   private symbol!: PIXI.Sprite;
   public winAmountText!: PIXI.Text;
   private dim!: PIXI.Graphics;

   //state
   public destinationPosY: number = 0;
   private eventData: SymbolData;
   public state: SymbolState;
   private isNearMiss: boolean = false;
   public dropDelay: number = 0;

   constructor() {
      super();
      this.addDisplayObjects();
      this.symbol.interactive = true;
      this.eventData = {};
      this.state = { isWinSymbol: false }

      this.symbol.on("click",()=>{ 
         this.state.isWinSymbol = true;
         this.setWinAnimation();
       }) 
   }

   private addDisplayObjects() {
      this.background = new PIXI.Sprite(getStaticTexture('block'));
      this.background.anchor.set(0.5);
      this.addChild(this.background);

      this.symbol = new PIXI.Sprite(getStaticTexture('s1'));
      this.symbol.visible = true;
      this.symbol.anchor.set(0.5);
      this.addChild(this.symbol);

      this.baseSpine = new Spine(getSpineData("symbols")!);
      Object.defineProperty(this.baseSpine, "scaleY", { get: () => { return this.scale._y.valueOf() }, set: (val) => { this.scale.set(1, val) } });
      Object.defineProperty(this.symbol, "scaleY", { get: () => { return this.scale._y.valueOf() }, set: (val) => { this.scale.set(1, val) } });
      this.baseSpine.visible = false;
      this.addChild(this.baseSpine);

      this.dim = new PIXI.Graphics();
      this.dim.beginFill(0x000000)
      this.dim.drawRoundedRect(-77, -70, 154, 140, 20);
      this.dim.endFill()
      this.dim.alpha = 0.5;
      this.dim.visible = false;
      this.dim.x = -this.x;
      this.dim.y = -this.y;
      this.addChild(this.dim)

      this.winFrame = new PIXI.Sprite(getStaticTexture('win_frame'));
      this.winFrame.visible = true;
      this.winFrame.anchor.set(0.5);
      this.winFrame.visible = false;
      this.addChild(this.winFrame);

      this.winAmountText = new PIXI.Text("", GameFonts.SymbolTextStyle)
      this.winAmountText.anchor.set(0.5, 0);
      this.winAmountText.y = 10;
      this.winAmountText.visible = false;
      this.addChild(this.winAmountText);
   }

   //state management
   public setBoardPosition(reelId: number, colIndex: number) {
      this.state.reelId = reelId;
      this.state.colIndex = colIndex;
   }

   public isWinSymbol(): boolean {
      return this.state.isWinSymbol;
   }

   private setEventData(evt: AnimationType) {
      this.eventData.colIndex = this.state.colIndex;
      this.eventData.reelId = this.state.reelId;
      this.eventData.event = evt;
   }

   public setWinAnimation(): void {
      if (this.state.isWinSymbol) {
         this.winFrame.visible = false;
         this.dim.visible = false;
         this.winAmountText.visible = false;
         this.showSpine()
         this.baseSpine.state.timeScale = 1.5;
         this.baseSpine.state.setAnimation(0, Config.SymbolNames[this.state.symbolId! - 1], false);
         this.alpha = 1;
      }
   }

   public setWinFrame(showWinAmount: boolean, winAmountText: number): void {
      this.winFrame.visible = true;
      this.alpha = 1;
      this.state.isWinSymbol = true;
      this.winAmountText.visible = showWinAmount;
      this.winAmountText.text = getDisplayAmount(winAmountText)
      this.dim.visible = showWinAmount;
   }

   public disableWinFrame() {
      this.alpha = 1;
      this.state.isWinSymbol = false;
   }

   public showBonusSymbolAnimation() {
      if (this.state.symbolId === Config.BonusSymbolId) {
         this.showSpine()
         this.baseSpine.state.setAnimation(0, AnimationName.BonusWin, false);
      }
   }

   public showBonusIdleAnimation() {
      if (this.state.symbolId === Config.BonusSymbolId) {
         this.showSpine()
         this.baseSpine.state.timeScale = 1;
         this.baseSpine.state.setAnimation(0, AnimationName.BonusNearMissIdle, true);
      }
   }

   public removeBonusIdleAnimation() {
      if (this.state.symbolId === Config.BonusSymbolId) {
         this.showSymbol()
      }
   }

   private showSpine() {
      this.symbol.visible = false;
      this.baseSpine.visible = true;
      this.baseSpine.cacheAsBitmap = false;
      this.baseSpine.state.timeScale = 1;
   }

   private showSymbol() {
      this.symbol.visible = true;
      this.baseSpine.visible = false;
      this.baseSpine.cacheAsBitmap = true;
   }

   public setSymbol(symbol: number) {
      this.showSymbol()
      this.symbol.texture = getStaticTexture('s' + symbol);
      this.state.symbolId = symbol;
      this.state.canBeAnimated = true;
   }

   //animation management
   private animateSymbolLand() {
      if (this.state.canBeAnimated && this.state.symbolId === Config.BonusSymbolId) {
         this.state.canBeAnimated = false;

         this.showSpine()
         if (this.isNearMiss) {
            this.showBonusIdleAnimation()
         } else {
            this.baseSpine.state.timeScale = 2;
            this.baseSpine.state.setAnimation(0, AnimationName.BonusLanding, false);
         }

         GameMediator.emit(GameEvent.ScatterLand);

         gsap.to(this.baseSpine, { duration: 0.15, scaleY: 0.7, y: 30 })
         setTimeout(() => {
            gsap.to(this.baseSpine, { duration: 0.15, scaleY: 1, y: 0 })
         }, 170)
      }

      if (this.state.symbolId !== Config.BonusSymbolId) {
         let resultY = this.state.colIndex! * 3

         gsap.timeline()
            .to(this.symbol, { duration: 0.07, y: resultY })
            .to(this.symbol, { duration: 0.07, y: 0, delay: 0.07 })
      }
   }

   private dropFinished = (evt: AnimationType) => {
      this.setEventData(evt);
      GameMediator.emit(GameEvent.SymbolStop, this.eventData);
      this.animateSymbolLand();

      if (this.eventData.colIndex === 0) {
         GameMediator.emit(GameEvent.DropStop, { id: this.eventData.reelId });
      }
   }

   private fillFinished = (evt: AnimationType) => {
      this.setEventData(AnimationType.Win);
      GameMediator.emit(GameEvent.SymbolStop, this.eventData);
      this.animateSymbolLand();

      if (this.eventData.colIndex === 0) {
         GameMediator.emit(GameEvent.FillStop, { id: this.state.reelId });
      }
   }

   public gsapWin() {
      this.destinationPosY = (this.state.colIndex! + 1) * Config.SymbolHeight;
      if (this.y === this.destinationPosY) {
         if (this.eventData.colIndex === 0) {
            GameMediator.emit(GameEvent.FillStop, { id: this.eventData.reelId });
         }
         return;
      }

      let duration = Math.abs(this.destinationPosY - this.y) / 4000
      let delay = 0.03 * (6 - this.state.colIndex!);

      gsap.timeline({ onComplete: () => this.fillFinished(AnimationType.Win) })
         .to(this, { duration: duration, y: this.destinationPosY, ease: "none", delay: delay })
   }

   public gsapDrop(isNearMiss: boolean, index: number, startDelay: number) {
      this.isNearMiss = isNearMiss;
      this.destinationPosY = (index + 1) * Config.SymbolHeight;
      this.y = Config.ReelCeilY + (index + 1) * Config.SymbolHeight;

      this.dropDelay = Config.SymbolDropStartDelay * (6 - index) / 1000;
      if (this.isNearMiss) {
         this.dropDelay = 0
      }

      gsap.timeline({ onComplete: () => this.dropFinished(AnimationType.Drop) })
         .to(this, { duration: 0.35, y: this.destinationPosY, ease: "power2.in", delay: startDelay + this.dropDelay })
   }

   public gsapClearBoard() {
      let delay = 0.01 * (6 - this.state.colIndex!);

      let deltaY = (6 - this.state.colIndex!) * 3

      gsap.timeline({ onComplete: this.ClearComplete })
         .to(this, { duration: 0.07, y: this.y - deltaY, ease: "none", delay: delay })
         .to(this, { duration: 0.25, y: this.y + 1300, ease: "power2.in", delay: delay + 0.1 })
   }

   public ClearComplete = () => {
      this.setEventData(AnimationType.Clear);
      if (this.eventData.colIndex === 0) {
         GameMediator.emit(GameEvent.ReelsCleared, { id: this.eventData.reelId });
      }
   }
}