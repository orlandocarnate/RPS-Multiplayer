$(document).ready(function () {
    // ----- start -----

    // Global variables
    var name;
    var p1item, p2item;
    var p1flag = false;
    var p2flag = false;
    var p1score = 0;
    var p2score = 0;
    var userScore = 0;
    var opponentScore = 0;

    var submitFX = document.createElement("audio");
    var alert1 = document.createElement("audio");
    var alert2 = document.createElement("audio");

    submitFX.setAttribute("src", "assets/sounds/notify1.mp3");
    alert1.setAttribute("src", "assets/sounds/alert1.mp3");
    alert2.setAttribute("src", "assets/sounds/alert2.mp3");

    // get localStorage if exists
    // if (typeof localStorage["myName"] !== 'undefined') {
    //     name = localStorage["myName"];
    //     console.log("localStorage['myName']: ", name);
    // } else {
    //     name = "player";
    //     console.log("no localStorage for myName");
    // };

    var pics = {
        rock: "assets/images/the_rock_headshot.png",
        paper: "assets/images/paper.png",
        scissors: "assets/images/Scissors.png",
        q: "assets/images/question.png",
        gif: "https://thumbs.gfycat.com/RegalAssuredGossamerwingedbutterfly-max-1mb.gif"
    };

    // p1 listener
    $(".p1select").on("click", function (event) {
        event.preventDefault();
        $("#status").empty();
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
        $("#status").empty();
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
        console.log("submit test");
        var chatText = $("#input-text").val().trim();
        if (chatText !== "") {
            pushChat(name + ": " + chatText);
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
                    $("#status").html("<h2>Player 1 Wins!</h2>Rock Beats Scissors!");
                    this.updateP1Score();
                } else if (item1 === "paper" && item2 === "rock") {
                    $("#status").html("<h2>Player 1 Wins!</h2>Paper Beats Rock!");
                    this.updateP1Score();
                } else if (item1 === "scissors" && item2 === "paper") {
                    $("#status").html("<h2>Player 1 Wins!</h2>Scissors Beats Paper!");
                    this.updateP1Score();
                } else if (item2 === "rock" && item1 === "scissors") {
                    $("#status").html("<h2>Player 2 Wins!</h2>Rock Beats Scissors!");
                    this.updateP2Score();
                } else if (item2 === "paper" && item1 === "rock") {
                    $("#status").html("<h2>Player 2 Wins!</h2>Paper Beats Rock!");
                    this.updateP2Score();
                } else if (item2 === "scissors" && item1 === "paper") {
                    $("#status").html("<h2>Player 2 Wins!</h2>Scissors Beats Paper!");
                    this.updateP2Score();
                } else {
                    $("#status").html("<h2>It's A DRAW!</h2>You both chose " + item1 + "!");
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

        firebaseChat: function (chat) {
            database.ref("/chat").push({
                user_id: user_id,
                chat: chat,
                chatTimeStamp: currentTime,
            })
        },

        pushChat: function (arg) {
            var currentTime = moment().unix();
            console.log("moment():", currentTime);
            console.log("user_id: ", user_UID);
            database.ref("/chat").push({
                user_id: user_UID,
                chat: arg,
                chatTimeStamp: currentTime,
                name: name,
            });
    
        },

        updateP1Score: function () {
            p1score++;
            userScore++;
            console.log("id, score ", user_id, userScore);
            database.ref("/users").child(user_id).set({ score: userScore });
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

    // ---------- FIREBASE ----------------
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

    // ---------- FIREBASE Variables ----------------------
    var database = firebase.database(); // Create a variable to reference the database.
    var connections = database.ref("/connections"); // All of our connections will be stored in this directory.
    var isConnected = database.ref(".info/connected"); // boolean value - true if client is connected, false if not.
    var user_UID; // Global USER object for firebase.auth().onAuthStateChanged(function (user) {...}

    var userObject = firebase.auth().signInAnonymously(); // OBJECT for Anon Auth ands SIGNS IN
    console.log("Logged In as Anon. User Object: ", userObject);

    // ---------- ANONYMOUS AUTHENTICATION to get a userID -------------------
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var isAnonymous = user.isAnonymous;
            console.log("user signed in?: ", isAnonymous);
            // user_UID = user.uid;
            console.log("user.uid: ", user.uid);
        } else {
            // FirebaseAuth.getInstance().signOut();
            // sign out operations
        }
    });

    // ---------- CHAT SECTION  ----------
    // Firebase connection status
    isConnected.on("value", function (connectedSnapshot) {
        if (connectedSnapshot.val()) {
            var connList = connections.push(true); // add user to list from connections
            connList.onDisconnect().remove(); // remove user from list when disconnected
        }
    });

    // Number of connections
    connections.on("value", function (connectionSnapshot) {
        $("#online-viewers").text(connectionSnapshot.numChildren()); // gets number of connections and outputs to DOM
    });

    // CHAT listener
    database.ref("/chat").limitToLast(20).on("child_added", function (childSnapshot) {
        var chat = childSnapshot.val().chat;
        var chatTime = childSnapshot.val().chatTimeStamp;
        var convertedTime = moment(chatTime, "X").format("MM/DD hh:mm");
        console.log("chat time: ", convertedTime);
        submitFX.play();
        if (user_UID === childSnapshot.val().user_id) {
            msgType = "sent";
        } else {
            msgType = "replies";
        }
        var $chatLine = $("<li><span class='" + msgType + "'><span class='chat-time'>(" + convertedTime + ")</span> " + chat + "</span></li>");
        $("#chat-box").append($chatLine);
        $("#chat-box").animate({ scrollTop: $("#chat-box")[0].scrollHeight });
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    // User listener - retreives the saved name and score
    database.ref("/users").on("value", function (userSnapshot) {
        console.log("chat listener: ", userSnapshot.child(user_UID).val());
        if (userSnapshot.child(user_UID).val().name === undefined) {
            name = "guest"; // assigns name of guest if there is none
        } else {
            name = userSnapshot.child(user_UID).val().name;
        }
        console.log("name: ", name);
        userScore = userSnapshot.child(user_UID).val().score;
        console.log("score: ", userScore);
    });



    // ------------------------ MODAL CODE --------------------------------
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
        if ($("#text-name").val().trim() !== "") {
            name = $("#text-name").val().trim();
            // localStorage["myName"] = name;
            database.ref("/users").child(user_UID).update({ name: name });
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