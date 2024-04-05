'use strict';

import { _Debug_ } from './debug';
import { Emitter } from './emitter';

/*eslint no-undef: "off"*/

export class Equipment extends Emitter {
    constructor(name){
        super();
        if(DEBUG.ON) _Debug_.checkEmptyAndValidString(name);
        this.name = name;
    }

    getName(){
        if(DEBUG.ON) _Debug_.checkEmptyAndValidString(this.name);
        return this.name;
    }
    
    equip(equipment){
        if(DEBUG.ON) _Debug_.checkEquipable(equipment);
        this[equipment.getName()] = equipment;
    }

    unequip(equipment){
        if(DEBUG.ON) _Debug_.checkEquipable(equipment);
        delete this[equipment.getName()];
    }
}