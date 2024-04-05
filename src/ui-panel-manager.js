'use strict';

class UIPanelManager {
    constructor() {
        this.currentSelectedPanel   = null;
        this.panels                 = [];
        this.handlePanelSelect      = this._handlPanelSelect.bind(this);
    }

    static create(){
        return new UIPanelManager();
    }

    addPanel(panel){
        this.panels.push(panel);
        panel.on('panelSelect', this.handlePanelSelect, 'panelManager');
        this._updateZIndexes();
    }

    _updateZIndexes(){
        let panel = null;

        const  len = this.panels.length - 1;
        for(const i in this.panels){
            panel = this.panels[i];
            panel.setZIndex(len - i);
        }
    }

    _handlPanelSelect(panelSelected){
        let panel = null;
        const selectedPanelId = panelSelected.getPanelId();

        if(this.currentSelectedPanel){
            if(this.currentSelectedPanel.getPanelId() === selectedPanelId) return;
            this.currentSelectedPanel.highlightPanelLabel(false);
        }

        for(const i in this.panels){
            panel = this.panels[i];

            if(panel.getPanelId() === selectedPanelId){
                this.panels.splice(i, 1);
                this.panels.unshift(panel);
                panel.highlightPanelLabel(true);
                this.currentSelectedPanel = panel;
                this._updateZIndexes();
                return;
            }
        }
    }
}

export const panelManager = UIPanelManager.create();
