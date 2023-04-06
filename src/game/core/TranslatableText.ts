import * as PIXI from 'pixi.js'
import { translate } from '../core/helpers';

// TODO: something like this we should already have in common, we should use it instead
export class TranslatableText extends PIXI.Text {
  private keyword!: string;
  private normalSize!: number;
  public fontSize!: number;
  public currentFontSize!:number;

  constructor(key: string, size: number, style?: PIXI.TextStyle | any) {
    super("", style);
    this.normalSize = size;
    this.fontSize = Number(this.style.fontSize);
    this.setText(key);
  }

  setText(key: string) {
    this.keyword = key;
    this.text = translate(this.keyword);
    if (this.text.length > this.normalSize) {
      this.currentFontSize =  this.getFontSize();
      this.style.fontSize = this.getFontSize();
    }
  }

 public setDefaultText(text: string) {
    this.text = text;
    if (this.text.length > this.normalSize) {
      this.currentFontSize =  this.getFontSize();
      this.style.fontSize = this.getFontSize();
    } else {
      this.currentFontSize = this.fontSize;
      this.style.fontSize = this.fontSize;
    }
  }

  getFontSize(): number {
    let minimalFont = this.fontSize * 0.6;
    let maxSize = this.fontSize * 1;

    let fontSize = this.fontSize * (this.normalSize / this.text.length);
    if (fontSize < minimalFont) {
      return minimalFont;
    }

    if (fontSize > maxSize) {
      return maxSize;
    }

    return fontSize;
  }
}