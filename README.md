Ding Dong You Are Wrong
======

**A Discord Bot for Immature Teenagers to ~~Bully~~ Tease Their Friends**

This is just an auto replier bot that  I made. It replies certain predictable responses based on certain triggers.

All triggers and replies are found in triggers.txt and the triggers can be used with regexes. The replies and triggers can be found in a "block" separated by new lines. The top line of each block are the replies, while the lines below it are the conditions and the triggers. There can be multiple replies and they are separated by semicolons in the reply block.

The minimum number of responses for each block is 1 and there is no maximum. The bot will simply just cycle through the different replies in increments.

**Every reply line must end with a semicolon. Every trigger must be lower case.**

The bot automatically converts every message to lower case and ignores everything under the "omit" reply. So for example, Ding Dong will see the message "I'm tall" as just: "im tall". As such, all the triggers should be lowercase and free of anything that's under "omit". The "NoTrigger" category is for stuff that ding dong will not remove from messages, but won't reply. I'm not sure if there is a case where I'd use NoTrigger over omit, but I've kept that in there just in case.

    omit;
    '
    ’
    ‘
    
    NoTrigger;
    (that|which) is strong
    
    <sm>alternate;
    #altme
    
    <sm>Yeah right;
    i am strong
    is strong
    
    Some Random Replies;alternate;other reply;
    u!>user#1234
    <sm>i like (apples|oranges|dragonfruit)
    i am (our |a |)(god|supreme leader)
    
    This%%reply%%will%%be%%split%%into%%newlines;
    u>asdf#1234;arst#1234
    (im|i am) short
    
    #u likes apples and #1 and #2;#un likes apples and #1 and #2;
    <5><sm>i like apples and (.*)#1 and (.*)#2

You can repeat responses, however you cannot repeat triggers in different blocks. The bot goes through triggers.txt top to bottom, so higher up triggers will have precedence over those below it. The bot will only reply to one trigger and will never reply more than once.

**Mocking Sarcastic Reply**

`alternate` is a special resonse in which it takes the trigger, alternates the case, and replies with that aLtErNaTiNg message. In addition to this, replying to a message with the trigger `#altme` will alternate the case of the message you've replied to. It can also be used alone with other text, so `#altme some other text` will result in `sOmE OtHeR TeXt` being sent. These last two uses of the alternate response only work if it is the only reply in that block.

**Replies Containing Newlines**

Replies containing new lines have to be expressed in one line where each new line is replaced with `%%`. This can be done with a utility like `tr`, though I'm not sure how you'd go about doing something like that on Windows or Mac. I'm sure it's pretty simple to find how on Google.

**User Specific Triggers**

The reply block with `u>asdf#1234;arst#1234` will ony apply to those users while the reply block with `u!>user#1234` will not apply to that user. The user allow/disallow line should always be below the reply line of each block, otherwise it will not be recognised. It doesn't make sense to have both a disallow and an allow line, but if there is, the disallow line will take precedence. Having no allow/disallow line applies the triggers to all users.

**Send Rather Than Reply Flag**

By default, the bot will reply to a user, which means that it will ping them in the process. `<sm>` is a tag that will have the bot send a message without the ping. It can be used on either the trigger or the reply. As long as either the trigger or the reply has this tag, the bot will send and not ping.

**"Variables" and Custom Pinging**

The bottom reply block has variables in the triggers and responses. The `#un` tag will be the user's username, while the `#u` tag will ping the user. The tags with a # followed by a number act like variables the way they are in the response block. You can alter the regex to have the variable only match a certain pattern, but that can get really complicated, so the example only shows a basic wild card that will match anything.

**Replies on n Number of Triggers**

The bottom reply block also has a flag on the bottom trigger to only reply when there are 5 messages containing the trigger from the same person. If used in combination with the send message tag, the order doesn't matter. So `<sm><5>` would be the same as `<5><sm>`.

Any regex string should work. Have a look at https://regex101.com/ or consult Google for more information on regexes.

I've also provided a sample of a trigger file which is mainly clean and free of any obscenities.

**Running Instructions**

First clone the repo and then install discord.js inside the directory: `npm install discord.js`.

Afterwards, create a file called `config.json` (make sure it is actually a .json file and not a .txt file or anything else). Copy and paste the following into it and replace `\<your token\>` with the token of your bot.

    {
        "TOKEN": "<your token>"
    }

Run `node index-nokey.js` and you're done.

You'll also need to create your own trigger file (called triggers.txt) and populate it with your own triggers.
