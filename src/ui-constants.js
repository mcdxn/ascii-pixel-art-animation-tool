'use strict';

const webpack = require('webpack');

module.exports = new webpack.DefinePlugin({
    
    EXCSS:{
        ToolbarItemSelected:    '"tool-item-selected"',
        PanelVertical:          '"panel-content-vertical"',
        PanelHorizontal:        '"panel-content-horizontal"'
    },

    TOOLBAR_TOOL_ID:{
        PENCIL:         '"pencil"', 
        PAINTBRUSH:     '"paintbrush"',
        BRUSH:          '"brush"',
        FILL:           '"fill"',
        ERASER:         '"eraser"',
        EYEDROPPER:     '"eyedropper"',
        ANIMATION:      '"animation"',
        PALETTE:        '"palette"',
        GRID:           '"grid"',
        RECORDER:       '"recorder"'
    }

});