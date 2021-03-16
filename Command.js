const Discord = require('discord.js');
const https = require('https');

class Command{

    constructor(){
        if (this.onMessage === undefined) {
            throw new Discord.TypeError("Must override method");
        }
        if (this.help === undefined) {
            throw new Discord.TypeError("Must override method");
        }
        this.instances = new Discord.Collection();
    }

    onMessage(message, args){
    }

    help(){    
    }

    stringArgs(args){

        let arr = args.join()
        let a = arr.split('"');
        let b = []
        a.forEach( (str, i) =>{
        
            if(str == '\u0020') return;
            if(str == "") return;
            
            b.push(
                str.replace(/,/g, ' ')
            ) 
        })
        
        
        return b
    }

    textBox(string, width, fontSize){
        let maxCharsPerLine = Math.round(width/fontSize); 
        let lines = Math.round(string.length/maxCharsPerLine)
        let line = 1;
        let str = ''
        for(var i = 0; i < string.length-1; i += maxCharsPerLine){ 
            if(line == 1 && string.length <= maxCharsPerLine){ // if we are on the first line
                str += string.substring(maxCharsPerLine*(line-1), (line*maxCharsPerLine)+1 );
            }else if(line == 1){ // if we are on the first line
                str += string.substring(maxCharsPerLine*(line-1), (line*maxCharsPerLine)+1 );
                str += "-"
            }else if(line >= lines){ // if we are on the last line
                str += string.substring(maxCharsPerLine*(line-1)+1, (line*maxCharsPerLine)+1 );
            }
            else{ //in between lines 
                str += string.substring(maxCharsPerLine*(line-1)+1, (line*maxCharsPerLine)+1 );
                str += "-"
            }
            str += '\n'
            line++

        }
        return str
    }

    httpsRequest(options, callback){
        https.request(options, (res) => callback(res)).end()
    }

}
module.exports = Command;