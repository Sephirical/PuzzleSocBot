const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const fs = require('fs');
const cryptics = require('./cryptic.json');
var players = JSON.parse(fs.readFileSync('./stats.json'));
var puzzle = 'none';
var curr_puzzle;
var points_left = 3.0;
var channel;
var players_submitted = [];
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  var user = msg.author;
  if (user.bot === false) {
    if (msg.channel.type === 'dm' && !players_submitted.includes(user) && puzzle === 'cryptic') {
      if (msg.content.toLowerCase() === curr_puzzle.answer) {
        msg.channel.send("Correct!");
        if (!players[user.id]) players[user.id] = {
          "picarats":0.0,
          "firsts":0,
          "seconds":0,
          "thirds":0,
          "other":0
        }
        players_submitted.push(user);
        switch (points_left) {
          case 3.0:
            channel.send(`${user} has gotten the correct answer! 3 picarats!`);
            players[user.id].picarats += 3.0;
            players[user.id].firsts++;
            points_left = 2.0;
            break;
          case 2.0:
            channel.send(`${user} has gotten the correct answer! 2 picarats!`);
            players[user.id].picarats += 2.0;
            players[user.id].seconds++;
            points_left = 1.0;
            break;
          case 1.0:
            channel.send(`${user} has gotten the correct answer! 1 picarat!`);
            players[user.id].picarats += 1.0;
            players[user.id].thirds++;
            points_left = 0.5;
            break;
          default:
            channel.send(`${user} has gotten the correct answer! 0.5 picarats!`);
            players[user.id].picarats += 0.5;
            players[user.id].other++;
        }
        
        fs.writeFile('./stats.json', JSON.stringify(players), (err) => {
          if (err) console.error(err);
        });
      } else {
        msg.channel.send(`${user} was incorrect! Try again.`);
      }
    } else if (msg.content === '!help') {
      msg.reply("my current commands are: \n \
      !cryptic - get a random cryptic crossword clue that you can answer (for points!!!!) \n \
      !hi - get a response from yours truly if you're ever feeling lonely! \n \
      !pickup - get a random pickup line for you! \n \
      !ping - pong! \n \
      !set - get the link to the daily Set puzzle!");
    
    } else if (msg.content === '-ping') {
      msg.reply("pong!");
    } else if (msg.content === '-set') {
      msg.reply("you can access the New York Times' daily Set puzzle at https://www.nytimes.com/puzzles/set");
    } else if (msg.content === '-pickup') {
      var pickupLines = [`${user}, OUCH are you okay? Cause I just saw you fall out of heaven`, `${user}, do you have a bandaid? Because I just scraped my knee falling for you`, `Wow are you ${user} cause everyone wants you`, `${user}, out of 10, you're a 9, cause I'm the one that you need`]
      var roll = Math.floor(Math.random() * pickupLines.length);
      msg.channel.send(pickupLines[roll]);
    } else if (msg.content === '-hi') {
      msg.channel.send(`Hi ${user}!`);
    } else if (msg.content === '-cryptic' && puzzle === 'none') {
      var roll = Math.floor(Math.random() * cryptics.length);
      msg.reply("your cryptic crossword clue is: " + cryptics[roll].cryptic);
      puzzle = 'cryptic';
      curr_puzzle = cryptics[roll];
      channel = msg.channel;
    } else if (msg.content === '-events') {
      msg.reply("these are our upcoming events: \n \
      None.");
    } else if (msg.content === '-rebus' && puzzle === 'none') {
      msg.reply("my head hurts... I'll get back to you on that.");
    } else if (msg.content.match(/^-a+$/)) {
      var new_aaa = msg.content.replace(/-/, '');
      msg.channel.send(new_aaa);
    } else if (msg.content.match(/^-a\d\d?/)) {
      var num_aaa = msg.content.replace(/-a/, '');
      var new_aaa = "";
      for (i = 0; i < num_aaa; i++) {
        new_aaa += 'a';
      }
      msg.channel.send(new_aaa);
    } else if (msg.content === '-reset' && msg.member.hasPermission("ADMINISTRATOR")) {
      if (puzzle === 'none') {
        msg.reply("there is no puzzle running right now!");
      } else {
        puzzle = 'none';
        points_left = 3;
        players_submitted = [];
        msg.reply("I've reset the puzzle!");
      }
    } else if (msg.content === '-cryptic' && puzzle === 'cryptic' && msg.member.hasPermission("ADMINISTRATOR")) {
      msg.reply(`the current cryptic is: ${curr_puzzle.cryptic}`);
    } else if (msg.content.startsWith('-sleep')) {
        var users = msg.mentions.users.array();
        if (users.length == 0) {
          msg.channel.send(``, {files: ["sleep.gif"]});
        } else {
          var string = "";
          for (i = 0; i < users.length; i++) {
            string += users[i] + " ";
          }
          msg.channel.send(string, {files: ["sleep.gif"]});
       }
    } else if (msg.content === '-stats') {
      if (!players[user.id]) {
        msg.reply("you haven't participated in a puzzle yet!");
      } else {
        msg.reply(`you have ${players[user.id].picarats} picarats! \n \
        First place finishes: ${players[user.id].firsts} \n \
        Second place finishes: ${players[user.id].seconds} \n \
        Third place finishes: ${players[user.id].thirds} \n \
        Fourth or lower finishes: ${players[user.id].other}`);
        
      }
    }
  }
});

client.login(auth.token);