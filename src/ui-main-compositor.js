'use strict';

// import { SYSTEM }               from './system-main';
import { UIItem }                       from './ui-item';
import { UIAnimationCompositorPanel }   from './ui-animation-compositor-panel';
import { panelManager }                 from './ui-panel-manager';

let compositorPanel = null;

export const UI_COMPOSITOR = {};

UI_COMPOSITOR.init = ()=>{

    compositorPanel = UIAnimationCompositorPanel.create();
    // layersPanel.setPanelHorizontal(true);
    // CREATE ONE DEFAULT ITEM IN PANEL.
    compositorPanel.addItem(UIItem.create());

    panelManager.addPanel(compositorPanel);
};

UI_COMPOSITOR.unhide = ()=>{
    compositorPanel.unhidePanel();
    compositorPanel.unhidePanel();
};

UI_COMPOSITOR.hide = ()=>{
    compositorPanel.hidePanel();
    compositorPanel.hidePanel();
};