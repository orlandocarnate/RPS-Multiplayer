$(document).ready(function () {
    // ----- start -----

    // declare variable
    var history = []; // game history that will retrieve data from Firebase
    var pics = {
        rock: "assets/images/the_rock_headshot.png",
        paper: "assets/images/paper.png",
        scissors: "assets/images/Scissors.png"
    };
    var p1score = 0;
    var p2score = 0;
    var p1item, p2item;
    var currentUser;
    var p1flag = false;
    var p2flag = false;

    // FIREBASE API
    var config = {
        apiKey: mine,
        authDomain: "rps-game-148d6.firebaseapp.com",
        databaseURL: "https://rps-game-148d6.firebaseio.com",
        projectId: "rps-game-148d6",
        storageBucket: "",
        messagingSenderId: "472953467227"
    };
    firebase.initializeApp(config); // Initialize Firebase
    
    // Create a variable to reference the database.
    var database = firebase.database();

    // p1 listener
    $(".p1select").on("click", function (event) {
        event.preventDefault();
        p1item = $(this).val();
        console.log("P1 chose " + p1item);
        rpsGame.showCard("#p1image", pics[p1item]);
        p1flag = true;
        database.ref().push({
            p1flag: p1flag,
        });
    });

    //p2 listener
    $(".p2select").on("click", function (event) {
        event.preventDefault();
        p2item = $(this).val();
        console.log("P2 chose " + p2item);
        rpsGame.showCard("#p2image", pics[p2item]);
        p2flag = true;
        database.ref().push({
            p2flag: p2flag,
        });
    });

    // temporary check winner button
    $("#check-winner").on("click", function (event) {
        rpsGame.checkWinner(p1item, p2item);
    });

    // if player presses chat submit button
    $("#submit").on("click", function(event) {
        event.preventDefault();
        var chatText = $("#chat-text").val().trim();
        rpsGame.updateChat(chatText);
    });

    // if game is idle (no one is playing) for more than 5 minutes game is over.

    // rps game object
    var rpsGame = {
        // compare player 1 and 2 selections and see who the winner is
        checkWinner: function (p1, p2) {
            // check if p1 and p2 are not empty
            console.log(p1, p2);
            if (p1 !== undefined && p2 !== undefined) {
                if (p1 === "rock" && p2 === "scissors") {
                    $(".p1status").html("Winner!");
                    $(".p2status").html("Loser!");
                    console.log("P1 WINS!");
                    p1score++;
                } else if (p1 === "paper" && p2 === "rock") {
                    $(".p1status").html("Winner!");
                    $(".p2status").html("Loser!");
                    console.log("P1 WINS!");
                    p1score++;
                } else if (p1 === "scissors" && p2 === "paper") {
                    $(".p1status").html("Winner!");
                    $(".p2status").html("Loser!");
                    console.log("P1 WINS!");
                    p1score++;
                } else if (p2 === "rock" && p1 === "scissors") {
                    $(".p2status").html("Winner!");
                    $(".p1status").html("Loser!");
                    console.log("P2 WINS!");
                    p2score++;
                } else if (p2 === "paper" && p1 === "rock") {
                    $(".p2status").html("Winner!");
                    $(".p1status").html("Loser!");
                    console.log("P2 WINS!");
                    p2score++;
                } else if (p2 === "scissors" && p1 === "paper") {
                    $(".p2status").html("Winner!");
                    $(".p1status").html("Loser!");
                    console.log("P2 WINS!");
                    p2score++;
                } else {
                    console.log("DRAW! TRY AGAIN!");
                    $(".p1status").html("DRAW!");
                    $(".p2status").html("DRAW!");
                }
            };

            // reset flags
            p1flag = false;
            p2flag = false;

        },

        // update footer w history data
        history: function () {
            // // load any saved values from Firebase to history array

            // update DOM
        },

        showCard: function (player, val) {
            console.log("player, img ", player, val);
            $(player).children("img").attr({ "src": val });
        },

        updateChat: function (arg) {
            database.ref().push({
                chat: arg,
                chatTimeStamp: firebase.database.ServerValue.TIMESTAMP
            });
        }
    };

    // if p1flag and p2flag are TRUE run the rpsGame.checkWinner() method. 
    database.ref().on("child_added", function (snapshot) {
        // Log everything that's coming out of snapshot
        console.log(snapshot.val());
        console.log(snapshot.val().p1flag);
        console.log(snapshot.val().p2flag);
        if (snapshot.val().p1flag === true && snapshot.val().p1flag === true) {
            checkWinner(snapshot.val().p1flag, snapshot.val().p2flag);
        }
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });


    //------ end ------
});