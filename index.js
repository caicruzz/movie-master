var upcomingMoviesArr = [
  "wonder woman","transformers 5","Despicable me 3"
];

var nowShowingMoviesArr = [
  "Pirates of the caribbean", "John wick: chapter 2, cars 3"
];
// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

    // if (event.session.application.applicationId !== "") {
    //     context.fail("Invalid Application ID");
    //  }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
  getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    var intent = intentRequest.intent
    var intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if(intentName == "getUpcomingMoviesIntent") {
      handleUpcomingMoviesResponse(intent, session, callback);
    } else if(intentName == "getNowShowingMoviesIntent") {
      handleNowShowingMoviesIntent(intent, session, callback);
    } else if(intentName == "AMAZON.HelpIntent") {
      handleGetHelpRequest(intent, session, callback);
    } else if(intentName == "AMAZON.StopIntent") {
      handleFinishSessionRequest(intent, session, callback);
    } else if(intentName == "AMAZON.CancelIntent") {
      handleFinishSessionRequest(intent, session, callback);
    } else {
      throw "Invalid Intent"
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {

}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
    var speechOutput = "Welcome to Movie Master. You can ask me for the upcoming or now playing movies";

    var reprompt = "Would you like to hear the upcoming or the now playing movies?";

    var header = "Movie Master";

    var shouldEndSession = false;

    var sessionAttributes = {
      "speechOutput" : speechOutput,
      "repromptText" : reprompt
    }

    callback(sessionAttributes, buildSpeechletResponse(header,speechOutput,reprompt,shouldEndSession));
}

function handleUpcomingMoviesResponse(intent, seesion, callback) {
  var speechOutput = "The upcoming movies are ";
  upcomingMoviesArr.forEach(function(movie) {
    speechOutput += movie + ", ";
  });


  var reprompt = "Ask me for the upcoming or now playing movies";
  var header = "Upcoming Movies";
  var shouldEndSession = false;

  var sessionAttributes = {
    "speechOutput" : speechOutput,
    "repromptText" : reprompt
  }

  callback(sessionAttributes, buildSpeechletResponse(header,speechOutput,reprompt,shouldEndSession));
}

function handleNowShowingMoviesIntent(intent, seesion, callback) {
  var speechOutput = "The now playing movies are ";
  nowShowingMoviesArr.forEach(function(movie) {
    speechOutput += movie + ", ";
  });

  var reprompt = "Ask me for the upcoming or now playing movies";
  var header = "Now Playing Movies";
  var shouldEndSession = false;
  var sessionAttributes = {
    "speechOutput" : speechOutput,
    "repromptText" : reprompt
  }

  callback(sessionAttributes, buildSpeechletResponse(header,speechOutput,reprompt,shouldEndSession));
}

function handleGetHelpRequest(intent, session, callback) {
    // Ensure that session.attributes has been initialized
    if (!session.attributes) {
        session.attributes = {};
      }

    var speechOutput = "I can tell you the upcoming or now playing movies";
    var repromptText = "Ask me for the upcoming or now playing movies";
    var shouldEndSession = false;
    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));

}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye! Thank you for using Movie Master", "", true));
}


// ------- Helper functions to build responses for Alexa -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
