import { ReelSymbol } from './ReelSymbol';
import Config from './ReelsConfig'
import { ReelType } from '../types/enums';
import { Container } from 'pixi.js';

export class GameReel extends Container {

    private reelId: number;
    private offset: number;
    private reelSymbols: ReelSymbol[] = [];
    public isNearMiss: boolean = false;
    public containsScatter: boolean = false;
    private firstIndex: number = 0;

    constructor(reelId: number) {
        super();
        this.reelId = reelId;
        this.offset = 0;
        this.addDisplayObjects();
    }

    private addDisplayObjects() {
        for (var i = 0; i < Config.RowSymbolCount; i++) {
            var symbol = new ReelSymbol();
            symbol.y = Config.ReelY + (i + 1) * Config.SymbolHeight;
            symbol.setBoardPosition(this.reelId, i);
            this.reelSymbols.push(symbol);
            this.addChild(symbol);
        }
    }

    public dropWinSymbols(state: number): boolean {
        var wins = this.removeWinSymbols();

        for (var i = 0; i < Config.RowSymbolCount; i++) {
            this.reelSymbols[i].setBoardPosition(this.reelId, i);
            this.reelSymbols[i].disableWinFrame();
        }

        if (wins.length === 0) {
            return false
        }

        this.offset -= wins.length;

        if (this.offset < 0) {
            this.offset = Config.MainReelLength + this.offset;
        }

        for (let j = 0; j < wins.length; j++) {
            wins[j].y = Config.ReelCeilY + ((7 - wins.length) + j + 1) * Config.SymbolHeight;
            wins[j].setSymbol(this.getReelConfigs(state)[(this.offset + j) % Config.MainReelLength])
        }

        return true;
    }

    public removeWinSymbols(): ReelSymbol[] {
        var winSymbols = this.reelSymbols.filter(e => e.isWinSymbol());
        if (winSymbols.length < 1) {
            return winSymbols;
        }
        var otherSymbols = this.reelSymbols.filter(e => !e.isWinSymbol());
        this.reelSymbols = [...winSymbols, ...otherSymbols];

        return winSymbols;
    }

    public disableWinFrameToSymbolsWithAlpha(): void {
        for (var i = 0; i < Config.RowSymbolCount; i++) {
            this.reelSymbols[i].disableWinFrame();
            this.reelSymbols[i].alpha = 0.2;
        }
    }

    public animateWinSymbols(): void {
        for (var i = 0; i < Config.RowSymbolCount; i++) {
            this.reelSymbols[i].setWinAnimation();
        }
    }

    public setWinFrameToSymbol(index: number, showWinText: boolean, winAmountText: number) {
        this.reelSymbols[index].setWinFrame(showWinText, winAmountText);
    }

    public disableWinFrameToSymbols() {
        for (var i = 0; i < Config.RowSymbolCount; i++) {
            this.reelSymbols[i].disableWinFrame();
            this.reelSymbols[i].alpha = 1;
        }
    }

    public showBonusWinAnimations() {
        for (var i = 0; i < Config.RowSymbolCount; i++) {
            this.reelSymbols[i].showBonusSymbolAnimation();
        }
    }

    public showBonusIdleAnimations() {
        for (var i = 0; i < Config.RowSymbolCount; i++) {
            this.reelSymbols[i].showBonusIdleAnimation();
        }
    }

    public removeBonusIdleAnimations() {
        for (var i = 0; i < Config.RowSymbolCount; i++) {
            this.reelSymbols[i].removeBonusIdleAnimation();
        }
    }

    public setupState(offset: number, reelsConfig: number, isNearMiss: boolean, firstIndex: number): number {
        this.offset = offset;
        this.isNearMiss = isNearMiss;
        this.firstIndex = firstIndex;

        let bonusCounter = 0;
        this.containsScatter = false;
        for (var i = 0; i < Config.RowSymbolCount; i++) {
            let symbol = this.getReelConfigs(reelsConfig)[(this.offset + i) % Config.MainReelLength];
            this.reelSymbols[i].setSymbol(symbol);

            if (symbol === Config.BonusSymbolId) {
                bonusCounter++;
                this.containsScatter = true;
            }
        }

        return bonusCounter;
    }

    public clearBoard() {
        setTimeout(() => {
            for (var i = 0; i < this.reelSymbols.length; i++) {
                this.reelSymbols[i].gsapClearBoard()
            }
        }, this.reelId * Config.ReelClearDelay);
    }

    public finishSpin() {
        let dropDelay = this.reelId * Config.ReelDropDelay;

        if (this.isNearMiss) {
            dropDelay += (this.reelId - this.firstIndex) * Config.NearMissReelDelay;
        }

        for (var i = 0; i < this.reelSymbols.length; i++) {
            this.reelSymbols[i].gsapDrop(this.isNearMiss, i, dropDelay / 1000);
        }
    }

    public fillSpin() {

        for (var i = 0; i < this.reelSymbols.length; i++) {
            this.reelSymbols[i].gsapWin();
        }
    }

    private getReelConfigs(state: number): number[] {
        if (state === ReelType.Extra) {
            return Config.BonusReelSet[this.reelId]
        }

        return Config.MainReelSet[this.reelId]
    }
}