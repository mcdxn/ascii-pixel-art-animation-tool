'use strict';

const webpack = require('webpack');

module.exports = new webpack.DefinePlugin({

    ALGO_COMMAND_NAME: {
    
        ToggleFill:             '"ToggleFill"',
        ToggleGrid:             '"ToggleGrid"',
        ClearScreen:            '"ClearScreen"',
        PixelIncrease:          '"IncreasePixelSize"',
        PixelDecrease:          '"DecreasePixelSize"',
        ScreenIncreaseTop:      '"ScreenIncreaseTop"',
        ScreenDecreaseTop:      '"ScreenDecreaseTop"',
        ScreenIncreaseBottom:   '"ScreenIncreaseBottom"',
        ScreenDecreaseBottom:   '"ScreenDecreaseBottom"',
        ScreenIncreaseLeft:     '"ScreenIncreaseLeft"',
        ScreenDecreaseLeft:     '"ScreenDecreaseLeft"',
        ScreenIncreaseRight:    '"ScreenIncreaseRight"',    
        ScreenDecreaseRight:    '"ScreenDecreaseRight"'
    
    },

});