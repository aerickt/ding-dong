const Discord = require(***REMOVED***discord.js***REMOVED***);
const client = new Discord.Client();

var fs = require("fs");
var raw = fs.readFileSync(ddhome+"/triggers.txt", "utf-8").split("\n");

var arrayIndex = 0;
var beginElement = 0;
var responseNum = 0;

var triggers = new Array;
var replies = new Array;

var userAllow = new Array;
var userReject = new Array;

var triggerCount = new Array;
var triggerThresh = new Array;

var variables = new Array;
var variablePosition = new Array;

var userMatch;

var tempTriggerCount = 1;

for (const i in raw) {

    if (raw[i] === "") {
        triggers[arrayIndex] = raw.slice(beginElement,i);
        arrayIndex++;
        beginElement = i;
        beginElement++;
    }

}

for (const i in triggers) {

    replies[i] = triggers[i][0];
    triggers[i].shift();

    if (!triggers[i][0].match(/u(!|)>/)) {
        userAllow[i] = "all";
    }

    else if (triggers[i][0].includes("u>")) {
        userAllow[i] = triggers[i][0].replace("u>", "");
        triggers[i].shift();
    }

    if (triggers[i][0].includes("u!>")) {
        userAllow[i] = "some";
        userReject[i] = triggers[i][0].replace("u!>", "");
        triggers[i].shift();
    }

    else userReject[i] = "no";

    triggerThresh[i] = [];
    triggerCount[i] = [];

    for (const a in triggers[i]) {

        triggerThresh[i][a] = 1;
        triggerCount[i][a] = "";

        if (triggers[i][a].includes("n>")) {
            //var tempArray = triggers[i][a].split("n>");
            //triggers[i][a] = tempArray[1];
            triggers[i][a] = triggers[i][a].split("n>")[1]
            triggerThresh[i][a] = Number(triggers[i][a].split("n>")[0]);
        }

    }

}

for (const i in replies) {

    if (replies[i].includes(***REMOVED***;***REMOVED***)) {
        replies[i] = replies[i].split(***REMOVED***;***REMOVED***);
    }

    replies[i].pop();
}

var alternateCase = function (s) {
    var chars = s.toLowerCase().split("");

    for (var i = 0; i < chars.length; i += 2) {
        chars[i] = chars[i].toUpperCase();
    }

    return chars.join("");
};

function replyFromArray(i, message, user, replyType, variables) {

    var response = replies[i][responseNum % replies[i].length];
    var messageReply;

    if (userAllow[i] === "some"  || userAllow[i] === "all" || userAllow[i].includes(user)) {

        if (response != "NoTrigger" && !userReject[i].includes(user)){

            while (response.match(***REMOVED***%%***REMOVED***)) {
                response = response.replace(***REMOVED***%%***REMOVED***, "\n");
            }

            if (response.includes("alternate")) {
                messageReply = alternateCase(message.content.replace("$altme", ""));
            }

            else if (response.includes("triggerlist")) {
                messageReply = { files: [ddhome+"/triggers.txt"] };
            }

            else if (response.includes("#")) {
                var variableCount = (response.match(/#/g) || []).length; 
                messageReply = response;

                for (var d = 0; d < variableCount; d++) {

                    placeHolder = "#" + (d + 1).toString();

                    while (messageReply.includes(placeHolder)) {
                        messageReply = messageReply.replace(placeHolder,variables[d]);
                    }

                }

                var userName = message.author.username;

                while (messageReply.includes("#un")) {
                    messageReply = messageReply.replace("#un",userName);
                }

                var userPing = "<@!" + message.author.id + ">"

                while (messageReply.includes("#u")) {
                    messageReply = messageReply.replace("#u",userPing);
                }

            }

            else messageReply = response;

            if (response.includes("sm>") || replyType === "send") {

                if (typeof messageReply === ***REMOVED***string***REMOVED***) {
                    messageReply = messageReply.replace("sm>","");
                }

                message.channel.send(messageReply);
            }

            else message.reply(messageReply);

            userMatch = true;

        }

    }

    else userMatch = false;
    responseNum++;
}

function countTrigger(i, a, user) {
    if (triggerCount[i][a].includes(user)) {
        var tempArray = triggerCount[i][a].split(user+":");
        var tempCount = Number(tempArray[1].split(***REMOVED***;***REMOVED***)[0]);
        var oldCount = user+":"+String(tempCount)+";";
        tempCount++;
        var newCount = user+":"+String(tempCount)+";";
        triggerCount[i][a] = triggerCount[i][a].replace(oldCount, newCount);
        tempTriggerCount = tempCount;
    }

    else {
        triggerCount[i][a] = triggerCount[i][a].concat(user+":1;");
    }

}

client.on(***REMOVED***message***REMOVED***, message => {

    if (message.author.bot) return;

    var replyType = "reply";
    var newMessage = message.content.toLowerCase();
    var user = message.author.username+"#"+message.author.discriminator;

    fs.appendFileSync(ddhome+***REMOVED***/log.txt***REMOVED***, newMessage+"\n");

    for (const i in triggers[0]) {
        var noTrigger = new RegExp(triggers[0][i]);

        while (newMessage.match(noTrigger)) {
            newMessage = newMessage.replace(noTrigger, "");
        }

    }

    console.log(newMessage);

    for (const i in triggers) {

        for (const a in triggers[i]) {
            var regex = triggers[i][a]

            if (triggers[i][a].includes("sm>")) {
                regex = triggers[i][a].replace("sm>", "");
                replyType = "send";
            }

            if (!triggers[i][a].includes("#")) {
                regex = new RegExp(regex);

                if (newMessage.match(regex)) {

                    countTrigger(i, a, user);

                    if (tempTriggerCount % triggerThresh[i][a] === 0) {
                        replyFromArray(i, message, user, replyType);
                    }

                    if (userMatch === true) return;

                }

            }

            else {
                var variableCount = (triggers[i][a].match(/#/g) || []).length;

                for (var b = 0; b < variableCount; b++) {

                    if (b > 0) {
                        variablePosition[b] = (new RegExp(triggers[i][a].split("#")[b].toString() + ***REMOVED***|***REMOVED***)).exec(***REMOVED******REMOVED***).length - 1 + variablePosition[b-1];
                    }

                    else {
                        variablePosition[b] = (new RegExp(triggers[i][a].split("#")[b].toString() + ***REMOVED***|***REMOVED***)).exec(***REMOVED******REMOVED***).length - 1;
                    }

                    placeHolder = "#" + (b + 1).toString();
                    regex = regex.replace(placeHolder,"");
                }

                regex = new RegExp(regex);

                if (newMessage.match(regex)) {

                    for (var b = 0; b < variableCount; b++) {

                        variables[b] = newMessage.match(regex)[variablePosition[b]];

                        while (variables[b].includes("my")) {
                            variables[b] = variables[b].replace("my","#un***REMOVED***s");
                        }

                        if (!variables[b] || variables[b] === " ") return;
                    }

                    countTrigger(i, a, user);

                    if (tempTriggerCount % triggerThresh[i][a] === 0) {
                        replyFromArray(i, message, user, replyType, variables);
                    }

                }

            }

            replyType = "reply";

        }

    }

});
