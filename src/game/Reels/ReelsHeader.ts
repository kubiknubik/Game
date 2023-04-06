import { Spine } from "pixi-spine";
import Config from './ReelsConfig'
import { GameEvent } from "../events/Events";
import { GameMediator } from "../mediator/Mediator";
import { AnimationName, GameType } from "../types/enums";
import { Container } from "pixi.js";
import { translate,getDisplayAmount,getSpineData } from "../core/helpers";
import GameFonts from "../core/Fonts";
import { TranslatableText } from "../core/TranslatableText";

export class ReelsHeader extends Container {
    private logo!: Spine;
    private multiplierSpine!: Spine;
    private activeMultiplierIndex: number = -1;
    private state: GameType = GameType.Normal;
    private winAmountText!: TranslatableText;

    public winAmount: number = 0;
    private activeSpinCount: number = 0;
    private totalSpinCount: number = 0;

    constructor() {
        super();
        this.addDisplayObjects();
        GameMediator.on(GameEvent.WinSymbolsShow, this.onWin)
    }

    public onWin = () => {
        var mult = 0;
        mult = this.multiplierIncrease(this.activeMultiplierIndex);

        this.setupLogoAnimation();
        this.setVisibilityToMultiplier(mult, this.state);
    }

    private multiplierIncrease(mltp: number) {
        if (mltp >= 3) {
            return 3;
        }
        return mltp + 1;
    }

    public resetMultipliers = () => {
        this.setVisibilityToMultiplier(0, this.state);
    }

    private addDisplayObjects(): void {

        this.logo = new Spine(getSpineData("background")!)
        this.logo.x = 450;
        this.logo.y = 800;
        this.addChild(this.logo);

        this.winAmountText = new TranslatableText("", 13, GameFonts.freeSpinsFont);
        this.winAmountText.anchor.set(0.5);
        this.winAmountText.x = 450;
        this.winAmountText.y = 45;

        this.setUpMultipliers();
        this.addChild(this.winAmountText)
    }

    private setVisibilityToMultiplier(mult: number, state: GameType): void {
        if (state === this.state && mult === this.activeMultiplierIndex) {
            return;
        }

        if (state === GameType.Bonus) {
            this.multiplierSpine.state.setAnimation(0, Config.BonusMultipliers[mult], false)
        } else {
            this.multiplierSpine.state.setAnimation(0, Config.MainMultipliers[mult], false)
        }

        this.activeMultiplierIndex = mult;
        this.state = state;
    }

    private setUpMultipliers(): void {
        this.multiplierSpine = new Spine(getSpineData("background")!);
        this.multiplierSpine.y = 795;
        this.multiplierSpine.x = 460;
        this.addChild(this.multiplierSpine)
    }

    public setupState(state: GameType, mult: number) {
        if (state === GameType.Bonus) {
            this.logo.state.setAnimation(0, AnimationName.BonusLogoIdle, true);
            this.winAmountText.visible = true;
        } else {
            this.winAmountText.visible = false;
            this.logo.state.setAnimation(0, AnimationName.LogoIdle, true);
            this.setWin(0);
        }

        this.setVisibilityToMultiplier(mult, state);
    }

    public addWin(amount: number) {
        this.setWin(this.winAmount + amount)
    }

    public setWin(amount: number) {
        this.winAmount = amount;
        this.winAmountText.setDefaultText(translate("bonusPopup.win") + " : " + getDisplayAmount(this.winAmount))
    }

    public setupLogoAnimation() {
        if (this.state === GameType.Normal) {
            this.logo.state.addListener({
                complete: () => {
                    this.logo.state.clearListeners();
                    this.logo.state.setAnimation(0, AnimationName.LogoIdle, true);
                }
            });
            this.logo.state.setAnimation(0, AnimationName.LogoWin, false);
        } else {
            let index = Math.floor(Math.random() * Config.BonusLogoAnimations.length);
            this.logo.state.setAnimation(0, Config.BonusLogoAnimations[index], true);
        }
    }

    public showFreeSpins(total: number) {
        this.totalSpinCount = total;
        this.activeSpinCount = 0;
    }

    public addFreeSpins(count: number) {
        this.totalSpinCount += count;

        var isBaseGame = this.totalSpinCount === count;
        GameMediator.emit(GameEvent.FreeSpinsCountChange, { count: this.totalSpinCount - this.activeSpinCount, isBaseGame: isBaseGame })
    }

    public nextSpin() {
        this.activeSpinCount++;
        GameMediator.emit(GameEvent.FreeSpinsCountChange, { count: this.totalSpinCount - this.activeSpinCount, isBaseGame: false })
    }
}