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
            var tempArray = triggers[i][a].split("n>");
            triggers[i][a] = tempArray[1];
            triggerThresh[i][a] = Number(tempArray[0]);
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

function replyFromArray(i, msg, user, replyType, variables) {

    var response = replies[i][responseNum % replies[i].length];
    var msgReply;

    if (userAllow[i] === "some"  || userAllow[i] === "all" || userAllow[i].includes(user)) {

        if (response != "NoTrigger" && !userReject[i].includes(user)){

            while (response.match(***REMOVED***%%***REMOVED***)) {
                response = response.replace(***REMOVED***%%***REMOVED***, "\n");
            }

            if (response.includes("alternate")) {

                if (msg.reference === null) {
                    msgReply = alternateCase(msg.content.replace("$altme", ""));
                }

                else {
                    msg.channel.messages.fetch(msg.reference.messageID)
                        .then(refMsg => {
                            if (!refMsg.author.bot) msgReply = (alternateCase(refMsg.content));
                            console.log(msgReply);
                        });
                }

            }

            else if (response.includes("triggerlist")) {
                msgReply = { files: [ddhome+"/triggers.txt"] };
            }

            else if (response.includes("#")) {
                var variableCount = (response.match(/#/g) || []).length; 
                msgReply = response;

                for (var d = 0; d < variableCount; d++) {

                    placeHolder = "#" + (d + 1).toString();

                    while (msgReply.includes(placeHolder)) {
                        msgReply = msgReply.replace(placeHolder,variables[d]);
                    }

                }

                var userName = msg.author.username;

                while (msgReply.includes("#un")) {
                    msgReply = msgReply.replace("#un",userName);
                }

                var userPing = "<@!" + msg.author.id + ">"

                while (msgReply.includes("#u")) {
                    msgReply = msgReply.replace("#u",userPing);
                }

            }

            else msgReply = response;

            if (response.includes("sm>") || replyType === "send") {

                if (typeof msgReply === ***REMOVED***string***REMOVED***) {
                    msgReply = msgReply.replace("sm>","");
                }

                msg.channel.send(msgReply);
            }

            else msg.reply(msgReply);

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

client.on(***REMOVED***message***REMOVED***, msg => {

    if (msg.author.bot) return;

    var replyType = "reply";
    var newMessage = msg.content.toLowerCase();
    var user = msg.author.username+"#"+msg.author.discriminator;

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
                        replyFromArray(i, msg, user, replyType);
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
                        replyFromArray(i, msg, user, replyType, variables);
                    }

                }

            }

            replyType = "reply";

        }

    }

});
