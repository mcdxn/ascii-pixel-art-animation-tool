'use strict';

import { ResizeScreenBase } from './algo-resize-screen-base';

export class ResizeScreenHeight extends ResizeScreenBase {

    constructor(){
        super();
    }
    
    algoDoneY(){

        if(this.flags.getFlag('resizeMode')){
            if((this.height - 1)) this.height -= 1;
        }else{
            this.height += 1;
        }

        super.algoDone();
    }

    algoIncreaseY(){
        const pixels = this.screen.pixelFactory.createArrayOfPixels();
        const scanline = this.screen.createScanline('0', pixels);

        if(this.flags.getFlag('resizeDirection')){
            // INSERT SCANLINE AT BOTTOM
            this.pixels.push(pixels);
            this.scanlines.push(scanline);
            this.display.appendChild(scanline);
        }else{
            // INSERT SCANLINE AT TOP
            this.pixels.unshift(pixels);
            this.scanlines.unshift(scanline);
            this.display.insertAdjacentElement('afterbegin', scanline);
        }

    }

    algoDecreaseY(){

        const len = this.scanlines.length - 1;

        if(len){
            // REMOVE SCANLINE FROM BOTTOM
            if(this.flags.getFlag('resizeDirection')){
                const scanline = this.scanlines.pop();
                const pixelRow = this.pixels.pop();
                for(const px of pixelRow) px.deletePixel();

                this.display.removeChild(scanline);
            }else{
            // REMOVE SCANLINE FROM TOP
                const pixelRow =  this.pixels.shift();
                for(const px of pixelRow) px.deletePixel();
                const scanline = this.scanlines[0];
                this.scanlines.shift();
                this.display.removeChild(scanline);
            }

        }

    }
}