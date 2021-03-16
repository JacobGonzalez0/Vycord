const Command = require("../Command");
const Media = require("../Media");
const Settings = require("../settings.json");
const Discord = require("discord.js")
const https = require('https');
const e = require("express");
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

    async request(res, message){
        this.instances.set(message.channel.id, 
           await new Instance(message.channel.id, res, message))
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
    constructor(id, res, message){
        this.channel_id = id;
        this.res = res;
        this.data = '';
        this.message = message;
        this.res.on('data', (chunk) => this.addData(chunk));
        this.res.on('end', ()=> this.send())
        this.sentMessage = null;
        this.pick = 0;
        this.userReact = null;
    }

    /*flow of this instance is
        constructor => send() => addReaction => awaitReaction => userinput => update()
    */

    send(){
        let data = this.JSON();

        if(data.hits.length == 0){
            message.channel.send("No images found");
        }
        let currentHit = data.hits[this.pick]

        const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Pixibay search result')
        .setURL(currentHit.pageURL)
        .setAuthor(currentHit.user, currentHit.userImageUrl, currentHit.pageURL)
        .setDescription(currentHit.tags)
        .setImage(currentHit.webformatURL)
        .setTimestamp()
        .setFooter('Pixibay search');

        this.message.channel.send(embed).then( (msg) => this.addReaction(msg) );
    }
 

    update(){
        
        let data = this.JSON();

        if(data.hits.length == 0){
            this.message.channel.send("No images found");
        }
        let currentHit = data.hits[this.pick]

        console.log(this.sentMessage)
        const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Pixibay search result')
        .setURL(currentHit.pageURL)
        .setAuthor(currentHit.user, currentHit.userImageUrl, currentHit.pageURL)
        .setDescription(currentHit.tags)
        .setImage(currentHit.webformatURL)
        .setTimestamp()
        .setFooter('Pixibay search');

        this.sentMessage.edit(embed).then( (msg) => this.addReaction(msg) );
        
    }

    addReaction(message){
        //clears all reactions
        message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)).then( ()=>{
            message.react('⬅️').then( () =>{ //following lines add the reations THEN starts the listener on reactions
                message.react('➡️').then( () => this.awaitReaction(message))
            })
        });
        
        
    }

    awaitReaction(message){
        // checks only for these two emojis and if youre a bot to prevent a loop
        const filter = (reaction, user) => {
            return ['⬅️', '➡️'].includes(reaction.emoji.name) && !user.bot 
        };
        message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
            const reaction = collected.first();
            this.sentMessage = message; //this is needed to keep the loop going if someone clicks onsomething

                if (reaction.emoji.name === '⬅️') {
                    this.pick --;
                    this.update()
                }else {
                    this.pick ++;
                    this.update()
                }
            
        
        })
        .catch(collected => {
            
        });
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