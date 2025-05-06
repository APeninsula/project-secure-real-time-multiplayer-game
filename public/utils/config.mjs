
export const GameSettings = {
  maximumCoins: 5,
  minimumCoins: 1,
};

//Credit to freeCodeCamp for the art assets
// May need to download the assests and have them as a saved file
export const CollectibleCoinSettings = {
  bronzeCoinSpriteURL:
    "https://cdn.freecodecamp.org/demo-projects/images/bronze-coin.png",
  silverCoinSpriteURL:
    "https://cdn.freecodecamp.org/demo-projects/images/silver-coin.png",
  goldCoinSpriteURL:
    "https://cdn.freecodecamp.org/demo-projects/images/gold-coin.png",
  height: 15,
  width: 15,
};

//Credit to freeCodeCamp for the art assets
export const PlayerAvatarSettings = {
  mainPlayerSpriteURL:
    "https://cdn.freecodecamp.org/demo-projects/images/main-player.png",
  otherPlayerSpriteURL:
    "https://cdn.freecodecamp.org/demo-projects/images/other-player.png",
  width: 30,
  //   why 28 height? vibes.
  height: 28,
};

const canvasWidth = 640;
const canvasHeight = 480;
const canvasBorder = 5;
const infoBar = 45;

export const CanvasBounds = {
  gameMaxX: canvasWidth - PlayerAvatarSettings.width - canvasBorder,
  gameMaxY: canvasHeight - PlayerAvatarSettings.height - canvasBorder,
  border: canvasBorder,
  gameMinX: canvasBorder,
  gameMinY: infoBar + canvasBorder,
  gameWidth: canvasWidth - canvasBorder * 2,
  gameHeight: canvasHeight - infoBar - canvasBorder * 2,
};

export const ControlKeySettings = function (keyEvent) {
  if (keyEvent.keyCode === 87 || keyEvent.keyCode === 38) return "up";
  if (keyEvent.keyCode === 83 || keyEvent.keyCode === 40) return "down";
  if (keyEvent.keyCode === 65 || keyEvent.keyCode === 37) return "left";
  if (keyEvent.keyCode === 68 || keyEvent.keyCode === 39) return "right";
  if (keyEvent.keyCode === 16) return "shift";
};
