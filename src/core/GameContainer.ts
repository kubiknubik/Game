import { Container } from "pixi.js";

export class GameContainer<T> extends Container{
    private State!:T;

    constructor(state:T) {
        super();
        this.State =state;
    }
}