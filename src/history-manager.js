'use strict';

import { _Debug_ } from './debug';
import { Equipment }  from './equipment';
import { Pixel } from './pixel';

/*eslint no-undef: "off"*/

export class HistoryManager extends Equipment {

    constructor(){
        
        super('historyManager');

        this.undoMoments    = [];
        this.redoMoments    = [];
        this.maxSize        = DEFAULTS.historySize;
        this.minSize        = DEFAULTS.historySize / 2;
    }

    static create(){
        return new HistoryManager();
    }

    record(element, state){
        if(DEBUG.ON) _Debug_.checkHTMLInstanceOfElement(element);

        const value = element.innerHTML;
        const fgColor = element.style.color;
        const bgColor = element.style.backgroundColor;

        if(
            value === state.getStateProperty('pixelValue') && 
            fgColor === state.getStateProperty('pixelFgColor') &&
            bgColor === state.getStateProperty('pixelBgColor')
        ){
            return;
        }

        this._pushUndo({element:element, x:0, y:0, value:element.innerHTML, fgcolor:fgColor, bgcolor:bgColor});
    }

    undo(){

        const moment = this._popUndo();

        if(moment){
           
            const pos = Pixel.getPixelElementPositionAttribute(moment.element);

            this._pushRedo({element:moment.element, x:0, y:0, value:moment.element.innerHTML, fgcolor:moment.element.style.color, bgcolor:moment.element.style.backgroundColor});

            moment.x = pos.x;
            moment.y = pos.y;

            return moment;
        }    

        return null;
    }

    redo(){
        const moment = this._popRedo();

        if(moment){

            const pos = Pixel.getPixelElementPositionAttribute(moment.element);

            this._pushUndo({element:moment.element, x:0, y:0, value:moment.element.innerHTML, fgcolor:moment.element.style.color, bgcolor:moment.element.style.backgroundColor});

            moment.x = pos.x;
            moment.y = pos.y;
            
            return moment;
        }

        return null;
    }

    _pushUndo(moment){
              
        if(this.undoMoments.length > this.maxSize){
            this.undoMoments.splice(0, this.minSize);
            if(DEBUG.ON) _Debug_.log('ADJUSTING HISTORY');
        }

        this.undoMoments.push(moment);
    }


    _popUndo(){
        if(this.undoMoments.length){
            const moment = this.undoMoments.pop();
            return moment;
        }

        return null;
    }

    _pushRedo(moment){
              
        if(this.redoMoments.length > this.maxSize){
            this.redoMoments.splice(0, (this.minSize));
        }

        this.redoMoments.push(moment);
    }

    _popRedo(){
        if(this.redoMoments.length){
            const moment = this.redoMoments.pop();
            return moment;
        }

        return null;
    }
}