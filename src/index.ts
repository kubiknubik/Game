import { GameLoader } from './core/GameLoader';

 document.body.onload = function(){
  const loader = new GameLoader();
  loader.loadAssets();
 }
 