# RPS-Multiplayer
 An Online multiplayer Rock Paper Scissors game using Firebase

## Game mechanics
* An online version of the classic Rock, Paper, Scissors game.
* Whoever selects first will have their buttons grayed out and not active.
  * A P1 true flag is saved to Firebase
* When second player chooses, their buttons are grayed out 
  * A P2 true flag is also saved to Firebase
* A Firebase listener will check if both P1 and P2 flags are true
  * If both are true, the `checkWinner` method will run
  * The screen will show the items they chose and display if Player 1 or 2 has won.
* Winner gets a point which is saved to Firebase
* The game starts again and the buttons will be active.

## Chat function
* If the player plays for the first time and submits text to chat their name will be defaulted to 'player'.
* When text is submitted to the chat method, the text string and a time stamp is pushed to Firebase.
  * Using Moment.JS, the `moment().unix()` method was used to add the time stamp.
  * Unix format was chosen so that I can apply different formats for the chat box window.
* The player creates a name by pressing `Create a name` button and a Modal pops up so that they can enter a new name
  * The new name is saved in `localStorage()`
* The chat name is preceded by a time stamp.
  * Moment.JS was used to format the time:
  ```
  var chat = childSnapshot.val().chat;
  var chatTime = childSnapshot.val().chatTimeStamp;
  var convertedTime = moment(chatTime, "X").format("MM/DD/YY hh:mm:ss");
  ```

## CSS & JavaScript Modal
* I created a CSS and JavaScript modal based off the Modal tutorial at [W3Schools.com](https://www.w3schools.com/howto/howto_css_modals.asp)

## TODOs or Future Implementations
* Only show Rock, Scissors, or Paper buttons for user. The opponent buttons will not show, only on their screen.
* If only 1 user is online that user must wait until another player is online, then the game will start or continue.
* Show who is online

## Programming Notes
* `<meta name="viewport" content="width=device-width">` in the HTML `<head>` is needed for Chrome to work with @media queries properly.

## Attributions
* [Subtle Patterns](https://www.toptal.com/designers/subtlepatterns/)
* Need to find out how to create a user ID so I found a tutorial on Chat:
  * [Google Firebase Live Group CHat in Javascript](https://codinginfinite.com/google-firebase-live-group-chat-example-javascript/)

## Firebase code from the excercises for reference
### User IDs
* Enabled [Anonymous Authentication in Firebase](https://firebase.google.com/docs/auth/web/anonymous-auth)
* call the `signInAnonymously` method
```
firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
```

* obtain user id with the following code:
```
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var isAnonymous = user.isAnonymous;
            console.log("user signed in?: ", isAnonymous);
            user_id = user.uid;
            console.log(user_id);
        } else {
            // User is signed out.
        }
    });
```
### `.set()` sets a value:
```
    database.ref("/contact").set({
    name: name,
    age: age,
    phone: phone
    });
```

### `.ref().on("value", function (snapshot) {..})` - Getting values when changes occur:
```
    // Firebase watcher + initial loader HINT: .on("value")
    // When changes occurs it will print them to console and html
    database.ref("/contact").on("value", function (snapshot) {

      // Print the initial data to the console.
      console.log(snapshot.val());

      // Log the value of the various properties
      console.log(snapshot.val().name);

      // Change the HTML
      $("#displayed-data").text(snapshot.val().name);

      // If any errors are experienced, log them to console.
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
```

### `.push()` - Push to add child data (From 7.3, Excercise 18-19). 
    ```
    database.ref().push({
        name: name,
        email: email,
        age: age,
        comment: comment,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    ```

### `.ref).on("child_added", ...` - When a child has been added event?
    ```
    // Firebase watcher + initial loader HINT: .on("value")
    dataRef.ref().on("child_added", function(snapshot) {
      // Log everything that's coming out of snapshot
      console.log(snapshot.val());
      console.log(snapshot.val().name);
      console.log(snapshot.val().email);

      // Change the HTML to reflect
      $("#name-display").text(snapshot.val().name);
      $("#email-display").text(snapshot.val().email);

      // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
    ```
    
### `.ref().orderByChild() AND .limitToLast(5)` - Sorting and Filtering
* Sorting: `orderByChild()`
* Filtering: `limitToLast()`
```
dataREf.ref().orderByChild("dateAdded").limitToLast(5).on("child_added", function(...
```

### `.exists()` checks to see if there is existing data.
```
    // If Firebase has a highPrice and highBidder stored (first case)
    if (snapshot.child("highBidder").exists() && snapshot.child("highPrice").exists()) {

        // Set the local variables for highBidder equal to the stored values in firebase.
        highBidder = snapshot.val().highBidder;
        highPrice = parseInt(snapshot.val().highPrice);
    ...
```
### Setting Child Name and value
* `database.ref("users").child(user_id).set(name);`

### Finding exact matches
* use `equalTo()` method to filter based on exact matches
  ```
  ref.orderByChild("height").equalTo(25).on("child_added", function(snapshot) {
  console.log(snapshot.key);
  });
  ```

### Firebase Presence
* The following is code for connections

* A variable **`conectionsRef`** is used for referencing the `/connections` directory in Firebase:
```
// -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");
```

* When the client leaves the page.
    * `.push(arg)` is adding value to the database, not replacing it.
    * `.onDisconnect().remove()` removes the current client's value from Firebase, reducing the num count.
```
// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);

    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});
```

### A listener When the connectionsRef count is updated
    * the method `.numChildren()` is used to count the items in the object array in Firebase.
```
// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snapshot) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#watchers").text(snapshot.numChildren());
});

// -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
```

### CHAT FUNCTION
* The Live Chat Tutorial from [CodingInfinite.com](https://codinginfinite.com/google-firebase-live-group-chat-example-javascript/) was very helpful.
    * Learned how to style the sent and reply messages.
    * Learned more about Anonymous Authentications for Offline Storage and Persistance.




