import { Spine } from "pixi-spine";
import * as PIXI from "pixi.js";
import { getSpineData } from "../core/helpers";
import { TranslatableText } from "../core/TranslatableText";
import { GameEvent, PopupEvents } from "../events/Events";
import { GameMediator } from "../mediator/Mediator";
import { AnimationName, GameType, SoundTypes } from "../types/enums";
import gsap from "gsap";
import { Container } from "pixi.js";
import GameFonts from "../core/Fonts";
import GameSounds from "../GameSounds";
import { ShowPopupInfo } from "../types/GameTypes";

export class BonusGamePopup extends PIXI.Container {
    private bg!: Spine;
    private pressToContinueText: TranslatableText;
    private youWinText!: TranslatableText;
    private freeSpinsText!: TranslatableText;
    private freeSpinsCountText!: PIXI.Text;
    private multiplierText!: TranslatableText;
    private increaseText!: TranslatableText;
    private mainContainer: Container;
    private centerY: number = 715;

    constructor() {
        super();

        this.bg = new Spine(getSpineData("free_spins")!);
        this.bg.visible = false;
        this.bg.y = this.centerY;
        this.addChild(this.bg);

        this.mainContainer = new Container();
        this.mainContainer.y = this.centerY;
        this.addChild(this.mainContainer)


        this.youWinText = new TranslatableText("bonusPopup.youWonSpins", 7, GameFonts.BonusStyleWhite)
        this.youWinText.anchor.set(0.5, 0.5);
        this.youWinText.y = 222 - this.centerY;

        this.freeSpinsCountText = new PIXI.Text("10", GameFonts.BonusStyleYellow)
        this.freeSpinsCountText.anchor.set(0.5, 0.5);
        this.freeSpinsCountText.y = 400 - this.centerY;

        this.freeSpinsText = new TranslatableText("bonusPopup.freeSpins", 10, GameFonts.BonusStyleWhite)
        this.freeSpinsText.anchor.set(0.5, 0.5);
        this.freeSpinsText.y = 592 - this.centerY;

        this.multiplierText = new TranslatableText("bonusPopup.multi", 10, GameFonts.BonusStyleMultiplier)
        this.multiplierText.anchor.set(0.5, 0.5);
        this.multiplierText.y = 979 - this.centerY;

        this.increaseText = new TranslatableText("bonusPopup.increased", 10, GameFonts.BonusStyleMultiplier)
        this.increaseText.anchor.set(0.5, 0.5);
        this.increaseText.y = 1104 - this.centerY;

        this.pressToContinueText = new TranslatableText("bonusPopup.pressToContinue", 35, GameFonts.BonusPressToContinueStyle)
        this.pressToContinueText.anchor.set(0.5, 0.5);
        this.pressToContinueText.y = 1325 - this.centerY;

        this.mainContainer.addChild(this.youWinText, this.freeSpinsCountText, this.freeSpinsText, this.multiplierText, this.increaseText, this.pressToContinueText);
        this.interactive = false;
        this.cursor = 'pointer';
        this.on("mouseup", this.starFreeSpins);
        this.on("tap", this.starFreeSpins);
    }

    public setFreeSpinCount(count: number) {
        this.visible = true;
        this.cacheAsBitmap = false;

        this.bg.visible = true;
        this.freeSpinsCountText.text = '' + count;
        this.pressToContinueText.alpha = 0;

        this.bg.state.timeScale = 0.5;
        this.bg.state.setAnimation(0, AnimationName.FreeSpinsLoop, true);

        this.bg.scale.set(0.6)
        this.mainContainer.scale.set(0.6)
        gsap.timeline({ onComplete: this.animationCompleted })
            .to(this.bg.scale, { duration: 1, ease: "back", x: 1, y: 1 })

        gsap.to(this.mainContainer.scale, { duration: 1, ease: "back", x: 1, y: 1 })

        GameSounds.playSound(SoundTypes.FreeSpinStart)
    }

    private animationCompleted = () => {
        this.interactive = true;
        gsap.to(this.pressToContinueText, { duration: 0.2, alpha: 1 })
        GameMediator.emit(GameEvent.FreeSpinsCountChange, { count: 10, isBaseGame: false })
    }

    private starFreeSpins = () => {
        this.visible = false;
        this.interactive = false;
        GameMediator.emit(PopupEvents.Show, { showOverlay: false, showPopup: false } as ShowPopupInfo);
        GameMediator.emit(GameEvent.ShowController, true);
        GameMediator.emit(GameEvent.StateChange, GameType.Bonus);
        this.cacheAsBitmap = true;
    }
}