var Discord = require('discord.io');
var fs = require('fs');

var logger = require('winston');
var auth = require('./auth.json');


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';


// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});


bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

let lists = {};

class RPGList {
    constructor(title) {
	    this.title = title;
	    this.entries = [];
    }

    //add an entry to a list
    addEntry(message) {
	    this.entries.push(message);
    }

    //get a printable version with title and numbered entries
    get printable(){
	    let printable = this.title+"\n";
            for (var entrynum = 0; entrynum < this.entries.length; entrynum++) {
                let humnum = entrynum + 1;
                printable = printable + humnum+". "+this.entries[entrynum]+"\n";
            };
	    return printable;
    }

    save() {
	fs.writeFile('./lists/'+this.title+'.txt',
			this.printable,
			(err) => {  
	    if (err) throw err;
	    logger.info('saved lists/'+this.title+'.txt');
	    })
    }
}

let title = ''
let entries = []

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it needs to execute a command
    // for this script it will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
	//take the message, chop the ! and split by spaces
        var args = message.substring(1).split(' ');
	//the command is the first part
        var cmd = args[0];

        args = args.splice(1);

        switch(cmd) {
	    // !new Title of List
	    case 'new':
		title = message.substring(5);
		lists[channelID] = new RPGList(title);
	        bot.sendMessage({ to: channelID, message: 'Starting new list: '+lists[channelID].title });
		break;
	    // !title
	    // Repeat the current title
	    case 'title':
	        bot.sendMessage({ to: channelID, message: 'Current title is: '+lists[channelID].title });
		break;
	    ///save the list and reprint it collated
	    case 'end':
	        bot.sendMessage({
			to: channelID,
			message: lists[channelID].printable });
		lists[channelID].save();
		break;
            default:
                bot.sendMessage({ to: channelID, message: 'Unknown command.' });
        }
    }

    //catch list entries that are just a number and a dot
    let dotsplits = message.split('.');
    if (dotsplits[0].length > 0 && !isNaN(dotsplits[0])) {
	let entrytext = message.substring(message.indexOf(".")+1);
	entrytext = entrytext.trim();
	bot.addReaction({
	    channelID: channelID,
	    messageID: evt.d.id,
	    reaction: "🤖"
	}, (err,res) => {
	    if (err) logger.info(err)
	});
	logger.info('The entry is: '+entrytext);
	lists[channelID].addEntry(entrytext);
	// bot.sendMessage({ to: channelID, message: 'Adding #'+lists[channelID].entries.length+' to '+lists[channelID].title });

    }

})
