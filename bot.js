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

class RPGList {
    constructor(title, channelID) {
	    this.channelID = channelID
	    this.title = title;
	    this.path = __dirname+"/lists/"+channelID+"/"+title+".json"
	    this.entries = [];
	    fs.mkdir(__dirname+"/lists/"+channelID,
	              { recursive: true }, (err) => {
		      if (err) throw err;
	    });
	    logger.info("initialized "+this.path);
    }

    //add an entry to a list
    addEntry(message) {
	    this.entries.push(message);
	    this.save();
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

    get json(){
	    return JSON.stringify(this);
    }

    load(path) {
	    this.entries = require(this.path);
    }

    save() {
	fs.writeFile(this.path,
			JSON.stringify(this.entries),
			//this.json,
			(err) => {  
	    if (err) throw err;
	    logger.info('saved '+this.path);
	    })
    }
}

//start activelists as blank, to contain list objects
let activeLists = {};

//initialize titles from the last known list of active tables
//this will fail bad if titles.json hasn't yet been created
//let titles = {};
let titles = require("./titles.json")

logger.info("Loading lists according to titles.json:");
logger.info(titles);

//for each active title, load that list from file
//key = channelID, titles[key] = title
for (var key in titles) {
	logger.info("loading "+titles[key]+" for channelID "+key);
	let newlist = new RPGList(titles[key], key);
	newlist.load("./lists/"+key+"/"+titles[key]);
	activeLists[key] = newlist;
	logger.info("success");
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
		titles[channelID] = title;
		activeLists[channelID] = new RPGList(title, channelID);
		fs.writeFile('titles.json',
				JSON.stringify(titles),
				(err) => {
					if (err) throw err;
				});
	        bot.sendMessage({ to: channelID, message: 'Starting: '+titles[channelID] });
		break;
	    // !title
	    // Repeat the current title
	    case 'title':
	        bot.sendMessage({ to: channelID, message: 'Current: '+titles[channelID] });
		break;
	    ///save the list and reprint it collated
	    case 'end':
	        bot.sendMessage({
			to: channelID,
			message: activeLists[channelID].printable });
		activeLists[channelID].save();
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
	activeLists[channelID].addEntry(entrytext);
	logger.info(activeLists[channelID].json);
	// bot.sendMessage({ to: channelID, message: 'Adding #'+lists[channelID].entries.length+' to '+lists[channelID].title });

    }

})
