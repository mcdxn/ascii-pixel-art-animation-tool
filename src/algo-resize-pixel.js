'use strict';

import { Util }         from './util';
import { AlgoBase }     from './algo-base';

/*eslint no-undef: "off"*/


class ResizePixel extends AlgoBase {
    constructor(){
        super();
    }
    
    algoResizePixel(){
        const artMode = this.state.getStateProperty('artMode');
        const fastPixels = this.screen.getFastPixels();

        if(artMode === ART_MODE.ASCII_ART)
        { 
            for(const px of fastPixels){
                px.setPixelElementStyleProperty('font-size', `${this.temp['pixelSize']}px`);
            }       
        }
        else if(artMode === ART_MODE.PIXEL_ART)
        {
            for(const px of fastPixels){
                px.setPixelElementStyleProperty('width', `${this.temp['pixelSize']}px`);
                px.setPixelElementStyleProperty('height', `${this.temp['pixelSize']}px`);
            }   
            
        }    
    }

    init(){
        this.temp['pixelSize'] = 0;
        const artMode = this.state.getStateProperty('artMode');
        const resizeMode = this.flags.getFlag('resizeMode');

        if(artMode === ART_MODE.ASCII_ART)
        {        
            const value = Util.extractNumberFromStringFontSize(this.state.getStateProperty('pixelSize'));

            if(resizeMode){
                (value === 2) ? this.exit = true : this.temp['pixelSize'] = value - 1;
            }else{
                this.temp['pixelSize'] = value + 1;
            }        
        }
        else if(artMode === ART_MODE.PIXEL_ART)
        {
            const value = Util.extractNumberFromStringFontSize(this.state.getStateProperty('pixelWidth'));

            if(resizeMode){
                (value === 2) ? this.exit = true : this.temp['pixelSize'] = value - 1;
            }else{
                this.temp['pixelSize'] = value + 1;
            }    
        }

    }

    done(){
        const artMode = this.state.getStateProperty('artMode');

        if(artMode === ART_MODE.ASCII_ART)
        {
            this.state.setStateProperty('pixelSize', `${this.temp['pixelSize']}px`);
        }
        else if(artMode === ART_MODE.PIXEL_ART)
        {
            this.state.setStateProperty('pixelWidth', `${this.temp['pixelSize']}px`);
            this.state.setStateProperty('pixelHeight', `${this.temp['pixelSize']}px`);
        }

        this.temp['pixelSize'] = 0;

    }
}

export class ResizePixelIncrease extends ResizePixel {
    
    constructor(){
        super();
        this.setCommandName(ALGO_COMMAND_NAME.PixelIncrease);
    }

    static create(){
        return new ResizePixelIncrease();
    }

    execute(){
        const algo = this.algo;
        algo.flags.setFlag('resizeMode', false);
        algo.run({before:this.algoResizePixel, init:super.init, done:super.done});
    }
}

export class ResizePixelDecrease extends ResizePixel {
   
    constructor(){
        super();
        super.setCommandName(ALGO_COMMAND_NAME.PixelDecrease);
    }

    static create(){
        return new ResizePixelDecrease();
    }

    execute(){
        const algo = this.algo;
        algo.flags.setFlag('resizeMode', true);
        algo.run({before:super.algoResizePixel, init:super.init, done:super.done});
    }
}