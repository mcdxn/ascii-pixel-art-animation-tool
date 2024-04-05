'use strict';

import { AlgoBase } from './algo-base';

/*eslint no-undef: "off"*/

export class Fill extends AlgoBase {
    
    constructor(){
        super();
        super.setCommandName(ALGO_COMMAND_NAME.ToggleFill);
    }

    static create(){
        return new Fill();
    }

    execute(){
        const algo = this.algo;
        algo.executeImmediate(this.algoFill);
    }

    algoFill(){
        // if(DEBUG.ON) _Debug_.log('IM FILLING IT!!!');
        const state         = this.state;
        const startPositionX = state.getStateProperty('fillPositionX');
        const startPositionY = state.getStateProperty('fillPositionY');
        const fillTarget    = state.getStateProperty('fillTarget');
        const fillValue     = state.getStateProperty('fillValue');
        const fillFgColor     = state.getStateProperty('fillFgColor');
        const fillBgColor   = state.getStateProperty('fillBgColor');

        const width         = this.screen.pixels[0].length;
        const height        = this.screen.pixels.length;
        let x       = startPositionX;
        let y       = startPositionY;      
        
        // goUp(this.screen, x, y, width, height, fillTarget, fillValue, fillFgColor);
        // goDown(this.screen, x, y, width, height, fillTarget, fillValue, fillFgColor);

        for(let i=x; i >= 0; i--){
            fillUtilEx(this.screen, i, y, width, height, fillTarget, fillValue, fillFgColor, fillBgColor);
        }

        for(let i=x; i <= width; i++){
            fillUtilEx(this.screen, i, y, width, height, fillTarget, fillValue, fillFgColor, fillBgColor);
        }

        // fillUtilEx(this.screen, x, y, width, height, fillTarget, fillValue, fillFgColor, fillBgColor);

        // function fillUtil(screen, x, y, width, height, fillTarget, fillValue, fillFgColor, fillBgColor){

        //     if (x < 0 || x >= width || y < 0 || y >= height)
        //         return;

        //     const pixelValue = screen.pixels[y][x].getPixelElementValue();

        //     if(pixelValue === fillTarget){
        //         screen.writePixel(x, y, fillValue, fillFgColor, true);
        //     }
        // }


        function fillUtilEx(screen, x, y, width, height, fillTarget, fillValue, fillFgColor, fillBgColor){

            if (x < 0 || x >= width || y < 0 || y >= height)
                return;

            goUp(screen, x, y, width, height, fillTarget, fillValue, fillFgColor, fillBgColor);
            goDown(screen, x, y, width, height, fillTarget, fillValue, fillFgColor, fillBgColor);
            goLeft(screen, x, y, width, height, fillTarget, fillValue, fillFgColor, fillBgColor);
            goRight(screen, x, y, width, height, fillTarget, fillValue, fillFgColor, fillBgColor);
        }

        function goUp(screen, x, y, width, height, fillTarget, fillValue, fillFgColor, fillBgColor){
            let tempY = y;
            let pixelValue = null;
            do{  
                pixelValue = screen.pixels[tempY][x].getPixelElementValue();

                if(pixelValue === fillTarget){
                    screen.writePixel(x, tempY, fillValue, fillFgColor, fillBgColor, true);
                    goLeft(screen, x, y, width, height, fillTarget, fillValue, fillFgColor, fillBgColor);
                    goRight(screen, x, y, width, height, fillTarget, fillValue, fillFgColor, fillBgColor);
                }else if(pixelValue === fillValue){
                    // break;
                    continue;
                }else{
                    break;
                }
            }while(tempY--);

        }

        function goDown(screen, x, y, width, height, fillTarget, fillValue, fillFgColor, fillBgColor){
            let tempY = y + 1;
            let pixelValue = null;

            do{  
                if(tempY >= height){
                    break;
                }
                pixelValue = screen.pixels[tempY][x].getPixelElementValue();

                if(pixelValue == fillTarget){
                    screen.writePixel(x, tempY, fillValue, fillFgColor, fillBgColor, true);
                    goLeft(screen, x, y, width, height, fillTarget, fillValue, fillFgColor, fillBgColor);
                    goRight(screen, x, y, width, height, fillTarget, fillValue, fillFgColor, fillBgColor);
                }else if(pixelValue === fillValue){
                    // break;
                    continue;
                }else{
                    break;
                }
            }while(tempY++ !== height - 1);

            tempY = y;

        }


        function goRight(screen, x, y, width, height, fillTarget, fillValue, fillFgColor, fillBgColor){
            let tempX = x;
            let pixelValue = null;

            do{
                if(tempX !== width){
                    pixelValue = screen.pixels[y][tempX].getPixelElementValue();
                    if(pixelValue === fillTarget){
                        screen.writePixel(tempX, y, fillValue, fillFgColor, fillBgColor, true);

                    }else if(pixelValue === fillValue){
                        continue;
                    }else{
                        break;
                    }
                }

            }while(tempX++ !== width - 1);

        }


        function goLeft(screen, x, y, width, height, fillTarget, fillValue, fillFgColor, fillBgColor){
            let tempX = x;
            let pixelValue = null;

            do{
                pixelValue = screen.pixels[y][tempX].getPixelElementValue();
                if(pixelValue === fillTarget){
                    screen.writePixel(tempX, y, fillValue, fillFgColor, fillBgColor, true);              
                }else if(pixelValue === fillValue){
                    continue;
                }else{
                    break;
                }
            }while(tempX--);

        }

    }
}