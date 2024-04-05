'use strict';

const webpack = require('webpack');

module.exports = new webpack.DefinePlugin({

    // SYSTEM RELEATED CONSTANTS

    ART_MODE: {
        ASCII_ART:      '"artModeAscii"', 
        PIXEL_ART:      '"artModePixel"',
    },
    

    //  PIXEL RELATED CONSTANTS

    PIXEL_ELEMENT_ATTRIB: {
        PIXEL_DATA_X_POS:   '"data-x-pos"',
        PIXEL_DATA_Y_POS:   '"data-y-pos"',
        PIXEL_TYPE:         '"data-pixel-type"',
        PIXEL_ART_MODE:     '"data-pixel-art-mode"',
        PIXEL_LAYER_ID:     '"data-pixel-layer-id"'
    },
    
    PIXEL_ART_MODE: {
        PIXELART:   1,
        ASCIIART:   2
    },
    
    PIXEL_TYPE: {
        SCREEN:     1,
        ANIMATION:  2
    },
    
    PIXEL_STATUS: {
        ACTIVE:   1,
        ERASED:   2,
        DELETED:  3
    },


    // COLOR PALETTE RELATED CONSTANTS

    COLOR_SET:{
        GrayScale:          '"grayscale"',
        BW:                 '"blackwhite"',
        RGB:                '"rgb"',
        MaterialDesign:     '"material_design"',
    }

});