const {GameMode, Player, Group, Keys, Vehicle} = require("@sa-mp/core");

GameMode.on("init", () => {
    console.log("[Mode] Init!");
});

const pInfo = [];

Player.on("connect", (player) => {
    pInfo[player.id] = {vehicles: new Group};
    player.send(`Hello, ${player}!`);
});

Player.on("disconnect", (player) => {
    pInfo[player.id].vehicles.destroy();
    delete pInfo[player.id];
});

Player.key.init();
Player.key(Keys.NO, (player) => {
    pInfo[player.id].vehicles.destroy();
});

Player.command.init();
Player.command.desc("veh", "Create vehicle");
Player.command("veh", [["i", "model"], ["i", "color1"], ["i", "color2"]], (player, model, color1, color2) => {
    const {x, y, z} = player.pos;
    const rotation = player.angle;
    const vehicle = Vehicle.create({x, y, z, model, colors: [color1, color2], rotation});
    if(player.isInAnyVehicle())
        player.vehicle.destroy();
    player.put(vehicle);
    pInfo[player.id].vehicles.push(vehicle);
});