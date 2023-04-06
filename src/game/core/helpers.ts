import { Resources } from "../../core/GameResources";

export function shouldDisplayCurrency(){
    return true;
}

export function getCurrency(){
   return "$";
}

export function getStaticTexture(key:string){
    return Resources.images.statics.textures![key+'.png'];
}

export function getDisplayAmount(amount:number){
return getCurrency()+amount;
}

export function translate(text:string){
return text;
}

export function getSpineData(key:string){
    return Resources.images[key].spineData!;
}