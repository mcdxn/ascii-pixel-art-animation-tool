'use strict';

import { Equipment }    from './equipment';
import { ScreenPixel }  from './screen-pixel';
import { _Debug_ }      from './debug';

/*eslint no-undef: "off"*/


export class ScreenPixelFactory extends Equipment {

    constructor(){
        super('pixelFactory');
        this.pixelMouseDownHandler = null;
        this.pixelMouseOverHandler = null;
    }

    static create(){
        return new ScreenPixelFactory();
    }

    init(mouseDownHandler, mouseOverHandler){
        if(DEBUG.ON) _Debug_.checkNullOrUndefinedValue(mouseDownHandler);
        if(DEBUG.ON) _Debug_.checkNullOrUndefinedValue(mouseOverHandler);

        this.pixelMouseDownHandler = mouseDownHandler;
        this.pixelMouseOverHandler = mouseOverHandler;
    }

    createPixel(){
        if(DEBUG.ON) _Debug_.checkNullOrUndefinedValue(this.screen);

        const px = document.createElement('div');
        px.style.setProperty('display', 'none');

        const attribX = document.createAttribute(PIXEL_ELEMENT_ATTRIB.PIXEL_DATA_X_POS);
        const attribY = document.createAttribute(PIXEL_ELEMENT_ATTRIB.PIXEL_DATA_Y_POS);
        const attribPixelType = document.createAttribute(PIXEL_ELEMENT_ATTRIB.PIXEL_TYPE);
        const attribLayerId = document.createAttribute(PIXEL_ELEMENT_ATTRIB.PIXEL_LAYER_ID);

        px.setAttributeNode(attribX);
        px.setAttributeNode(attribY);
        px.setAttributeNode(attribPixelType);
        px.setAttributeNode(attribLayerId);

        px.innerHTML = DEFAULTS.pixelValue;
     
        px.style.setProperty('color', DEFAULTS.pixelFgColor);
        px.style.setProperty('background-color', DEFAULTS.pixelBgColor);
        // Default mode is ACII art mode.
        // FOR ASCII ART MODE - font size must be > 1 PX.
        px.style.setProperty('font-size', this.screen.getStateProperty('pixelSize'));
        px.style.setProperty('font-family', DEFAULTS.pixelFontFamily);
        px.style.setProperty('width', 'auto');
        px.style.setProperty('height', 'auto');

        if(this.screen.getStateProperty('artMode') === ART_MODE.PIXEL_ART){
            // Check if we are in art mode.
            // FOR PIXEL ART MODE - font size must be 0 PX.
            px.style.setProperty('font-size', DEFAULTS.pixelSizeZero);
            px.style.setProperty('width', this.screen.getStateProperty('pixelWidth'));
            px.style.setProperty('height', this.screen.getStateProperty('pixelHeight'));
        }

        // IMPORTANT FOR CORRECT PIXEL SPACING
        px.style.setProperty('display', 'inline-block');

        px.addEventListener('mousedown', this.pixelMouseDownHandler);
        px.addEventListener('mouseover', this.pixelMouseOverHandler);

        const screenPixel = ScreenPixel.create(px);
        screenPixel.setPixelType(PIXEL_TYPE.SCREEN);
        screenPixel.setPixelElementLayerId(-1);

        return screenPixel;
    }

    createArrayOfPixels(){
        
        let countX = 0;
        const arrayOfPixels = [];
        const width = this.screen.getStateProperty('screenWidth');
        
        do{
            const px = this.createPixel();
            arrayOfPixels.push(px);

        }while((countX++ !== width - 1));
    
        return arrayOfPixels;
    }
}