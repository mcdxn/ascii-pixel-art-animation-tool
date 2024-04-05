'use strict';

import { UIPanel }      from './ui-panel';
import { ColorFactory } from './color-factory';
import { ColorLoader }  from './color-loader';

/*eslint no-undef: "off"*/

export class UIColorPalettePanel extends UIPanel {
    constructor() {
        super('colorpalettepanel');
        super.clearDefaultPanelContentClass();
        super.addPanelContentClass('color-panel-content');
        super.setPanelLabel('Color Palette');

        this.colorSelectHandler = this._handleColorSelect.bind(this);
    }

    static create(){
        const colorPalettePanel = new UIColorPalettePanel();
        
        colorPalettePanel.hidePanel();
        colorPalettePanel.init();

        return colorPalettePanel;
    }

    init(){
        const contentElement = super.getPanelContentElement();
        const colorSet = ColorLoader.loadColorSet(COLOR_SET.MaterialDesign);
        const colorFactory = ColorFactory.create(colorSet);

        colorSet.setColorSelectHandler(this._handleColorSelect.bind(this));

        contentElement.appendChild(colorFactory.getFragment());
    }

    _handleColorSelect(color){
        this.emit('colorSelect', color);
    }
}