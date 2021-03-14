const Command = require("../Command");
const Media = require("../Media");
const Settings = require("../settings.json");
const Discord = require("discord.js")
const https = require('https');
// message object in onMessage() can be found at
// https://discord.js.org/#/docs/main/stable/class/Message
class Pixibay extends Command{

    constructor(){
        super();
    }

    //Override
    onMessage(message, args){
        var API_KEY = Settings.Pixibay;

        let options = {
            host: "pixabay.com",
            path: "/api/?key=" + API_KEY + "&q=" + encodeURIComponent(args[0])
        };

        
        https.request(options, (res)=>{
            let data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {
                let pick =  Math.floor(Math.random() * JSON.parse(data).hits.length - 1) || args[1]
                if(JSON.parse(data).hits.length == 0){
                    message.channel.send("No images found");
                }
                let currentHit = JSON.parse(data).hits[pick]

                const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Pixibay search result')
                .setURL(currentHit.pageURL)
                .setAuthor(currentHit.user, currentHit.userImageUrl, currentHit.pageURL)
                .setDescription(currentHit.tags)
                .setImage(currentHit.webformatURL)
                .setTimestamp()
                .setFooter('Pixibay search');

                message.channel.send(embed);
            });

        }).end();
    }

    //Override
    help(){
        let helpText = `Returns the first result on Pixibay: <search>`
        return helpText
    }

}

module.exports = Pixibay;