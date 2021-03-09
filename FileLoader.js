const Discord = require('discord.js');

class FileLoader{

    constructor(){
        this._fs = require("fs");
    }

    //returns array of files
    checkDir(dir, _files){
        _files = _files || [];
        let files = this._fs.readdirSync(dir);
        files.forEach( element => {
            let name = dir + "/" + element;
            if(this._fs.statSync(name).isDirectory()){
                this.checkDir(name, _files);
            }else{
        
              _files.push(name);
            }
          })
        return _files
    }

    parseCommands(files){
        
        if(!Array.isArray(files)){
            console.error("Invalid Array")
            return -1
        }

        let collection = new Discord.Collection();
        files.forEach( file =>{
            let command = require("./" + file);
            collection.set(command.name.toLowerCase(), new command());
        })

        return collection;
    }

}
module.exports = FileLoader;