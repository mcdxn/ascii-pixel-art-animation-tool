'use strict';

import { _Debug_ }          from './debug';
import { Util }             from './util';
import { Equipment }        from './equipment';
import { StorageAgent }     from './storage-agent';

/*eslint no-undef: "off"*/

export class SystemFlags extends Equipment {
    
    constructor(){

        super('flags');
        this.listen             = true;
        this.grid               = false;
        this.fill               = false;
        this.pencil             = false;
        this.paintbrush         = false;
        this.brush              = false;
        this.eraser             = false;
        this.eyedropper         = false;
        this.colorPalette       = false;
        this.recorder           = false;
        this.animation          = false;
        this.autoClick          = false; 
        this.colorPaint         = false;
        this.resizeMode         = false;
        this.resizeDirection    = false;
        this.nightMode          = false;
        this.panelLayers        = false;
        this.panelAnimations    = false;
        this.panelFrames        = false;
        this.panelCompositor    = false;


        
        if(StorageAgent.isStorageAvailable()){
            const ownPropNames = Object.getOwnPropertyNames(this);
            for(const propName in ownPropNames){
                const value = Util.parseStringToBool(StorageAgent.getItem(`flag_${propName}`));
                if(value !== null){
                    this[propName] = value;
                }
            }
        }

    }

    static create(){
        return new SystemFlags();
    }

    toggleFlag(name){
        if(DEBUG.ON) _Debug_.checkHasOwnProperty(this, name);
        this.setFlag(name,!this[name]);
    }

    on(name, callback){
        if(DEBUG.ON) _Debug_.checkHasOwnProperty(this, name);
        super.on(name, callback);
    }

    setFlag(name, value){
        if(DEBUG.ON) _Debug_.checkHasOwnProperty(this, name);
        if(DEBUG.ON) _Debug_.checkBolean(value);
        
        this[name] = value;

        StorageAgent.setItem(`flag_${name}`, value);

        super.emit(name, value);
        super.emitAny(name, value);
    }

    getFlag(name){
        if(DEBUG.ON) _Debug_.checkHasOwnProperty(this, name);

        return this[name];
    }
}
