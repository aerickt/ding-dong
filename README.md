Ding Dong You Are Wrong
======

**A Discord Bot for Immature Teenagers to ~~Bully~~ Tease Their Friends**

This is my first time coding in node, so I***REMOVED***m sure there are several things that could be improved. I really don***REMOVED***t like the fact that I didn***REMOVED***t use the json file format for the trigger file; that would have made some aspects of this bot easier (it would also save about 25 lines that I use to process the trigger file and possibly a few seconds to load the triggers and replies into arrays). But it also would have made some things maybe a little more complicated, so I***REMOVED***m not going to do anything about that for now.

Also, because I don***REMOVED***t code very often, I get the feeling that this is one giant bodge.

All triggers are found in triggers.txt and use regexes. Though, any phrases or words without any regexes characters or rules surrounding them is just a regular string that the bot will try and match. A new line just indicates a separation of a different reply block. In each reply block the first line contains the responses that the bot will cycle through while the triggers and conditions are below that first line.

The minimum number of responses for each block is 1 and there is no maximum.

**Every response line must end with a semicolon. Every trigger must be lower case.**

The bot automatically converts every message to lower case and ignores apostrophes before comparing with the triggers. It does this by removing everything that is under the first response block (with the response of "NoTrigger") from the message before comparing the message.

    NoTrigger
    ***REMOVED***
    ***REMOVED***
    
    Response one;Response number two with spaces;Response three;alternate;
    u!>user#1234
    i like (apples|oranges|dragonfruit)
    i am (our |a |)(god|supreme leader)
    
    New Set of Triggers;sm>alternate;Response number two with spaces;
    u>asdf#1234;arst#1234
    (im|i am) short
    
    #u likes apples and #1 and #2;#un likes apples and #1 and #2;
    5n>i like apples and (.*)#1 and (.*)#2

You can repeat responses, however you cannot repeat triggers in different blocks. The bot goes through triggers.txt top to bottom, so higher up triggers will have precedence over those below it. The bot will only reply to one trigger and will never reply more than once.

**Mocking Sarcastic Reply**

`alternate` is a special resonse in which it takes the trigger, alternates the case and replies back with aLtErNaTiNg case. Replying to a message with the trigger `$altme` will alternate the case of the message you***REMOVED***ve replied to. Unfortunately, this is all handled in the code. I may end up changing that because it feels wrong to just have a trigger in the code itself rather than in the triggers file.

**User Specific Triggers**

The reply block with `u>asdf#1234;arst#1234` will ony apply to those users while the reply block with `u!>user#1234` will not apply to that user. The user allow/disallow line should always be the second line of each trigger block, otherwise it will not be recognised. It doesn***REMOVED***t make sense to have both a disallow and an allow line, but if there is, the disallow line will take precedence. Having no allow/disallow line will have the triggers apply to all users.

**Send Rather Than Reply Flag**

`sm>` is a tag that will have the reply only send a message to the channel, rather than replying to the person, which pings them. So, the alternate response in the third response black will only resend the person***REMOVED***s message (with alternating case), but the "response number two with spaces" will ping the user and in the same message literally reply with "Response number two with spaces".

**"Variables" and Custom Pinging**

The bottom reply block has variables in the triggers and responses. The `#un` tag will be the user***REMOVED***s username, while the `#u` tag will ping the user. The tags with a # followed by a number act like variables the way they are in the response block. You can alter the regex to have the variable only match a certain pattern, but that can get really complicated, so the example only shows a basic wild card that will match anything.

The bottom reply block also has a flag on the bottom trigger to only reply when there are 5 messages containing the trigger from the same person. If using a response threshold flag as well as a send message tag, the send message tag has to be last. So for example, `3n>sm>trigger` would be correct, while `sm>3n>trigger` would not. I***REMOVED***m thinking of somehow simplifying the flags and the user white list/blacklist stuff at some point, but for now, you must adhere to this format.

Any regex string should work. Have a look at https://regex101.com/ or consult Google for more information on regexes.

I***REMOVED***ve also provided a sample of a trigger file which is mainly clean and free of any obscenities.

**Running Instructions**

If you***REMOVED***re on Linux (running on a Raspberry Pi, for example), you can easily just create a file called "priv.txt" with the line for your Discord token login. It should look something like the following:

    client.login("your-private-token-goes-here");

Then afterwards, just run start.sh and you***REMOVED***re good. This should also work on Mac, but I haven***REMOVED***t tested it so no guarantees.

If you***REMOVED***re on Windows, then simply just edit index-nokey.js and add `var ddhome = ***REMOVED***/path/to/ding-dong***REMOVED***` right at the top, and also add the client log in line right at the bottom. It***REMOVED***s recommended that you not save these changes to index-nokey.js, but rather save to a new file called index.js so that when you don***REMOVED***t run into conflicts when you pull changes.
