'use strict';

import { StorageAgent } from './storage-agent';
// import { _Debug_ } from './debug';

export class Draggable {

    constructor(windowElement, headerElement) {
        
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;

        this.mouseup    = this.handleMouseUp.bind(this);
        this.mousedown  = this.handleMouseDown.bind(this);
        this.mousemove  = this.handleMouseMove.bind(this);

        // this.updatePanelPosition = this._updatePanelPosition.bind(this);

        this.panelElement = windowElement;
        this.draggableId = windowElement.id;

        this.headerElement = headerElement;
        this.headerElement.style.setProperty('cursor', 'move');
        this.headerElement.addEventListener('mousedown', this.mousedown);

        if(StorageAgent.isStorageAvailable()){

            const x = StorageAgent.getItem(`drag_X_${this.draggableId}`);
            const y = StorageAgent.getItem(`drag_Y_${this.draggableId}`);

            if(x && y){
                this.panelElement.style.left = `${x}px`;
                this.panelElement.style.top  = `${y}px`; 
            }
        }
    }

    static makeElementDraggable(containerElement, headerElement) {
        return new Draggable(containerElement, headerElement);
    }

    handleMouseDown(event) {

        event.preventDefault();

        this.x2 = event.clientX;
        this.y2 = event.clientY;

        document.addEventListener('mouseup', this.mouseup, false);
        document.addEventListener('mousemove', this.mousemove, false);
    }

    handleMouseMove(event) {

        event.preventDefault();
        event.stopImmediatePropagation();
    
        this.x1 = this.x2 - event.clientX;
        this.y1 = this.y2 - event.clientY;

        // if(!this.busy){
        // window.requestAnimationFrame(this.updatePanelPosition);
        //     this.busy = true;
        // }

        const {left, top} = this.panelElement.getBoundingClientRect();

        if(this.x1) this.panelElement.style.left = `${left - this.x1}px`;
        if(this.y1) this.panelElement.style.top  = `${top - this.y1}px`;    
  
        this.x2 = event.clientX;
        this.y2 = event.clientY;
    }

    handleMouseUp(event) {

        event.preventDefault();
        event.stopImmediatePropagation();

        const {left, top} = this.panelElement.getBoundingClientRect();
        
        if(StorageAgent.isStorageAvailable()){
            StorageAgent.setItem(`drag_X_${this.draggableId}`, `${left}`);
            StorageAgent.setItem(`drag_Y_${this.draggableId}`, `${top}`);
        }
    
        document.removeEventListener('mouseup', this.mouseup, false);
        document.removeEventListener('mousemove', this.mousemove, false);
    }

    // _updatePanelPosition(){
    //     const {left, top} = this.panelElement.getBoundingClientRect();
    //     if(this.x1) this.panelElement.style.left = `${left - this.x1}px`;
    //     if(this.y1) this.panelElement.style.top  = `${top - this.y1}px`;    
    //     this.busy = false;
    // }
}