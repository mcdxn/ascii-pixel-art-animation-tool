'use strict';

import { _Debug_ } from './debug';

/*eslint no-undef: "off"*/


export class FontUtil {

    static isFontAvailable(fontName) {
        
        const text = '(-]Verifying_F0NT[-)';

        const f1 = document.getElementById('f1');
        const f2 = document.getElementById('f2');

        f2.style.fontFamily = `${fontName}, Arial`;
        
        f1.style.fontSize = '8pt';
        f2.style.fontSize = '8pt';
        
        f1.innerHTML = text;
        f2.innerHTML = text;

        const {width:f1Width} = f1.getBoundingClientRect();
        const {width:f2Width} = f2.getBoundingClientRect();
        
        if(Math.floor(f1Width) !== Math.floor(f2Width)){
            return true;
        }

        f2.style.fontFamily = '';
        
        f1.style.fontSize = '0px';
        f2.style.fontSize = '0px';
        
        f1.innerHTML = '';
        f2.innerHTML = '';

        if(DEBUG.ON) _Debug_.log(`Font1: ${Math.floor(f1Width)} Font2: ${Math.floor(f2Width)}`);

        return false;
    }
    
}


