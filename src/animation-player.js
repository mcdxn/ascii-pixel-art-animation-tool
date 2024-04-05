'use strict';

/*eslint no-undef: "off"*/

export class AnimationPlayer {

    constructor(){
        this.screen         = null;
        this.pixels         = null;
        this.isPlaying      = false;
        this.animationList  = [];
    }

    static create(){
        return new AnimationPlayer();
    }

    init(screen){
        this.screen = screen;
        this.pixels = screen.getPixels();
    }
    
    playAnimation(animationObject)
    {

        if(this.isPlaying){
            this.isPlaying = false;

            for(const animation of this.animationList){
                animation.pauseAnimation();
            }            
            
            return;
        }

        this.isPlaying = true;

        this.animationList.push(animationObject);

        for(const animation of this.animationList){
            animation.playAnimation();
        }

        let timer = null;

        const animation = (step)=>
        {

            if(!timer){
                timer = step;
            }

            const elapsed = step - timer;

            // RESTORES BACKGROUND PIXELS
            if(elapsed >= animationObject.getSpeed())
            {

                timer = 0;

                if(animationObject.getPrevScreenPixelLength()){
                    let px = null;
                    let screenPixelRef = null;
                    do{
                        px = animationObject.popPrevScreenPixel();
                        if(px){
                            screenPixelRef = this.pixels[px.getY()][px.getX()];
                            screenPixelRef.setPixelType(px.getPixelType());
                            screenPixelRef.setPixelElementValue(px.getPixelValue());
                            screenPixelRef.setPixelElementFgColor(px.getPixelFgColor());
                            screenPixelRef.setPixelElementBgColor(px.getPixelBgColor());
                        }
                    }while(px);
                }

                const currFrame = animationObject.nextFrame();
                let nextLayerPixel = null;
                let screenPixel = null;
                // RENDERS CURRENT ANIMATION FRAME
                do{
                    nextLayerPixel = currFrame.nextLayerPixel();

                    if(nextLayerPixel){

                        screenPixel = this.pixels[nextLayerPixel.getY()][nextLayerPixel.getX()];
                    
                        if(screenPixel.getPixelType() === PIXEL_TYPE.SCREEN){
                            animationObject.pushPrevScreenPixel(screenPixel.getPixelCopy());
                        }

                        screenPixel.setPixelElementValue(nextLayerPixel.getPixelValue());
                        screenPixel.setPixelElementFgColor(nextLayerPixel.getPixelFgColor());
                        screenPixel.setPixelElementBgColor(nextLayerPixel.getPixelBgColor());
                        screenPixel.setPixelType(PIXEL_TYPE.ANIMATION);
                    }
                
                }while(nextLayerPixel !== null);  
            }

            if(this.isPlaying) window.requestAnimationFrame(animation);
        };

        window.requestAnimationFrame(animation);
    }

    stopAnimation(id){
        window.clearInterval(id);
    }
}