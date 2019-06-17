const inquirer = require("inquirer")
const Robot = require("./robot.js");
const game = new Robot();
async function enterGame() {
    const values = await game.init(false);
    const toStart = await inquirer.prompt([
        {
            type: "confirm",
            name: "start",
            message: "Start game with the values?"
        }
    ])
    if (toStart.start)
        game.start();
}
enterGame()