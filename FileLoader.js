const Discord = require('discord.js');
const Database = require('./Database');


class FileLoader{

    constructor(){
        this._fs = require("fs");
        this._db = new Database();
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
                if(name.indexOf("js") != -1){
                    _files.push(name);
                }
                
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
            let _command = require("./" + file);
            let command = new _command();
            this._db.addCommand(_command.name.toLowerCase(), command.help())
            collection.set(_command.name.toLowerCase(), command);
        })

        this._db.getCommands();

        return collection;
    }

}
module.exports = FileLoader;