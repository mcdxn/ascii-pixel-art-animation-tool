'use strict';

import { Equipment } from './equipment';


export class Commander extends Equipment {

    registerCommand(command){
        this[command.getCommandName()] = command;
    }

    executeCommand(name){
        return new Promise(function (resolve){
            this[name].execute();
            resolve(true);
        }.bind(this));
    }
}