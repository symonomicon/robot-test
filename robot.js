const inquirer = require("inquirer");

module.exports = class Robot {
    constructor (x = -1, y = -1, facingValue = -1) {
        this.x = x;
        this.y = y;
        this.facing = "North"
        this.facingValue = facingValue;

        this.compass = ["North", "East", "South", "West"]
        this.fvMax = this.compass.length - 1;
        this.xMax = 4;
        this.yMax = 4;
    }
    async init (autoStart) {
        const self = this;

        let answers = null;
        if (!this.isInitialized)
            answers = await self.setValues();
        else {
            self.facing = self.compass[self.facingValue] || "North"
            answers = self.checkValues();
        }
        
        if (autoStart)
            setTimeout(() => self.start(), 2500) // Take time to read
        return answers;
    }
    async setValues () {
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
        return answers;
    }
    checkValues () {
        const self = this
        self.x = self.x > self.xMax ? self.xMax : self.x < 0 ? 0 : self.x;
        self.y = self.y > self.yMax ? self.yMax : self.y < 0 ? 0 : self.y;
        return { 
            x: self.x, 
            y: self.y, 
            facing: self.facing 
        }
    }
    async start (loop) {
        const self = this;
        self.checkValues();
        if (!loop) {
            console.log(`Now lets start, choices would be as follows: ${self.help}`)
            self.report();
        }
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
            setTimeout(() => self.start(true), 750);
        }
        return answers
    }
    rotate (d) {
        if (d%2) { // If operation is "Left"
            this.mathOp.sub("facingValue", this.fvMax, true);
        } else {
            this.mathOp.add("facingValue", this.fvMax, true);
        }
        this.facing = this.compass[this.facingValue];
    }
    move () {
        switch (this.facingValue) {
            case 0: // North movement
                this.mathOp.add("y", this.yMax, false);
                break;
            case 1: // East movement
                this.mathOp.add("x", this.xMax, false);
                break;
            case 2: // South movement
                this.mathOp.sub("y", this.yMax, false);
                break;
            case 3: // West movement
                this.mathOp.sub("x", this.xMax, false);
                break;
        }
    }
    report (raw) {
        if (!raw) 
            console.log(`\n\x1b[32m Your bot is at (${this.x}, ${this.y}), facing ${this.facing}. \x1b[0m`);
        else 
            return { x: this.x, y: this.y, facing: this.facing }
    }
    get isInitialized () {
        return this.x !== -1 && this.y !== -1 && this.facingValue !== -1;
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
