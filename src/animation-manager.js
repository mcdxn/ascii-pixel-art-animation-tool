'use strict';

import { _Debug_ }          from './debug';

import { Equipment }        from './equipment';
import { AnimationObject }  from './animation-object';
import { IndexManager }     from './index-manager';

/*eslint no-undef: "off"*/

export class AnimationManager extends Equipment {
    constructor() {
        super('animationManager');

        this.activeAnimationObject = null;
        this.animationObjects = [];
    }

    static create(){
        return new AnimationManager();
    }

    init(){
        this.addAnimationObjectById(0);
        this.setActiveAnimationObjectById(0);
    }

    saveScreenPixel(pixel){
        const pixelId = pixel.getPixelId();
        let pixelFound = null;

        for(const animationObject of this.animationObjects){
            if(animationObject.isScreenPixelSaved(pixelId)){
                pixelFound = animationObject.getSavedScreenPixel(pixelId);
                break;
            }
        }

        if(pixelFound){
            this.activeAnimationObject.saveScreenPixel(pixelFound);
        }else{
            this.activeAnimationObject.saveScreenPixel(pixel);
        }
    }

    addAnimationObjectById(id){
        const animationObject = AnimationObject.create();
        animationObject.setId(id);
        animationObject.setScreen(this.screen);

        this.animationObjects.push(animationObject);

        IndexManager.updateIndexes(this.animationObjects);

        if(DEBUG.ON) _Debug_.log(`ADD ANIMATION OBJECT ID: ${id}`);

        return animationObject;
    }

    setActiveAnimationObjectById(id){

        if(this.activeAnimationObject && id === this.activeAnimationObject.getId()) return null;

        for(const animationObject of this.animationObjects){
            if(animationObject.getId() === id){
                this.activeAnimationObject = animationObject;
                if(DEBUG.ON) _Debug_.log(`ACTIVE ANIMATION OBJECT ID: ${id}`);
                return animationObject;
            }
        }
    }

    getActiveAnimationObject(){
        return this.activeAnimationObject;
    }

    getAnimationObject(id){
        for(const object of this.animationObjects){
            if(object.getId() === id){
                return object;
            }
        }
    }

    deleteAnimationObjectById(id){
        for(const i in this.animationObjects){
            const obj = this.animationObjects[i];
            if(obj.getId() === id){
                this.animationObjects[i].deleteAllLayers();
                this.animationObjects.splice(i, 1);
                IndexManager.updateIndexes(this.animationObjects);
            }    
        }
    }

    hideAnimationObject(id, value){
        const animationObject = this.getAnimationObject(id);
        animationObject.hideAllFrames(value);
    }

    clearAnimationArea(){
        
        const savedScreenPixels = this.activeAnimationObject.getSavedScreenPixels();
        const screenPixels = this.screen.getPixels();
        let screenPixel = null;

        for(const savedPixel of savedScreenPixels){
            screenPixel = screenPixels[savedPixel.getY()][savedPixel.getX()];
            if(screenPixel.getPixelLayerId() === savedPixel.getPixelLayerId())
            {
                screenPixel.setPixelElementValue(savedPixel.getPixelValue());
                screenPixel.setPixelElementFgColor(savedPixel.getPixelFgColor());
                screenPixel.setPixelElementBgColor(savedPixel.getPixelBgColor());
            }
          
        }   
    }

    eraseAnimationPixel(pixel){
        this.activeAnimationObject.eraseLayerPixel(pixel);
    }

    writeFramePixel(pixel){
        this.activeAnimationObject.writeFramePixel(pixel);
    }

    addFrameById(id){
        this.activeAnimationObject.addFrameById(id);
    }

    deleteFrameById(id){
        this.activeAnimationObject.deleteFrameById(id);
    }

    hideFrame(id, value){
        this.activeAnimationObject.hideFrame(id, value);
    }

    setActiveFrameById(id){
        return this.activeAnimationObject.setActiveFrameById(id);
    }
    
    moveAnimationObjectIndex(fromIndex, toIndex){
        IndexManager.moveIndexes(this.animationObjects, fromIndex, toIndex);
    }

    moveFrameIndex(fromIndex, toIndex){
        this.activeAnimationObject.moveLayerIndex(fromIndex, toIndex);
    }

    playAnimation(){
        this.activeAnimationObject.purgeErasedLayerPixels();
        this.activeAnimationObject.playAnimation();
        if(DEBUG.ON) _Debug_.log(`PLAY ANIMATION ID: ${this.activeAnimationObject.getId()}`);
    }

    stopAnimation(){        
        this.activeAnimationObject.stopAnimation();
        if(DEBUG.ON) _Debug_.log(`STOP ANIMATION ID: ${this.activeAnimationObject.getId()}`);
    }

    pauseAnimation(){
        this.activeAnimationObject.pauseAnimation();
    }
}