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

## Firebase code
* Push to add data (From 7.3, Excercise 18-19).
    ex: 
    ```
    database.ref().push({
        name: name,
        email: email,
        age: age,
        comment: comment,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    ```
* When a child has been added event?
    ```
    // Firebase watcher + initial loader HINT: .on("value")
    dataRef.ref().on("child_added", function(snapshot) {
      // Log everything that's coming out of snapshot
      console.log(snapshot.val());
      console.log(snapshot.val().name);
      console.log(snapshot.val().email);
      console.log(snapshot.val().age);
      console.log(snapshot.val().comment);
      // Change the HTML to reflect
      $("#name-display").text(snapshot.val().name);
      $("#email-display").text(snapshot.val().email);
      $("#age-display").text(snapshot.val().age);
      $("#comment-display").text(snapshot.val().comment);

      // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
    ```
    * Sorting and Filtering
    ```
    dataREf.ref().orderByChild("dateAdded").limitToLast(5).on("child_added")...
    ```
        * Sorting: `orderByChild()`
        * Filtering: `limitToLast()`



## Programming Notes
* `<meta name="viewport" content="width=device-width">` is needed for Chrome to work with @media queries properly.


