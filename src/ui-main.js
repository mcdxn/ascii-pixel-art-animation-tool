'use strict';

import { UI_TOOLBAR }               from './ui-main-toolbar';
import { UI_LAYERS }                from './ui-main-layers';
import { UI_ANIMATION_OBJECTS }     from './ui-main-animation-objects';
import { UI_ANIMATION_FRAMES }      from './ui-main-animation-frames';
import { UI_COMPOSITOR }            from './ui-main-compositor';



export const SYSTEMUI = {};

SYSTEMUI.init = ()=>{

    window.addEventListener('load', ()=>
    {
        UI_TOOLBAR.init();       
        UI_LAYERS.init();
        UI_ANIMATION_OBJECTS.init();
        UI_ANIMATION_FRAMES.init(); 
        UI_COMPOSITOR.init();
    });
};

SYSTEMUI.toolBarArtModeAscii = ()=>{
    UI_TOOLBAR.toolBarArtModeAscii();
};

SYSTEMUI.toolBarArtModePixel = ()=>{
    UI_TOOLBAR.toolBarArtModePixel();
};