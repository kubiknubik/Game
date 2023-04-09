import { Loader } from "pixi.js";
import GameConfig from "../Config";
import { Resources } from "./GameResources";
import { GameMediator } from "../game/mediator/Mediator";
import { GameEvent } from "../game/events/Events";

export class GameLoader {

   private imageLoader!: Loader;
   private soundLoader!: Loader;

   public soundLoaded: boolean = false;
   public imageLoaded: boolean = false;

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

      GameMediator.emit(GameEvent.LoadComplete)
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
