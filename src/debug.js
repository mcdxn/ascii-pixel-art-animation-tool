'use strict';

import { Equipment }    from './equipment';
import { Pixel } from './pixel';

/*eslint no-undef: "off"*/


const ERROR_MESSAGE = Object.freeze({
    PROPERTY_NOT_FOUND:             'NO PROPERTY FOUND',
    NO_OWN_PROPERTY:                'NO OWN PROPERTY',
    NO_OWN_PROPERTY_AND_CHAIN:      'NO OWN PROPERTY AND IN PROTOTYPE CHAIN',
    ALGO_NOT_FOUND:                 'ALGO NAME NOT FOUND',
    EQUIP_NOT_VALID:                'NOT EQUIPABLE',
    STRING_EMPTY:                   'ERROR STRING IS EMPTY',
    NOT_INSTANCE_OF_STRING:         'ERROR NOT INSTANCE OF STRING',
    NOT_TYPE_OF_STRING:             'ERROR NOT TYPE OF STRING',
    NULL_PARAMETER_OR_UNDEFINED:    'ERROR NULL OR UNDEFINED PARAMETER',
    NOT_VALID_ART_MODE:             'ERROR NOT VALID ART MODE',              
    NOT_VALID_HTML_ELEMENT:         'ERROR NOT VALID HTML ELEMENT',
    NOT_VALID_FUNCTION:             'ERROR NOT VALID FUNCTION',
    NOT_ENUMERABLE_PROPERTY:        'WARNING PROPERTY NOT ENUMERABLE',
    NOT_INSTANCE_OF_NUMBER:         'ERROR NOT INSTANCE OF NUMBER',
    NOT_TYPE_OF_NUMBER:             'ERROR NOT TYPE OF NUMBER',
    NOT_INSTANCE_OR_TYPE_OF_NUMBER: 'ERROR NOT INSTANCE OR TYPE OF NUMBER',
    NOT_INSTANCE_OF_PIXEL:          'ERROR NOT INSTANCE OF PIXEL',
    NOT_INSTANCE_OF_ARRAY:          'ERROR NOT INSTANCE OF ARRAY',
    PARAM_BOLEAN:                   'PARAMETER REQUIRES BOLEAN TYPE'
});

export class _Debug_ {

    static throwException(message){
        throw message;
    }

    static checkBolean(value){
        if(typeof value !== 'boolean'){
            throw `${ERROR_MESSAGE.PARAM_BOLEAN}`;            
        }
    }

    static checkIsPropertyEnumerable(obj, name){
        if(!obj.propertyIsEnumerable(name)){
            throw `${ERROR_MESSAGE.PROPERTY_NOT_FOUND}: ${name}`;            
        }
    }

    static checkPropertyInObject(obj, name){
        if(!(name in obj)){
            throw `${ERROR_MESSAGE.NO_OWN_PROPERTY_AND_CHAIN}: ${name}`;            
        }
    }

    static checkHasOwnProperty(obj, name){
        if(!(name in obj)){
            throw `${ERROR_MESSAGE.NO_OWN_PROPERTY}: ${name}`;            
        }
    }

    static checkAlgoName(name){
        let found = false;
        const entries = Object.entries(ALGO_COMMAND_NAME);

        for(const value of entries){
            if(value[1] === name){
                found = true;
            }
        }

        if(!found){
            throw ERROR_MESSAGE.ALGO_NOT_FOUND;
        }

    }

    static checkEquipable(equipment){
        if(!(equipment instanceof Equipment)){
            throw ERROR_MESSAGE.EQUIP_NOT_VALID;
        }
    }

    static checkValidArtMode(mode){
        switch(mode){
        case ART_MODE.ASCII_ART:
        case ART_MODE.PIXEL_ART:
        case ART_MODE.BLOCK_ART:
            break;
        default:
            throw ERROR_MESSAGE.NOT_VALID_ART_MODE;
        }
    }

    static checkEmptyAndValidString(s){
        if(typeof s !== 'string') throw ERROR_MESSAGE.NOT_TYPE_OF_STRING;
        if(s === '' || s === ' ') throw ERROR_MESSAGE.STRING_EMPTY;
    }
    
    static checkNullOrUndefinedValue(v){
        if(v === '' || v === ' ' || v === null || v === undefined){
            throw ERROR_MESSAGE.NULL_OR_UNDEFINED_PARAMETER;
        } 
    }

    static checkHTMLInstanceOfElement(element){
        if(!(element instanceof Element)){
            throw ERROR_MESSAGE.NOT_VALID_HTML_ELEMENT;
        }
    }

    static checkInstanceOfString(string){
        if(!(string instanceof String)){
            throw ERROR_MESSAGE.NOT_INSTANCE_OF_STRING;
        }
    }

    static checkTypeOfString(string){
        if(!(typeof string === 'string')){
            throw ERROR_MESSAGE.NOT_TYPE_OF_STRING;
        }
    }

    static checkInstanceOfArray(value){
        if(!Array.isArray(value)){
            throw ERROR_MESSAGE.NOT_INSTANCE_OF_ARRAY;
        }   
    }

    static checkInstanceAndTypeOfNumber(value){
        if(!(value instanceof Number) && (typeof value) !== 'number'){
            throw ERROR_MESSAGE.NOT_INSTANCE_OR_TYPE_OF_NUMBER;
        }   
    }

    static checkInstanceOrTypeOfNumber(value){
        if(!(value instanceof Number) || (typeof value) !== 'number'){
            throw ERROR_MESSAGE.NOT_INSTANCE_OR_TYPE_OF_NUMBER;
        }   
    }

    static checkInstanceOfNumber(value){
        if(!(value instanceof Number)){
            throw ERROR_MESSAGE.NOT_INSTANCE_OF_NUMBER;
        }
    }

    static checkTypeOfNumber(value){
        if((typeof value) !== 'number'){
            throw ERROR_MESSAGE.NOT_TYPE_OF_NUMBER;
        }
    }

    static checkInstanceOfFunction(f){
        if(!(f instanceof Function)){
            throw ERROR_MESSAGE.NOT_A_VALID_FUNCTION_PARAMATER;
        }
    }

    static checkInstanceOfPixel(pixel){
        if(!(pixel instanceof Pixel)){
            throw ERROR_MESSAGE.NOT_INSTANCE_OF_PIXEL;
        }
    }

    static log(message){
        console.log(`DEBUG: ${message}`);
    }
}