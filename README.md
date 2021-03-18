Ding Dong You Are Wrong
======

**A Discord Bot for Immature Teenagers to ~~Bully~~ Tease Their Friends**

This is really just an auto replier bot that is fairly customisable.

All triggers are found in triggers.txt and use regexes. Though, any phrases or words without any regexes characters or rules surrounding them is just a regular string that the bot will try and match. A new line just indicates a separation of a different reply block. In each reply block, the first line contains the responses that the bot will cycle through while the triggers and conditions are below that first line.

The minimum number of responses for each block is 1 and there is no maximum.

**Every response line must end with a semicolon. Every trigger must be lower case.**

The bot automatically converts every message to lower case and ignores apostrophes before comparing with the triggers. It does this by removing everything that is under the first response block (with the response of "NoTrigger") from the message before comparing the message.

    NoTrigger
    '
    (that|which) is strong
    
    <sm>alternate;
    #altme
    
    <sm>Yeah right;
    i am strong
    is strong
    
    Response one;Response number two with spaces;Response three;alternate;
    u!>user#1234
    <sm>i like (apples|oranges|dragonfruit)
    i am (our |a |)(god|supreme leader)
    
    New Set of Triggers;sm>alternate;Response number two with spaces;
    u>asdf#1234;arst#1234
    (im|i am) short
    
    #u likes apples and #1 and #2;#un likes apples and #1 and #2;
    <5><sm>i like apples and (.*)#1 and (.*)#2

You can repeat responses, however you cannot repeat triggers in different blocks. The bot goes through triggers.txt top to bottom, so higher up triggers will have precedence over those below it. The bot will only reply to one trigger and will never reply more than once.

**Mocking Sarcastic Reply**

`alternate` is a special resonse in which it takes the trigger, alternates the case, and replies with that aLtErNaTiNg message. In addition to this, replying to a message with the trigger `#altme` will alternate the case of the message you've replied to. It can also be used alone with other text, so `#altme some other text` will result in `sOmE OtHeR TeXt` being sent. These last two uses of the alternate response only work if it is the only reply in that block.

**User Specific Triggers**

The reply block with `u>asdf#1234;arst#1234` will ony apply to those users while the reply block with `u!>user#1234` will not apply to that user. The user allow/disallow line should always be below the reply line of each block, otherwise it will not be recognised. It doesn't make sense to have both a disallow and an allow line, but if there is, the disallow line will take precedence. Having no allow/disallow line applies the triggers to all users.

**Send Rather Than Reply Flag**

By default, the bot will reply to a user, which means that it will ping them in the process. `<sm>` is a tag that will have the bot send a message without the ping. It can be used on either the trigger or the reply. As long as either the trigger or the reply has this tag, the bot will send and not ping.

**"Variables" and Custom Pinging**

The bottom reply block has variables in the triggers and responses. The `#un` tag will be the user's username, while the `#u` tag will ping the user. The tags with a # followed by a number act like variables the way they are in the response block. You can alter the regex to have the variable only match a certain pattern, but that can get really complicated, so the example only shows a basic wild card that will match anything.

**Replies on n Number of Triggers**

The bottom reply block also has a flag on the bottom trigger to only reply when there are 5 messages containing the trigger from the same person. If used in combination with the send message tag, the order doesn't matter. So `<sm><12>` would be the same as `<12><sm>`.

Any regex string should work. Have a look at https://regex101.com/ or consult Google for more information on regexes.

I've also provided a sample of a trigger file which is mainly clean and free of any obscenities.

**Running Instructions**

First clone the repo and then install discord.js inside the directory: `npm install discord.js`.

If you're on Linux (running on a Raspberry Pi, for example), put the ding-dong folder in your home directory (`~/`) and then create a file called "priv.txt" inside the ding-dong folder. That file should contain the line for your Discord token login and should look something like the following:

    client.login("your-private-token-goes-here");

Then run start.sh and you're good. This should also work on Mac, but I haven't tested it so no guarantees.

If you're on Windows, then simply just edit index-nokey.js and add `var ddhome = '/path/to/ding-dong'` right at the top, and also add the client log in line right at the bottom. It's recommended that you not save these changes to index-nokey.js, but rather save to a new file called index.js so that you don't run into conflicts if you pull new changes.
