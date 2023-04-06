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

      this.imageLoader.onComplete.add((loader:any)=>this.loadComplete(loader))
   }
 
   public loadComplete(loader:any):void{
     
        Resources.images = loader.resources;
        app = new Application({
         transparent: true, 
         sharedLoader: true,
         sharedTicker: true, 
         autoDensity: true,
         width: 1080,
         height: 1756,
         view: document.getElementById('canvas') as any,
         //resizeTo: document.getElementById("game") as any
       });
       
       document.body.appendChild(app.view); 

       this.fruitBloxx = new FruitBloxx();       
       app.stage.addChild(this.fruitBloxx);
 
       

       this.fruitBloxx.playIntro()
   }

   public loadSounds(): void {
      if (GameConfig.omitSounds) {
         this.soundLoader = new Loader();
         this.imageLoader.add(Resources.sounds)
      }
   }
}