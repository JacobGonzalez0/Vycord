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

        this.httpsRequest({
            host: "pixabay.com",
            path: "/api/?key=" + API_KEY + "&q=" + encodeURIComponent(args[0])
        },
        (res)=> this.request(res, message))
        
    }

    //Override
    help(){
        let helpText = `Returns the first result on Pixibay: <search>`
        return helpText
    }

    request(res, message){

        
        this.instances.set(message.channel.id, 
            new Instance(message.channel.id, res))
        
        this.instances.get(message.channel.id).res.on('data', function (chunk) {
            this.instances.get(message.channel.id).addData(chunk)
        });

        this.instances.get(message.channel.id).res.on('end', ()=> this.end(message.channel.id))
    }

    end(channel_id){

        let data = this.instances.get(channel_id).JSON();

        let pick =  Math.floor(Math.random() * data.hits.length - 1) || args[1]
        if(data.hits.length == 0){
            message.channel.send("No images found");
        }
        let currentHit = data.hits[pick]

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
    }

}

class Instance{
    constructor(id, res){
        this.channel_id = id;
        this.res = res;
        this.data = '';
    }

    addData(str){
        this.data += str
    }

    getData(str){
        return this.data
    }

    setMessageId(message){
        this.message_id = message.id
    }

    JSON(){
        try {
            let json = JSON.parse(this.data);
            return json;
        } catch (e) {
            return {err: "Invalid data"};
        }
    }
}

module.exports = Pixibay;