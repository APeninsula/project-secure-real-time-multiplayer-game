import { ControlKeySettings } from "./utils/config.mjs";

const controls = function (player, socket) {
  document.onkeydown = (e) => {
    var direction = ControlKeySettings(e);

    if (direction) {
      player.moveDirection(direction);
      socket.emit("player-moved", direction, { x: player.x, y: player.y });
    }
  };

  document.onkeyup = (e) => {
    var direction = ControlKeySettings(e);

    if (direction) {
      player.stopDirection(direction);
      socket.emit("player-stopped", direction, { x: player.x, y: player.y });
    }
  };
};

export default controls;
