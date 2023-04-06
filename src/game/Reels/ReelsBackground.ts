import { Spine } from "pixi-spine";
import { Container } from "pixi.js";
import { getSpineData } from "../core/helpers";
import { AnimationName, GameType } from "../types/enums";

export class ReelsBackground extends Container {
    private bgSpine!: Spine;

    constructor() {
        super();

        this.drawBackground();
    }

    private drawBackground() {
        this.bgSpine = new Spine(getSpineData("background"));
        this.bgSpine.x = 462
        this.bgSpine.y = 567
    }

    public setupState(state: GameType) {
        if (state === GameType.Bonus) {
            this.bgSpine.state.setAnimation(0, AnimationName.BonusFrame, true)
        } else {
            this.bgSpine.state.setAnimation(0, AnimationName.BaseFrame, true)
        }
        this.addChild(this.bgSpine);
    }
}