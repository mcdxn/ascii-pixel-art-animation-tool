'use strict';

import { SYSTEM }    from './system-main';

/*eslint no-undef: "off"*/

export class KeyboardBindings {

    static create(){
        return KeyboardBindings;
    }

    static init(){

        document.addEventListener('keydown', (event)=>{
        
            // if(DEBUG.ON) _Debug_.log(`KEY: ${event.key} : CODE: ${event.code}`);
        
            const code = event.code;
            const key = event.key;

            if(event.ctrlKey){

                if(code === KB.Q){
                    SYSTEM.switchAsciiArtMode();
                }

                if(code === KB.W){
                    SYSTEM.switchPixelArtMode();
                }

                if(code === KB.D){
                    SYSTEM.setFlag('eyedropper', true);
                }

                if(code === KB.P){
                    SYSTEM.setFlag('pencil', true);
                }

                if(code === KB.F){
                    SYSTEM.toggleFill();
                }

                if(code === KB.U){
                    SYSTEM.undo();
                }

                if(code === KB.R){
                    SYSTEM.redo();
                }

                if(code === KB.TOGGLE_GRID){
                    SYSTEM.toggleGrid();
                }

                if(key === KB.PIXEL_INCREASE_SIZE){
                    SYSTEM.incPixelSize();
                }

                if(key === KB.PIXEL_DECREASE_SIZE){
                    SYSTEM.decPixelSize();
                }

                if(code === KB.BACKSPACE){
                    SYSTEM.clearScreen();
                }
            }

            if(event.altKey){

                // TOP SIDE OF SCREEN
                if(code === KB.SCREEN_INCREASE_HEIGHT){
                    SYSTEM.incScreenTop();
                }
    
                if(code === KB.SCREEN_DECREASE_HEIGHT){
                    SYSTEM.decScreenTop();
                }

                // RIGHT SIDE OF SCREEN
                if(code === KB.SCREEN_DECREASE_WIDTH){
                    SYSTEM.incScreenRight();
                }

                if(code === KB.SCREEN_INCREASE_WIDTH){
                    SYSTEM.decScreenRight();
                }
    
            }

            if(event.shiftKey){


                // BOTTOM SIDE OF SCREEN
                if(code === KB.SCREEN_INCREASE_HEIGHT){
                    SYSTEM.incScreenBottom();
                }
    
                if(code === KB.SCREEN_DECREASE_HEIGHT){
                    SYSTEM.decScreenBottom();
                }


                // LEFT SIDE OF SCREEN
                if(code === KB.SCREEN_INCREASE_WIDTH){
                    SYSTEM.incScreenLeft();
                }
    
                if(code === KB.SCREEN_DECREASE_WIDTH){
                    SYSTEM.decScreenLeft();
                }
            }
  

            if(code === KB.BACKSPACE && !event.ctrlKey){
                SYSTEM.toggleEraser();
            }
        });
    }
}