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
        // $(".p2select").addClass("btn-opacity").attr("disabled", true); // disable p2 buttons
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
            rpsGame.pushChat(chatText);
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
            database.ref("/users").child(user_UID).set({ score: userScore });
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
        apiKey: "AIza" + "SyA6MnePmIsN9" + "caVZaX1GQGt1dRkh" + "-8MBTc",
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

    // OBJECT for Anon Auth ands SIGNS IN
    firebase.auth().signInAnonymously().catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Error code & Message if any: ", errorCode, errorMessage);
        // ...
    });
    // console.log("Logged In as Anon. Current User Object: ", currentUser);

    // if p1flag and p2flag are TRUE run the rpsGame.checkWinner() method. 
    database.ref("/status").on("value", function (snapshot) {
        var flag1 = snapshot.child("p1").val().p1flag;
        var item1 = snapshot.child("p1").val().p1item;
        var flag2 = snapshot.child("p2").val().p2flag;
        var item2 = snapshot.child("p2").val().p2item;
        if (flag1 === true) {
            alert1.play();
            $(".p1select").addClass("btn-opacity").attr("disabled", true); // disable p1 buttons
        } else {
            $(".p1select").removeClass("btn-opacity").attr("disabled", false);
        }
        if (flag2 === true) {
            alert2.play();
            $(".p2select").addClass("btn-opacity").attr("disabled", true); // disable p1 buttons
        } else {
            $(".p2select").removeClass("btn-opacity").attr("disabled", false);
        }
        if (flag1 === true && flag2 === true) {
            rpsGame.checkWinner(item1, item2);
        }
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    // ---------- Player Scores listener ----------
    database.ref("/score").on("value", function (childSnapshot) {
        p1score = childSnapshot.child("p1").val().p1score;
        p2score = childSnapshot.child("p2").val().p2score;
        $(".p1score").text(p1score);
        $(".p2score").text(p2score);
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    // ---------- ANONYMOUS AUTHENTICATION to get a userID -------------------
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var isAnonymous = user.isAnonymous;
            console.log("user signed in?: ", isAnonymous);
            user_UID = user.uid;
            console.log("user.uid: ", user.uid);
        } else {
            FirebaseAuth.getInstance().signOut();
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
        var chatName = childSnapshot.val().name;
        var chatTime = childSnapshot.val().chatTimeStamp;
        var convertedTime = moment(chatTime, "X").format("MM/DD hh:mm");
        console.log("chat time: ", convertedTime);
        submitFX.play();
        if (user_UID === childSnapshot.val().user_id) {
            msgType = "sent";
        } else {
            msgType = "replies";
        }
        var $chatLine = $("<li><span class='chat-time'>(" + convertedTime + ")</span>" + chatName + ": <span class='" + msgType + "'>" + chat + "</span></li>");
        $("#chat-box").append($chatLine);
        $("#chat-box").animate({ scrollTop: $("#chat-box")[0].scrollHeight });
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    // User listener - retreives the saved name and score
    database.ref("/users").on("value", function (userSnapshot) {
        console.log("chat listener: ", userSnapshot.child(user_UID).val());
        console.log("name exists: ", userSnapshot.child(user_UID).child("name").exists());
        if (userSnapshot.child(user_UID).child("name").exists() === false) {
            name = "guest"; // assigns name of guest if there is none
        } else {
            name = userSnapshot.child(user_UID).val().name;
        }
    });

    // ------------------------ MODAL CODE - https://www.w3schools.com/howto/howto_css_modals.asp
    // open Modal
    $("#btnName").on("click", function (event) {
        event.preventDefault();
        $(".modal").css("display", "block");
    });

    // get value for name then close modal
    $("#submit-name").on("click", function (event) {
        event.preventDefault();
        if ($("#text-name").val().trim() !== "") {
            name = $("#text-name").val().trim();
            database.ref("/users").child(user_UID).update({ name: name });
            $(".modal").css("display", "none");
        }
    });

    // close modal on Cancel
    $("#cancel-name").on("click", function (event) {
        event.preventDefault();
        $(".modal").css("display", "none");
    });

    // close Modal when click 'X' close button
    $(".close").on("click", function () {
        $(".modal").css("display", "none");
    });

    // *** This code didn't work. Will figure out later. ***
    // // close Modal when clicked outside modal box
    // $(document).on("click", function (event) {
    //     if (event.target == modal) {
    //         $(".modal").css("display", "none");
    //     }
    // })

    //------ end ------
});