'use strict';

import { _Debug_ } from './debug';
import { UIPanel } from './ui-panel';

/*eslint no-undef: "off"*/

export class UIInfoPanel extends UIPanel {
    constructor(){

        super('infopanel');
        super.setPanelLabel('Info');
        super.clearDefaultPanelContentClass();
        super.showPanelFooter(true);

        const sectionDiv = document.createElement('div');
        const modeDiv = document.createElement('div');

        sectionDiv.classList.add('info-selection');
        modeDiv.classList.add('info-mode');

        sectionDiv.style.setProperty('font-family', DEFAULTS.pixelFontFamily);

        super.panelContentAppend(sectionDiv);
        super.panelFooterAppend(modeDiv);

        this.infoSelection = sectionDiv;
        this.infoModeElement = modeDiv;
    }

    static create(){    
        return new UIInfoPanel();
    }

    hideSelectionInfoText(value){
        value ? this.infoSelection.style.setProperty('visibility', 'hidden') : this.infoSelection.style.setProperty('visibility', 'visible');
    }

    setSelectionInfoText(value){
        if(DEBUG.ON) _Debug_.checkTypeOfString(value);

        this.infoSelection.innerHTML = value;
    }

    setSelectionInfoTextColor(value){
        if(DEBUG.ON) _Debug_.checkEmptyAndValidString(value);

        this.infoSelection.style.setProperty('color', value);
    }

    setSelectionInfoBackgroundColor(value){
        if(DEBUG.ON) _Debug_.checkEmptyAndValidString(value);

        this.infoSelection.style.setProperty('background-color', value);
    }

    setModeInfoText(value){
        if(DEBUG.ON) _Debug_.checkEmptyAndValidString(value);

        this.infoModeElement.innerHTML = value;
    }

    setModeInfoTextColor(value){
        if(DEBUG.ON) _Debug_.checkEmptyAndValidString(value);

        this.infoModeElement.style.setProperty('color', value);
    }

    setModeInfoBackgroundColor(value){
        if(DEBUG.ON) _Debug_.checkEmptyAndValidString(value);

        this.infoModeElement.style.setProperty('background-color', value);
    }
}