'use strict';


const webpack = require('webpack');

module.exports = new webpack.DefinePlugin({

    DEFAULTS:
    {
        historySize:            2000,
        screenWidth:            54,
        screenHeight:           18,
    
        displayId:              '"display"',
        displayBgColor:         '"transparent"',
        displayBorder:          '"none"',
        displayBorderColor:     '"none"',
    
        pixelValue:             '" "',

        // FAMILY NAME:
        // Monaco, Menlo, Andale Mono, Courier, Courier New, PT Mono
        // GENERIC: monospace

        pixelFontFamily:        '"Monaco"',

        pixelSize:              '"12px"',
        pixelSizeZero:          '"0px"',
        pixelFgColor:           '"transparent"',
        pixelBgColor:           '"transparent"',
        pixelOutlineStyle:       '"1px solid WhiteSmoke"',
        pixelOutlineColor:       '"WhiteSmoke"',
    
        panelContentHorizontalWidth:   '"300px"',
        panelContentVerticalHeight:    '"200px"',
    
        colorItemBoxSize:       '"20px"',
    
        eyedropperFgColor:      '"transparent"',
        eyedropperBgColor:      '"transparent"',
    
        pixelSizePixeArtMode:   '"6px"'
    }

});