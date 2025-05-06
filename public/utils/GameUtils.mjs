import Collectible from "../Collectible.mjs";
import { CanvasBounds } from "./config.mjs";

export const generateId = function () {
  var retVal = "";
  const idComplexity = 3;
  crypto
    .getRandomValues(new Uint32Array(idComplexity))
    .forEach((val) => (retVal += val.toString(36)));
  return retVal;
};

export const loadGameSprite = function (src) {
  try {
    const gameSprite = new Image();
    gameSprite.src = src;
    return gameSprite;
  } catch (error) {
    console.error(error);
  }
};

export const generateCoin = function () {
  return new Collectible({
    id: generateId(),
    x: randomMinMax(CanvasBounds.gameMinX, CanvasBounds.gameMaxX), //replace with defined canvas bounds later
    y: randomMinMax(CanvasBounds.gameMinY, CanvasBounds.gameMaxY),
    value: generateItemValue(),
  });
};

const generateItemValue = function () {
  return Math.floor(Math.random() * 3) + 1;
};

export const randomMinMax = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};
