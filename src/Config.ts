 const GameConfig = {
    gameID: 25012,
    maxBet: 100,
    defaultBet: 1,
    betSelection: [{ betStep: 1, threshold: 10 }, { betStep: 5, threshold: 50 }, { betStep: 10 }],
    gameType: 'cascadeSlot',
    gameTitle: "Fruit Bloxx",
    gameCycle:1000,
    sound : true,
    omitSounds: false,
    baseURL : '',
    gameUrl:"ws://localhost:5087?token=1234"
  };

  export default GameConfig;