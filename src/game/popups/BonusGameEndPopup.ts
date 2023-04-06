import { Spine } from "pixi-spine";
import * as PIXI from "pixi.js";
import { TranslatableText } from "../core/TranslatableText";
import { GameEvent, PopupEvents } from "../events/Events";
import { GameMediator } from "../mediator/Mediator";
import { getDisplayAmount, getSpineData } from "../core/helpers";
import { Container } from "pixi.js";
import { AnimationName, GameType, SoundTypes } from "../types/enums";
import GameFonts from "../core/Fonts";
import gsap from "gsap";
import GameSounds from "../GameSounds";
import { ShowPopupInfo } from "../types/GameTypes";

export class BonusGameEndPopup extends Container {
    private bgSpine!: Spine;
    private congratsText!: PIXI.Text;
    private featureText!: PIXI.Text;
    private noWinText!: PIXI.Text;
    private youWinText!: PIXI.Text;
    private amountText!: PIXI.Text;
    private pressToContinueText!: TranslatableText;
    private winAmount: number = 0;
    private totalWin: number = 0;
    private tween!: gsap.core.Timeline;

    constructor() {
        super();
        this.scale.set(1.2)
        this.addDisplayObjects();
    }

    private addDisplayObjects() {

        this.bgSpine = new Spine(getSpineData("puf")!);
        this.bgSpine.y = 450;
        this.addChild(this.bgSpine);

        this.congratsText = new TranslatableText("bonusPopup.congrats", 15, GameFonts.BonusEndStyleCongrats)
        this.congratsText.y = 235;
        this.congratsText.anchor.set(0.5, 0.5);

        this.youWinText = new TranslatableText("bonusPopup.youWon", 10, GameFonts.BonusEndStyleWhite)
        this.youWinText.y = 413;
        this.youWinText.anchor.set(0.5, 0.5);

        this.featureText = new TranslatableText("bonusPopup.featureComplete", 16, GameFonts.BonusEndStyleCongrats)
        this.featureText.style.fontSize = 80;
        this.featureText.y = 300;
        this.featureText.anchor.set(0.5, 0.5);

        this.noWinText = new TranslatableText("bonusPopup.noWin", 10, GameFonts.BonusEndStyleWhite)
        this.noWinText.y = 500;
        this.noWinText.anchor.set(0.5, 0.5);

        this.amountText = new PIXI.Text("", GameFonts.BonusEndStyleYellow)
        this.amountText.y = 655;
        this.amountText.anchor.set(0.5, 0.5);

        Object.defineProperty(this.amountText, "winAmount", { get: this.getWinAmount, set: this.updateWinAmount });

        this.pressToContinueText = new TranslatableText("bonusPopup.pressToContinue", 35, GameFonts.BonusPressToContinueStyle)
        this.pressToContinueText.anchor.set(0.5, 0.5);
        this.pressToContinueText.y = 1025;

        this.addChild(this.youWinText, this.congratsText, this.youWinText, this.amountText, this.pressToContinueText);
        this.addChild(this.featureText, this.noWinText);

        this.interactive = false;
        this.cursor = 'pointer';
        this.on("mouseup", this.onClick);
        this.on("tap", this.onClick);
    }

    private updateWinAmount = (num: number) => {
        this.winAmount = num;
        this.amountText.text = getDisplayAmount(this.winAmount);
    }

    private getWinAmount = () => {
        return this.winAmount;
    }

    public setWinAmount(amount: number) {
        this.amountText.visible = true;
        this.winAmount = 0;

        GameMediator.emit(GameEvent.ShowController, false);

        GameSounds.playSound(SoundTypes.CounterStart)
        setTimeout(() => {
            GameSounds.playSound(SoundTypes.CounterLoop, { volume: 1, loop: true })
        }, 100);

        this.tween = gsap
            .timeline({ onComplete: this.counterStopped })
            .to(this.amountText, { duration: 3, winAmount: amount })
    }


    public counterStopped = () => {
        this.showPressToContinueText();
        GameSounds.stopSound(SoundTypes.CounterLoop);
        GameSounds.playSound(SoundTypes.CounterEnd);
    }

    public showPressToContinueText = () => {
        gsap.to(this.pressToContinueText, { duration: 0.2, alpha: 1 })
    }

    public animationCompleted = () => {
        this.interactive = true
        this.bgSpine.state.timeScale = 0.5;
        this.bgSpine.state.setAnimation(0, AnimationName.PopupLoop, true);
    }

    private onClick = () => {
        if (this.tween && this.tween.isActive()) {
            this.tween.kill()
            this.tween.clear();
            this.updateWinAmount(this.totalWin)
            this.showPressToContinueText()
            GameSounds.stopSound(SoundTypes.CounterLoop);
            GameSounds.playSound(SoundTypes.CounterEnd);
            return;
        }

        this.endFreeSpins()
    }
    private endFreeSpins = () => {

        this.visible = false;
        this.interactive = false;
        this.cacheAsBitmap = true;
        GameMediator.emit(GameEvent.StateChange, GameType.Normal);
        GameMediator.emit(GameEvent.WinComplete);
        GameMediator.emit(GameEvent.ShowController, true);
        GameMediator.emit(PopupEvents.Show, { showOverlay: false, showPopup: false } as ShowPopupInfo);
        GameMediator.emit(GameEvent.FreeSpinsCountChange, { count: 0, isBaseGame: true })
    }

    public showPopup(amount: number) {
        this.totalWin = amount;
        this.visible = true;
        this.cacheAsBitmap = false;
        this.amountText.visible = true;

        this.congratsText.visible = false;
        this.youWinText.visible = false;
        this.featureText.visible = false;
        this.noWinText.visible = false;

        this.pressToContinueText.alpha = 0;
        this.bgSpine.state.timeScale = 0.5
        this.bgSpine.state.setAnimation(0, AnimationName.PopUp, false);

        GameSounds.playSound(SoundTypes.FreeSpinsEnd)

        setTimeout(() => {
            this.animationCompleted();
        }, 1000)

        if (amount > 0) {
            this.setWinAmount(amount)
            this.congratsText.style.fontSize = 100;
            this.congratsText.visible = true;
            this.youWinText.visible = true;

        } else {
            this.featureText.style.fontSize = 90;
            this.featureText.visible = true
            this.noWinText.visible = true
            setTimeout(() => {
                this.showPressToContinueText();
            }, 1000)

            gsap.to(this.pressToContinueText, { duration: 0.2, alpha: 1 })
        }
    }
}