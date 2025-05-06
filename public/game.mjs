import Player from "./Player.mjs";
import Collectible from "./Collectible.mjs";
import { randomMinMax } from "./utils/GameUtils.mjs";
import { CanvasBounds } from "./utils/config.mjs";
import controls from "./controls.mjs";

const socket = io();
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d");

var activeItems = [];
var activePlayers = [];
var tick;
var isGameOver = false;

socket.on("init-client", ({ id, players, coins }) => {
  console.log(`Connected ${id}`);

  cancelAnimationFrame(tick);

  const mainPlayer = new Player({
    x: randomMinMax(CanvasBounds.gameMinX, CanvasBounds.gameMaxX),
    y: randomMinMax(CanvasBounds.gameMinY, CanvasBounds.gameMaxY),
    id: socket.id,
    isMainPlayer: true,
  });

  controls(mainPlayer, socket);

  // Have socket emit the event without adding the player to the current list so achieve synchronization
  socket.emit("player-joined", mainPlayer);

  socket.on("player-joined", (player) => {
    // flatten list of current players into IDs
    const playerIDs = activePlayers.map((player) => player.id);
    // Only add a new player if they aren't already in the player list
    if (!playerIDs.includes(player.id)) {
      activePlayers.push(new Player(player));
    }
  });

  socket.on("player-moved", ({ id, direction, position }) => {
    const movingPlayer = activePlayers.find((player) => player.id === id);
    // Update movement of player
    movingPlayer.moveDirection(direction);

    movingPlayer.x = position.x;
    movingPlayer.y = position.y;
  });

  socket.on("player-stopped", ({ id, direction, position }) => {
    const stoppingPlayer = activePlayers.find((player) => player.id === id);
    // Update movement of player
    stoppingPlayer.stopDirection(direction);

    stoppingPlayer.x = position.x;
    stoppingPlayer.y = position.y;
  });

  socket.on("player-left", (playerId) => {
    console.log(`${playerId} has left.`);
    // Filter out the player that disconnected
    activePlayers = activePlayers.filter((player) => player.id !== playerId);
  });

  socket.on("player-scored", ({ scoringId, coinValue }) => {
    const scoringPlayerIndex = activePlayers.findIndex(
      (player) => player.id === scoringId
    );
    // Why target with index? Bugfixing mostly and I am spiteful of the code that caused me 80 minutes of pain >:(
    activePlayers[scoringPlayerIndex].score += coinValue;

  });

  socket.on("coins-updated", (updatedCoins) => {
    activeItems = updatedCoins.map((item) => new Collectible(item));
  });

  activePlayers = players
    .map((player) => new Player(player))
    .concat(mainPlayer);
  activeItems = coins.map((item) => new Collectible(item));
  drawGame();
});

const drawGame = function () {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "purple";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "lavender";
  context.strokeRect(
    CanvasBounds.gameMinX,
    CanvasBounds.gameMinY,
    CanvasBounds.gameWidth,
    CanvasBounds.gameHeight
  );
  context.fillStyle = "lavender";
  context.font = `11px 'Press Start 2P'`;
  context.textAlign = "center";
  context.fillText("Controls: WASD / Arrows. SHIFT to boost", 225, 32.8);

  activePlayers.forEach((player) => {
    player.draw(context, activeItems, activePlayers);
  });

  let collectedItem = null;
  activeItems.forEach((item) => {
    item.draw(context);
    if (item.collected) {
      collectedItem = item;
    } else {
      return;
    }
  });
  if (collectedItem) {
    socket.emit("item-collected", {
      playerId: collectedItem.collected,
      coinValue: collectedItem.value,
      coinId: collectedItem.id,
    });
  }
  // may create some gameover logic later

  if (!isGameOver) tick = requestAnimationFrame(drawGame);
};
