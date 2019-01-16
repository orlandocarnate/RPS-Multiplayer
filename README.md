# RPS-Multiplayer
 An Online multiplayer Rock Paper Scissors game using Firebase

## Game mechanics
*Short Summary of Rock, Paper, Scissors.
* Game is over if a player wins 2 out of 3 games.
* Game is over after 5 minutes of idle time (no activity from either player).

* Whoever selects first will have their buttons grayed out and not active.
* When second player chooses, their buttons are grayed out and the game object will determine the winner.
* A 3 second timer countdowns to reveal who won and show the buttons that were selected.
* Winner gets a point.
* After 10 seconds the game continues.
* When the game is over or if no activity after a period of time, the history will update and each player's score will be reset to 0.
