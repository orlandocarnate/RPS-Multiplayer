$(document).ready(function () {
    // ----- start -----

    // declare variable
    var name; // localStorage variable

    // get localStorage if exists
    if (typeof localStorage["myName"] !== 'undefined') {
        name = localStorage["myName"];
        console.log("localStorage['myName']: ", name);
    } else {
        name = "player";
        console.log("no localStorage for myName");
    };

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
    var p1score = 0;
    var p2score = 0;

    // FIREBASE API
    var config = {
        apiKey: "AIza" + "SyA6MnePmIsN9caVZaX1GQGt1dRkh" + "-8MBTc",
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

    // chat button
    $("#submit").on("click", function (event) {
        event.preventDefault();
        var chatText = $("#input-text").val().trim();
        if (chatText !== "") {
            rpsGame.updateChat(name + ": " + chatText);
            $("#input-text").val("");
        }

    });

    // rps game object
    var rpsGame = {
        // compare player 1 and 2 selections and see who the winner is
        checkWinner: function (item1, item2) {
            console.log("Checking Winner Param: ", item1, item2)
            // check if p1 and p2 are not empty
            if (item1 !== undefined && item2 !== undefined) {
                if (item1 === "rock" && item2 === "scissors") {
                    $(".p1status").html("Winner!");
                    $(".p2status").html("Loser!");
                    console.log("P1 WINS!");
                    this.updateP1Score();
                } else if (item1 === "paper" && item2 === "rock") {
                    $(".p1status").html("Winner!");
                    $(".p2status").html("Loser!");
                    console.log("P1 WINS!");
                    this.updateP1Score();
                } else if (item1 === "scissors" && item2 === "paper") {
                    $(".p1status").html("Winner!");
                    $(".p2status").html("Loser!");
                    console.log("P1 WINS!");
                    this.updateP1Score();
                } else if (item2 === "rock" && item1 === "scissors") {
                    $(".p2status").html("Winner!");
                    $(".p1status").html("Loser!");
                    console.log("P2 WINS!");
                    this.updateP2Score();
                } else if (item2 === "paper" && item1 === "rock") {
                    $(".p2status").html("Winner!");
                    $(".p1status").html("Loser!");
                    console.log("P2 WINS!");
                    this.updateP2Score();
                } else if (item2 === "scissors" && item1 === "paper") {
                    $(".p2status").html("Winner!");
                    $(".p1status").html("Loser!");
                    console.log("P2 WINS!");
                    this.updateP2Score();
                } else {
                    console.log("DRAW! TRY AGAIN!");
                    $(".p1status").html("DRAW!");
                    $(".p2status").html("DRAW!");
                }
            };
            rpsGame.showCard("#p1image", pics[item1]);
            rpsGame.showCard("#p2image", pics[item2]);

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

        showCard: function (player, val) {
            $(player).children("img").attr({ "src": val });
        },

        updateChat: function (arg) {
            var currentTime = moment().unix();
            console.log("moment():", currentTime);
            database.ref("/chat").push({
                chat: arg,
                chatTimeStamp: currentTime,
            });
        },

        updateP1Score: function () {
            p1score++;
            database.ref("/score/p1").set({
                p1score: p1score,
            });
        },

        updateP2Score: function () {
            p2score++;
            database.ref("/score/p2").set({
                p2score: p2score,
            });
        },
    };

    // if p1flag and p2flag are TRUE run the rpsGame.checkWinner() method. 
    database.ref("/status").on("value", function (snapshot) {
        console.log("/status changed");
        // Log everything that's coming out of snapshot
        var flag1 = snapshot.child("p1").val().p1flag;
        var item1 = snapshot.child("p1").val().p1item;
        var flag2 = snapshot.child("p2").val().p2flag;
        var item2 = snapshot.child("p2").val().p2item;
        console.log("snaphot: ", snapshot.val());
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
    database.ref("/chat").limitToLast(20).on("child_added", function (childSnapshot) {
        // Log everything that's coming out of snapshot
        var chat = childSnapshot.val().chat;
        var chatTime = childSnapshot.val().chatTimeStamp;
        var convertedTime = moment(chatTime, "X").format("MM/DD/YY hh:mm:ss");
        console.log("chat time: ", convertedTime);
        $("#chat-box").append("<li><span class='chat-time'>(" + convertedTime + ")</span> " + chat + "</li>");
        $("#chat-box").animate({ scrollTop: $("#chat-box")[0].scrollHeight });
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    // p1score value listener
    database.ref("/score").on("value", function (childSnapshot) {
        p1score = childSnapshot.child("p1").val().p1score;
        p2score = childSnapshot.child("p2").val().p2score;
        $(".p1score").text(p1score);
        $(".p2score").text(p2score);
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    // open Modal
    $("#btnName").on("click", function (event) {
        event.preventDefault();
        $(".modal").css("display", "block");
    });

    // close Modal
    $(".close").on("click", function () {
        $(".modal").css("display", "none");
    });

    // get value for name then close modal
    $("#submit-name").on("click", function (event) {
        event.preventDefault();
        if ($("#text-name").val() !== "") {
            name = $("#text-name").val();
            localStorage["myName"] = name;
            console.log("Player name: ", name);
            $(".modal").css("display", "none");
        }
    });

    // close modal on Cancel
    $("#cancel-name").on("click", function (event) {
        event.preventDefault();
        $(".modal").css("display", "none");
    });

    // // close Modal when clicked outside modal box
    // $(document).on("click", function (event) {
    //     if (event.target == modal) {
    //         $(".modal").css("display", "none");
    //     }
    // })


    //------ end ------
});