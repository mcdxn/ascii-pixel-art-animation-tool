'use strict';

import { _Debug_ } from './debug';

/*eslint no-undef: "off"*/

export class Layer {
    constructor(id){
        this.indexPosition = 0;
        
        this.layerHide      = false;
        this.layerId        = id;
        this.layerPixels    = [];
        
        this.layerPixelEmitterCallbackId = null;

        this.screenPixelReferences = [];

        this.isSorted = false;
        this.nextLayerPixelIndex = 0;
    }

    static create(id){
        return new Layer(id);
    }

    setLayerId(id){
        if(DEBUG.ON) _Debug_.checkInstanceAndTypeOfNumber(id);
        this.layerId = id;
    }

    getLayerId(){
        return this.layerId;
    }

    setIndexPosition(value){
        if(DEBUG.ON) _Debug_.checkInstanceAndTypeOfNumber(value);
        this.indexPosition = value;
    }

    getIndexPosition(){
        return this.indexPosition;
    }

    setLayerHide(value){
        this.layerHide = value;

        if(value && !this.isSorted){
            this.sortLayerPixels();
        }
    }

    isLayerHidden(){
        return this.layerHide;
    }

    isLayerEmpty(){
        return this.layerPixels.length ? false : true;
    }

    addLayerPixels(pixels){
        _Debug_.checkInstanceOfArray(pixels);
        this.layerPixels = [...this.layerPixels, ...pixels];
    }

    getLayerPixels(){
        return this.layerPixels;
    }

    getLayerPixel(id)
    {
        const layerPixels = this.layerPixels;
        if(layerPixels.length){
            for(const px of layerPixels){
                if(px.getPixelId() === id){
                    return px;
                }
            }
        }

        return null;
    }

    sortLayerPixels(){

        if(!this.layerPixels.length || this.isSorted) return;
        
        const promise = new Promise((resolve)=>{

            let executor = (a, b) => a.getPixelId() < b.getPixelId() ? -1 : 1;

            this.layerPixels.sort(executor);
            this.screenPixelReferences.sort(executor);

            resolve(true);
        });


        promise.then((value)=>{
            this.isSorted = value;
        });
    }

    writeLayerPixel(pixel)
    {
        if(DEBUG.ON) _Debug_.checkInstanceOfPixel(pixel);

        pixel.setPixelStatus(PIXEL_STATUS.ACTIVE);

        const pixelId = pixel.getPixelId();

        const px = this.getLayerPixel(pixelId);

        if(px){
            px.updatePixelValues(pixel);
        }else{

            this.isSorted = false;

            const pixelCopy = pixel.getPixelCopy();
            // pixelCopy.setPixelLayerId(this.layerId);

            this.layerPixels.push(pixelCopy);
            this.screenPixelReferences.push(pixel);

            this.layerPixelEmitterCallbackId = `layer-${this.getLayerId()}`;

            pixel.on('position', function (x, y){
                this.setPixelPosition(x, y);
            }.bind(pixelCopy), this.layerPixelEmitterCallbackId);

            pixel.on('id', function (id){
                this.setPixelId(id);
            }.bind(pixelCopy), this.layerPixelEmitterCallbackId);

            pixel.on('delete', function(screenId){
                this.deleteLayerPixel(screenId);
            }.bind(this), this.layerPixelEmitterCallbackId);
        }
    }

    eraseLayerPixel(pixel){
        const px = this.getLayerPixel(pixel.getPixelId());

        if(px){
            px.setPixelStatus(PIXEL_STATUS.ERASED);
        }
    }

    purgeErasedLayerPixels(){
        for(const i in this.layerPixels){
            const pixel = this.layerPixels[i];
            if(pixel.getPixelStatus() === PIXEL_STATUS.ERASED){
                this.layerPixels.splice(i, 1);
            }
        }
    }

    deleteLayerPixels()
    {
        this.layerPixels.length = 0;

        for(const screenPixel of this.screenPixelReferences){
            screenPixel.removeCallback(this.layerPixelEmitterCallbackId);
        }

        this.screenPixelReferences.length = 0;
    }

    deleteLayerPixel(id){
        for(const i in this.layerPixels){
            const px = this.layerPixels[i];
            const screenPxRef = this.screenPixelReferences[i];

            if(px.getPixelId() === id){
                screenPxRef.removeCallback(this.layerPixelEmitterCallbackId);
                this.screenPixelReferences.splice(i, 1);
                this.layerPixels.splice(i, 1);
            }
        }
    }

    nextLayerPixel(){
        if(this.nextLayerPixelIndex === this.layerPixels.length){
            this.nextLayerPixelIndex = 0;
            return null;
        }
        return this.layerPixels[this.nextLayerPixelIndex++];
    }
}