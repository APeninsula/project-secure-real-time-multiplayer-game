import {
  CanvasBounds,
  CollectibleCoinSettings,
  PlayerAvatarSettings,
} from "./utils/config.mjs";
import { loadGameSprite } from "./utils/GameUtils.mjs";

class Player {
  constructor({ x, y, score = 0, id, isMainPlayer = false }) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
    this.speed = 5;
    this.isBoosting = false;
    this.isMainPlayer = isMainPlayer;
    this.movementDirections = {};
  }

  movePlayer(dir, speed) {
    speed = this.isBoosting ? speed * 2 : speed;
    var diff;
    switch (dir) {
      case "up":
        diff = this.y - speed;
        this.y = diff < CanvasBounds.gameMinY ? CanvasBounds.gameMinY : diff;
        break;
      case "down":
        diff = this.y + speed;
        this.y = diff > CanvasBounds.gameMaxY ? CanvasBounds.gameMaxY : diff;
        break;
      case "left":
        diff = this.x - speed;
        this.x = diff < CanvasBounds.gameMinX ? CanvasBounds.gameMinX : diff;
        break;
      case "right":
        diff = this.x + speed;
        this.x = diff > CanvasBounds.gameMaxX ? CanvasBounds.gameMaxX : diff;
        break;
      default:
        console.error("Invald player movement command");
        break;
    }
  }

  moveDirection(direction) {
    if (direction === "shift") {
      this.isBoosting = true;
    } else {
      this.movementDirections[direction] = true;
    }
  }
  stopDirection(direction) {
    if (direction === "shift") {
      this.isBoosting = false;
    } else {
      this.movementDirections[direction] = false;
    }
  }

  // Need to add a Draw function
  draw(context, coins, activePlayers) {
    // Since directions are being stored as an Object with key = Direction, value = boolean
    // We need to isolate the filter the directions we have by isolating the keys and using Array.filter
    const directions = Object.keys(this.movementDirections).filter(
      (direction) => this.movementDirections[direction]
    );
    // Move the player
    directions.forEach((direction) => this.movePlayer(direction, this.speed));

    // draw the player as Main Player sprite or Other Player sprite.
    if (this.isMainPlayer) {
      context.font = `11px 'Press Start 2P'`;
      context.fillText(this.calculateRank(activePlayers), 560, 32.8);
      // Originally wanted to draw the rank in the main game.mjs file but this isn't much of a bleed in responsibility
      context.drawImage(
        loadGameSprite(PlayerAvatarSettings.mainPlayerSpriteURL),
        this.x,
        this.y
      );
    } else {
      context.drawImage(
        loadGameSprite(PlayerAvatarSettings.otherPlayerSpriteURL),
        this.x,
        this.y
      );
    }

    coins = coins.map((coin) => {
      if (this.collision(coin)) {
        coin.collected = this.id;
      }
      return coin;
    });
  }
  collision(item) {
    // wowee i love collision logic
    // logic from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection

    const adjustedPlayerX = this.x + PlayerAvatarSettings.width;
    const adjustedPlayerY = this.y + PlayerAvatarSettings.height;
    const adjustedIemX = item.x + CollectibleCoinSettings.width;
    const adjustedItemY = item.y + CollectibleCoinSettings.height;

    return (
      this.x < adjustedIemX &&
      adjustedPlayerX > item.x &&
      this.y < adjustedItemY &&
      adjustedPlayerY > item.y
    );
  }

  calculateRank(activePlayers) {
    try {
      // Sort players by Highest Score to Lowest Score
      const sortedScores = activePlayers.sort(
        (playerA, playerB) => playerB.score - playerA.score
      );
      // If the Player doesn't have any points, they are in last place. Otherwise, find where they are in the rankings via matching the ID
      const thisPlayerRank =
        this.score === 0
          ? activePlayers.length
          : sortedScores.findIndex((player) => player.id === this.id) + 1; //Add 1 to offset 0 index
      return `Rank: ${thisPlayerRank} / ${activePlayers.length}`;
    } catch (error) {
      console.error(error);
    }
  }
}

export default Player;
