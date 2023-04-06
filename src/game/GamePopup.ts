import { Container } from "pixi.js";
import { GameEvent, PopupEvents } from "./events/Events";
import { GameMediator } from "./mediator/Mediator";
import { BigWinPopup } from "./popups/BigWinPopup";
import { BonusGameEndPopup } from "./popups/BonusGameEndPopup";
import { BonusGamePopup } from "./popups/BonusGamePopup";
import { PopupType } from "./types/enums";
import { PopupInfo, ShowPopupInfo } from "./types/GameTypes";

export default class GamePopup extends Container {

    private winPopup!: BigWinPopup;
    private bonusGamePopup!: BonusGamePopup;
    private bonusGameFinishPopup!: BonusGameEndPopup;

    constructor(stage: Container) {
        super();

        stage.addChild(this);

        this.addDisplayObjects();
        GameMediator.on(GameEvent.ShowPopup, this.showPupup)
    }

    private addDisplayObjects() {
        this.winPopup = new BigWinPopup();
        this.winPopup.y = 300
        this.winPopup.visible = false;
        this.addChild(this.winPopup);

        this.bonusGamePopup = new BonusGamePopup();
        this.bonusGamePopup.x = 530;
        this.bonusGamePopup.y = 190;
        this.bonusGamePopup.visible = false;
        this.addChild(this.bonusGamePopup);

        this.bonusGameFinishPopup = new BonusGameEndPopup();
        this.bonusGameFinishPopup.x = 535;
        this.bonusGameFinishPopup.y = 300;
        this.bonusGameFinishPopup.visible = false;
        this.addChild(this.bonusGameFinishPopup);
    }

    private showPupup = (evt: PopupInfo) => {
        if (evt.type === PopupType.BigWin) {
            this.winPopup.setWin(evt.data.amount, evt.data.bet);
        } else if (evt.type === PopupType.FreeSpinStart) {
            GameMediator.emit(GameEvent.ShowController, false);
            GameMediator.emit(PopupEvents.Show, { showController: false, showOverlay: true, showPopup: true } as ShowPopupInfo);
            this.bonusGamePopup.setFreeSpinCount(evt.data.count);
        } else {
            this.bonusGameFinishPopup.showPopup(evt.data.amount);
            GameMediator.emit(PopupEvents.Show, { showController: false, showOverlay: true, showPopup: true } as ShowPopupInfo);
        }
    }
}