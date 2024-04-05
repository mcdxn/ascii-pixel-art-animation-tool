'use strict';

import { SYSTEM }                   from './system-main';
import { UIItem }                   from './ui-item';
import { UIAnimationObjectPanel }   from './ui-animation-objects-panel';
import { panelManager }             from './ui-panel-manager';

let animationObjectsPanel = null;

export const UI_ANIMATION_OBJECTS = {};

UI_ANIMATION_OBJECTS.init = ()=>{

    animationObjectsPanel = UIAnimationObjectPanel.create();
    
    const zeroItem = UIItem.create();
    animationObjectsPanel.addItem(zeroItem);
    animationObjectsPanel.selectItem(zeroItem);

    panelManager.addPanel(animationObjectsPanel);

    animationObjectsPanel.on('addItem', (objectId)=>{
        SYSTEM.addAnimationObjectById(objectId);
    });

    animationObjectsPanel.on('deleteItem', (objectId)=>{
        SYSTEM.deleteAnimationObjectById(objectId);
    });

    animationObjectsPanel.on('selectItem', (objectId)=>{
        SYSTEM.setActiveAnimationObjectById(objectId);
    });

    animationObjectsPanel.on('hideItem', (id, value)=>{
        SYSTEM.hideAnimationObject(id, value);
    });

    animationObjectsPanel.on('moveItem', (indexA, indexB)=>{
        SYSTEM.moveAnimationObjectIndex(indexA, indexB);
    });

    animationObjectsPanel.on('playAnimation', ()=>{
        SYSTEM.clearAnimationArea();
        SYSTEM.playAnimation();
    });

    animationObjectsPanel.on('stopAnimation', ()=>{
        SYSTEM.stopAnimation();
        SYSTEM.clearAnimationArea();
    });
};

UI_ANIMATION_OBJECTS.unhide = ()=>{
    animationObjectsPanel.unhidePanel();
};

UI_ANIMATION_OBJECTS.hide = ()=>{
    animationObjectsPanel.hidePanel();
};