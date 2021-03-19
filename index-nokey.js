const start = Date.now();

const Discord = require('discord.js');
const client = new Discord.Client();

var fs = require("fs");
var raw = fs.readFileSync(ddhome+"/triggers.txt", "utf-8").split("\n");

var arrayIndex, beginElement, replyCounter;
arrayIndex = beginElement = replyCounter = 0;

var trigs = [];
var replies = [];

var userAllow = [];
var userReject = [];

var trigType = [];
var replyType = []

var trigCount = [];
var trigThresh = [];

var variables = [];
var variablePosition = [];

var userMatch, tempCount;

for (const i in raw) {

    if (raw[i] === "") {
        trigs[arrayIndex] = raw.slice(beginElement,i);
        arrayIndex++;
        beginElement = Number(i) + 1;
    }

}

for (const i in trigs) {

    replies[i] = trigs[i][0];
    trigs[i].shift();

    if (!trigs[i][0].match(/u(!|)>/)) {
        userAllow[i] = "all";
    }

    else if (trigs[i][0].includes("u>")) {
        userAllow[i] = trigs[i][0].replace("u>", "");
        trigs[i].shift();
    }

    if (trigs[i][0].includes("u!>")) {
        userAllow[i] = "some";
        userReject[i] = trigs[i][0].replace("u!>", "");
        trigs[i].shift();
    }

    else userReject[i] = "no";

    trigThresh[i] = [];
    trigCount[i] = [];

    trigType[i] = [];

    for (const a in trigs[i]) {

        trigThresh[i][a] = 1;
        trigCount[i][a] = "";

        if (trigs[i][a].match(/<(\d*)>/)) {
            trigThresh[i][a] = Number(trigs[i][a].match(/<(\d*)>/)[1]);
            trigs[i][a] = trigs[i][a].replace(/<(\d*)>/, "");
        }

        trigType[i][a] = "reply";

        if (trigs[i][a].includes("<sm>")) {
            trigs[i][a] = trigs[i][a].replace("<sm>", "");
            trigType[i][a] = "send";
        }

    }

}

for (const i in replies) {

    if (replies[i].includes(';')) {
        replies[i] = replies[i].split(';');
    }

    replies[i].pop();

    replyType[i] = [];

    for (const a in replies[i]) {

        replyType[i][a] = "reply";

        if (replies[i][a].includes("<sm>")) {
            replies[i][a] = replies[i][a].replace("<sm>", "");
            replyType[i][a] = "send";
        }

    }

}

var alternateCase = function (s) {
    var chars = s.toLowerCase().split("");

    for (var i = 0; i < chars.length; i += 2) {
        chars[i] = chars[i].toUpperCase();
    }

    return chars.join("");
};

async function replyFromArray(i, a, msg, user, variables) {

    var replyIndex = replyCounter % replies[i].length;
    var response = replies[i][replyIndex];
    let msgReply = null;

    if (userAllow[i] === "some"  || userAllow[i] === "all" || userAllow[i].includes(user)) {

        if (response != "NoTrigger" && !userReject[i].includes(user)){

            while (response.includes('%%')) {
                response = response.replace('%%', "\n");
            }

            if (response.includes("alternate")) {

                if (replies[i].length === 1) {

                    if (msg.reference === null) {
                        console.log(trigs[i][a]);
                        msgReply = alternateCase(msg.content.replace(trigs[i][a], ""));
                    }

                    else if (msg.reference !== null && replies[i].length === 1) {
                        var refMsg = await msg.channel.messages.fetch(msg.reference.messageID);
                        if (!refMsg.author.bot) msgReply = alternateCase(refMsg.content);
                    }

                }

                else {
                    msgReply = alternateCase(msg.content);
                }

            }

            else if (response.includes("triggerlist")) {
                msgReply = { files: [ddhome+"/triggers.txt"] };
            }

            else if (response.includes("triggercount")) {
                msgReply = totalTrig + " triggers and " + totalReply + " replies.";
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

            if (msgReply === "") return;

            if (replyType[i][replyIndex] === "send" || trigType[i][a] === "send") msg.channel.send(msgReply);

            else msg.reply(msgReply);

            userMatch = true;

        }

    }

    else userMatch = false;

    replyCounter++;
}

function countTrigger(i, a, user) {

    if (trigCount[i][a].includes(user)) {
        const re = new RegExp(user+":"+"(\\d*)\;");
        tempCount = Number(trigCount[i][a].match(re)[1]);
        trigCount[i][a] = trigCount[i][a].replace(re, "");
        tempCount++;
    }

    else tempCount = 1;

    trigCount[i][a] = trigCount[i][a].concat(user+":"+tempCount+";");

}

var totalTrig = String(trigs.reduce((count, row) => count + row.length, 0));
var totalReply = String(replies.reduce((count, row) => count + row.length, 0));

var loadTime = Date.now() - start;

console.log("Loaded " + totalTrig + " triggers and " + totalReply + " replies in " + loadTime + " ms.");

client.on('message', async msg => {

    if (msg.author.bot) return;

    var newMessage = msg.content.toLowerCase();
    var user = msg.author.username+"#"+msg.author.discriminator;

    fs.appendFileSync(ddhome+'/log.txt', newMessage+"\n");

    for (const i in trigs[0]) {
        var noTrigger = new RegExp(trigs[0][i]);

        while (newMessage.match(noTrigger)) {
            newMessage = newMessage.replace(noTrigger, "");
        }

    }

    console.log(newMessage);

    for (const i in trigs) {

        for (const a in trigs[i]) {
            var regex = trigs[i][a]

            if (!trigs[i][a].includes("#")) {
                regex = new RegExp(regex);

                if (newMessage.match(regex)) {

                    countTrigger(i, a, user);

                    if (tempCount % trigThresh[i][a] === 0) {
                        replyFromArray(i, a, msg, user);
                    }

                    if (userMatch === true) return;

                }

            }

            else {
                var variableCount = (trigs[i][a].match(/#/g) || []).length;

                for (var b = 0; b < variableCount; b++) {

                    if (b > 0) {
                        variablePosition[b] = (new RegExp(trigs[i][a].split("#")[b].toString() + '|')).exec('').length - 1 + variablePosition[b-1];
                    }

                    else {
                        variablePosition[b] = (new RegExp(trigs[i][a].split("#")[b].toString() + '|')).exec('').length - 1;
                    }

                    placeHolder = "#" + (b + 1).toString();
                    regex = regex.replace(placeHolder,"");
                }

                regex = new RegExp(regex);

                if (newMessage.match(regex)) {

                    for (var b = 0; b < variableCount; b++) {

                        variables[b] = newMessage.match(regex)[variablePosition[b]];

                        while (variables[b].includes("my")) {
                            variables[b] = variables[b].replace("my","#un's");
                        }

                        if (!variables[b] || variables[b] === " ") return;
                    }

                    countTrigger(i, a, user);

                    if (tempCount % trigThresh[i][a] === 0) {
                        replyFromArray(i, a, msg, user, variables);
                    }

                }

            }

        }

    }

});
