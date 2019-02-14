<img src="https://images2.imgbox.com/a1/c2/pGy6ICJI_o.jpg" alt="alt text" width="300">

# Zadelrazz
Zadelrazz is a discord bot for making lists. Tell him when you are starting a new lists, and he will automatically save each new numbered entry. Finally, tell him when you're done and he'll spit out the whole thing.

# Commands
!new [NAME] : Start listening for entries to table NAME.

-> Each following message that begins with i., where i is an integer, will be added to the table.

!title : Print the active table's name.

!end : Close the active table, list its contents, and save them to the server.

!help : Display this help message.

See !help for an up-to-date list of commands and options.

# Todo

## High priority
* record server of origin and entry authors
* better folder names (maybe just a file in the folder with the name of the server/channel?)
* flagging system for moderation

## Low priority
* roll on saved lists
* search saved lists
* output compiled lists to an additional specified channel
* host online somewhere
* make publicly invitable
* switch to [eris](https://github.com/abalabahaha/eris)
* Search saved list contents
* Allow for list switching in a single channel
* output to HTML, static pages or as wiki (or as tiddlywiki???)
* Have lists refer to other lists
* sort lists by server


# Prerequisites

* Must have installed Node JS
* Must have Git installed

# Setup

* To install dependencies: `npm install`
* Discord.io's gateway is currently broken so to run bots also run `npm install woor/discord.io#gateway_v6` in the main directory

# Running Server

Simply run the command `node bot.js`
