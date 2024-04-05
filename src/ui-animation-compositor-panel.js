'use strict';

import { UIItemPanel } from './ui-item-panel';

export class UIAnimationCompositorPanel extends UIItemPanel {
    constructor(){
        super('compositorpanel');
        super.setPanelLabel('Compositor');
        super.setPanelWidth(150);
        super.setPanelHeight(325);
        super.showPanelVertical();
        super.setItemLabelDefault('New Composite');
        super.setItemLabelZero('New Composite');
    }

    static create(){
        const compositorPanel = new UIAnimationCompositorPanel();
        compositorPanel.hidePanel();

        compositorPanel.showPanelFooter(false);

        return compositorPanel;
    }
}