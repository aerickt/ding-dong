Ding Dong You Are Wrong
======

**A Discord Bot for Immature Teenagers to Point Out Innuendos**

This is my first time coding in node, so I***REMOVED***m sure there are several things that could be improved. I really don***REMOVED***t like the fact that I didn***REMOVED***t use the json file format for the trigger file; that would have made some aspects of this bot easier (would have saved about 25 lines that I use to process the trigger file and possibly a lot of time to load the triggers and replies). But it also would have made some things maybe a little more complicated, so I***REMOVED***m not going to do anything about that for now.

All triggers use regexes. Any phrases or words without any regexes characters or rules surrounding them is just a regular string that the bot will try and match. A new line indicates a separation of a different reply block. The first line of every block are the responses that the bot will cycle through with the triggers and conditions below it.

The minimum number of responses for each block is 1 and there is no maximum.

**Every response line must end with a semicolon. Every trigger must be lower case.**

The bot automatically converts every message to lower case and ignores apostrophes before comparing with the triggers. The bot does this by removing everything that is under the first response block (with the response of "NoTrigger") from the message before comparing the message.

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

`alternate` is a special resonse in which it takes the trigger, alternates the case and replies back with aLtErNaTiNg case. You can repeat responses, however you cannot repeat triggers in different blocks. The bot goes through triggers.txt top to bottom, so higher up triggers will have precedence over those below it.

The reply block with `u>asdf#1234;arst#1234` will ony apply to those users while the reply block with `u!>user#1234` will not apply to that user. The user allow/disallow line should always be the second line of each trigger block, otherwise it will not be recognised. It doesn***REMOVED***t make sense to have both a disallow and an allow line, but if there is, the disallow line will take precedence. Having no allow/disallow line with have the triggers apply to all users.

`sm>` is a tag that will have the reply only send a message to the channel, rather than replying to the person, which pings them. So, the alternate response in the third response black will only resend the person***REMOVED***s message (with alternating case), but the "response number two with spaces" will ping the user and in the same message literally reply with "Response number two with spaces".

The bottom reply block has variables in the triggers and responses. The `#un` tag will be the user***REMOVED***s username, while the `#u` tag will ping the user. The tags with a # followed by a number act like variables the way they are in the response block. You can alter the regex to have the variable only match a certain pattern, but that can get really complicated, so the example only shows a basic wild card that will match anything.

The bottom reply block also has a flag on the bottom trigger to only reply when there are 5 messages with the trigger. The bot doesn***REMOVED***t care who the user is and doesn***REMOVED***t keep track of it, so it will reply after 5 triggers regardless of who sent those 5 triggers.

Any regex string should work. Have a look at https://regex101.com/ or consult Google for more information on regexes.

