import { Container } from "pixi.js";
import { GameSymbol } from "./GameSymbol";
import { GameMediator } from "../game/mediator/Mediator";
import { SymbolData } from "../game/types/GameTypes";
import gsap from "gsap";

export class CandyCrush extends Container {

    private matrix: GameSymbol[][] = [];
    private selectedSymbols: SymbolData[] = [];

    constructor() {
        super();
        this.setUpGame();
        GameMediator.on("symbol_selected", this.SymbolSelected)
    }

    private setUpGame(): void {
        for (var i = 0; i < 5; i++) {
            let reelRow = [];
            for (let j = 0; j < 5; j++) {
                let symbol = new GameSymbol()
                symbol.setSymbol(this.rand());
                symbol.x = i * 200;
                symbol.y = j * 180;
                symbol.setBoardPosition(i, j);
                reelRow.push(symbol);
                this.addChild(symbol);
            }

            this.matrix.push(reelRow);
        }
    }

    private rand(): number {
        return 1 + Math.floor((Math.random() * 10));
    }

    private SymbolSelected = (evt: SymbolData) => {
        if (this.selectedSymbols.length == 0) {
            this.selectedSymbols.push(evt);
            this.matrix[evt.reelId!][evt.colIndex!].setFrame();
            return;
        }
        this.matrix[evt.reelId!][evt.colIndex!].setFrame();
        let s1Info = this.selectedSymbols[0];

        let deltaX = s1Info.reelId! - evt.reelId!;
        let deltaY = s1Info.colIndex! - evt.colIndex!;

        if (Math.abs(deltaX * deltaY) <=1 ) {
            this.swapSymbols(s1Info, evt)
        } else {
            this.matrix[s1Info.reelId!][s1Info.colIndex!].setSymbol(s1Info.symbolId!);
            this.matrix[evt.reelId!][evt.colIndex!].interactive = false;
            this.selectedSymbols[0] = evt;
        }
    }

    private swapSymbols(s1: SymbolData, s2: SymbolData) {
        var symbol1 = this.matrix[s1.reelId!][s1.colIndex!];
        var symbol2 = this.matrix[s2.reelId!][s2.colIndex!];

        var dest1X = symbol1.x;
        var dest2X = symbol2.x;

        var dest1Y = symbol1.y;
        var dest2Y = symbol2.y;

        symbol1.swipe(dest2X, dest2Y, 0.2,s2.symbolId!);
        symbol2.swipe(dest1X, dest1Y, 0.2,s1.symbolId!);

        this.selectedSymbols = [];
    }
}