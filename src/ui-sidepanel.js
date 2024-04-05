'use strict';

import { Emitter } from './emitter';

export class UISidePanel extends Emitter {
    constructor(){
        super();

        const sidepanelElement = document.createElement('div');
        

        this.sidepanelElement = null;
    }

    static create(){
        return new UISidePanel();
    }

    
}