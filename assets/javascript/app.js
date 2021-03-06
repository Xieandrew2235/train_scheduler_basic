$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyDoAmvX4x2ocfIDlZE4bN5DBi7m_KCm9gM",
        authDomain: "ucbehomework.firebaseapp.com",
        databaseURL: "https://ucbehomework.firebaseio.com",
        projectId: "ucbehomework",
        storageBucket: "ucbehomework.appspot.com",
        messagingSenderId: "307311357520"
    };
    firebase.initializeApp(config);

    // A variable to reference the database.
    var database = firebase.database();

    // Variables for the onClick event
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;
    //   On click function and event.preventDefault so that the page doesn't refresh
    $("#add-train").on("click", function () {
        event.preventDefault();
        
        // Storing and retreiving new train data
        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

        // Pushing user input thats collected to firebase
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });

    database.ref().on("child_added", function (childSnapshot) {
        var nextArr;
        var minAway;
        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        // Difference between the current train and firstTrain
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        var minAway = childSnapshot.val().frequency - remainder;
        // Time the next train arrives (add minutes away so that nextTrain shows minutes before next train, in HH:MM format)
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        // For each time the user inputs data and submits, it will append and sit on top of the previous entry
        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
            "</td><td>" + childSnapshot.val().destination +
            "</td><td>" + childSnapshot.val().frequency +
            "</td><td>" + nextTrain +
            "</td><td>" + minAway + "</td></tr>");

        // Console log my errors (very useful!!!!)
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
        // Change the HTML to reflect
        $("#train-name-display").html(snapshot.val().name);
        $("#destination-display").html(snapshot.val().email);
        $("#first-train-display").html(snapshot.val().age);
        $("#frequency").html(snapshot.val().comment);
    });
});

// This was one of the harder assignments so far in this course, and I got a lot of guidance and help from Kanwar and Denis on this assignment. 