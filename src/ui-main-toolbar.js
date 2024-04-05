'use strict';

import { SYSTEM }               from './system-main';

import { UIToolBarPanel }       from './ui-toolbar-panel';
import { UIInfoPanel }          from './ui-info-panel';
import { UIColorPalettePanel }  from './ui-color-palette-panel';

import { panelManager }         from './ui-panel-manager';
import { UI_ANIMATION_OBJECTS } from './ui-main-animation-objects';
import { UI_ANIMATION_FRAMES }  from './ui-main-animation-frames';
import { UI_COMPOSITOR }        from './ui-main-compositor';

/*eslint no-undef: "off"*/

let toolBarPanel = null;
let infoPanel = null;
let colorPalettePanel = null;

export const UI_TOOLBAR = {};

UI_TOOLBAR.init = ()=>{

    colorPalettePanel = UIColorPalettePanel.create();
    colorPalettePanel.on('colorSelect', onColorSelect.bind(this));

    infoPanel = UIInfoPanel.create();
    infoPanel.hidePanel();
    infoPanel.setSelectionInfoTextColor('black');
    SYSTEM.setPixelFgColor('black');

    toolBarPanel = UIToolBarPanel.create();
    toolBarPanel.showPanel();

    toolBarPanel.on('toolSelect',   onToolSelectHandler.bind(this));
    toolBarPanel.on('toolDeselect', onToolDeselectHandler.bind(this));
    toolBarPanel.on('toolToggle',   onToolToggleHandler.bind(this));

    switch(SYSTEM.getArtMode()){
    case ART_MODE.ASCII_ART:
        UI_TOOLBAR.toolBarArtModeAscii();
        break;
    case ART_MODE.PIXEL_ART:
        UI_TOOLBAR.toolBarArtModePixel();
        break;
    }


    panelManager.addPanel(toolBarPanel);
    panelManager.addPanel(infoPanel);
    panelManager.addPanel(colorPalettePanel);

        
    SYSTEM.onSetState('pixelValue', (value)=>{
        infoPanel.setSelectionInfoText(value);
    });

    SYSTEM.onSetState('eyedropperFgColor', (value)=>{
        if(SYSTEM.getStateProperty('artMode')){
            SYSTEM.setPixelFgColor(value);
            infoPanel.setSelectionInfoTextColor(value);
        }
    });

    SYSTEM.onSetState('eyedropperBgColor', (value)=>{
        SYSTEM.setPixelBgColor(value);
        infoPanel.setSelectionInfoBackgroundColor(value);
    });

    SYSTEM.onSetState('artMode', (value)=>{
        if(value === ART_MODE.ASCII_ART){
            UI_TOOLBAR.toolBarArtModeAscii();
        }
        else if(value === ART_MODE.PIXEL_ART){
            UI_TOOLBAR.toolBarArtModePixel();
        }
    });

    SYSTEM.onSetFlag('grid', (value)=>{
        toolBarPanel.highlightToggleable(TOOLBAR_TOOL_ID.GRID, value);
    });

    SYSTEM.onSetFlag('pencil', (value)=>{     
        if(value){
            infoPanel.unhidePanel();

            toolBarPanel.highlightSelectable(TOOLBAR_TOOL_ID.PENCIL);

            infoPanel.setModeInfoText(TOOLBAR_TOOL_ID.PENCIL.toUpperCase());
    
            const currentFgColor = SYSTEM.getPixelFgColor();
            const currentBgColor = SYSTEM.getPixelBgColor();
    
            const artMode = SYSTEM.getStateProperty('artMode');
    
            if(artMode === ART_MODE.ASCII_ART){
                infoPanel.setSelectionInfoText(SYSTEM.getStateProperty('pixelValue'));
                infoPanel.setSelectionInfoTextColor(currentFgColor);
                infoPanel.setSelectionInfoBackgroundColor('white'); 
            }
            else if(artMode === ART_MODE.PIXEL_ART){
                colorPalettePanel.unhidePanel();
                infoPanel.setSelectionInfoTextColor(DEFAULTS.pixelFgColor);
                infoPanel.setSelectionInfoBackgroundColor(currentBgColor);
            }
        }
    });


    SYSTEM.onSetFlag('eyedropper', (value)=>{     
        if(value){
            toolBarPanel.highlightSelectable(TOOLBAR_TOOL_ID.EYEDROPPER);
            infoPanel.setModeInfoText(TOOLBAR_TOOL_ID.EYEDROPPER.toUpperCase());
                
            infoPanel.setSelectionInfoTextColor('transparent');
            infoPanel.setSelectionInfoBackgroundColor('white');
        }
    });

    SYSTEM.onSetFlag('brush', (value)=>{     
        if(value){

            SYSTEM.setFlag('colorPalette', true);

            const currentBgColor = SYSTEM.getPixelBgColor();

            toolBarPanel.highlightSelectable(TOOLBAR_TOOL_ID.BRUSH);
            infoPanel.setModeInfoText(TOOLBAR_TOOL_ID.BRUSH.toUpperCase());

            infoPanel.setSelectionInfoTextColor(currentBgColor);
            infoPanel.setSelectionInfoBackgroundColor(currentBgColor);
        }
    });

    SYSTEM.onSetFlag('paintbrush', (value)=>{     
        if(value){    

            SYSTEM.setFlag('colorPalette', true);

            const currentFgColor = SYSTEM.getPixelFgColor();

            toolBarPanel.highlightSelectable(TOOLBAR_TOOL_ID.PAINTBRUSH);
            infoPanel.setModeInfoText(TOOLBAR_TOOL_ID.PAINTBRUSH.toUpperCase());

            infoPanel.setSelectionInfoTextColor(currentFgColor);
            infoPanel.setSelectionInfoBackgroundColor(currentFgColor);
        }
    });

    SYSTEM.onSetFlag('fill', (value)=>{     
        if(value){
            const currentFgColor = SYSTEM.getPixelFgColor();
            const currentBgColor = SYSTEM.getPixelBgColor();

            toolBarPanel.highlightSelectable(TOOLBAR_TOOL_ID.FILL);
            infoPanel.setModeInfoText(TOOLBAR_TOOL_ID.FILL.toUpperCase());

            infoPanel.setSelectionInfoTextColor(currentFgColor);
            infoPanel.setSelectionInfoBackgroundColor(currentBgColor);
        }
    });

    SYSTEM.onSetFlag('eraser', (value)=>{     
        if(value){
            toolBarPanel.highlightSelectable(TOOLBAR_TOOL_ID.ERASER);
            infoPanel.setModeInfoText(TOOLBAR_TOOL_ID.ERASER.toUpperCase());

            infoPanel.setSelectionInfoTextColor('white');
            infoPanel.setSelectionInfoBackgroundColor('white');
        }
    });

    SYSTEM.onSetFlag('colorPalette', (value)=>{
        value ? colorPalettePanel.unhidePanel() : colorPalettePanel.hidePanel();
        toolBarPanel.highlightToggleable(TOOLBAR_TOOL_ID.PALETTE, value); 
    });

    SYSTEM.onSetFlag('animation', (value)=>{
        if(value){
            UI_ANIMATION_OBJECTS.unhide();
            UI_ANIMATION_FRAMES.unhide();
        }else{
            UI_ANIMATION_OBJECTS.hide();
            UI_ANIMATION_FRAMES.hide();
        }
        
        toolBarPanel.highlightToggleable(TOOLBAR_TOOL_ID.ANIMATION, value); 

    });



    function onColorSelect(color)
    {
        
        switch(toolBarPanel.getCurrentToolSelection())
        {
        case TOOLBAR_TOOL_ID.PENCIL:
            {
                const artMode = SYSTEM.getStateProperty('artMode');

                if(artMode === ART_MODE.ASCII_ART){
                    SYSTEM.setPixelFgColor(color);
                    infoPanel.setSelectionInfoTextColor(color);
                    infoPanel.setSelectionInfoBackgroundColor('white');
                }
                else if(artMode === ART_MODE.PIXEL_ART){
                    SYSTEM.setPixelFgColor(DEFAULTS.pixelFgColor);
                    SYSTEM.setPixelBgColor(color);
                    infoPanel.setSelectionInfoTextColor(DEFAULTS.pixelFgColor);
                    infoPanel.setSelectionInfoBackgroundColor(color);
                }
            }
            break;

        case TOOLBAR_TOOL_ID.BRUSH:
            SYSTEM.setPixelBgColor(color);
            infoPanel.setSelectionInfoTextColor(color);
            infoPanel.setSelectionInfoBackgroundColor(color);
            break;

        case TOOLBAR_TOOL_ID.PAINTBRUSH:
            SYSTEM.setPixelFgColor(color);
            infoPanel.setSelectionInfoTextColor(color);
            infoPanel.setSelectionInfoBackgroundColor(color);
            break;

        case TOOLBAR_TOOL_ID.FILL:
            {
                const artMode = SYSTEM.getStateProperty('artMode');

                if(artMode === ART_MODE.PIXEL_ART)
                {
                    SYSTEM.setPixelFgColor(DEFAULTS.pixelFgColor);
                    SYSTEM.setPixelBgColor(color);
                    infoPanel.setSelectionInfoTextColor(DEFAULTS.pixelFgColor);
                    infoPanel.setSelectionInfoBackgroundColor(color);
                }
            }
            break;

        }
    }


    function onToolSelectHandler(selectedElement)
    {
        SYSTEM.setFlag(selectedElement.id, true);
        infoPanel.setModeInfoText(selectedElement.id.toUpperCase());
    }

    function onToolDeselectHandler(deselectedElement)
    {
        SYSTEM.setFlag(deselectedElement.id, false);
    }

    function onToolToggleHandler(toggledElement)
    {
        
        switch(toggledElement.id)
        {
        case TOOLBAR_TOOL_ID.ANIMATION:{
            const value = SYSTEM.getFlag('animation');
            SYSTEM.setFlag('animation', !value);
        }break;

        case TOOLBAR_TOOL_ID.PALETTE:{
            const value = SYSTEM.getFlag('colorPalette');
            SYSTEM.setFlag('colorPalette', !value);
        }break;

        case TOOLBAR_TOOL_ID.GRID:
            SYSTEM.toggleGrid();
            break;
            
        case TOOLBAR_TOOL_ID.RECORDER:
            break;    
        }    
    }

};


UI_TOOLBAR.toolBarArtModeAscii = ()=>{
    SYSTEM.setPixelFgColor('black');
    SYSTEM.setPixelBgColor(DEFAULTS.pixelBgColor);
    infoPanel.setSelectionInfoTextColor(SYSTEM.getPixelFgColor());
    infoPanel.setSelectionInfoBackgroundColor('white');           
    toolBarPanel.unhideToolItem(TOOLBAR_TOOL_ID.PAINTBRUSH);
    toolBarPanel.unhideToolItem(TOOLBAR_TOOL_ID.BRUSH);
};

UI_TOOLBAR.toolBarArtModePixel = ()=>{
    SYSTEM.setPixelFgColor(DEFAULTS.pixelFgColor);
    SYSTEM.setPixelBgColor(DEFAULTS.pixelBgColor);
    infoPanel.setSelectionInfoTextColor(DEFAULTS.pixelFgColor);
    infoPanel.setSelectionInfoBackgroundColor(DEFAULTS.pixelBgColor);
    toolBarPanel.hideToolItem(TOOLBAR_TOOL_ID.PAINTBRUSH);
    toolBarPanel.hideToolItem(TOOLBAR_TOOL_ID.BRUSH);
};