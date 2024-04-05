'use strict';

import { SYSTEM }    from './system-main';

export class Keyboard {

    static create(){
        return Keyboard;
    }

    static init(){

        document.addEventListener('keypress', (event)=>{
        
            const key = event.key;

            if(!event.ctrlKey){
                if(key.length === 1){
                    SYSTEM.setASCII(key);
                }
            }
        });
    }
}