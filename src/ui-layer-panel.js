'use strict';

import { UIItemPanel } from './ui-item-panel';

export class UILayerPanel extends UIItemPanel {
    constructor(){
        super('layerspanel');
        super.setPanelLabel('Layers');
        super.setPanelWidth(150);
        super.setPanelHeight(250);
        super.showPanelVertical();
        super.setItemLabelDefault('New Layer');
        super.setItemLabelZero('Background');
    }

    static create(){
        const layerPanel = new UILayerPanel();

        const addButton     = document.createElement('div');
        const delButton     = document.createElement('div');
        const copyButton    = document.createElement('div');
        const cloneButton   = document.createElement('div');

        addButton.classList.add('panel-button', 'fas', 'fa-file');
        delButton.classList.add('panel-button', 'panel-button-delete', 'fas', 'fa-trash');
        copyButton.classList.add('panel-button', 'fas', 'fa-copy');
        cloneButton.classList.add('panel-button', 'fas', 'fa-clone');

        addButton.style.setProperty('display', 'inline-block');
        delButton.style.setProperty('display', 'inline-block');

        layerPanel.setAddButton(addButton);
        layerPanel.setDeleteButton(delButton);

        layerPanel.addPanelFooterButton(copyButton);
        layerPanel.addPanelFooterButton(cloneButton);

        layerPanel.showPanelFooter(true);

        return layerPanel;
    }
}