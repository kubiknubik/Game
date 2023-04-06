import { Loader , Application} from "pixi.js";
import GameConfig from "../Config";
import { Resources } from "./GameResources";
import {FruitBloxx} from "../game/FruitBloxx";
import { ReelSymbol } from "../game/Reels/ReelSymbol";
 
export var app: Application;

export class GameLoader {

   private imageLoader!: Loader;
   private soundLoader!: Loader;
   public fruitBloxx! : FruitBloxx;
   public symbol! : ReelSymbol;

   public soundLoaded:boolean=false;
   public imageLoaded:boolean=false;

   constructor(){

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

      this.imageLoader.onComplete.add((loader:any)=>this.loadCompleteImages(loader))
   }
   public loadCompleteSounds(loader:any):void{
      Resources.sounds = loader.resources;
      this.soundLoaded= true;
      this.startGame();
   }
   public loadCompleteImages(loader:any):void{     
      Resources.images = loader.resources;
      this.imageLoaded= true;
      this.startGame();
   }

   public startGame():void{
      if(!this.soundLoaded || !this.imageLoaded){
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

   
       this.fruitBloxx.playIntro()
   }

   public loadSounds(): void {
      if (GameConfig.omitSounds) {
         this.soundLoaded= true;

         return;
      } 

      this.soundLoader = new Loader();
      this.soundLoader.concurrency = 4;
      this.soundLoader.baseUrl = Resources.soundManifest.path;
      this.soundLoader.add(Resources.soundManifest.manifest);
      
      this.soundLoader.onComplete.add((loader:any)=>this.loadCompleteSounds(loader))

      this.soundLoader.load();
   }
}