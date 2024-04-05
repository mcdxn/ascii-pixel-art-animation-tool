'use strict';

const webpack = require('webpack');

module.exports = new webpack.DefinePlugin({

    KB:{
   
        A: '"KeyA"',
        D: '"KeyD"',
        E: '"KeyE"',
        F: '"KeyF"',
        H: '"KeyH"',
        U: '"KeyU"',
        P: '"KeyP"',
        R: '"KeyR"',
        S: '"KeyS"',
        T: '"KeyT"',
        Q: '"KeyQ"',
        W: '"KeyW"',
        X: '"KeyX"',
    
        PLUS:   '"+"',
        MINUS:  '"-"',
        TOGGLE_GRID:        '"KeyG"',
        BACKSPACE:          '"Backspace"',
        TOGGLE_AUTOCLICK:   '"Space"',
        PIXEL_INCREASE_SIZE: '"["',
        PIXEL_DECREASE_SIZE: '"]"',
        SCREEN_INCREASE_HEIGHT: '"ArrowUp"',
        SCREEN_DECREASE_HEIGHT: '"ArrowDown"',
        SCREEN_INCREASE_WIDTH:  '"ArrowLeft"',
        SCREEN_DECREASE_WIDTH:  '"ArrowRight"'
    }

});