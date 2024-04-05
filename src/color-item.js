'use strict';

import { Emitter } from './emitter';

/*eslint no-undef: "off"*/

export class ColorItem extends Emitter {

    constructor(colorValue){

        super();
        
        const divElement = document.createElement('div');
        divElement.style.setProperty('cursor', 'pointer');
        divElement.classList.add('color-item');
        divElement.addEventListener('click', this._onClickHandler.bind(this));

        this.colorElement = divElement;

        this.setColorBoxSize(DEFAULTS.colorItemBoxSize);
        this.setColor(colorValue);
    }

    static create(colorValue){        
        return new ColorItem(colorValue);
    }

    getColorElement(){
        return this.colorElement;
    }
    setColor(colorValue){
        this.colorElement.style.setProperty('background-color', `${colorValue}`);
    }

    getColor(){
        return this.colorElement.style.getPropertyValue('background-color');
    }
    
    setColorBoxSize(size){
        this.colorElement.style.setProperty('width', `${size}`);
        this.colorElement.style.setProperty('height', `${size}`);
    }

    _onClickHandler(){
        super.emit('colorSelect', this.getColor());
    }
}