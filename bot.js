const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const fs = require('fs');
const cryptics = require('./cryptic.json');
var players = JSON.parse(fs.readFileSync('stats.json'));
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
          "id":user.id,
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
        //console.log(`${Object.keys(players).length}`);
        var newjson = "[ ";
        for (i = 0; i < Object.keys(players).length; i++) {
          newjson += JSON.stringify(players[Object.keys(players)[i]]);
          if (i == Object.keys(players).length - 1) {
            newjson += " ]";
          } else {
            newjson += ", ";
          }
        }
        fs.writeFile('stats.json', newjson, (err) => {
          if (err) console.error(err);
        });
        //console.log(`${Object.keys(players).length}`);
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
    } else if (msg.content.match(/^!a+$/)) {
      var new_aaa = msg.content.replace(/!/, '');
      msg.channel.send(new_aaa);
    } else if (msg.content === '-reset') {
      if (puzzle === 'none') {
        msg.reply("there is no puzzle running right now!");
      } else {
        puzzle = 'none';
        points_left = 3;
        players_submitted = [];
        msg.reply("I've reset the puzzle!");
      }
    } else if (msg.content === '-cryptic' && puzzle === 'cryptic') {
      msg.reply(`the current cryptic is: ${curr_puzzle.cryptic}`);
    } else if (msg.content.startsWith('-sleep')) {
        //const attachment = new Discord.MessageAttachment('./sleep.gif');
        //msg.channel.send(attachment);
        //message.channel.send("Hey, ", {files: ["https://pa1.narvii.com/6559/82632842ac51f65e88c34d54257d0d13dd257ccd_128.gif"]});
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
        //msg.reply(`you have ${players[user.id].picarats} picarats!`);
        var yes = JSON.stringify(players);
        msg.reply(`${yes}`);
      }
    }
  }
});

client.login(auth.token);