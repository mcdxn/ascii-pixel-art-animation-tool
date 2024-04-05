'use strict';

import { AlgoBase }     from './algo-base';

/*eslint no-undef: "off"*/

export class ResizeScreenBase extends AlgoBase {

    constructor(){
        super();
    }
    
    algoDone(){
        
        this.screen.updateFastPixels();

        if(this.flags.getFlag('grid')){
            this.x = 0;
            this.y = 0;
            this.executeCommand(ALGO_COMMAND_NAME.ToggleGrid);
            this.executeCommand(ALGO_COMMAND_NAME.ToggleGrid);
        }
    }
    
    algoReprocessProperties(){
        const px = this.pixels[this.y][this.x];
        px.setPixelElementId(`${this.screenId}`);
        px.setPixelElementPosition(this.x, this.y);
    }
}