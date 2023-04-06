import * as PIXI from "pixi.js";

export default class GameFonts {
  static AddFreeSpinsFont: PIXI.TextStyle = new PIXI.TextStyle({
    strokeThickness: 4,
    fill: [
      "yellow",
      "#fff479"
    ],
    fontFamily: "Arista",
    fontSize: 100
  });

  static FreeSpinsFont: PIXI.TextStyle = new PIXI.TextStyle({
    strokeThickness: 4,
    fill: [
      "yellow",
      "#fff479"
    ],
    fontFamily: "Arista",
    fontSize: 100
  });

  static WinAmountFont: PIXI.TextStyle = new PIXI.TextStyle({
    strokeThickness: 4,
    fill: [
      "yellow",
      "#fff479"
    ],
    fontFamily: "Arista",
    fontSize: 100
  });

  static freeSpinsFont: PIXI.TextStyle = new PIXI.TextStyle({
    dropShadow: true,
    dropShadowAlpha: 0.9,
    dropShadowAngle: 0,
    dropShadowBlur: 8,
    dropShadowColor: 0xff8a00,
    dropShadowDistance: 0,
    fill: [
      0xffe70a,
      0xffc800
    ],
    fillGradientStops: [
      0.4
    ],
    fontFamily: "FreeSpins",
    fontSize: 50,
    letterSpacing: 2,
    lineJoin: "bevel",
    stroke: 0xe4ff14,
    strokeThickness: 3
  });

  //bonus start fonts
  static BonusStyleYellow = new PIXI.TextStyle({
    dropShadow: true,
    dropShadowAlpha: 0.9,
    dropShadowAngle: 0,
    dropShadowBlur: 8,
    dropShadowColor: 0xff8a00,
    dropShadowDistance: 0,
    fill: [
      0xffe70a,
      0xffc800
    ],
    fillGradientStops: [
      0.4
    ],
    fontFamily: "FreeSpins",
    letterSpacing: 2,
    lineJoin: "bevel",
    stroke: 0xe4ff14,
    strokeThickness: 3,
    fontSize: 180
  });

  static BonusStyleWhite = new PIXI.TextStyle({
    dropShadow: true,
    dropShadowAngle: 0,
    dropShadowBlur: 10,
    dropShadowColor: "#9c00ff",
    dropShadowDistance: 0,
    fill: "white",
    fillGradientStops: [
      0.4
    ],
    fontFamily: "Arista",
    letterSpacing: 2,
    lineJoin: "bevel",
    miterLimit: 0,
    padding: 13,
    stroke: "#f370f5",
    strokeThickness: 2,
    fontSize: 160
  });

  static BonusStyleMultiplier = new PIXI.TextStyle({
    dropShadow: true,
    dropShadowAngle: 0,
    dropShadowBlur: 10,
    dropShadowColor: "#9c00ff",
    dropShadowDistance: 0,
    fill: "white",
    fillGradientStops: [
      0.4
    ],
    fontFamily: "Arista",
    letterSpacing: 2,
    lineJoin: "bevel",
    miterLimit: 0,
    padding: 13,
    stroke: "#f370f5",
    strokeThickness: 2,
    wordWrapWidth: 788,
    fontSize: 100,
  });

  //bonus end fonts
  static BonusEndStyleYellow = new PIXI.TextStyle({
    dropShadow: true,
    dropShadowAlpha: 0.9,
    dropShadowAngle: 0,
    dropShadowBlur: 8,
    dropShadowColor: 0xff8a00,
    dropShadowDistance: 0,
    fill: [
      0xffe70a,
      0xffc800
    ],
    fillGradientStops: [
      0.4
    ],
    fontFamily: "FreeSpins",
    letterSpacing: 2,
    lineJoin: "bevel",
    stroke: 0xe4ff14,
    strokeThickness: 3,
    fontSize: 100
  });

  static BonusEndStyleWhite = new PIXI.TextStyle({
    dropShadow: true,
    dropShadowAngle: 0,
    dropShadowBlur: 10,
    dropShadowColor: "#9c00ff",
    dropShadowDistance: 0,
    fill: "white",
    fillGradientStops: [
      0.4
    ],
    fontFamily: "Arista",
    letterSpacing: 2,
    lineJoin: "bevel",
    miterLimit: 0,
    padding: 13,
    stroke: "#f370f5",
    strokeThickness: 2,
    fontSize: 95
  });

  static BonusEndStyleCongrats = new PIXI.TextStyle({
    dropShadow: true,
    dropShadowAngle: 0,
    dropShadowBlur: 10,
    dropShadowColor: "#9c00ff",
    dropShadowDistance: 0,
    fill: "white",
    fillGradientStops: [
      0.4
    ],
    fontFamily: "Arista",
    letterSpacing: 2,
    lineJoin: "bevel",
    miterLimit: 0,
    padding: 13,
    stroke: "#f370f5",
    strokeThickness: 2,
    fontSize: 100,
  });

  static BonusPressToContinueStyle = new PIXI.TextStyle({ 
    fill: "white",
    fontFamily: "FreeSpins", 
    fontSize: 35,
  });

  static SymbolTextStyle = new PIXI.TextStyle({
    strokeThickness: 4,
    fill: [
       "yellow",
       "#fff479"
    ],
    fontFamily: "Arista",
    fontSize: 40
 });
}