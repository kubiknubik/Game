import * as PIXI from "pixi.js";
import { Spine } from 'pixi-spine';
import Config from '../game/Reels/ReelsConfig'
import { GameMediator } from "../game/mediator/Mediator";
import { GameEvent } from "../game/events/Events";
import { AnimationName, AnimationType, SoundTypes } from "../game/types/enums";
import { getDisplayAmount, getSpineData, getStaticTexture } from "../game/core/helpers";
import gsap from "gsap";
import { Container } from "pixi.js";
import { SymbolData, SymbolState } from "../game/types/GameTypes";
import GameSounds from "../game/GameSounds";
import { GameContainer } from "../core/GameContainer";
import GameFonts from "../game/core/Fonts";

export class GameSymbol extends GameContainer<SymbolState> {

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
      super({ isWinSymbol: false });
      this.addDisplayObjects();
      this.eventData = {};
      this.state = { isWinSymbol: false }

      this.interactive = true;
      this.on("click", this.clicked);
   }

   private clicked = () => {
      this.setEventData(AnimationType.Clear);
      GameMediator.emit("symbol_selected", {...this.eventData});
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
      this.eventData.symbolId = this.state.symbolId;
      this.eventData.empty = false;

      return {...this.eventData};
   }

   public setWinAnimation(): void {

      this.winFrame.visible = false;
      this.dim.visible = false;
      this.winAmountText.visible = false;
      this.showSpine()
      this.alpha = 1;
      this.interactive = false;

      this.baseSpine.state.timeScale = 1.5;
      if (this.state.symbolId == 10) {
         this.baseSpine.state.timeScale = 2;
         this.baseSpine.state.setAnimation(0, AnimationName.BonusLanding, false);
      } else {
         this.baseSpine.state.setAnimation(0, Config.SymbolNames[this.state.symbolId! - 1], false);
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

   public setFrame(): void {
      this.winFrame.visible = true;
      this.alpha = 1;
   }

   public disableWinFrame() {
      this.alpha = 1;
      this.winFrame.visible = false;
   }

   public swipe(newX:number, newY:number,duration:number,sym:number){
     var x = this.x;
     var y = this.y;

      gsap.timeline({onComplete:()=>{
         this.setSymbol(sym)
         this.x = x;
         this.y = y;
         this.setWinAnimation()
      }
      })
      .to(this,{x:newX, y: newY , duration:duration})
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
      this.disableWinFrame()
      this.interactive =true;
   }
}