'use strict';

import { AlgoBase } from './algo-base.js';

/*eslint no-undef: "off"*/


export class ClearScreen extends AlgoBase {

    constructor(){
        super();
        super.setCommandName(ALGO_COMMAND_NAME.ClearScreen);
    }
    
    static create(){
        return new ClearScreen();
    }

    execute(){
        this.algo.executeImmediate(this.algoClearScreen);
    }

    algoClearScreen(){

        const fastPixels = this.screen.getFastPixels();

        for(const px of fastPixels){
            px.setPixelElementValue(DEFAULTS.pixelValue);
            px.setPixelElementFgColor(DEFAULTS.pixelFgColor);
            px.setPixelElementBgColor(DEFAULTS.pixelBgColor);
            px.setPixelLayerId(-1);
            px.setPixelStatus(PIXEL_STATUS.ACTIVE);
        }
    }
}