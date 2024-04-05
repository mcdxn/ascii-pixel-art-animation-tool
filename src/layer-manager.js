'use strict';

import { _Debug_ } from './debug';
import { Layer } from './layer';
import { Equipment } from './equipment';
import { IndexManager } from './index-manager';

/*eslint no-undef: "off"*/
export class LayerManager extends Equipment {

    constructor(){
        super('layerManager');
        this.activeLayer = null;
        this.layers = [];
    }
    
    static create(){
        const layerManager = new LayerManager();

        // CREATE ONE DEFAULT LAYER.
        const defaultLayer = layerManager.addLayerId(0);
        layerManager.setActiveLayer(defaultLayer);

        return layerManager;
    }

    getLayerCount(){
        return this.layers.length;
    }

    getLayerIndexPosition(id){
        for(const index in this.layers){
            if(this.layers[index].getLayerId() === id){
                return index;
            }
        }
    }

    writeLayerPixel(pixel){
        this.setActiveLayerById(pixel.getPixelLayerId());
        this.activeLayer.writeLayerPixel(pixel);
    }

    eraseLayerPixel(pixel){
        this.activeLayer.eraseLayerPixel(pixel);
    }

    purgeErasedLayerPixels(){
        for(const layer of this.layers){
            layer.purgeErasedLayerPixels();
        }
    }

    moveLayerIndex(fromIndex, toIndex){
        IndexManager.moveIndexes(this.layers, fromIndex, toIndex);
    }

    getLayerById(id){
        for(const layer of this.layers){
            if(layer.getLayerId() === id){
                return layer;
            }
        }
    }

    getLayers(){
        return this.layers;
    }

    getLayerPixelsById(id){
        let layerPixels = [];
        let px = null;

        for(const layer of this.layers)
        {
            if(layer.isLayerHidden()) continue;

            px = layer.getLayerPixel(id);
            if(px){
                layerPixels.push(px);
            }
        }

        return layerPixels;
    }

    getAllLayerPixels()
    {
        let layerPixels = [];
        let arr = null;

        for(const layer of this.layers)
        {
            if(layer.isLayerHidden()) continue;

            arr = layer.getLayerPixels();
            layerPixels.push.apply(layerPixels, arr);
        }

        return layerPixels;
    }

    setActiveLayerById(id)
    {
        if(this.activeLayer.getLayerId() === id) return this.activeLayer;
        
        for(const layer of this.layers){
            if(layer.getLayerId() === id){
                this.activeLayer.sortLayerPixels();
                this.activeLayer = layer;
                return this.activeLayer;
            }
        }

        if(DEBUG.ON) _Debug_.checkNullOrUndefinedValue(null);
    }

    setActiveLayer(layer){
        this.activeLayer = layer;
    }

    getActiveLayerId(){
        return this.activeLayer.getLayerId();
    }

    getActiveLayer(){
        return this.activeLayer;
    }

    getActiveLayerIndex(){
        return this.activeLayer.getIndexPosition();
    }
    
    setLayerHide(id, value){

        for(const layer of this.layers){
            if(layer.getLayerId() === id){
                return layer.setLayerHide(value);
            }
        }
    }

    isLayerHidden(id){
        
        for(const layer of this.layers){
            if(layer.getLayerId() === id){
                return layer.isLayerHidden();
            }
        }
    }

    getLayerPixelBelow(pixel){
   
        let layer = null;
        let status = null;
        let pixelBelow = null;

        const startIndex = this.getLayerIndexPosition(pixel.getPixelLayerId()) - 1;

        for(let i = startIndex; i >= 0; i--)
        {
            layer = this.layers[i];
            
            if(layer.isLayerHidden()) continue;

            pixelBelow = layer.getLayerPixel(pixel.getPixelId());

            if(pixelBelow)
            {
                status = pixelBelow.getPixelStatus();

                if(status === PIXEL_STATUS.ERASED || status === PIXEL_STATUS.DELETED){
                    continue;
                }else{
                    return pixelBelow;
                }
            }
        }

        return null;
    }

    addLayers(layers){
        _Debug_.checkInstanceOfArray(layers);
        this.layers = [...this.layers, ...layers];
    }

    addLayerId(id){
        const layer = Layer.create(id);
        this.layers.push(layer);
        IndexManager.updateIndexes(this.layers);
        if(DEBUG.ON) _Debug_.log(`NEW LAYER ID: ${id}`);
        return layer;
    }

    addLayer(layer){
        this.layers.push(layer);
        IndexManager.updateIndexes(this.layers);
        if(DEBUG.ON) _Debug_.log(`NEW LAYER ID: ${layer.getLayerId()}`);
    }

    deleteLayer(id)
    {
        const promise = new Promise(function (resolve){
            for(const i in this.layers){
                if(id === this.layers[i].getLayerId()){

                    let isEmit = false;

                    if(this.layers[i].isLayerEmpty()){
                        isEmit = false;
                    } else{
                        isEmit = true;
                        this.layers[i].deleteLayerPixels();
                    }

                    this.layers[i] = null;
                    this.layers.splice(i, 1);
                    
                    IndexManager.updateIndexes(this.layers);
                    
                    if(DEBUG.ON) _Debug_.log(`DELETE LAYER ID: ${id}`);

                    resolve(isEmit); 
                    break;
                }
            }
        }.bind(this));

        promise.then((value)=> {
            if(value) this.emit('layerDelete', id);
        });
    }

    deleteAllLayers(){
        for(const layer of this.layers){
            layer.deleteLayerPixels();
        }

        this.layers.length = 0;
    }
}