'use strict';

import { _Debug_ }                  from './debug';
import { SYSTEM }                   from './system-main';
import { UIItem }                   from './ui-item';
import { UIAnimationFramesPanel }   from './ui-animation-frames-panel';
import { panelManager }             from './ui-panel-manager';
import { UIItemManager }            from './ui-item-manager';

let animationFramesPanel = null;
let itemManager = null;

export const UI_ANIMATION_FRAMES = {};

UI_ANIMATION_FRAMES.init = ()=>{
    
    animationFramesPanel = UIAnimationFramesPanel.create();

    const zeroItem = UIItem.create();
    animationFramesPanel.addItem(zeroItem);
    animationFramesPanel.selectItem(zeroItem);

    itemManager = UIItemManager.create();

    panelManager.addPanel(animationFramesPanel);

    animationFramesPanel.on('addItem', (frameId)=>{
        SYSTEM.addFrameById(frameId);
    });

    animationFramesPanel.on('deleteItem', (frameId)=>{
        SYSTEM.deleteFrameById(frameId);
    });

    animationFramesPanel.on('selectItem', (frameId)=>{
        SYSTEM.setActiveFrameById(frameId);
        _Debug_.log(`SELECT FRAME ID: ${frameId}`);
    });

    animationFramesPanel.on('hideItem', (frameId, value)=>{
        SYSTEM.hideFrame(frameId, value);
    });

    animationFramesPanel.on('moveItem', (indexA, indexB)=>{
        SYSTEM.moveFrameIndex(indexA, indexB);
        if(animationFramesPanel.checkItemLabelByNumber()) animationFramesPanel.updateItemLabelByNumber();

    });

    SYSTEM.onSetState('activeAnimationObject', (animationObject)=>{
        _Debug_.log(`ACTIVATE ANIMATION OBJECT ID: ${animationObject.getId()}`);

        const previousAnimationObject = SYSTEM.getStateProperty('previousAnimationObject');
        itemManager.saveItems(previousAnimationObject.getId(), animationFramesPanel.getItems(), animationFramesPanel.getItemIdCounter());

        const savedItems = itemManager.getSavedItems(animationObject.getId());

        if(savedItems) {
            animationFramesPanel.setItemIdCounter(savedItems.savedLastId);
            animationFramesPanel.setItems(savedItems.savedItems);
            animationFramesPanel.selectItem(savedItems.lastItem);
        }else{
            if(animationObject.getLayerCount() === 1) {
                animationFramesPanel.resetAllItems();
                const frameItem = UIItem.create();
                animationFramesPanel.addItem(frameItem, false);
                animationFramesPanel.selectItem(frameItem);
            }
        }
    });

    SYSTEM.onSetState('deleteAnimationObjectById', (animationObjectId)=>{
        itemManager.removeSavedItems(animationObjectId);
    });
};

UI_ANIMATION_FRAMES.unhide = ()=>{
    animationFramesPanel.unhidePanel();
};

UI_ANIMATION_FRAMES.hide = ()=>{
    animationFramesPanel.hidePanel();
};