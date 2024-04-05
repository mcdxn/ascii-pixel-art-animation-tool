const path = require('path');
const webpack = require('webpack');

const SYSTEM_DEFAULTS       =  require('./src/system-defaults');
const SYSTEM_CONSTANTS      =  require('./src/system-constants');
const KEYBOARD_CONSTANTS    =  require('./src/keyboard-constants');
const UI_CONSTANTS          =  require('./src/ui-constants');
const ALGO_CONSTANTS        =  require('./src/algo-constants');


const DEBUG_CHECKS = new webpack.DefinePlugin({
    DEBUG: {
        ON: 'true'
    }
});

module.exports = 
{
    // 'production' 'development' or 'none'
    mode: 'development',
    
    entry: './src/system-main.js',
    
    target: 'web',

    output: 
    {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ascii.js'
    },

    plugins:
    [
        DEBUG_CHECKS,
        SYSTEM_DEFAULTS, 
        SYSTEM_CONSTANTS, 
        KEYBOARD_CONSTANTS, 
        UI_CONSTANTS,
        ALGO_CONSTANTS
    ]
};