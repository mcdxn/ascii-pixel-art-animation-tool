'use strict';

import { SYSTEM }               from './system-main';
import { UILayerPanel }         from './ui-layer-panel';
import { UIItem }               from './ui-item';
import { panelManager } from './ui-panel-manager';

let layersPanel = null;

export const UI_LAYERS = {};

UI_LAYERS.init = ()=>{

    layersPanel = UILayerPanel.create();
    layersPanel.showPanel();

    // CREATE ONE DEFAULT ITEM IN PANEL.
    const zeroItem = UIItem.create();
    layersPanel.addItem(zeroItem);
    layersPanel.selectItem(zeroItem);
    
    panelManager.addPanel(layersPanel);

    layersPanel.on('addItem', (layerId)=>{
        SYSTEM.addLayerId(layerId);
    });

    layersPanel.on('deleteItem', (layerId)=>{
        SYSTEM.delLayer(layerId);
    });

    layersPanel.on('selectItem', (layerId)=>{
        SYSTEM.setActiveLayerById(layerId);
    });

    layersPanel.on('hideItem', (id, value)=>{
        SYSTEM.hideLayer(id, value);
    });

    layersPanel.on('moveItem', (indexA, indexB)=>{
        SYSTEM.moveLayerIndex(indexA, indexB);
    });

    SYSTEM.onSetFlag('animation', (value)=>{
        if(value) layersPanel.hidePanel();
        else if(!value) layersPanel.unhidePanel();
    });
};