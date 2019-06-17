const inquirer = require("inquirer");

class Robot {
    constructor () {
        this.x = 0;
        this.y = 0;
        this.facing = "North"
        this.facingValue = 0;
        this.compass = ["North", "East", "South", "West"]
    }
    async init () {
        console.log(`
        Lets start by getting the initial data we need to play,
        the X and Y coordinates together with where you bot would face.

        NOTE: X/Y coordinate should be somewhere between 0-4 only.
        `);

        const self = this;
        const coordValidator = (input) => {
            if (isNaN(input)) 
                return "Invalid input, please type a number";
            if (input > 4 || input < 0)
                return "Exceeds playable area, select something between 0-4";
            return true;
        }
        const initQuestions = [
            {
                type: "number",
                name: "x",
                message: "Input X coordinate\n",
                validate: (input) => {
                    return coordValidator(input);
                }
            },
            {
                type: "number",
                name: "y",
                message: "Input Y coordinate\n",
                validate: (input) => {
                    return coordValidator(input);
                }
            },
            {
                type: "list",
                name: "facing",
                message: "Facing where?\n",
                choices: self.compass,
            },
        ];

        const answers = await inquirer.prompt(initQuestions);

        Object.assign(self, answers);
        self.facingValue = self.compass.indexOf(answers.facing);

        self.report();
        console.log(`Now lets start, choices would be as follows: ${self.help}`)
        setTimeout(() => self.start(), 2500) // Take time to read
    }
    async start () {
        const self = this;
        const operationChoices = ["MOVE", "LEFT", "RIGHT", "REPORT", "HELP", "QUIT"];
        const tactics = [
            {
                type: "list",
                name: "operation",
                message: "Whats your next move?\n",
                choices: operationChoices,
                filter: (choice) => {
                    return operationChoices.indexOf(choice);
                }
            }
        ]
        const answers = await inquirer.prompt(tactics);
        if (answers.operation !== 5) {
            switch (answers.operation) {
                case 0: 
                    self.move();
                    break;
                case 1:
                case 2:
                    self.rotate(answers.operation);
                    break;
                case 3:
                    self.report();
                    break;
                case 4:
                    console.log(self.help);
            }
            setTimeout(() => self.start(), 750);
        }
    }
    rotate (d) {
        if (d%2) { // To Left
            this.facingValue = (this.facingValue - 1) < 0 ? 3 : this.facingValue - 1;
        } else {
            this.facingValue = (this.facingValue + 1) > 3 ? 0 : this.facingValue + 1;
        }
        this.facing = this.compass[this.facingValue];
    }
    move () {
        switch (this.facingValue) {
            case 0:
                this.y = (this.y + 1) > 4 ? this.y : this.y + 1;
                break;
            case 1:
                this.x = (this.x + 1) > 4 ? this.x : this.x + 1;
                break;
            case 2:
                this.y = (this.y - 1) < 0 ? this.y : this.y - 1;
                break;
            case 3:
                this.x = (this.x - 1) < 0 ? this.x : this.x - 1;
                break;
        }
    }
    report () {
        console.log(`\n\x1b[32m Your bot is at (${this.x}, ${this.y}), facing ${this.facing}. \x1b[0m`)
    }
    get help () {
        return `
            MOVE: Will move 1 step towards where your bot is facing. (eg. (1,2) facing East will move to (2, 2) still facing East),
            LEFT: Will rotate your bot 90º leftward. (eg. Currently facing West, then turn Left, will now face South),
            RIGHT: Will rotate your bot 90º rightward. (eg. Currently facing North, then turn Right, will now face East),
            REPORT: Displays the current position of your bot in the board.
            HELP: Displays readme for all the commands.
            QUIT: Leave the game :c
        `
    }
}

const game = new Robot();
game.init()