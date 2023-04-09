import { Application } from "pixi.js";
import GameConfig from "./Config";
import { WebSocketManager } from "./connection/WebSocketManager";
import { FruitBloxx } from "./game/FruitBloxx";
import { ReelSymbol } from "./game/Reels/ReelSymbol";
import GamePopup from "./game/GamePopup";
import GameSounds from "./game/GameSounds";
import { SoundTypes } from "./game/types/enums";
import { GameMediator } from "./game/mediator/Mediator";
import { GameEvent } from "./game/events/Events";


var app: Application;
export class MainGame {
    private webSocketManager!: WebSocketManager;
    public fruitBloxx!: FruitBloxx;
    public symbol!: ReelSymbol;
    constructor() {
        this.webSocketManager = new WebSocketManager(GameConfig.gameUrl);
        GameMediator.on(GameEvent.LoadComplete, this.loadComplete);
        GameMediator.on(GameEvent.Login, this.StartGame);
        GameMediator.on(GameEvent.SpinResult, this.SpinResult);
    }

    private loadComplete = () => {
        console.log("load complete")
        this.webSocketManager.connect();
    }

    private SpinResult = (evt:any) => {
        console.log(evt);

        if(evt.error){
         alert("error")
        }else{
            this.fruitBloxx.updateGameState(evt)
        }
    }

    private StartGame = (evt: any) => {
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

        var popup = new GamePopup(app.stage)

        this.fruitBloxx.playIntro();

        this.symbol = new ReelSymbol();
        this.symbol.setSymbol(2);
        this.symbol.x = 400;
        this.symbol.y = 1550;
        this.symbol.interactive = true;

        this.symbol.on("click", () => {
            GameSounds.playSound(SoundTypes.ReelStart);
            this.fruitBloxx.data=null;
            this.fruitBloxx.performSpin();         

            const message = { betAmount:700,RoomId:7};
            this.webSocketManager.sendData(GameEvent.SpinRequest,message);
        });
        this.fruitBloxx.addChild(this.symbol)
    }
}