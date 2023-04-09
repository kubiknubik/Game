import { GameEvent } from "./events/Events";
import GameSounds from "./GameSounds";
import ReelsConfig from "./Reels/ReelsConfig"
import Config from "../Config";
import { GameMediator } from "./mediator/Mediator";
import { ReelsBackground } from "./Reels/ReelsBackground";
import { ReelsContainer } from "./Reels/ReelsContainer";
import { ReelsHeader } from "./Reels/ReelsHeader";
import { AnimationName, GameType, PopupType, SoundTypes } from "./types/enums";
import { WebSocketManager } from "../connection/WebSocketManager";
import { Container } from "pixi.js";
import { Spine } from "pixi-spine";
import GameFonts from "./core/Fonts";
import gsap from "gsap";
import { getCurrency, getSpineData, shouldDisplayCurrency, translate } from "./core/helpers";
import { TranslatableText } from "./core/TranslatableText"; 
 

export  class FruitBloxx extends Container {
   private reelContainer!: ReelsContainer;
   private header!: ReelsHeader;
   private background!: ReelsBackground;
   private introSpine!: Spine;
   private freeSpinsText!: TranslatableText;

   //state
   private type: GameType = GameType.Normal;
   private spinComplete: boolean = false;
   private data: any = null;
   private wsIndex = 0;
   private filledCount: number = 0;
   private isBonusGame: boolean = false;
   private spinIndex: number = 0;
   private currentWin: number = 0;
   private spinWin: number = 0;
   private currentBet!: number;
   private freeSpins: number = 0;
   private removeCount: number = 0;
   constructor() {
      super();
      this.setupDisplayObjects();
    
      GameMediator.on(GameEvent.ReelsCleared, this.onSpinStop);
      GameMediator.on(GameEvent.DropStop, this.onDropStop);
      GameMediator.on(GameEvent.FillStop, this.onFillStop);
      GameMediator.on(GameEvent.StateChange, this.stateChange);
      GameMediator.on(GameEvent.WinAnimationCompleted, this.onWinPopupShow);
      GameMediator.on(GameEvent.SpinCompleted, this.spinCompleted);
    
   }

   private setupDisplayObjects() {

      ReelsConfig.ShouldDisplayCurrency = shouldDisplayCurrency();
      ReelsConfig.Currency = getCurrency();

      if (Config.gameCycle) {       
         var delay = Config.gameCycle / 8;
         if (delay > ReelsConfig.ReelDropDelay) {
            ReelsConfig.ReelDropDelay = delay;
         }
      }

      this.header = new ReelsHeader();
      this.header.alpha = 0;
      this.header.y = 105
      this.header.x = 73
      this.addChild(this.header);

      this.background = new ReelsBackground();
      this.background.alpha = 0;
      this.background.x = 73
      this.background.y = 335
      this.addChild(this.background);

      this.reelContainer = new ReelsContainer(176, 285);
      this.reelContainer.alpha = 0;
      this.addChild(this.reelContainer);

      this.introSpine = new Spine(getSpineData("background")!);
      this.introSpine.visible = false;
      this.introSpine.x = 540;
      this.introSpine.y = 800;
      this.addChild(this.introSpine);

      this.freeSpinsText = new TranslatableText("", 10, GameFonts.AddFreeSpinsFont);
      this.freeSpinsText.anchor.set(0.5)
      this.freeSpinsText.alpha = 0;
      this.freeSpinsText.x = 540;
      this.freeSpinsText.y = 900;
      this.addChild(this.freeSpinsText);

      this.setupState(this.type);
      this.setInitialState();
   }

   public playIntro(): void {
      setTimeout(() => {
         this.introSpine.visible = true
         this.introSpine.state.setAnimation(0, AnimationName.Intro, false);
         GameSounds.playSound(SoundTypes.Intro)
      }, 1000);

      this.introSpine.state.addListener({
         complete: this.introComplete
      });
   }

   //state management
   public setupState(state: GameType) {
      this.header.setupState(state, 0);
      this.reelContainer.setupState(state);
      this.background.setupState(state);
   }

   public setInitialState() {
      var index = this.GetRandomSize(ReelsConfig.ZeroWins.length);
      var symbols = ReelsConfig.ZeroWins[index];
      this.reelContainer.setupReelState(symbols, 0, false);
   }

   public resetMultiplier() {
      this.header.resetMultipliers();
   }

   public restoreSpinState(stops: any, spinIndex: number) {
      if (stops.length <= 1) {
         this.restoreState(stops[0].spin_res)
      } else {
         let count = stops.length - spinIndex - 1;
         if (count <= 0) {
            return;
         }

         let currentState = stops[spinIndex];
         let freeSpinCount = currentState.remaining_freespins ? currentState.remaining_freespins : 0;
         if (count <= 0) {
            return;
         }

         var amount = 0;
         for (let i = 1; i < spinIndex; i++) {
            for (let j = 0; j < stops[i].ws.length; j++) {
               console.log(stops[i].ws)
               for (let k = 0; k < stops[i].ws[j].length; k++) {
                  amount += stops[i].ws[j][k].win_amount;
               }
            }
         }

         this.header.setWin(0);
         this.header.addWin(amount);

         this.isBonusGame = true;
         this.data = {};
         this.data.spin_results = {};
         this.data.spin_results.results_ex = stops;
         this.spinIndex = spinIndex;

         GameMediator.emit(GameEvent.ShowPopup, { type: PopupType.FreeSpinStart, data: { count: freeSpinCount } })
         this.header.showFreeSpins(freeSpinCount);
      }
   }

   public restoreState(stops: number[]) {
      this.setupState(GameType.Normal)
      this.reelContainer.setupReelState(stops, 0, false);
   }

   public updateGameState(data: any) {
      this.data = data;
      this.spinIndex = 0;
      this.currentBet = Config.defaultBet;
      this.isBonusGame = this.data.spin_results.results_ex.length > 1;
      if (this.spinComplete) {
         this.setResult();
      }
   }

   //events
   public introComplete = () => {
      this.introSpine.state.clearListeners();
      this.introSpine.visible = false;
      this.introSpine.cacheAsBitmap = true;

      setTimeout(() => {
         this.introSpine.destroy();
      }, 0)

      this.header.alpha = 1;
      this.background.alpha = 1;
      this.reelContainer.alpha = 1;

      GameMediator.emit(GameEvent.IntroComplete);
     // GameSounds.soundFadeIn(SoundTypes.Music, { loop: true, volume: 0.50 }, 2);
   }

   public showAdditionalFreeSpins = (count: number) => {
      if (this.spinIndex === 0 || count === 0) {
         this.showBonusStartOrEnd();
         return;
      }

      GameSounds.playSound(SoundTypes.ExtraSpins);

      this.shoFreeSpinsTextAnimation(count);
   }

   public shoFreeSpinsTextAnimation(count: number) {
      this.reelContainer.alpha = 0.6;
      this.freeSpinsText.alpha = 0;
      this.freeSpinsText.setDefaultText("+" + count + " " + translate("additionalFreeSpins"));

      var fontSize = this.freeSpinsText.currentFontSize * 1.2;

      gsap.timeline({ onComplete: this.showBonusStartOrEnd })
         .to(this.freeSpinsText, { alpha: 1, duration: 0.5 })
         .to(this.freeSpinsText, { alpha: 0, duration: 0.5, delay: 1 });

      gsap
         .to(this.freeSpinsText.style, { duration: 0.5, fontSize: fontSize, delay: 1.5 })
   }

   public playNextFreeSpin = () => {
      setTimeout(() => {
         this.header.nextSpin();
         this.performSpin();
         GameSounds.playSound(SoundTypes.ReelStart);
      }, 1000);
   }

   public performSpin = () => {
      this.spinComplete = false;
      this.wsIndex = 0;
      this.currentWin = 0;
      this.spinWin = 0;

      this.header.resetMultipliers();
      this.reelContainer.StartSpin();
   }

   public onSpinStop = (evt: any) => {
      if (evt.id === 4) {
         this.spinComplete = true;
         if (this.data != null) {
            this.setResult();
         }
      }
   }

   public onDropStop = (evt: any) => {
      if (evt.id === ReelsConfig.ColumnSymbolCount - 1) {
         let ws = this.data.spin_results.results_ex[this.spinIndex].ws;
         let config = this.data.spin_results.results_ex[this.spinIndex].slot_config;
         if (ws.length > 0) {
            this.showWin(ws, config);
         } else {
            GameMediator.emit(GameEvent.SpinCompleted);
         }

         GameSounds.playSound(SoundTypes.ReelStop);
      }
   }

   public onWinPopupShow = (evt: any) => {
      GameMediator.emit(GameEvent.SpinCompleted);
   }

   public onFillStop = (evt: any) => {
      this.filledCount++
      if (this.filledCount === ReelsConfig.ColumnSymbolCount) {
         this.filledCount = 0;
         let ws = this.data.spin_results.results_ex[this.spinIndex].ws;
         let reelSet = this.data.spin_results.results_ex[this.spinIndex].slot_config;
         if (ws.length > this.wsIndex) {
            setTimeout(() => {
               this.showWin(ws, reelSet)
            }, 300);
         } else {
            setTimeout(() => {
               if (this.spinIndex > 0) {
                  this.header.addWin(this.spinWin);
               }
               GameMediator.emit(GameEvent.ShowPopup, { type: PopupType.BigWin, data: { amount: this.spinWin, bet: this.currentBet } })
            }, 300);
         }
      }
   }

   private showWin(ws: any, reelSet: number) {
      var currWS = ws[this.wsIndex];
      this.removeCount = 0;
      this.currentWin = 0;
      this.reelContainer.setAlphaToBoard();

      for (let z = 0; z < currWS.length; z++) {
         this.reelContainer.setWinSymbols(currWS[z].idxs, currWS[z].win_amount);
         this.removeCount += currWS[z].idxs.length;
         this.currentWin += currWS[z].win_amount;
      }

      this.spinWin += this.currentWin;

      let soundName = SoundTypes.WinLine + this.GetRandom()
      GameSounds.playSound(soundName);

      setTimeout(() => {
         for (let z = 0; z < currWS.length; z++) {
            this.reelContainer.animateWinSymbols();
         }
         this.wsIndex++;

         GameSounds.playSound(SoundTypes.WinLineExplode + this.GetRandom());
      }, 700)

      setTimeout(() => {
         this.reelContainer.removeWinSymbols(reelSet);
         GameMediator.emit(GameEvent.WinSymbolsShow);
      }, 1900)
   }

   public GetRandom(): number {
      return Math.floor(Math.random() * 3) + 1
   }

   public GetRandomSize(size: number): number {
      return Math.floor(Math.random() * size);
   }

   public stateChange = (evt: GameType) => {
      GameSounds.stopSound(SoundTypes.Music);
      GameSounds.stopSound(SoundTypes.BonusMusic);
      if (evt === GameType.Bonus) {
         //this.header.setWin(0);
         //this.header.addFreeSpins(0);
         setTimeout(() => {
            this.header.nextSpin();
            this.performSpin();

            GameSounds.playSound(SoundTypes.ReelStart);
         }, 1000)

         GameSounds.soundFadeIn(SoundTypes.BonusMusic, { loop: true, volume: 0.5 }, 2);
      } else {
         this.header.showFreeSpins(0);
         GameSounds.soundFadeIn(SoundTypes.Music, { loop: true, volume: 0.5 }, 2);
      }

      this.setupState(evt)
   }

   public spinCompleted = (evt: any) => {
      if (!this.isBonusGame) {
         GameMediator.emit(GameEvent.WinComplete);
         this.spinIndex = 0;
         return;
      }

      if (this.data.spin_results.results_ex[this.spinIndex].extra_free_spins) {
         this.freeSpins = this.data.spin_results.results_ex[this.spinIndex].extra_free_spins;
         this.header.addFreeSpins(this.freeSpins);
      } else {
         this.freeSpins = 0
      }

      this.showAdditionalFreeSpins(this.freeSpins)
   }

   public showBonusStartOrEnd = () => {
      this.spinIndex++;
      this.reelContainer.alpha = 1;
      if (this.isBonusGame && this.spinIndex === 1) {
         this.freeSpinPopupShow();
         return;
      }

      if (this.data.spin_results.results_ex.length === this.spinIndex) {
         this.freeSpinEnd();
         return;
      }

      this.playNextFreeSpin();
   }

   public setResult() {
      let result = this.data.spin_results.results_ex[this.spinIndex];
      this.reelContainer.setupReelState(result.spin_res, result.slot_config, this.spinIndex === 0);
      this.reelContainer.finishSpin();
   }

   public freeSpinPopupShow = () => {
      this.reelContainer.showBonusWinAnimations();
      setTimeout(() => {
         var freeSpins = this.data.spin_results.results_ex[0].extra_free_spins;
         GameMediator.emit(GameEvent.ShowPopup, { type: PopupType.FreeSpinStart, data: { count: freeSpins } })
         this.header.showFreeSpins(freeSpins);
      }, ReelsConfig.FreeSpinStartDelay)
   }

   public freeSpinEnd = () => {
      setTimeout(() => {
         GameMediator.emit(GameEvent.ShowPopup, { type: PopupType.FreeSpinEnd, data: { amount: this.header.winAmount } })
         this.spinIndex = 0;
         this.data = null;
      }, ReelsConfig.FreeSpinEndDelay);
   }
}