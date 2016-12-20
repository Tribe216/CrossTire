## CrossTire

### Background

You'll get caught up in the .... Cross Tire!

CrossTire is a browser game based on the classic action board game Crossfire by the Milton Bradley Company. It is a two player game in which each player attempts to knock a tire or tires initially placed in the center of the game board into the opposing player's pit by shooting ball bearings out of a pivoting launcher.

### Features and MVP  

The main features of the game will be:

- [ ] Start a new two player game
- [ ] Select ball bearing speed, a well as directional and power variance
- [ ] Pivot the launcher and launch ball bearings into the game area

In addition, this project will include:

- [ ] A landing modal containing directions and credits
- [ ] A production README

### Wireframes

CrossFire will consist of two screens: a landing and a game page.

Th landing page will feature the game logo along with directions and a credits section with links to the related Github repository and LinkedIn page. It will also feature game options which will modify the bahavior of the launched ball bearings.

![Landing Page](/docs/CrossTireLanding.png)

The main game screen will consist of the game board and game elements as well as score counters and a link to start a new game, which will direct the players back to the landing page.

![MainBoard](/docs/CrossTireMainScreen.png)

### Game Architecture

CrossTire will be built upon these technologies:

- JavaScript, React and jQuery for structure, state, and logic.
- SoundJs for rendering sounds
- HTML5 Canvas for rendering graphics
- Webpack to aggregate the scripts into an entry file

The game will user the following files:

`landing.js`: this will render and capture state changes on the landing page for later use

`board.js`: this will hold the logic for creating and maintaining state of the game board

`piece.js`: this will hold the common properties and logic to the game pieces

`tire.js`: this will hold the properties properties and logic to the tire pieces


`bearing.js`: this will hold the common properties and logic to the ball bearing pieces


### Implementation Timeline

**Day 1**:

- set up all Javascript libraries as well as Webpack
- write basic backend for board and game pieces
- write basic landing page
- use Canvas and Easel to render the game board and pieces statically

**Day 2**:

- modify pieces so they are able to move
- render moving pieces
- add collision logic to game pieces and/or board bounds
- add point scored and game over detection

**Day 3**:

- add more extensive styling to game assets
- add functionality to landing page which will change game conditions
- add sounds and possibly music as time allows
- finish up various bugs and clean up code
