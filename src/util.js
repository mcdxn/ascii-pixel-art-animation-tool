'use strict';

import { _Debug_ } from './debug';

/*eslint no-undef: "off"*/

export class Util{

    static copyAndValidateOptions(options, state){
        for(const p in options){
            if(DEBUG.ON) _Debug_.checkHasOwnProperty(state, p);
            state[p] = options[p];
        }
        return state;
    }
    
    static copyOnlyPropertiesWithValue(a, b){
        for(const p in a){
            b[p] ? b[p] : b[p] = a[p];
        }

        return b;
    }
    
    static extractNumberFromStringFontSize(fontSize){
        const reg = new RegExp(/em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax/, 'gi');
        let value = fontSize.replace(reg, '');
        value = Number.parseInt(value, 10);
        return value; 
    }
    
    static isStringEmpty(s){
        if(typeof s !== 'string') throw 'ERROR NOT A STRING';
        if(s === '' || s === ' ') throw 'ERROR STRING IS EMPTY';
    }

    static isAllowedASCII(ascii){

        const asciiCode = ascii.charCodeAt(0);
        
        // if(DEBUG.ON) _Debug_.log(`KEY: ${asciiCode}`);

        // TODO: Need to include extended ASCII characters
        //       that maintain space and grid alignment.
         
        if(asciiCode > 32 && asciiCode < 126){
            return true;
        }

        return false;
    }

    static parseStringToBool(value){
        if(value === 'true') return true;
        if(value === 'false') return false;
    }
}