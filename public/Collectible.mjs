import { CollectibleCoinSettings } from "./utils/config.mjs";
import { loadGameSprite } from "./utils/GameUtils.mjs";

class Collectible {
  constructor({ x, y, value = 1, id }) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.collected = null;
  }

  draw(context) {
    switch (this.value) {
      case 1:
        context.drawImage(
          loadGameSprite(CollectibleCoinSettings.bronzeCoinSpriteURL),
          this.x,
          this.y
        );
        break;
      case 2:
        context.drawImage(
          loadGameSprite(CollectibleCoinSettings.silverCoinSpriteURL),
          this.x,
          this.y
        );
        break;
      default:
        context.drawImage(
          loadGameSprite(CollectibleCoinSettings.goldCoinSpriteURL),
          this.x,
          this.y
        );
        break;
    }
  }
}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch (e) {}

export default Collectible;
