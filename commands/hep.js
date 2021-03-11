const Command = require("../Command");

class Hep extends Command{

    //Override
    onMessage(message, args){
        //it just heps for some reason

        message.channel.send("*heps*");
    }

    //Override
    help(){
        let helpText = `It just heps`
        return helpText
    }

}

module.exports = Hep;