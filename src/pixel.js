'use strict';

import { _Debug_ }      from './debug';
import { Emitter }      from './emitter';

/*eslint no-undef: "off"*/

export class Pixel extends Emitter {
    constructor(x, y, value, fgcolor, bgcolor){
        if(DEBUG.ON) _Debug_.checkTypeOfNumber(x);
        if(DEBUG.ON) _Debug_.checkTypeOfNumber(y);

        super();

        this.status     = PIXEL_STATUS.ACTIVE;
        this.type       = null;
        this.screenId   = 0;
        this.layerId    = 0;
        this.layerType  = null;
        this.x          = x;
        this.y          = y;
        this.value      = value;
        this.fgColor    = fgcolor;
        this.bgColor    = bgcolor;
    }

    deletePixel(){
        this.status = PIXEL_STATUS.DELETED;
        super.removeAllCallbacks();
    }

    deletePixelCallback(id){
        super.removeCallback(id);
    }

    getPixelCopy(){
        return Object.assign(new Pixel(0,0), this);
    }

    updatePixelValues(pixel){
        const keys = Object.keys(pixel);

        for(const key of keys){
            if(key === 'element') continue;
            if(key === 'emitter') continue;
            
            this[key] = pixel[key];
        }
    }

    getPixel(){
        return this;
    }

    setPixelType(pixelType){
        this.type = pixelType;
    }

    getPixelType(){
        return this.type;
    }

    setPixelStatus(status){
        this.status = status;
    }

    getPixelStatus(){
        return this.status;
    }

    setPixelId(id){
        if(DEBUG.ON) _Debug_.checkInstanceAndTypeOfNumber(id);
        this.screenId = id;
    }

    getPixelId(){
        return this.screenId;
    }

    setPixelLayerId(id){
        if(DEBUG.ON) _Debug_.checkInstanceAndTypeOfNumber(id);
        this.layerId = id;
    }

    getPixelLayerId(){
        return this.layerId;
    }

    setPixelLayerType(value){
        this.layerType = value;
    }

    getPixelLayerType(){
        return this.layerType;
    }

    setX(x){
        if(DEBUG.ON) _Debug_.checkTypeOfNumber(x);
        
        this.x = x;
    }

    getX(){
        return this.x;
    }

    setY(y){
        if(DEBUG.ON) _Debug_.checkTypeOfNumber(y);

        this.y = y;
    }

    getY(){
        return this.y;
    }

    setPixelPosition(x, y){
        if(DEBUG.ON) _Debug_.checkTypeOfNumber(x);
        if(DEBUG.ON) _Debug_.checkTypeOfNumber(y);

        this.x = x;
        this.y = y;
    }
    
    getPixelPosition(){
        return {x:this.x, y:this.y};
    }

    isPixelPositionEqual(x, y){
        return (x === this.x && y === this.y) ? true : false;
    }

    setPixelValue(value){
        this.value = value;
    }

    getPixelValue(){
        return this.value;
    }

    setPixelFgColor(color){
        this.fgColor = color;
    }

    getPixelFgColor(){
        return this.fgColor;
    }

    setPixelBgColor(color){
        this.bgColor = color;
    }

    getPixelBgColor(){
        return this.bgColor;
    }

    movePixelX(delta){
        this.x += delta;
    }

    movePixelY(delta){
        this.y += delta;
    }
    
    static setPixelElementArtModeAttribute(pixelElement, artMode){
        pixelElement.setAttribute(PIXEL_ELEMENT_ATTRIB.PIXEL_ART_MODE, `${artMode}`);
    }

    static getPixelElementArtModeAttribute(pixelElement){
        return pixelElement.getAttribute(PIXEL_ELEMENT_ATTRIB.PIXEL_ART_MODE);
    }

    static setPixelElementTypeAttribute(pixelElement, pixelType){
        pixelElement.setAttribute(PIXEL_ELEMENT_ATTRIB.PIXEL_TYPE, `${pixelType}`);
    }

    static getPixelElementTypeAttribute(pixelElement){
        return pixelElement.getAttribute(PIXEL_ELEMENT_ATTRIB.PIXEL_TYPE);
    }

    static setPixelElementPositionAttribute(pixelElement, x, y){
        pixelElement.setAttribute(PIXEL_ELEMENT_ATTRIB.PIXEL_DATA_X_POS, `${x}`);
        pixelElement.setAttribute(PIXEL_ELEMENT_ATTRIB.PIXEL_DATA_Y_POS, `${y}`);
    }

    static getPixelElementPositionAttribute(pixelElement){
        const x = pixelElement.getAttribute(PIXEL_ELEMENT_ATTRIB.PIXEL_DATA_X_POS);
        const y = pixelElement.getAttribute(PIXEL_ELEMENT_ATTRIB.PIXEL_DATA_Y_POS);
        return {x:Number.parseInt(x, 10),y:Number.parseInt(y, 10)};
    }

    static setPixelElementLayerIdAttribute(pixelElement, id){
        pixelElement.setAttribute(PIXEL_ELEMENT_ATTRIB.PIXEL_LAYER_ID, `${id}`);
    }

    static getPixelElementLayerIdAttribute(pixelElement){
        return pixelElement.getAttribute(PIXEL_ELEMENT_ATTRIB.PIXEL_LAYER_ID);
    }
}