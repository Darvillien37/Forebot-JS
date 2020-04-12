//============================ Logging set up ==================================
// require winston.js logging package
var winston = require('winston');
//Get the current dateTime do write in the logging file name
var dtNow = GetFormatedDateTime(true);

const { combine, printf } = winston.format;

const myFormat = printf(({ level, message }) => {
	return `[${GetFormatedDateTime(false)}] [${level}] ${message}`;
});

//Initialise the logger
const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.combine(	
		winston.format.colorize(),	
		myFormat
	),
	transports: [
		new winston.transports.Console(),
		// - Write to all logs with level `info` and below to `combined.log` 
		// - Write all logs error (and below) to `error.log`.		
		new winston.transports.File({ filename: './Logs/' + dtNow + 'error.log', level: 'error' }),
		new winston.transports.File({ filename: './Logs/' + dtNow + 'combined.log' })
	]
});

//============================ Discord bot set up ==================================
const Discord = require('discord.js');
var location = 'D:\\GitHub\\ForebotToken';
const auth = require(location + '/auth.json');

const COMMAND_CHARACTER = '!';


//Initialise the bot
const bot = new Discord.Client()

//event when the bot has logged in
bot.on('ready', () => {
	logger.info('Connected');
	logger.info('Logged in as: ' + bot.user.tag);

	//List all the guilds the bot is connected to
	var guildChanelList = "";
	bot.guilds.forEach((guild) => {
		guildChanelList = guildChanelList + "\n - " + guild.name;		

		// List all channels in the guild
		guild.channels.forEach((channel) => {
			guildChanelList = guildChanelList + `\n\t -- ${channel.name} (${channel.type}) - ${channel.id}`;
		})
	})

	logger.info('Guilds:' + guildChanelList);	
});

bot.on('message', (receivedMessage) => {
	// Prevent bot from responding to its own messages
	if (receivedMessage.author == bot.user) {
		return
	}


	if (receivedMessage.content.startsWith(COMMAND_CHARACTER)) {
		ProcessCommand(receivedMessage)
	}	
})

bot.login(auth.token);




// ============================ Functions ==================================

function ProcessCommand(receivedMessage) {
	let fullCommand = receivedMessage.content.substr(1) // Remove the leading command character
	let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space

	let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
	let args = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

	switch (primaryCommand) {
		case "help":
			HelpCommand(args, receivedMessage);
			break;
		
	}
}


function HelpCommand(args, receivedMessage) {
	
	if (args.length == 0) {
		receivedMessage.channel.send("Type '" + COMMAND_CHARACTER + "help [command]' to know about a specific command."
			+ "\nToDo: list commands");
	}
	else
	{
		receivedMessage.channel.send("ToDo: rest of help command");		
	}	
}




//Summary: 
//	Function gets a formatted TimeDate string, formatted with either
//		file name characters, or user readable characters
//params:
//	forFileNames: Boolean, true for file name formatting, false for user reading characters.
//Returns:
//	Formatted TimeDate string
function GetFormatedDateTime(forFileNames) {
	var today = new Date();
	var dateSep = '/';
	var timeSep = ':';
	var tdSep = ' ';

	if (forFileNames == true) {
		dateSep = '-';
		timeSep = '-';
		tdSep = '_';
	}

	var year = today.getFullYear();
	var month = (today.getMonth() + 1);	
	var day = today.getDate();	

	var hour = today.getHours();
	var min = today.getMinutes();
	var sec = today.getSeconds();

	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	
	if (hour < 10) {
		hour = "0" + hour;
	}
	if (min < 10) {
		min = "0" + min;
	}
	if (sec < 10) {
		sec = "0" + sec;
	}

	var date = year + dateSep + month + dateSep + day;
	var time = hour + timeSep + min + timeSep + sec;
	return date + tdSep + time;

}