import * as PIXI from "pixi.js";
import GameFonts from "../core/Fonts";
import gsap from "gsap";
import { getDisplayAmount} from "../core/helpers";
import { Container } from "pixi.js";
import { getStaticTexture } from "../core/helpers";

export class WinFrame extends Container {
  private amountBG1: PIXI.Sprite;
  private amountBG2: PIXI.Sprite;
  private amountBG3: PIXI.Sprite;
  private amountText: PIXI.Text;
  public winAmount: number = 0;
  private centerBGWidth = 122;
  private minCharCount = 7;
  private maxCharCount = 15;
  private tween!: gsap.core.Tween;

  constructor() {
    super();

    this.amountBG1 = new PIXI.Sprite(getStaticTexture('win_display1'));
    this.amountBG1.anchor.set(1, 0.5);

    this.amountBG2 = new PIXI.Sprite(getStaticTexture('win_display2'));
    this.amountBG2.anchor.set(0.5, 0.5);

    this.amountBG3 = new PIXI.Sprite(getStaticTexture('win_display3'));
    this.amountBG3.anchor.set(0, 0.5);

    this.amountText = new PIXI.Text('', GameFonts.WinAmountFont)
    this.amountText.anchor.set(0.5, 0.5);
    Object.defineProperty(this.amountText, "winAmount", { get: this.getWinAmount, set: this.updateWinAmount });

    this.addChild(this.amountBG2, this.amountBG1, this.amountBG3);
    this.addChild(this.amountText);
  }

  public setWinAmount(winAmount: number, animDuration: number) {
    this.winAmount = 0;
    this.tween = gsap.to(this.amountText, { duration: animDuration, winAmount: winAmount })
  }

  private setBackground(scale: number) {
    this.amountBG2.scale.x = scale;

    var pos = this.centerBGWidth * scale
    this.amountBG1.x = -pos;
    this.amountBG3.x = pos;
  }

  private getBGScale(charCount: number) {
    if (charCount < this.minCharCount) {
      return 1;
    }

    return 2 * charCount / this.maxCharCount;
  }

  private updateWinAmount = (num: number) => {
    this.winAmount = num;
    this.amountText.text = getDisplayAmount(this.winAmount);
    this.setBackground(this.getBGScale(this.amountText.text.length))
  }

  private getWinAmount = () => {
    return this.winAmount;
  }

  public setFinalWin = (winAmount: number) => {
    if (this.tween.isActive()) {
      this.tween.kill();
    }

    this.updateWinAmount(winAmount);
  }
}