$(document).ready(function () {
    // ----- start -----

    // declare variable
    var history = []; // game history that will retrieve data from Firebase
    var pics = {
        rock: "assets/images/the_rock_headshot.png",
        paper: "assets/images/paper.png",
        scissors: "assets/images/Scissors.png",
        q: "assets/images/question.png",
        gif: "https://thumbs.gfycat.com/RegalAssuredGossamerwingedbutterfly-max-1mb.gif"
    };

    var p1item, p2item;
    var p1flag = false;
    var p2flag = false;

    // FIREBASE API
    var config = {
        apiKey: "AIzaSyA6MnePmIsN9caVZaX1GQGt1dRkh-8MBTc",
        authDomain: "rps-game-148d6.firebaseapp.com",
        databaseURL: "https://rps-game-148d6.firebaseio.com",
        projectId: "rps-game-148d6",
        storageBucket: "",
        messagingSenderId: "472953467227"
    };
    firebase.initializeApp(config); // Initialize Firebase
    
    console.log("UserInfo: ",firebase.UserInfo);
    // Create a variable to reference the database.
    var database = firebase.database();

    // p1 listener
    $(".p1select").on("click", function (event) {
        event.preventDefault();
        p1item = $(this).val();
        rpsGame.showCard("#p1image", pics["q"]);
        rpsGame.showCard("#p2image", pics["q"]);
        p1flag = true;

        // save data to Firebase RTDB
        database.ref("/status/p1").set({
            p1flag: p1flag,
            p1item: p1item
        });
    });

    //p2 listener
    $(".p2select").on("click", function (event) {
        event.preventDefault();
        p2item = $(this).val();
        rpsGame.showCard("#p1image", pics["q"]);
        rpsGame.showCard("#p2image", pics["q"]);
        console.log("P2 chose " + p2item);
        p2flag = true;
        $(".p2select").addClass("btn-opacity").attr("disabled", true); // disable p2 buttons
        // save data to Firebase RTDB
        database.ref("/status/p2").set({
            p2flag: p2flag,
            p2item: p2item
        });
    });

    // temporary check winner button
    $("#check-winner").on("click", function (event) {
        rpsGame.checkWinner(p1item, p2item);
    });

    // if player presses chat submit button
    $("#submit").on("click", function(event) {
        event.preventDefault();
        var chatText = $("#input-text").val().trim();
        if (chatText !== "") {
            rpsGame.updateChat(chatText);
            $("#input-text").val("");
        }

    });


    // rps game object
    var rpsGame = {
        // compare player 1 and 2 selections and see who the winner is
        checkWinner: function (item1, item2) {
            console.log("Checking Winner Param: ",item1, item2)
            // check if p1 and p2 are not empty
            if (item1 !== undefined && item2 !== undefined) {
                if (item1 === "rock" && item2 === "scissors") {
                    $(".p1status").html("Winner!");
                    $(".p2status").html("Loser!");
                    console.log("P1 WINS!");
                    // p1score++;
                } else if (item1 === "paper" && item2 === "rock") {
                    $(".p1status").html("Winner!");
                    $(".p2status").html("Loser!");
                    console.log("P1 WINS!");
                    // p1score++;
                } else if (item1 === "scissors" && item2 === "paper") {
                    $(".p1status").html("Winner!");
                    $(".p2status").html("Loser!");
                    console.log("P1 WINS!");
                    // p1score++;
                } else if (item2 === "rock" && item1 === "scissors") {
                    $(".p2status").html("Winner!");
                    $(".p1status").html("Loser!");
                    console.log("P2 WINS!");
                    // p2score++;
                } else if (item2 === "paper" && item1 === "rock") {
                    $(".p2status").html("Winner!");
                    $(".p1status").html("Loser!");
                    console.log("P2 WINS!");
                    // p2score++;
                } else if (item2 === "scissors" && item1 === "paper") {
                    $(".p2status").html("Winner!");
                    $(".p1status").html("Loser!");
                    console.log("P2 WINS!");
                    // p2score++;
                } else {
                    console.log("DRAW! TRY AGAIN!");
                    $(".p1status").html("DRAW!");
                    $(".p2status").html("DRAW!");
                }
            };
            rpsGame.showCard("#p1image", pics[p1item]);
            rpsGame.showCard("#p2image", pics[p2item]);

            // reset flags
            p1flag = false;
            p2flag = false;
            database.ref("/status/p1").set({
                p1flag: p1flag,
                p1item: ""
            });
            database.ref("/status/p2").set({
                p2flag: p2flag,
                p2item: ""
            });

        },

        // update footer w history data
        history: function () {
            // // load any saved values from Firebase to history array

            // update DOM
        },

        showCard: function (player, val) {
            $(player).children("img").attr({ "src": val });
        },

        updateChat: function (arg) {
            database.ref("/chat").push({
                chat: arg,
                chatTimeStamp: firebase.database.ServerValue.TIMESTAMP
            });
        }
    };

    // if p1flag and p2flag are TRUE run the rpsGame.checkWinner() method. 
    database.ref("/status").on("value", function (snapshot) {
        console.log("/status changed");
        // Log everything that's coming out of snapshot
        var flag1 = snapshot.child("p1").val().p1flag;
        var item1 = snapshot.child("p1").val().p1item;
        var flag2 = snapshot.child("p2").val().p2flag;
        var item2 = snapshot.child("p2").val().p2item;
        console.log("snaphot: ",snapshot.val());
        console.log(flag1, item1, flag2, item2);
        if (flag1 === true) {
            $(".p1select").addClass("btn-opacity").attr("disabled", true); // disable p1 buttons
        } else {
            $(".p1select").removeClass("btn-opacity").attr("disabled", false);
        }
        if (flag2 === true) {
            $(".p2select").addClass("btn-opacity").attr("disabled", true); // disable p1 buttons
        } else {
            $(".p2select").removeClass("btn-opacity").attr("disabled", false);
        }
        if (flag1 === true && flag2 === true) {
            console.log("Checking Winner");
            rpsGame.checkWinner(item1, item2);
        }
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    // chat value listener
    database.ref("/chat").limitToLast(5).on("child_added", function (childSnapshot) {
        // Log everything that's coming out of snapshot
        var chat = childSnapshot.val().chat;
        console.log("chat snap: ", chat);
        $("#chat-box").append("<li>" + chat + "</li>");
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    

    //------ end ------
});