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
import { CandyCrush } from "./MatchThree/CandyCrush";


var app: Application;
export class MainGame {
    private webSocketManager!: WebSocketManager;
    private CandyCrush! :CandyCrush;
    public fruitBloxx!: FruitBloxx;
    public symbol!: ReelSymbol;
    public symbol1!: ReelSymbol;
    constructor() {
       
        //GameMediator.on(GameEvent.LoadComplete, this.loadComplete);
        GameMediator.on(GameEvent.LoadComplete, this.StartGame); //ToDo remove
        GameMediator.on(GameEvent.Login, this.StartGame);
        GameMediator.on(GameEvent.SpinResult, this.SpinResult);
    }

    private loadComplete = () => {
        this.webSocketManager = new WebSocketManager(GameConfig.gameUrl);
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


         this.CandyCrush = new CandyCrush();
         this.CandyCrush.x =100;
         this.CandyCrush.y = 500;
         app.stage.addChild(this.CandyCrush);
        // this.fruitBloxx = new FruitBloxx();

        // app.stage.addChild(this.fruitBloxx);


        // var popup = new GamePopup(app.stage)

        // this.fruitBloxx.playIntro();

        // this.symbol = new ReelSymbol();
        // this.symbol.setSymbol(2);
        // this.symbol.x = 360;
        // this.symbol.y = 1550;
        // this.symbol.interactive = true;

        // this.symbol.on("click", this.spin1);
        // this.symbol.on("tap", this.spin1);
     
        // this.symbol1 = new ReelSymbol();
        // this.symbol1.setSymbol(5);
        // this.symbol1.x = 720;
        // this.symbol1.y = 1550;
        // this.symbol1.interactive = true;

      
        // this.symbol1.on("click", this.spin2);
        // this.symbol1.on("tap", this.spin2);
        
        // this.fruitBloxx.addChild(this.symbol)
        // this.fruitBloxx.addChild(this.symbol1)
    }

    private spin2 = ()=>{
        const message = { betAmount:1,RoomId:7, stops:[ 42, 5, 19, 79, 64]};
        this.spin(message);
    }

    private spin1= ()=>{
        const message = { betAmount:1,RoomId:7};
        this.spin(message);
    }

    private spin= (message:any)=>{
        GameSounds.playSound(SoundTypes.ReelStart);
        this.fruitBloxx.data=null;
        this.fruitBloxx.performSpin();      
        this.webSocketManager.sendData(GameEvent.SpinRequest,message);
    }
}