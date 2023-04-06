import { AnimationType } from "./enums"

type  ResponseData = {
    spin_results: SpinResults,
    total_win: number,
    authority_session_id: string,
    authority_ticket_id: string,
    currency: string,
    game_state: { possible_actions: string[], round_state: string },
    player: { balance: number, userid: number },
    precision: number,
    session_bet: number,
    session_id: number,
    session_start_ts: number,
    session_won: number,
    user_prefs: {}
}

type SpinResults = {
    results_ex: [{ spin_res: number[], ws: WinLine[], wild_spin?: number }]
}


type GameState = {
    bet?: number,
    winlines?: MappedWin | null;
    spinStops?: number[];
    wildSpin?: number,
    autoSpin?: boolean
    autoSpinCount?: number,
    totalWin?: number
}

type WinLine = {
    amount: number,
    payline?: number[],
    symbol?: number,
    mul?: number,
    pos?: number,
    reel?: number,
    is_jackpot?:boolean
}

type MappedWin = {
    symbols: Symbols,
    chips?: Chip[],
}

type Chip = {
    amount: number,
    mul: number,
    pos: number,
    reel: number,
    is_jackpot:boolean,
}

type Symbols = {
    [index: string]: number[][];
}
 
type PropertyObject = {
    spinResult: number | null,
    spinResults: ResponseData
    spinEnabled: boolean,
    autospin: boolean,
    numberOfAutospins: number,
    currentNumberOfSpins: number,
    sounds: number,
    showControls: boolean,
    popupInfo:ShowPopupInfo,
    actionEnableSpin: Function,
    actionSpinStart: Function,
    actionSpinStop: Function,
    actionAutoSpinStop: Function,
    actionSoundToggle: Function,
    actionBalanceUpdate: Function,
    actionShowControls: Function,
    actionFreeSpinsCount:Function
    updatePopup: Function,
    actionLowBalance:Function,
    availableActions:string[],
    isBaseGame:boolean,
    freeSpinsCount:number
}

type SymbolState =
{
   reelId?: number,
   colIndex?: number,
   isWinSymbol: boolean,
   symbolId?: number,
   event?: AnimationType,
   canBeAnimated?:boolean;
}

type SymbolData =
{
  reelId?: number,
  colIndex?: number,
  event?: AnimationType
}

type PopupInfo={
 type:number,
 data?:any
}

type PopupState={
    show?:boolean,
    showOverlay?:boolean,
    gameScale:number, 
    gameHeight:number,
    screenRatio:number
}

type ShowPopupInfo={
  showPopup: boolean,
  showOverlay:boolean,
  showController:boolean
}