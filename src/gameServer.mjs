import { GameSettings } from "../public/utils/config.mjs";
import { generateCoin, randomMinMax } from "../public/utils/GameUtils.mjs";
import Player from "../public/Player.mjs";

var activePlayers = [];
var coins = [];

const generateRandomAmountOfCoins = function () {
  const freshCoins = [];
  const coinCreationCount = randomMinMax(
    GameSettings.minimumCoins,
    GameSettings.maximumCoins
  );
  for (let i = 0; i < coinCreationCount; i++) {
    freshCoins.push(generateCoin());
  }
  return freshCoins;
};

const gameServer = function (io) {
  io.on("connection", async (socket) => {
    console.log("A User Has Connected", socket.id);
    coins = coins.length === 0 ? generateRandomAmountOfCoins() : coins;
    socket.emit("init-client", {
      coins,
      players: activePlayers,
      id: socket.id,
    });

    const coinGeneratorInterval = function () {
      if (coins.length < GameSettings.maximumCoins) {
        // Make a list of coins. We want the different of the amount of coins generated to the amount of maximum coins we can have
        // Then, we splice the coins generated so we do not add more coins than the max coins setting
        const newCoins = generateRandomAmountOfCoins();
        const diffToMaxCoins = GameSettings.maximumCoins - coins.length;
        newCoins.splice(diffToMaxCoins);
        coins = coins.concat(newCoins);
        io.emit("coins-updated", coins);
      } else {
        return;
      }
    };
    coinGeneratorInterval();

    socket.on("disconnect", () => {
      console.log("A User Has Disconnected", socket.id);
      io.emit("player-left", socket.id);
      activePlayers = activePlayers.filter((player) => player.id !== socket.id);
    });

    socket.on("player-joined", (newPlayer) => {
      // flatten list of current players into IDs
      const playerIDs = activePlayers.map((player) => player.id);
      newPlayer.isMainPlayer = false;
      // Only add a new player if they aren't already in the player list
      if (!playerIDs.includes(newPlayer.id)) {
        activePlayers.push(new Player(newPlayer));
      }
      // broadcast new player to all other players connected
      socket.broadcast.emit("player-joined", newPlayer);
    });

    socket.on("player-moved", (direction, position) => {
      const movingPlayer = activePlayers.find(
        (player) => player.id === socket.id
      );
      movingPlayer.x = position.x;
      movingPlayer.y = position.y;
      socket.broadcast.emit("player-moved", {
        id: socket.id,
        direction: direction,
        position: position,
      });
    });

    socket.on("player-stopped", (direction, position) => {
      const stoppingPlayer = activePlayers.find(
        (player) => player.id === socket.id
      );
      stoppingPlayer.x = position.x;
      stoppingPlayer.y = position.y;
      socket.broadcast.emit("player-stopped", {
        id: socket.id,
        direction: direction,
        position: position,
      });
    });

    socket.on("item-collected", ({ playerId, coinValue, coinId }) => {
      console.log(playerId);
      // Update score for player server-side
      const scoringPlayer= activePlayers.find(
        (player) => player.id === playerId
      );
      scoringPlayer.score += coinValue;
      // Make sure the score isn't counted twice, and that the coin ID is for a coin that is acknowledged
      // if the length of the coins filtering out the collected coin is the same, don't do anything and something went wrong, probably
      const unCollectedCoins = coins.filter((coin) => coin.id !== coinId);
      if (coins.length > unCollectedCoins.length) {
        io.emit("player-scored", ({scoringId: playerId, coinValue: coinValue}));
        coins = unCollectedCoins;

        if (coins.length > GameSettings.minimumCoins) {
          const time = randomMinMax(1, 10) * 500;
          setTimeout(coinGeneratorInterval, time);
          io.emit("coins-updated", coins);
        } else {
          const newCoin = generateCoin();
          coins.push(newCoin);
          io.emit("coins-updated", coins);
        }
      }
    });
  });
};

export default gameServer;

