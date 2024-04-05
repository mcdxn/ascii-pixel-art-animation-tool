'use strict';

import { UIItemPanel } from './ui-item-panel';

export class UIAnimationFramesPanel extends  UIItemPanel{
    constructor(){
        super('animationframespanel');
        super.setItemInsertionModeNormal(false);
        super.setPanelLabel('Animation Frames');
        super.setPanelWidth(500);
        super.showPanelHorizontal();  
        super.setItemViewDimensions(50, 50);
        super.setItemLabelByNumber(true);
        super.setItemLabelSize(20);
        super.disableItemLabelRename();
    }

    static create(){
        const animationFramePanel = new UIAnimationFramesPanel();
    
        const addButton     = document.createElement('div');
        const delButton     = document.createElement('div');
        const copyButton    = document.createElement('div');
        const cloneButton   = document.createElement('div');

        addButton.classList.add('panel-button', 'fas', 'fa-walking');
        delButton.classList.add('panel-button', 'panel-button-delete', 'fas', 'fa-trash');
        copyButton.classList.add('panel-button', 'fas', 'fa-copy');
        cloneButton.classList.add('panel-button', 'fas', 'fa-clone');

        addButton.style.setProperty('display', 'inline-block');
        delButton.style.setProperty('display', 'inline-block');

        animationFramePanel.setAddButton(addButton);
        animationFramePanel.setDeleteButton(delButton);
        animationFramePanel.addPanelFooterButton(copyButton);
        animationFramePanel.addPanelFooterButton(cloneButton);

        animationFramePanel.showPanelFooter(true);
        return animationFramePanel;
    }

}