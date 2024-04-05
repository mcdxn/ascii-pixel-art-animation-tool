'use strict';

import { UIItemPanel } from './ui-item-panel';

export class UIAnimationObjectPanel extends  UIItemPanel{
    constructor(){
        super('animationobjectspanel');
        super.setPanelLabel('Animation Objects');
        super.setPanelWidth(150);
        super.setPanelHeight(250);
        super.showPanelVertical();  
        super.setItemLabelZero('New Animation');
        super.setItemLabelDefault('New Animation');  

        this.handlePlayButton = this._handlePlayButton.bind(this);
        this.handleStopButton = this._handleStopButton.bind(this);
    }

    static create(){
        const animationObjectPanel = new UIAnimationObjectPanel();
    
        const addButton     = document.createElement('div');
        const delButton     = document.createElement('div');
        const copyButton    = document.createElement('div');
        const cloneButton   = document.createElement('div');
        const playButton    = document.createElement('div');
        const stopButton    = document.createElement('div');


        addButton.classList.add('panel-button', 'fas', 'fa-film');
        delButton.classList.add('panel-button', 'panel-button-delete', 'fas', 'fa-trash');
        
        copyButton.classList.add('panel-button', 'fas', 'fa-copy');
        cloneButton.classList.add('panel-button', 'fas', 'fa-clone');
        playButton.classList.add('panel-button', 'fas', 'fa-play');
        stopButton.classList.add('panel-button', 'fas', 'fa-stop');

        addButton.style.setProperty('display', 'inline-block');
        delButton.style.setProperty('display', 'inline-block');

        animationObjectPanel.setAddButton(addButton);
        animationObjectPanel.setDeleteButton(delButton);

        animationObjectPanel.addPanelFooterButton(copyButton);
        animationObjectPanel.addPanelFooterButton(cloneButton);
        animationObjectPanel.setPlayButton(playButton);
        animationObjectPanel.setStopButton(stopButton);

        animationObjectPanel.showPanelFooter(true);
        return animationObjectPanel;
    }

    setPlayButton(element){
        element.addEventListener('mousedown', this.handlePlayButton, false);
        super.addPanelFooterButton(element);
    }

    setStopButton(element){
        element.addEventListener('mousedown', this.handleStopButton, false);
        super.addPanelFooterButton(element);
    }

    _handlePlayButton(){
        super.emit('playAnimation');
    }

    _handleStopButton(){
        super.emit('stopAnimation');
    }
}