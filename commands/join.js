const Command = require("../Command");
// message object in onMessage() can be found at
// https://discord.js.org/#/docs/main/stable/class/Message
class Join extends Command{

    constructor(){
        super();
    }

    //Override
    onMessage(message, args){
        bot.media.addInstance(message.member.voice.channel.id)
    }

    //Override
    help(){
        let helpText = `Makes the bot join your voice channel`
        return helpText
    }

}
 
module.exports = Join;