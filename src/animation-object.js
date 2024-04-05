'use strict';

import { _Debug_ }          from './debug';

import { LayerManager }     from './layer-manager';
import { AnimationFrame }   from './animation-frame';
/*eslint no-undef: "off"*/


export class AnimationObject extends LayerManager {
    constructor(){
        super();

        this.screen = null;
        this.screenPixels = null;

        this.indexPosition = 0;  //determines UI index number;
        this.layerPosition = 0;  //determines layer zindex;

        this.animationObjectId = 0;
        this.label = 'New Animation Object';

        this.isPlaying = false;
        this.isHidden = false;

        this.nextFrameIndex = 0;
        this.previousFrame  = null;

        this.previousScreenPixels = [];
        
        this.speed = 500;
    }

    static create(){
        const animationObject = new AnimationObject();
        const frame = animationObject.addFrameById(0);
        animationObject.setActiveLayer(frame);
        animationObject.setActiveFrameById(0);
        return animationObject;
    }

    setId(id){
        this.animationObjectId = id;
    }

    getId(){
        return this.animationObjectId;
    }

    setScreen(screen){
        this.screen = screen;
        this.screenPixels = screen.getPixels();
    }

    isScreenPixelSaved(pixelId){
        const frames = super.getLayers();
        let result = false;

        for(const frame of frames){
            result = frame.isScreenPixelSaved(pixelId);
            if(result) break;
        }

        return result;
    }

    saveScreenPixel(pixel){
        const layers =  super.getLayers();
        let temp = null;

        for(const layer of layers){
            temp = layer.getSavedScreenPixel(pixel.getPixelId());
            if(temp){
                pixel = temp;
                break; 
            }
        }

        const activeLayer = super.getActiveLayer();
        activeLayer.saveScreenPixel(pixel.getPixelCopy());   
    }

    getSavedScreenPixel(pixelId){
        const frames = super.getLayers();

        for(const frame of frames){
            if(frame.isScreenPixelSaved(pixelId)){
                return frame.getSavedScreenPixel(pixelId);
            }
        }

        return null;
    }

    getSavedScreenPixels(){
        const frames = super.getLayers();
        let savedPixels = [];

        for(const frame of frames){
            savedPixels = [...savedPixels, ...(frame.getSavedScreenPixels())];
        }

        return savedPixels;
    }

    pushPrevScreenPixel(screenPixel){
        this.previousScreenPixels.push(screenPixel);
    }

    popPrevScreenPixel(){
        return this.previousScreenPixels.pop();
    }

    getPrevScreenPixelLength(){
        return this.previousScreenPixels.length;
    }

    setName(name){
        this.label = name;
    }

    getName(){
        return this.label;
    }

    setIndexPosition(value){
        this.indexPosition = value;
    }

    getIndexPosition(){
        return this.indexPosition;
    }

    addFrameById(id){
        const frame = AnimationFrame.create(id);
        super.addLayer(frame);

        return frame;
    }

    deleteFrameById(id){
        this.stopAnimation();
        super.deleteLayer(id);
    }

    hideAllFrames(value){
        const frames = super.getLayers();

        for(const frame of frames){
            this.hideFrame(frame.getLayerId(), value);
        }
    }

    hideFrame(id, value){

        const frame = super.getLayerById(id);

        frame.setLayerHide(value);

        const pixels = value ? frame.getSavedScreenPixels() : frame.getLayerPixels();
        let screenPixel = null;

        for(const px of pixels){
            screenPixel = this.screenPixels[px.getY()][px.getX()];
            screenPixel.setPixelElementValue(px.getPixelValue());
            screenPixel.setPixelElementFgColor(px.getPixelFgColor());
            screenPixel.setPixelElementBgColor(px.getPixelBgColor());
        }
    }

    grayOutFrame(frame){
        let framePixels = frame.getLayerPixels();
        let screenPx = null;
        
        const screenPixels = this.screenPixels;

        for(const px of framePixels) {
            screenPx = screenPixels[px.getY()][px.getX()];
            screenPx.setPixelElementFgColor('gray');

            if(screenPx.getPixelElementBgColor() !== 'transparent'){
                screenPx.setPixelElementBgColor('#AAAAAA');
            }
        }
    }

    setActiveFrameById(id){
        
        const currentActiveFrame = super.getActiveLayer();
        
        if(currentActiveFrame.getLayerId() === id) return;
        
        this.grayOutFrame(currentActiveFrame);
        
        const screenPixels = this.screenPixels;

        super.setActiveLayerById(id);
        let activeLayer = super.getActiveLayer();
        let framePixels = activeLayer.getLayerPixels();
        let screenPx = null;

        for(const px of framePixels){
            screenPx = screenPixels[px.getY()][px.getX()];
            screenPx.setPixelElementFgColor(px.getPixelFgColor());
            screenPx.setPixelElementBgColor(px.getPixelBgColor());   
        }

        if(DEBUG.ON) _Debug_.log(`ACTIVE FRAME ID: ${id}`);

        return activeLayer;
    }

    setSpeed(speed){
        this.speed = speed;
    }

    getSpeed(){
        return this.speed;
    }

    nextFrame(){
        if(this.nextFrameIndex === this.layers.length){
            this.nextFrameIndex = 0;
        }

        this.previousFrame = this.layers[this.nextFrameIndex];
    
        return this.layers[this.nextFrameIndex++];
    }

    prevFrame(){
        return this.previousFrame;
    }

    isAnimationPause(){
        return this.isPlaying;
    }

    writeFramePixel(pixel){
        const pxCopy = pixel.getPixelCopy();
        pxCopy.setPixelLayerId(super.getActiveLayerId());
        super.writeLayerPixel(pxCopy);
    }

    pauseAnimation(){
        this.isPlaying = false;
    }

    stopAnimation(){
        this.nextFrameIndex = 0;
        this.isPlaying = false;
    }

    playAnimation(screen)
    {         
        if(this.isPlaying || this.isHidden) return;

        this.isPlaying = true;
        
        if(screen){
            this.setScreen(screen);
        }

        let timer = null;

        const animation = (step)=>
        {

            if(!timer){
                timer = step;
            }

            const elapsed = step - timer;

            // RESTORES BACKGROUND PIXELS
            if(elapsed >= this.speed)
            {
                timer = 0;                

                if(this.previousScreenPixels.length)
                {
                    let px = null;
                    let screenPixelRef = null;

                    do{
                        px = this.previousScreenPixels.pop();

                        if(px){
                            screenPixelRef = this.screenPixels[px.getY()][px.getX()];
                            screenPixelRef.setPixelType(px.getPixelType());
                            screenPixelRef.setPixelElementValue(px.getPixelValue());
                            screenPixelRef.setPixelElementFgColor(px.getPixelFgColor());
                            screenPixelRef.setPixelElementBgColor(px.getPixelBgColor());
                        }
                    }while(px);
                }

                const currFrame = this.nextFrame();

                let nextLayerPixel = null;
                let screenPixel = null;
                // RENDERS CURRENT ANIMATION FRAME
                do{
                    nextLayerPixel = currFrame.nextLayerPixel();

                    if(nextLayerPixel){

                        screenPixel = this.screenPixels[nextLayerPixel.getY()][nextLayerPixel.getX()];

                        if(screenPixel.getPixelLayerId() > this.layerPosition){
                            continue;
                        }
                    
                        if(screenPixel.getPixelType() === PIXEL_TYPE.SCREEN){
                            this.pushPrevScreenPixel(screenPixel.getPixelCopy());
                        }

                        screenPixel.setPixelElementValue(nextLayerPixel.getPixelValue());
                        screenPixel.setPixelElementFgColor(nextLayerPixel.getPixelFgColor());
                        screenPixel.setPixelElementBgColor(nextLayerPixel.getPixelBgColor());
                        screenPixel.setPixelType(PIXEL_TYPE.ANIMATION);
                    }
                
                }while(nextLayerPixel !== null);  
            }

            if(this.isPlaying) window.requestAnimationFrame(animation);
        };

        window.requestAnimationFrame(animation);
    }

}