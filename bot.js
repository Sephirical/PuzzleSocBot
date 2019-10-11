const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const cryptics = require('./cryptic.json');
var puzzle = 'none';
var curr_puzzle;
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  var user = msg.author;
  if (puzzle === 'cryptic') {
	if (msg.content.toLowerCase() === curr_puzzle.answer) {
	  //msg.channel.bulkDelete(1);
	  msg.channel.send(`${user} has gotten the correct answer!`);
	  puzzle = 'none';
	} else {
	  if (user.bot === false) {
		//msg.channel.bulkDelete(1);
		msg.channel.send(`${user} was incorrect! Try again.`);
      }
	}
  } else if (msg.content === '!help' && puzzle === 'none') {
	msg.reply("my current commands are: \n \
	!cryptic - get a random cryptic crossword clue that you can answer (for points!!!!) \n \
	!hi - get a response from yours truly if you're ever feeling lonely! \n \
	!pickup - get a random pickup line for you! \n \
	!ping - pong! \n \
	!set - get the link to the daily Set puzzle!");
	
  } else if (msg.content === '!ping' && puzzle === 'none') {
    msg.reply('pong!');
  } else if (msg.content === '!set' && puzzle === 'none') {
	msg.reply("you can access the New York Times' daily Set puzzle at https://www.nytimes.com/puzzles/set");
  } else if (msg.content === '!pickup' && puzzle === 'none') {
	var pickupLines = [`${user}, OUCH are you okay? Cause I just saw you fall out of heaven`, `${user}, do you have a bandaid? Because I just scraped my knee falling for you`, `Wow are you ${user} cause everyone wants you`, `${user}, out of 10, you're a 9, cause I'm the one that you need`]
	var roll = Math.floor(Math.random() * pickupLines.length);
	msg.channel.send(pickupLines[roll]);
  } else if (msg.content === '!hi' && puzzle === 'none') {
	msg.channel.send(`Hi ${user}!`);
  } else if (msg.content === '!cryptic' && puzzle === 'none') {
	var roll = Math.floor(Math.random() * cryptics.length);
	msg.reply("your cryptic crossword clue is: " + cryptics[roll].cryptic);
	puzzle = 'cryptic';
	curr_puzzle = cryptics[roll];
  } else if (msg.content === '!events' && puzzle === 'none') {
	msg.reply("these are our upcoming events: \n \
	None.");
  }
});

client.login(auth.token);