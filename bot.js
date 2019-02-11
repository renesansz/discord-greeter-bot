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
            // !ping
            case 'ping':
                bot.sendMessage({ to: channelID, message: 'Pong!' });
		break;
	    // !new Title of List
	    case 'new':
		title = message.substring(5);
	        bot.sendMessage({ to: channelID, message: 'Starting new list: '+title });
		break;
	    // !title
	    // Repeat the current title
	    case 'title':
	        bot.sendMessage({ to: channelID, message: 'Current title is: '+title });
		break;
	    case 'add':
		entry = message.substring(5);
		entries.push(entry);
		bot.addReaction({
	    	    channelID: channelID,
		    messageID: evt.d.id,
		    reaction: "🤖"
		}, (err,res) => {
		    if (err) logger.info(err)
		});
	        bot.sendMessage({ to: channelID, message: 'Adding #'+entries.length+' to '+title });
		break;
	    case 'end':
		let listmessage = '';
		listmessage = listmessage + title + "\n"
		for (var entrynum = 0; entrynum < entries.length; entrynum++) {
		    let humnum = entrynum + 1;
	            listmessage = listmessage + humnum+". "+entries[entrynum]+"\n";
		};
		fs.writeFile('lists/'+title+'.txt', listmessage, (err) => {
			if (err) throw err;
		});
		logger.info('Saved list: '+title);
	        bot.sendMessage({ to: channelID, message: listmessage });
		bot.uploadFile({ to: channelID, file: './lists/'+title+'.txt'});
		title = "";
		entries = [];
		logger.info('Variables cleared');
		break;
            default:
                bot.sendMessage({ to: channelID, message: 'Unknown command.' });
        }
    }

    let dotsplits = message.split('.');
    if (dotsplits[0].length > 0 && !isNaN(dotsplits[0])) {
        logger.info('WE GOT A NUMBER, CAP\'N');
	let entrytext = message.substring(message.indexOf(".")+1);
	entrytext = entrytext.trim();
	logger.info('The entry is: '+entrytext);
	entries.push(entrytext);
	bot.sendMessage({ to: channelID, message: 'Adding #'+entries.length+' to '+title });

    }

})
