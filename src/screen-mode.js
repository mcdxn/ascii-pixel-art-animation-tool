'use strict';

import { _Debug_ } from './debug';
import { Equipment } from './equipment';

/*eslint no-undef: "off"*/

export class ScreenMode extends Equipment {
    constructor(){
        super('mode');
    }

    static create(){
        return new ScreenMode();
    }

    switchArtMode(mode){
        if(DEBUG.ON) _Debug_.checkEmptyAndValidString(mode);
        if(DEBUG.ON) _Debug_.checkValidArtMode(mode);
        if(DEBUG.ON) _Debug_.checkNullOrUndefinedValue(this.algo);

        this.algo.run(ALGO_COMMAND_NAME.ClearScreen);

        switch(mode)
        {
        case ART_MODE.ASCII_ART:
            this.screen.setStateProperty('pixelSize', DEFAULTS.pixelSize);
            this.algo.run({X:this._processAsciiArtSwitch});
            break;
        case ART_MODE.PIXEL_ART:
            this.screen.setStateProperty('pixelSize', DEFAULTS.pixelSizeZero);
            this.algo.run({X:this._processPixelArtSwitch});
            break;
        case ART_MODE.BLOCK_ART:
            break;
        default:
            break;
        }

        this.screen.setStateProperty('artMode', mode);
        this.screen.setStateProperty('pixelValue', DEFAULTS.pixelValue);
        this.screen.setStateProperty('pixelFgColor', DEFAULTS.pixelFgColor);
        this.screen.setStateProperty('pixelBgColor', DEFAULTS.pixelBgColor);
    }

    _processAsciiArtSwitch(){

        const px =  this.pixels[this.y][this.x];

        px.setPixelElementStyleProperty('font-size', this.screen.getStateProperty('pixelSize'));
        px.setPixelElementStyleProperty('width', 'auto');
        px.setPixelElementStyleProperty('height', 'auto');
    }

    _processPixelArtSwitch(){

        const px =  this.pixels[this.y][this.x];

        px.setPixelElementStyleProperty('font-size', DEFAULTS.pixelSizeZero);
        px.setPixelElementStyleProperty('width', this.screen.getStateProperty('pixelWidth'));
        px.setPixelElementStyleProperty('height', this.screen.getStateProperty('pixelHeight'));
    }

    _processBlockArtSwitch(){

    }
}