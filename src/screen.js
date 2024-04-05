'use strict';

import { _Debug_ }      from './debug';
import { Equipment }    from './equipment';
import { Pixel }        from './pixel';

/*eslint no-undef: "off"*/

export class Screen extends Equipment {

    constructor(){
        
        super('screen');

        this.display        = null;
        this.pixels         = null;
        this.fastPixels     = [];
        this.scanlines      = null;
        this.mouseup        = this._handleMouseUp.bind(this);
        this.mousedown      = this._handleMouseDown.bind(this);
        this.mousemove      = this._handleMouseMove.bind(this);
    }

    static create(){
        return new Screen();
    }

    createScanline(id, pixels){
        const fragment = document.createDocumentFragment();
        const scanline = document.createElement('div');
        scanline.id = id;
        scanline.style.setProperty('font-size', '0px');
        scanline.style.setProperty('white-space', 'pre');
        scanline.style.setProperty('margin', '0');
        scanline.style.setProperty('padding', '0');

        for(const p of pixels){
            fragment.appendChild(p.getPixelElement());
        }

        scanline.appendChild(fragment);
        return scanline;
    }

    init()
    {
        const state = this.state;

        this.display = document.getElementById(state.getStateProperty('displayId'));

        const display = this.display;

        display.addEventListener('mousedown', this.mousedown, false);

        display.style.cursor = 'crosshair';
        display.style.display = 'inline-block';
        display.style.backgroundColor = state.getStateProperty('displayBgColor');
        display.style.setProperty('outline', '1px solid black');

        const pixels = [];
        const scanlines = [];
        const maxScreenHeight = state.getStateProperty('screenHeight') - 1;

        let countY = 0;
        let countX = 0;
        let screenId = 0;

        const fragment = document.createDocumentFragment();

        do{
            const arrayOfPixels = this.pixelFactory.createArrayOfPixels();
            const scanline = this.createScanline(countY, arrayOfPixels);
    
            countX = 0;

            for(const px of arrayOfPixels){
                px.setPixelElementPosition(countX++, countY);
                px.setPixelElementId(screenId++);
            }

            pixels[countY] = arrayOfPixels;
            
            scanlines[countY] = scanline;
            fragment.appendChild(scanline);
    
        }while((countY++) !== maxScreenHeight);
        
        display.appendChild(fragment);

        this.setPixels(pixels);
        this.setFastPixels(pixels);
        this.setScanlines(scanlines);
    }

    writePixelPx(pixel, record){
        const screenPixel = this.pixels[pixel.getY()][pixel.getX()];

        if(record){
            this.historyManager.record(screenPixel.getPixelElement(), this.state);
        }

        screenPixel.setPixelElementValue(pixel.getPixelValue());
        screenPixel.setPixelElementFgColor(pixel.getPixelFgColor());
        screenPixel.setPixelElementBgColor(pixel.getPixelBgColor());

        screenPixel.setPixelLayerId(pixel.getPixelLayerId());

        this.layerManager.writeLayerPixel(screenPixel.getPixel());
    }

    // REFACTOR: NEEDS TO BE REPLACED BY writePixePx.
    writePixel(x, y, value, fgcolor, bgcolor, record){

        const screenPixel = this.pixels[y][x];

        if(record){
            this.historyManager.record(screenPixel.getPixelElement(), this.state);
        }

        screenPixel.setPixelElementValue(value);
        screenPixel.setPixelElementFgColor(fgcolor);
        screenPixel.setPixelElementBgColor(bgcolor);

        screenPixel.setPixelLayerId(this.layerManager.getActiveLayerId());

        this.layerManager.writeLayerPixel(screenPixel.getPixel());
    }

    redrawLayers()
    {
        this.algo.executeCommand(ALGO_COMMAND_NAME.ClearScreen);
        const savedCurrentLayerSelectionId = this.layerManager.getActiveLayerId();       
        const allLayerPixels = this.layerManager.getAllLayerPixels();
        for(const px of allLayerPixels){

            if(px.getPixelStatus() === PIXEL_STATUS.ACTIVE){
                this.writePixelPx(px);
            }

        }

        this.layerManager.setActiveLayerById(savedCurrentLayerSelectionId);
    }

    getPixelMouseDownHandler(){
        return this._handlePixelMouseDown.bind(this);
    }

    getPixelMouseOverHandler(){
        return this._handlePixelMouseOver.bind(this);
    }

    toggleFlag(name){
        this.flags.toggleFlag(name);
    }

    setFlag(name, value){
        this.flags.setFlag(name, value);
    }

    getFlag(name){
        return this.flags.getFlag(name);
    }

    setStateProperty(name, value){
        this.state.setStateProperty(name, value);
    }

    getStateProperty(name){
        return this.state.getStateProperty(name);
    }

    setPixels(pixels){
        this.pixels = pixels;
    }

    getPixels(){
        return this.pixels;
    }

    setFastPixels(pixels){
        this.fastPixels.length = 0;
        for(const pxarray of pixels){
            this.fastPixels = [...this.fastPixels, ...pxarray];
        }
    }

    updateFastPixels(){
        this.setFastPixels(this.pixels);
    }

    getFastPixels(){
        return this.fastPixels;
    }

    setScanlines(scanlines){
        this.scanlines = scanlines;
    }

    getScanlines(){
        return this.scanlines;
    }

    _handleMouseDown(event){
        event.preventDefault();
        event.stopImmediatePropagation();

        document.addEventListener('mouseup', this.mouseup, false);
        document.addEventListener('mousemove', this.mousemove, false);
    }

    _handleMouseMove(event){
        event.preventDefault();
        event.stopImmediatePropagation();

        if(!this.getFlag('autoClick')){
            this.setFlag('autoClick', true);
        }
    }

    _handleMouseUp(event){  
        event.preventDefault();     
        event.stopImmediatePropagation();

        this.setFlag('autoClick', false);
        
        document.removeEventListener('mouseup', this.mouseup, false);
        document.removeEventListener('mousemove', this.mousemove, false);
    }


    // MUST BE BOUND TO THIS SCREEN WHEN PASSED TO PIXELFACTORY
    _handlePixelMouseDown(event)
    {
        if(DEBUG.ON) _Debug_.checkNullOrUndefinedValue(this.state);
        if(DEBUG.ON) _Debug_.checkNullOrUndefinedValue(this.flags);

        event.preventDefault();

        if(this.flags.getFlag('autoClick')){
            return;
        }

        if(this.flags.getFlag('fill')){
            const pixelElement = event.currentTarget;
            const state = this.state;
            const pixelValue = state.getStateProperty('pixelValue');
            const pixelFgColor = state.getStateProperty('pixelFgColor');
            const pixelBgColor = state.getStateProperty('pixelBgColor');

            const pos = Pixel.getPixelElementPositionAttribute(pixelElement);
            state.setStateProperty('fillTarget', pixelElement.innerHTML);
            state.setStateProperty('fillPositionX', pos.x);
            state.setStateProperty('fillPositionY', pos.y);

            state.setStateProperty('fillValue', pixelValue);
            state.setStateProperty('fillFgColor', pixelFgColor);
            state.setStateProperty('fillBgColor', pixelBgColor);

            this.algo.executeCommand(ALGO_COMMAND_NAME.ToggleFill);

            return;
        }

        return new Promise((resolve)=>{
            this._render(event.currentTarget);
            resolve(true);
        });      
    }

    // MUST BE BOUND TO THIS SCREEN WHEN PASSED TO PIXELFACTORY
    _handlePixelMouseOver(event){

        if(DEBUG.ON) _Debug_.checkNullOrUndefinedValue(this.state);
        if(DEBUG.ON) _Debug_.checkNullOrUndefinedValue(this.flags);

        event.preventDefault();
        event.stopImmediatePropagation();
        
        if(this.flags.getFlag('autoClick')){
            return new Promise((resolve)=>{
                this._render(event.currentTarget);
                resolve(true);
            });
        }
    }

    _render(pixelElement)
    {
        const state             = this.state;
        const layerManager      = this.layerManager;
        const animationManager  = this.animationManager;

        const artMode = state.getStateProperty('artMode');

        const animationFlag = this.flags.getFlag('animation');

        const pixelValue        = state.getStateProperty('pixelValue');
        const pixelFgColor      = state.getStateProperty('pixelFgColor');
        const pixelBgColor      = state.getStateProperty('pixelBgColor');
        const pixelPosition     = Pixel.getPixelElementPositionAttribute(pixelElement);

        const screenPixel           = this.pixels[pixelPosition.y][pixelPosition.x];
        const screenPixelValue      = screenPixel.getPixelValue();
        const screenPixelFgColor    = screenPixel.getPixelFgColor();
        const screenPixelBgColor    = screenPixel.getPixelBgColor();
        const screenPixelLayerId    = screenPixel.getPixelLayerId();    
        
        const activeLayerId     = layerManager.getActiveLayerId();
        const screenLayerIndex  = layerManager.getLayerIndexPosition(screenPixelLayerId);
        const activeLayerIndex  = layerManager.getActiveLayerIndex();

        if(this.flags.getFlag('pencil'))
        {

            if(
                screenPixelValue    === pixelValue   && 
                screenPixelFgColor  === pixelFgColor &&
                screenPixelBgColor  === pixelBgColor &&
                screenPixelLayerId  === activeLayerId &&
                !animationFlag
            ) return;

            // ONLY DRAW WHEN ACTIVE LAYER IS ON TOP
            if(activeLayerIndex < screenLayerIndex) return;
            
            this.historyManager.record(pixelElement, state);

            screenPixel.setPixelLayerId(activeLayerId);
            
            if(animationFlag) animationManager.saveScreenPixel(screenPixel.getPixel());

            if(artMode === ART_MODE.ASCII_ART)
            {
                screenPixel.setPixelElementValue(pixelValue);
                screenPixel.setPixelElementFgColor(pixelFgColor);
            }
            else if(artMode === ART_MODE.PIXEL_ART)
            {
                screenPixel.setPixelElementBgColor(pixelBgColor);
            }

            if(animationFlag) animationManager.writeFramePixel(screenPixel.getPixel());
            else layerManager.writeLayerPixel(screenPixel.getPixel());

            return;
        }

        if(this.flags.getFlag('paintbrush') && artMode === ART_MODE.ASCII_ART){
           
            // ONLY PAINT ON OWN SCREEN PIXEL
            if(screenPixelLayerId !== activeLayerId) return;

            // DON'T PAINT FOREGROUND IF VALUES AND COLORS ARE THE SAME
            if(screenPixelValue === pixelValue && screenPixelFgColor === pixelFgColor) return;
           
            this.historyManager.record(pixelElement, state);

            screenPixel.setPixelElementFgColor(pixelFgColor);
            screenPixel.setPixelLayerId(activeLayerId);

            if(animationFlag) animationManager.writeFramePixel(screenPixel.getPixel());
            else layerManager.writeLayerPixel(screenPixel.getPixel());
            
            return;
        }

        
        if(this.flags.getFlag('brush')){
            
            // ONLY PAINT ON OWN SCREEN PIXEL
            if(screenPixelLayerId !== activeLayerId) return;

            // DON'T PAINT IF COLORS ARE THE SAME
            if(screenPixelBgColor === pixelBgColor) return;

            this.historyManager.record(pixelElement, state);

            screenPixel.setPixelElementBgColor(pixelBgColor);
            screenPixel.setPixelLayerId(activeLayerId);

            if(screenPixelLayerId !== activeLayerId){
                screenPixel.setPixelElementFgColor(DEFAULTS.pixelFgColor);
            }

            if(animationFlag) animationManager.writeFramePixel(screenPixel.getPixel());
            else layerManager.writeLayerPixel(screenPixel.getPixel());

            return;
        }

        if(this.flags.getFlag('eraser')){

            if(screenPixelLayerId === activeLayerId)
            {
                const pixelBelow = layerManager.getLayerPixelBelow(screenPixel);

                if(pixelBelow){
                    if(pixelBelow.getPixelStatus() !== PIXEL_STATUS.ERASED)
                    {
                        if(artMode === ART_MODE.ASCII_ART)
                        {
                            screenPixel.setPixelElementValue(pixelBelow.value);
                            screenPixel.setPixelElementFgColor(pixelBelow.fgColor);
                        }

                        screenPixel.setPixelElementBgColor(pixelBelow.bgColor);
                        screenPixel.setPixelLayerId(pixelBelow.getPixelLayerId());

                        if(animationFlag) animationManager.eraseAnimationPixel(screenPixel.getPixel());
                        else layerManager.eraseLayerPixel(screenPixel.getPixel());
                    
                        return;
                    }
                }

                if(screenPixel.getPixelStatus() !== PIXEL_STATUS.ERASED){
                
                    if(artMode === ART_MODE.ASCII_ART)
                    {
                        screenPixel.setPixelElementValue(' ');
                        screenPixel.setPixelElementFgColor('transparent');
                    }

                    screenPixel.setPixelElementBgColor('transparent');
                    screenPixel.setPixelLayerId(activeLayerId);

                    if(animationFlag) animationManager.eraseAnimationPixel(screenPixel.getPixel());
                    else layerManager.eraseLayerPixel(screenPixel.getPixel());
                    
                    return;
                
                }
            }
        }

        if(this.flags.getFlag('eyedropper')){
            state.setStateProperty('eyedropperFgColor', screenPixelFgColor);
            state.setStateProperty('eyedropperBgColor', screenPixelBgColor);
            return;
        }
    }
}