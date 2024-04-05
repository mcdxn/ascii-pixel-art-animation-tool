'use strict';

import { ResizeScreenBase } from './algo-resize-screen-base';

export class ResizeScreenWidth extends ResizeScreenBase {
    
    algoDoneX(){
        
        if(this.flags.getFlag('resizeMode')){
            if((this.width - 1)) this.width -= 1;
        }else{
            this.width += 1;
        }

        super.algoDone();
    }

    algoIncreaseX(){
        const y = this.y;
        const x = this.width - 1;

        const pixel             = this.screen.pixelFactory.createPixel(0);
        const pixelStyle        = pixel.getPixelElementStyle();
        
        const screenPixelStyle  = this.pixels[y][x].getPixelElementStyle();

        screenPixelStyle.setProperty('border', '');

        pixelStyle.setProperty('font-size',     screenPixelStyle.getPropertyValue('font-size'));
        pixelStyle.setProperty('font-family',   screenPixelStyle.getPropertyValue('font-family'));
        pixelStyle.setProperty('color',         screenPixelStyle.getPropertyValue('color'));
        pixelStyle.setProperty('border-left',   screenPixelStyle.getPropertyValue('border-left'));
        pixelStyle.setProperty('border-top',    screenPixelStyle.getPropertyValue('border-top'));
        pixelStyle.setProperty('border-right',  screenPixelStyle.getPropertyValue('border-right'));
        pixelStyle.setProperty('border-bottom', screenPixelStyle.getPropertyValue('border-bottom'));
        pixelStyle.setProperty('border',        screenPixelStyle.getPropertyValue('border'));

        pixel.setPixelElementValue(' ');
        
        if(this.flags.getFlag('resizeDirection')){
            // ADD TO LEFT
            this.pixels[y].unshift(pixel);
            this.scanlines[y].insertAdjacentElement('afterbegin', pixel.getPixelElement());
        }else{
            // ADD TO RIGHT
            this.pixels[y].push(pixel);
            this.scanlines[y].appendChild(pixel.getPixelElement());
        }

    }


    algoDecreaseX(){
        const y = this.y;
        const len = this.pixels[y].length - 1;

        if(len){
            if(this.flags.getFlag('resizeDirection')){
                // REMOVE FROM LEFT
                const pixel = this.pixels[y].shift();
                pixel.deletePixel();   
                this.scanlines[y].removeChild(pixel.getPixelElement());
            }else{
                // REMOVE FROM RIGHT
                const pixel = this.pixels[y].pop();
                pixel.deletePixel();   
                this.scanlines[y].removeChild(pixel.getPixelElement());
            }
        }
    }

}