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
    var chatText;
    var currentUser;
    var p1flag = false;
    var p2flag = false;

    // FIREBASE API


    // Initialize Firebase
    /*
    var config = {
        apiKey: mine,
        authDomain: "rps-game-148d6.firebaseapp.com",
        databaseURL: "https://rps-game-148d6.firebaseio.com",
        projectId: "rps-game-148d6",
        storageBucket: "",
        messagingSenderId: "472953467227"
    };
    firebase.initializeApp(config);
    */

    // Create a variable to reference the database.
    // var database = firebase.database();

    // Event Listeners

    // if player 1 selects a button
    $(".p1select").on("click", function (event) {
        event.preventDefault();
        p1item = $(this).val();
        console.log("P1 chose " + p1item);
        rpsGame.showCard("#p1image", pics[p1item]);
    });

    // if player 2 selects a button
    $(".p2select").on("click", function (event) {
        event.preventDefault();
        p2item = $(this).val();
        console.log("P2 chose " + p2item);
        rpsGame.showCard("#p2image", pics[p2item]);
    });

    // temporary check winner button
    $("#check-winner").on("click", function (event) {
        rpsGame.checkWinner(p1item, p2item);
    });

    // if player presses chat submit button
    /*
    $("#submit").on("click", function(event) {
        event.preventDefault();
        chatText = $("#chat-text").val().trim();
    });
    */


    // if game is idle (no one is playing) for more than 5 minutes game is over.



    // rps game object
    var rpsGame = {
        // play game

        playGame: function () {
            // wait for players to finish their selections

            // put player values to FireBase

            // retrieve p1 & p2 values from Firebase

            // check winner
            this.checkWinner(p1, p2);
        },

        // compare player 1 and 2 selections and see who the winner is
        checkWinner: function (p1, p2) {
            // check if p1 and p2 are not empty
            console.log(p1, p2);
            if (p1 !== undefined && p2 !== undefined) {
                if (p1 === "rock" && p2 === "scissors") {
                    $(".p1status").html("Winner!");
                    $(".p2status").html("Loser!");
                    console.log("P1 WINS!");
                } else if (p1 === "paper" && p2 === "rock") {
                    $(".p1status").html("Winner!");
                    $(".p2status").html("Loser!");
                    console.log("P1 WINS!");
                } else if (p1 === "scissors" && p2 === "paper") {
                    $(".p1status").html("Winner!");
                    $(".p2status").html("Loser!");
                    console.log("P1 WINS!");
                } else if (p2 === "rock" && p1 === "scissors") {
                    $(".p2status").html("Winner!");
                    $(".p1status").html("Loser!");
                    console.log("P2 WINS!");
                } else if (p2 === "paper" && p1 === "rock") {
                    $(".p2status").html("Winner!");
                    $(".p1status").html("Loser!");
                    console.log("P2 WINS!");
                } else if (p2 === "scissors" && p1 === "paper") {
                    $(".p2status").html("Winner!");
                    $(".p1status").html("Loser!");
                    console.log("P2 WINS!");
                } else {
                    console.log("DRAW! TRY AGAIN!");
                    $(".p1status").html("DRAW!");
                    $(".p2status").html("DRAW!");
                }
            }

        },

        // update footer w history data
        history: function () {
            // // load any saved values from Firebase to history array

            // update DOM
        },

        showCard: function (player, val) {
            console.log("player, img ", player, val);
            $(player).children("img").attr({ "src": val });
        }

    }


    //------ end ------
});