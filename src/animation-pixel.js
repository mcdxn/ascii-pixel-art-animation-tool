'use strict';

import { Pixel } from './pixel';

/*eslint no-undef: "off"*/

export class AnimationPixel extends Pixel {
    constructor(x, y, value, fgcolor, bgcolor){
        super(x, y, value, fgcolor, bgcolor);
    }

    static create(x, y, value, fgcolor, bgcolor){
        const animationPixel = new AnimationPixel(x, y, value, fgcolor, bgcolor);
        animationPixel.setPixelType(PIXEL_TYPE.ANIMATION);
        return animationPixel;
    }
}