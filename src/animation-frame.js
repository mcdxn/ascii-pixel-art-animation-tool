'use strict';

import { Layer } from './layer';

export class AnimationFrame extends Layer{

    constructor(id){
        super(id);
        this.savedScreenPixels = [];
    }

    static create(id){
        return new AnimationFrame(id);
    }

    isScreenPixelSaved(pixelId){
        for(const pixel of this.savedScreenPixels){
            if(pixelId === pixel.getPixelId()){
                return true;
            }
        }

        return false;
    }

    saveScreenPixel(pixel){
        this.savedScreenPixels.push(pixel.getPixelCopy());
    }

    getSavedScreenPixel(pixelId){
        for(const pixel of this.savedScreenPixels){
            if(pixel.getPixelId() === pixelId){
                return pixel;
            }
        }

        return null;
    }

    getSavedScreenPixels(){
        return this.savedScreenPixels;
    }
}