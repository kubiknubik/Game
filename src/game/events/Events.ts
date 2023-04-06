export enum GameEvent {
    SpinStop = "SpinStop",
    SymbolStop = "SymbolStop",
    DropStop = "DropStop",
    FillStop = "FillStop",
    ReelsCleared = "ReelsCleared",
    SpinCompleted = "SpinCompleted",
    WinComplete = "WinComplete",
    IntroComplete = "IntroComplete",
    WinSymbolsShow = "WinSymbols",
    StateChange = "StateChange",
    WinAnimationCompleted = "WinAnimationCompleted",
    FreeSpinsStart = "FreeSpinsStart",
    ShowPopup ="ShowPopup",
    ShowController="ShowController",
    AdditionalFreeSpins = "AdditionalFreeSpins",
    ScatterLand = "ScatterLand",
    FreeSpinsCountChange = "FreeSpinsCountChange"
}

export enum ControllerEvent {
    Spin = "spin",
    AutoSpin = "autoSpin",
    StopAutoSpin = "stopAutoSpin",
}

export enum ReelEvent {
    ReelPreLoop = "ReelPreLoop",
    ReelPreStop = "ReelPreStop",
    ReelStop = "ReelStop",
}

export enum PopupEvents{
    Show = "Show",
    Hide = "Hide"
}
