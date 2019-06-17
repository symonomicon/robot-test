const inquirer = require("inquirer");

class Robot {
    constructor () {
        this.x = 0;
        this.y = 0;
        this.facing = "North"
        this.facingValue = 0;
        this.compass = ["North", "East", "South", "West"]

        this.fvMax = this.compass.length - 1;
        this.xMax = 4;
        this.yMax = 4;
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
            if (input > self.xMax || input < 0)
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
            this.mathOp.sub("facingValue", this.fvMax, true);
        } else {
            this.mathOp.add("facingValue", this.fvMax, true);
        }
        this.facing = this.compass[this.facingValue];
    }
    move () {
        switch (this.facingValue) {
            case 0:
                this.mathOp.add("y", this.yMax, false);
                break;
            case 1:
                this.mathOp.add("x", this.xMax, false);
                break;
            case 2:
                this.mathOp.sub("y", this.yMax, false);
                break;
            case 3:
                this.mathOp.sub("x", this.xMax, false);
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
    get mathOp () {
        const self = this
        return {
            add: (item, limit, isReset) => {
                self[item] = (self[item] + 1) > limit ? (isReset ? 0 : self[item]) : self[item] + 1;
            },
            sub: (item, limit, isReset) => {
                self[item] = (self[item] - 1) < 0 ? (isReset ? limit : self[item]) : self[item] - 1;
            }
        }
    }
}

const game = new Robot();
game.init()