$(document).ready(function () {

    var submitFX = document.createElement("audio");
    var alert1 = document.createElement("audio");
    var alert2 = document.createElement("audio");



    submitFX.setAttribute("src", "assets/sounds/notify1.mp3");
    alert1.setAttribute("src", "assets/sounds/alert1.mp3");
    alert2.setAttribute("src", "assets/sounds/alert2.mp3");

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
    var msgType; // apply style to sent and replies messages

    var userObject = firebase.auth().signInAnonymously(); // OBJECT for Anon Auth ands SIGNS IN
    console.log("Logged In as Anon. User Object: ", userObject);

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
    // tutoral from https://codinginfinite.com/google-firebase-live-group-chat-example-javascript/
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

    // chat listener
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
            name = "guest";
        } else {
            name = userSnapshot.child(user_UID).val().name;
        }
        console.log("name: ", name);
        userScore = userSnapshot.child(user_UID).val().score;
        console.log("score: ", userScore);
    });

    function pushChat(arg) {
        var currentTime = moment().unix();
        console.log("moment():", currentTime);
        console.log("user_id: ", user_UID);
        database.ref("/chat").push({
            user_id: user_UID,
            chat: arg,
            chatTimeStamp: currentTime,
            name: name,
        });

    };
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

});