export enum GameType {
  Normal = 1,
  Bonus = 2,
  FreeSpins = 3
}

export enum ReelType{
  Main=0,
  Extra = 1
}

export enum BigWinType {
  Normal = 0,
  Big,
  Mega,
  Epic
}

export enum AnimationType {
  Clear = 1,
  Drop = 2,
  Win = 3
}

export enum ActionType {
  Initial = -1,
  Reconnect = -2
}

export enum PopupType {
  BigWin = 0,
  FreeSpinStart,
  FreeSpinEnd
}

export enum AnimationName {
  Intro = "Intro",
  BaseFrame = "base frame",
  BonusFrame = "bonus frame",

  LogoIdle = "logo idle",
  LogoWin = "logo win",

  BonusLogoIdle = "bonus logo idle 5",
  BonusLogoIdle2 = "bonus logo idle 6",
  BonusLogoIdle3 = "bonus logo idle 5",
  BonusLogoIdle4 = "bonus logo idle 6",

  multiplierX1 = "multiplier x1",
  multiplierX2 = "multiplier x2",
  multiplierX3 = "multiplier x3",
  multiplierX5 = "multiplier x5",
  multiplier1X2 = "multiplier 2 x2",
  multiplier1X4 = "multiplier 2 x4",
  multiplier1X6 = "multiplier 2 x6",
  multiplier1X10 = "multiplier 2 x10",

  bigWin = "big win",
  megaWin = "mega win",
  epicWin = "epic win",

  BonusLanding = "bonus landing 3",
  BonusNearMissIdle = "bonus near miss idle",
  BonusWin = "bonus win 5",

  ReelLightIn = "Light_in",
  ReelLightOut = "Light_out",
  ReelLightLoop = "Light_loop",

  PopUp ="Pop_up",
  PopupLoop = "Pop_up_loop",

  FreeSpinsLoop = "free spins loop",
}

export enum SoundTypes {
  FreeSpinsEnd ="free_spin_end_popup",
  StartSpin = "start_spin",
  ScatterLand = "scatter_land_",  
  Music = "music",
  BonusMusic = "music_bonus",
  WinLine = "winline_",
  WinLineExplode = "winline_explode_",
  WinLineCharging = "winline_charging",
  InstantWin = "instant_win",
  BigWin = "big_win",
  NearMiss = "near_miss",
  ReelStart ="reel_start",
  ReelStop = "reel_stop",
  ScatterActivation = "scatter_activation",
  FreeSpinStart = "freespin_start_popup",
  CounterStart = "counter_start",
  CounterLoop = "counter_loop",
  CounterEnd = "counter_stop",
  SymbolLand = "symbol_land",
  NearMissEmptyDrop = "near_miss_drop",
  UIButton = "ui_button",
  ExtraSpins = "extra_spins",
  Intro = "intro"
}