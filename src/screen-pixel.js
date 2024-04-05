'use strict';

import { _Debug_ }      from './debug';
import { Pixel }        from './pixel';

/*eslint no-undef: "off"*/

export class ScreenPixel extends Pixel {

    constructor(element){
        super(0, 0, element.innerHTML, element.style.getPropertyValue('color'), element.style.getPropertyValue('background-color')); 
        super.setPixelFgColor(element.style.getPropertyValue('color'));
        super.setPixelBgColor(element.style.getPropertyValue('background-color'));

        if(DEBUG.ON) _Debug_.checkHTMLInstanceOfElement(element);       
        this.element = element;
    }

    static create(element){
        return new ScreenPixel(element);
    }

    showPixel(){
        this.element.style.setProperty('display', 'inline-block');
    }

    deletePixel(){
        super.emit('delete', super.getPixelId());
        super.deletePixel();
    }

    setPixelElementId(id){
        const value = parseInt(id, 10);
        this.element.id = value;
        super.setPixelId(value);
        super.emit('id', value);
    }

    getPixelElementId(){
        return parseInt(this.element.id, 10);
    }

    setPixelElementValue(value){
        if(DEBUG.ON) _Debug_.checkTypeOfString(value);
        this.element.innerHTML = value;
        super.setPixelValue(value); 
        super.emit('setpixelvalue', value);
    }

    getPixelElementValue(){
        return this.element.innerHTML;
    }

    setPixelElementStyleProperty(name, value){
        if(DEBUG.ON) _Debug_.checkPropertyInObject(this.element.style, name);
        this.element.style[name] = value;

        if(name === 'color'){
            super.setPixelFgColor(value);
        }else if(name === 'background-color'){
            super.setPixelBgColor(value);
        }
    }

    setPixelElementFgColor(color){
        this.element.style.setProperty('color', color);
        super.setPixelFgColor(color);
    }

    getPixelElementFgColor(){
        return this.element.style.getPropertyValue('color');
    }

    setPixelElementBgColor(color){
        this.element.style.setProperty('background-color', color);
        super.setPixelBgColor(color);
    }

    getPixelElementBgColor(){
        return this.element.style.getPropertyValue('background-color');
    }

    getPixelElementStyleProperty(name){
        if(DEBUG.ON) _Debug_.checkPropertyInObject(this.element.style, name);
        return this.element.style[name];
    }

    setPixelElement(element){
        if(DEBUG.ON) _Debug_.checkHTMLInstanceOfElement(element);       
        this.element = element;
    }

    getPixelElement(){
        if(DEBUG.ON) _Debug_.checkNullOrUndefinedValue(this.element);
        return this.element;
    }

    getPixelElementStyle(){
        if(DEBUG.ON) _Debug_.checkNullOrUndefinedValue(this.element);
        return this.element.style;
    }

    setPixelType(pixelType){
        super.constructor.setPixelElementTypeAttribute(this.element, pixelType);
        super.setPixelType(pixelType);
    }

    getPixelType(){
        return super.getPixelType();
    }

    setPixelElementPosition(x, y){
        super.constructor.setPixelElementPositionAttribute(this.element, x, y);
        super.setPixelPosition(x, y);
        super.emit('position', x, y);
    }

    getPixelElementPosition(){
        return super.constructor.getPixelElementPositionAttribute(this.element);
    }

    setPixelElementLayerId(id){
        super.constructor.setPixelElementLayerIdAttribute(this.element, id);
        super.setPixelLayerId(id);
    }

    getPixelElementLayerId(){
        return parseInt(super.constructor.getPixelElementLayerIdAttribute(this.element), 10);
    }
}