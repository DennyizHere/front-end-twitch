var token = "";
var tuid = "";
var ebs = "";
var chID = ""; //channel ID
var vCount = "";
var clientID= "915s1vuysn8c3qav9owo04349xf19d";

// because who wants to type this every time?
var twitch = window.Twitch.ext;

var audio = new Audio('audio.mp3');

// create the request options for our Twitch API calls
var requests = {
    set: createRequest('POST', 'cycle'),
    get: createRequest('GET', 'query')
};

function createRequest(type, method) {

    return {
        type: type,
        url: 'https://localhost:8081/color/' + method,
        success: updateBlock,
        error: logError
    }
}

function setAuth(token) {
    Object.keys(requests).forEach((req) => {
        twitch.rig.log('Setting auth headers');
        requests[req].headers = { 'Authorization': 'Bearer ' + token }
    });
}

twitch.onContext(function(context) {
    twitch.rig.log(context);
});

twitch.onAuthorized(function(auth) {
    // save our credentials
    token = auth.token;
    tuid = auth.userId;
    chID = auth.channelId;


    // enable the button
    $('#cycle').removeAttr('disabled');

    setAuth(token);
    $.ajax(requests.get);
});

function updateBlock(hex) {
    twitch.rig.log('Updating block color');
    $('#color').css('background-color', hex);
}

function logError(_, error, status) {
  twitch.rig.log('EBS request returned '+status+' ('+error+')');
}

function logSuccess(hex, status) {
  // we could also use the output to update the block synchronously here,
  // but we want all views to get the same broadcast response at the same time.
  twitch.rig.log('EBS request returned '+hex+' ('+status+')');
}

function playAudio(){
    twitch.rig.log("Playing audio clip");
    if (!audio.paused) audio.paused;
    audio.currentTime = 0;
    audio.play();
}
// NUMBAR VAL: 0 - 10 starting at 0% - 100%
function setEmoteProgressBar(numBar){
    var i;
    var bars = ["bar1","bar2","bar3","bar4","bar5","bar6","bar7","bar8","bar9","bar10",]
    for (i = 0; i < numBar; i++){
        $('#'+bars[i]).removeClass("hideElement");
    }
    for (i = numBar; i < 10; i++){
        $('#'+bars[i]).addClass("hideElement");
    }
}


$(function() {

    // when we click the cycle button
    $('#cycle').click(function() {
        if(!token) { return twitch.rig.log('Not authorized'); }
        twitch.rig.log('Requesting a color cycle');
        $.ajax(requests.set);
    });

        $('#AudioControlDiv').click(function() {
        $('#AudioControl').toggleClass("fa-volume-up");
        $('#AudioControl').toggleClass("fa-volume-off");


    });

    $('#EmptyBar').click(function() {
        setEmoteProgressBar(0);
    });
    $('#HalfBar').click(function() {
        setEmoteProgressBar(5);
    });
    $('#FullBar').click(function() {
        setEmoteProgressBar(10);
    });

    $('#AudioPlay').click(function() {
        if ($('#AudioControl').hasClass("fa-volume-up")){
            playAudio();
        }
        else{
            twitch.rig.log("Turned off. Clip not playing");

        }
        twitch.rig.log(chID);

        $.ajax({ //GET FOR STREAM INFORMATION (VIEWER COUNT)
            type: 'GET',
            url: 'https://api.twitch.tv/kraken/streams/' + chID,
            headers: {
              'Client-ID': clientID
            },
            success: function(data) {
               // var vCount = data.stream.viewers;
                twitch.rig.log(data);
            }
           });
    });


    // listen for incoming broadcast message from our EBS
    twitch.listen('broadcast', function (target, contentType, color) {
        twitch.rig.log('Received broadcast color');
        updateBlock(color);
    });
});
