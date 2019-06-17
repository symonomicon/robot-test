# robot-test
This tiny app runs a simple robot game that you can play interactively via the command line.

## Installation
It is recommended to install the latest version of node.  
Clone or download zip

## Usage
Run
```
npm i -s
```
Then execute with
```
node app
```

It will initially prompt you with initial values required to start the game.  
For now the table area you can play around is **5x5**. Since we start at 0, coordinate values will run between 0-4.  
After selecting your desired coordinates, you will be prompted to select where the bot would initially face.  
![alt text](https://image.prntscr.com/image/gOFwf6SQTR_Ur2tj005FJg.png "Sample initial values")  
  
As listed, you may face either **North**, **East**, **South** or **West**.
  
Next, a prompt to start the game will appear. A simple yes or no would suffice.  
A full list of instruction is also included before starting the game,  
the following operations are available:  

| Operation        | Function           |
| ------------- |:-------------:|
| Move      | Will move your bot one step towards where it is facing |
| Left     | Will turn your bot 90º to the left (eg. Currently facing West, then turn Left, will now face South)     |
| Right | Will rotate your bot 90º rightward. (eg. Currently facing North, then turn Right, will now face East)      |
| Report | Reports the current location of your bot.     |
| Help | Displays help text of each operation      |
| Quit | Exits the application ~dont~      |

![alt text](https://image.prntscr.com/image/fjMhzTXKRXq8wuinyZ2pGQ.png "Sample operations image")  
  
Each operation will be continuous. One after another unless *Quit* will be selected. The only way to see your bot's current place would be by selecting the *Report* function.

## Unit Testing
In testing the application, it'll use <a href="https://github.com/mochajs/mocha"> Mocha </a> with Node's native assert to test the application, simply run:  
```
mocha test.js
```
Each step concerns simple scenarios the can roadblock the application running its usual routine.
