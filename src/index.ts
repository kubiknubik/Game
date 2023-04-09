import { MainGame } from './MainGame';
import { GameLoader } from './core/GameLoader';

 document.body.onload = function(){

  const game = new MainGame();
  const loader = new GameLoader();
  loader.loadAssets();
 }
 