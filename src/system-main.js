'use strict';

import { _Debug_ }            from './debug';
import { SystemFlags }        from './system-flags';
import { SystemState }        from './system-state';
import { Screen }             from './screen';
import { LayerManager }       from './layer-manager';
import { HistoryManager }     from './history-manager';
import { Util }               from './util';
import { Algo }               from './algo';
import { Grid }               from './algo-grid';
import { ClearScreen }        from './algo-clear-screen';
import { Keyboard }           from './keyboard';
import { KeyboardBindings }   from './keyboard-bindings';
import {
    ResizePixelIncrease, 
    ResizePixelDecrease
} from './algo-resize-pixel';

import {
    ResizeScreenIncreaseTop, 
    ResizeScreenDecreaseTop,
    ResizeScreenIncreaseBottom, 
    ResizeScreenDecreaseBottom,
    ResizeScreenIncreaseLeft,
    ResizeScreenDecreaseLeft,
    ResizeScreenIncreaseRight,
    ResizeScreenDecreaseRight
} from './algo-resize-screen';

import { ScreenPixelFactory } from './screen-pixel-factory';
import { ScreenMode }         from './screen-mode';

import { Draggable } from './draggable';
import { Fill } from './algo-fill';

import { AnimationManager } from './animation-manager';

import { SYSTEMUI } from './ui-main';

/*eslint no-undef: "off"*/


export const SYSTEM = {};

window.ASCII = SYSTEM;

let _screen         = null;
let _screenMode     = null;
let _layerManager   = null;
let _historyManager = null;
let _animationManager = null;

let _keyboard       = null;
let _keybindings    = null;
let _algo           = null;
let _flags          = null;
let _state          = null;

let _pixelFactory = null;

SYSTEM.init = (options)=>{

    window.addEventListener('load', function () {

        _screen             = Screen.create();
        _screenMode         = ScreenMode.create();
        _layerManager       = LayerManager.create();
        _historyManager     = HistoryManager.create();
        _animationManager   = AnimationManager.create();
        _state              = SystemState.create(); 
        _flags              = SystemFlags.create();
        _keyboard           = Keyboard.create();
        _keybindings        = KeyboardBindings.create();
        _algo               = Algo.create();
        _pixelFactory       = ScreenPixelFactory.create();

        _state.setOptions(options);
        _state.setStateProperty('artMode', ART_MODE.ASCII_ART);

        _screenMode.equip(_screen);
        _screenMode.equip(_algo);
        
        _screen.equip(_state);
        _screen.equip(_flags);    
        _screen.equip(_layerManager);
        _screen.equip(_historyManager);
        _screen.equip(_animationManager);
        _screen.equip(_algo);
        _screen.equip(_pixelFactory);    

        _animationManager.equip(_screen);

        _pixelFactory.equip(_screen);
        _pixelFactory.init(_screen.getPixelMouseDownHandler(), _screen.getPixelMouseOverHandler());
        
        _screen.init();
        _keyboard.init();
        _keybindings.init();
        _animationManager.init();
        _algo.init(_screen);

        _screen.setStateProperty('pixelValue', 'X');

        _layerManager.on('layerDelete', ()=>{
            if(DEBUG.ON) _Debug_.log('REDRAWING LAYERS AFTER DELETE');
            _screen.redrawLayers();
        });

        _algo.registerCommand(ClearScreen.create());

        _algo.registerCommand(Grid.create());

        _algo.registerCommand(Fill.create());

        _algo.registerCommand(ResizePixelIncrease.create());
        _algo.registerCommand(ResizePixelDecrease.create());

        _algo.registerCommand(ResizeScreenIncreaseTop.create());
        _algo.registerCommand(ResizeScreenDecreaseTop.create());

        _algo.registerCommand(ResizeScreenIncreaseBottom.create());
        _algo.registerCommand(ResizeScreenDecreaseBottom.create());
        
        _algo.registerCommand(ResizeScreenIncreaseLeft.create());
        _algo.registerCommand(ResizeScreenDecreaseLeft.create());
        
        _algo.registerCommand(ResizeScreenIncreaseRight.create());
        _algo.registerCommand(ResizeScreenDecreaseRight.create());
    });

    SYSTEMUI.init();
};

SYSTEM.undo = ()=>{

    const moment = _historyManager.undo();

    if(moment){
        _screen.writePixel(moment.x, moment.y, moment.value, moment.fgcolor, moment.bgcolor);
    }
};

SYSTEM.redo = ()=>{

    const moment = _historyManager.redo();

    if(moment){
        _screen.writePixel(moment.x, moment.y, moment.value, moment.fgcolor, moment.bgcolor);
    }
};

SYSTEM.setASCII = (asciiChar)=>{
    if(Util.isAllowedASCII(asciiChar)){
        _screen.setStateProperty('pixelValue', asciiChar);
    }
};

// LAYERS START

SYSTEM.setActiveLayerById = (id)=>{
    _layerManager.setActiveLayerById(id);
};

SYSTEM.addLayerId = (id)=>{
    const layer = _layerManager.addLayerId(id);
    _layerManager.setActiveLayer(layer);
};

SYSTEM.delLayer = (id)=>{
    _layerManager.deleteLayer(id);
};

SYSTEM.moveLayerIndex = (a, b)=>{
    if(DEBUG.ON) _Debug_.checkInstanceAndTypeOfNumber(a);
    if(DEBUG.ON) _Debug_.checkInstanceAndTypeOfNumber(b);

    _layerManager.moveLayerIndex(a, b);
    _screen.redrawLayers();
};

SYSTEM.hideLayer = (id, value)=>{
    _layerManager.setLayerHide(id, value);
    _screen.redrawLayers();
};


// LAYERS END

// ANIMATION STARTS

SYSTEM.clearAnimationArea = ()=>{
    _animationManager.clearAnimationArea();
};

SYSTEM.hideAnimationObject = (id, value)=>{
    _animationManager.hideAnimationObject(id, value);
};

SYSTEM.playAnimation = ()=>{
    _animationManager.playAnimation();
};

SYSTEM.stopAnimation = ()=>{
    _animationManager.stopAnimation();
};

SYSTEM.pauseAnimation = ()=>{
    _animationManager.pauseAnimation();
};

SYSTEM.addAnimationObjectById = (id)=>{
    _animationManager.addAnimationObjectById(id);
};

SYSTEM.deleteAnimationObjectById = (id)=>{
    _animationManager.deleteAnimationObjectById(id);
    _screen.setStateProperty('deleteAnimationObjectById', id);
};

SYSTEM.setActiveAnimationObjectById = (id)=>{

    const previousActiveAnimationObject = _animationManager.getActiveAnimationObject();

    if(previousActiveAnimationObject.getId() === id) return;
    
    _screen.setStateProperty('previousAnimationObject', previousActiveAnimationObject);

    const activeAnimationObject = _animationManager.setActiveAnimationObjectById(id);
    
    if(activeAnimationObject){
        _screen.setStateProperty('activeAnimationObject', activeAnimationObject);
    }
};

SYSTEM.getActiveAnimationObject = ()=>{
    return _animationManager.getActiveAnimationObject();
};

SYSTEM.addFrameById = (frameId)=>{
    _animationManager.stopAnimation();
    _animationManager.addFrameById(frameId);
};

SYSTEM.deleteFrameById = (frameId)=>{
    _animationManager.deleteFrameById(frameId);
    _screen.setStateProperty('deleteAnimationFrameById', frameId);
};

SYSTEM.hideFrame = (frameId, value)=>{
    _animationManager.hideFrame(frameId, value);
};

SYSTEM.setActiveFrameById = (frameId)=>{
    const activeAnimationFrame = _animationManager.setActiveFrameById(frameId);
    if(activeAnimationFrame){
        _screen.setStateProperty('activeAnimationFrame', activeAnimationFrame);
    }

    return activeAnimationFrame;
};

SYSTEM.moveAnimationObjectIndex = (a, b)=>{
    if(DEBUG.ON) _Debug_.checkInstanceAndTypeOfNumber(a);
    if(DEBUG.ON) _Debug_.checkInstanceAndTypeOfNumber(b);

    _animationManager.moveAnimationObjectIndex(a, b);
    // _screen.redrawLayers();
};

SYSTEM.moveFrameIndex = (a, b)=>{
    if(DEBUG.ON) _Debug_.checkInstanceAndTypeOfNumber(a);
    if(DEBUG.ON) _Debug_.checkInstanceAndTypeOfNumber(b);

    _animationManager.moveFrameIndex(a, b);
    // _screen.redrawLayers();
};



// ANIMATION END

SYSTEM.onSetState = (name, callback)=>{
    _screen.state.on(name, callback);
};

SYSTEM.onSetFlag = (name, callback)=>{
    _screen.flags.on(name, callback);
};

SYSTEM.setStateProperty = (name, value)=>{
    _screen.setStateProperty(name, value);
};

SYSTEM.getStateProperty = (name)=>{
    return _screen.getStateProperty(name);
};

SYSTEM.setFlag = (name, value)=>{
    _screen.flags.setFlag(name, value);
};

SYSTEM.getFlag = (name)=>{
    return _screen.flags.getFlag(name);
};

SYSTEM.setPixelFgColor = (color)=>{
    _screen.state.setStateProperty('pixelFgColor', color);
};

SYSTEM.setPixelBgColor = (color)=>{
    _screen.state.setStateProperty('pixelBgColor', color);
};

SYSTEM.getPixelFgColor = ()=>{
    return _screen.state.getStateProperty('pixelFgColor');
};

SYSTEM.getPixelBgColor = ()=>{
    return _screen.state.getStateProperty('pixelBgColor');
};

SYSTEM.setEyeDropperFgColor = (color)=>{
    _screen.state.setStateProperty('eyedropperFgColor', color);
};

SYSTEM.setEyeDropperBgColor = (color)=>{
    _screen.state.setStateProperty('eyedropperBgColor', color);
};

SYSTEM.getEyeDropperFgColor = ()=>{
    return _screen.state.getStateProperty('eyedropperFgColor');
};

SYSTEM.getEyeDropperBgColor = ()=>{
    return _screen.state.getStateProperty('eyedropperBgColor');
};

SYSTEM.setFill = (value)=>{
    _screen.setFlag('fill', value);
};

SYSTEM.toggleFill = ()=>{
    _screen.toggleFlag('fill');
};

SYSTEM.toggleEraser = ()=>{
    _screen.toggleFlag('eraser');
};

SYSTEM.toggleGrid = ()=>{
    _algo.executeCommand(ALGO_COMMAND_NAME.ToggleGrid);
};

SYSTEM.toggleSingleClick = ()=>{
    _screen.setFlag('autoClick', false);
};

SYSTEM.toggleAutoClick = ()=>{
    _screen.toggleFlag('autoClick');
};

SYSTEM.incPixelSize = ()=>{
    _algo.executeCommand(ALGO_COMMAND_NAME.PixelIncrease);
};

SYSTEM.decPixelSize = ()=>{
    _algo.executeCommand(ALGO_COMMAND_NAME.PixelDecrease);
};

SYSTEM.incScreenAll = ()=>{
    _algo.executeCommand(ALGO_COMMAND_NAME.ScreenIncreaseTop);
    _algo.executeCommand(ALGO_COMMAND_NAME.ScreenIncreaseBottom);
    _algo.executeCommand(ALGO_COMMAND_NAME.ScreenIncreaseLeft);
    _algo.executeCommand(ALGO_COMMAND_NAME.ScreenIncreaseRight);
};

SYSTEM.decScreenAll = ()=>{
    _algo.executeCommand(ALGO_COMMAND_NAME.ScreenDecreaseTop);
    _algo.executeCommand(ALGO_COMMAND_NAME.ScreenDecreaseBottom);
    _algo.executeCommand(ALGO_COMMAND_NAME.ScreenDecreaseLeft);
    _algo.executeCommand(ALGO_COMMAND_NAME.ScreenDecreaseRight);
};

SYSTEM.incScreenTop = ()=>{
    _algo.executeCommand(ALGO_COMMAND_NAME.ScreenIncreaseTop);
};

SYSTEM.decScreenTop = ()=>{
    _algo.executeCommand(ALGO_COMMAND_NAME.ScreenDecreaseTop);
};

SYSTEM.incScreenBottom = ()=>{
    _algo.executeCommand(ALGO_COMMAND_NAME.ScreenIncreaseBottom);
};

SYSTEM.decScreenBottom = ()=>{
    _algo.executeCommand(ALGO_COMMAND_NAME.ScreenDecreaseBottom);
};

SYSTEM.incScreenLeft = ()=>{
    _algo.executeCommand(ALGO_COMMAND_NAME.ScreenIncreaseLeft);
};

SYSTEM.decScreenLeft = ()=>{
    _algo.executeCommand(ALGO_COMMAND_NAME.ScreenDecreaseLeft);
};

SYSTEM.incScreenRight = ()=>{
    _algo.executeCommand(ALGO_COMMAND_NAME.ScreenIncreaseRight);
};

SYSTEM.decScreenRight = ()=>{
    _algo.executeCommand(ALGO_COMMAND_NAME.ScreenDecreaseRight);
};

SYSTEM.clearScreen = ()=>{
    _algo.executeCommand(ALGO_COMMAND_NAME.ClearScreen);
};

SYSTEM.makeElementDraggable = (element)=>{
    Draggable.makeElementDraggable(element);
};

SYSTEM.switchPixelArtMode = ()=>{
    const artMode = _screen.getStateProperty('artMode');

    if(artMode == ART_MODE.PIXEL_ART) return;

    _algo.executeCommand(ALGO_COMMAND_NAME.ClearScreen);
    _screenMode.switchArtMode(ART_MODE.PIXEL_ART);
};

SYSTEM.switchAsciiArtMode = ()=>{
    const artMode = _screen.getStateProperty('artMode');

    if(artMode == ART_MODE.ASCII_ART) return;

    _algo.executeCommand(ALGO_COMMAND_NAME.ClearScreen);
    _screenMode.switchArtMode(ART_MODE.ASCII_ART);
};

SYSTEM.getArtMode = ()=>{
    return _screen.getStateProperty('artMode');
};

SYSTEM.saveAsImage = ()=>{

};

SYSTEM.saveAsTxt = ()=>{

};


// COMMAND.drawCircle = ()=>{
//     Shape.circle(_screen, 'A', 'red', 5, 20, 5)
//};