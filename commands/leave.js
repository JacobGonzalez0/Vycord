const Command = require("../Command");
const Media = require("../Media");
// message object in onMessage() can be found at
// https://discord.js.org/#/docs/main/stable/class/Message
class Leave extends Command{

    constructor(){
        super();
    }

    //Override
    onMessage(message, args){
        //it just heps for some reason
        bot.media.leave(message.member.voice.channel.id)  
    }

    //Override
    help(){
        let helpText = `The bot will leave the voice channel you are connected to.`
        return helpText
    }

}

module.exports = Leave;