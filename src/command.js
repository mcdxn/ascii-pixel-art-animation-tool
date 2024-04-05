'use strict';

import { _Debug_ } from './debug';

export class Command {

    constructor(name){
        this.name = name || 'NO COMMAND NAME';
    }

    setCommandName(name){
        if(DEBUG.ON) _Debug_.checkEmptyAndValidString(name);
        this.name = name;
    }

    getCommandName(){
        return this.name;
    }

    execute(){
        throw 'THIS COMMAND HAS NO IMPLEMENTATION. PLEASE IMPLEMENT <3 <3 <3';
    }
}