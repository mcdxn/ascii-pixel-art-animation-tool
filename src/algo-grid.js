'use strict';

import { AlgoBase } from './algo-base';

/*eslint no-undef: "off"*/

export class Grid extends AlgoBase {

    constructor(){
        super();
        super.setCommandName(ALGO_COMMAND_NAME.ToggleGrid);
    }

    static create(){
        return new Grid();
    }

    execute(){
        this.algo.flags.toggleFlag('grid');
        this.algo.executeImmediate(this.algoXToggle);
    }

    algoXToggle(){

        const fastPixels = this.screen.getFastPixels();
        const flag = this.flags.getFlag('grid');
        let style = null;
        
        for(const px of fastPixels){
            style = px.getPixelElementStyle();    

            if(flag){
                style.setProperty('outline', this.state.getStateProperty('pixelOutlineStyle'));
            }else{
                style.setProperty('outline', 'none');
            }
        }

    }
}