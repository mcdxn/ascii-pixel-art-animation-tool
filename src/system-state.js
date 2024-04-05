'use strict';
import { _Debug_ }          from './debug';
import { Equipment }        from './equipment';
import { StorageAgent }     from './storage-agent';

/*eslint no-undef: "off"*/

export class SystemState extends Equipment {
    
    constructor(){
        
        super('state');

        this.default                = DEFAULTS;
        this.artMode                = ART_MODE.ASCII_ART;
        this.screenWidth            = DEFAULTS.screenWidth;
        this.screenHeight           = DEFAULTS.screenHeight;
        this.historySize            = DEFAULTS.historySize;

        this.activeAnimationObject      = null;
        this.previousAnimationObject    = null;
        this.deleteAnimationObjectById    = 0;
        
        this.activeAnimationFrame       = null;
        this.deleteAnimationFrameById     = 0;

        this.displayId              = DEFAULTS.displayId;
        this.displayBgColor         = DEFAULTS.displayBgColor;
        this.displayBorder          = DEFAULTS.displayBorder;
        this.displayBorderColor     = DEFAULTS.displayBorderColor;

        this.pixelValue             = DEFAULTS.pixelValue;
        this.pixelFontFamily        = DEFAULTS.pixelFontFamily;
        this.pixelSize              = DEFAULTS.pixelSize;
        this.pixelWidth             = DEFAULTS.pixelSizePixeArtMode;
        this.pixelHeight            = DEFAULTS.pixelSizePixeArtMode;
        this.pixelFgColor           = DEFAULTS.pixelFgColor;
        this.pixelBgColor           = DEFAULTS.pixelBgColor;
        this.pixelOutlineStyle      = DEFAULTS.pixelOutlineStyle;
        this.pixelOutlineColor      = DEFAULTS.pixelOutlineColor;
        
        this.fillTarget             = '';
        this.fillPositionX          = 0;
        this.fillPositionY          = 0;
        this.fillValue              = '';  
        this.fillFgColor            = '';
        this.fillBgColor            = '';

        this.eyedropperFgColor      = DEFAULTS.eyedropperFgColor;
        this.eyedropperBgColor      = DEFAULTS.eyedropperBgColor;

        if(StorageAgent.isStorageAvailable()){
            const ownPropNames = Object.getOwnPropertyNames(this);

            for(const propName in ownPropNames){
                const value = StorageAgent.getItem(`state_${propName}`);
    
                if(value !== null){
    
                    switch(propName){
    
                    case 'screenWidth': 
                    case 'screenHeight': 
                    case 'historySize':
                    case 'fillPositionX':
                    case 'fillPositionY': this[propName] = parseInt(value, 10);
                        break;
                    default: this[propName] = value;
                        break;
    
                    }
                }
            }
        }
    }

    static create(){
        return new SystemState();
    }

    setOptions(options){
        for(const opt in options){
            this.setStateProperty(opt, options[opt]);
        }
    }

    on(name, callback){
        if(DEBUG.ON) _Debug_.checkHasOwnProperty(this, name);
        super.on(name, callback);
    }

    setStateProperty(name, value){
        if(DEBUG.ON) _Debug_.checkHasOwnProperty(this, name);
        this[name] = value;
        super.emit(name, value);
        super.emitAny(name, value);
        StorageAgent.setItem(`state_${name}`, value);
    }

    getStateProperty(name){
        if(DEBUG.ON) _Debug_.checkHasOwnProperty(this, name);
        return this[name];
    }
}