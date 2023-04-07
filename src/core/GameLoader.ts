import { Loader, Application } from "pixi.js";
import GameConfig from "../Config";
import { Resources } from "./GameResources";
import { FruitBloxx } from "../game/FruitBloxx";
import { ReelSymbol } from "../game/Reels/ReelSymbol";
import GameSounds from "../game/GameSounds";
import { SoundTypes } from "../game/types/enums";

export var app: Application;

const data = { "balance": 99450, "possible_actions": ["spin"], "round_id": 18, "round_state": "endgame", "spin_results": { "results_ex": [{ "seed": 46368, "spin_res": [70, 33, 26, 29, 61], "ws": [[{ "idxs": [10, 11, 12, 13, 18, 19, 20, 25, 23, 24, 26, 27], "symbol": 7, "win_amount": 300 }, { "idxs": [14, 15, 16, 21, 22], "symbol": 6, "win_amount": 50 }], [{ "idxs": [8, 9, 10, 11, 15, 16, 17], "symbol": 7, "win_amount": 160 }], [{ "idxs": [15, 16, 17, 23, 24, 25], "symbol": 3, "win_amount": 600 }]] }] }, "total_win": 1110 }

export class GameLoader {

   private imageLoader!: Loader;
   private soundLoader!: Loader;
   public fruitBloxx!: FruitBloxx;
   public symbol!: ReelSymbol;

   public soundLoaded: boolean = false;
   public imageLoaded: boolean = false;

   constructor() {

   }

   public loadAssets(): void {
      this.loadImages();
      this.loadSounds();
   }

   public loadImages(): void {
      this.imageLoader = new Loader();
      this.imageLoader.concurrency = 4;
      this.imageLoader.baseUrl = Resources.imageManifest.path;
      this.imageLoader.add(Resources.imageManifest.manifest);

      this.imageLoader.load();

      this.imageLoader.onComplete.add((loader: any) => this.loadCompleteImages(loader))
   }
   public loadCompleteSounds(loader: any): void {
      Resources.sounds = loader.resources;
      this.soundLoaded = true;
      this.startGame();
   }
   public loadCompleteImages(loader: any): void {
      Resources.images = loader.resources;
      this.imageLoaded = true;
      this.startGame();
   }

   public startGame(): void {
      if (!this.soundLoaded || !this.imageLoaded) {
         return;
      }

      app = new Application({
         transparent: true,
         sharedLoader: true,
         sharedTicker: true,
         autoDensity: true,
         resolution: window.devicePixelRatio,
         width: 1080,
         height: 1756,
         view: document.getElementById('canvas') as any,
         resizeTo: document.getElementById("game") as any
      });

      this.fruitBloxx = new FruitBloxx();

      app.stage.addChild(this.fruitBloxx);

      this.fruitBloxx.playIntro();

      this.symbol = new ReelSymbol();
      this.symbol.setSymbol(2);
      this.symbol.x=400;
      this.symbol.y=1550;
      this.symbol.interactive =true;
      
      this.symbol.on("click",()=>{         
         GameSounds.playSound(SoundTypes.ReelStart);
         this.fruitBloxx.performSpin();
         this.fruitBloxx.updateGameState(data)
       });
      this.fruitBloxx.addChild(this.symbol)
   }

   public loadSounds(): void {
      if (GameConfig.omitSounds) {
         this.soundLoaded = true;

         return;
      }

      this.soundLoader = new Loader();
      this.soundLoader.concurrency = 4;
      this.soundLoader.baseUrl = Resources.soundManifest.path;
      this.soundLoader.add(Resources.soundManifest.manifest);

      this.soundLoader.onComplete.add((loader: any) => this.loadCompleteSounds(loader))
      this.soundLoader.load();
   }
}
