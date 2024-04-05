'use strict';

import { _Debug_ }  from './debug';
import { UIPanel }  from './ui-panel';

/*eslint no-undef: "off"*/

export class UIToolBarPanel extends UIPanel {
    constructor(){

        super('toolbarpanel');
        super.setPanelLabel('Tools');
        super.clearDefaultPanelContentClass();

        this.currentToolSelection   = null;
        this.toolToggleHandler      = this._handleToolToggle.bind(this);
        this.toolSelectionHandler   = this._handleToolSelection.bind(this);
        this.selectables            = {};
        this.toggleables            = {};
    }

    static create(){

        const pencil        = document.createElement('i');
        const paintbrush    = document.createElement('i');
        const bigbrush      = document.createElement('i');
        const fill          = document.createElement('i');
        const eraser        = document.createElement('i');
        const eyedropper    = document.createElement('i');
        const palette       = document.createElement('i');
        const grid          = document.createElement('i');
        const animation     = document.createElement('i');

        pencil.classList.add('tool-item', 'fas', 'fa-pencil-alt');     
        paintbrush.classList.add('tool-item', 'fas', 'fa-paint-brush'); 
        bigbrush.classList.add('tool-item', 'fas', 'fa-brush');   
        fill.classList.add('tool-item', 'fas', 'fa-fill-drip');       
        eraser.classList.add('tool-item', 'fas', 'fa-eraser');     
        eyedropper.classList.add('tool-item', 'fas', 'fa-eye-dropper'); 
        palette.classList.add('tool-item', 'fas', 'fa-palette');    
        grid.classList.add('tool-item', 'fas', 'fa-th');       
        animation.classList.add('tool-item', 'fas', 'fa-film');  

        pencil.id       = TOOLBAR_TOOL_ID.PENCIL;     
        paintbrush.id   = TOOLBAR_TOOL_ID.PAINTBRUSH; 
        bigbrush.id     = TOOLBAR_TOOL_ID.BRUSH; 
        fill.id         = TOOLBAR_TOOL_ID.FILL;      
        eraser.id       = TOOLBAR_TOOL_ID.ERASER; 
        eyedropper.id   = TOOLBAR_TOOL_ID.EYEDROPPER; 
        palette.id      = TOOLBAR_TOOL_ID.PALETTE; 
        grid.id         = TOOLBAR_TOOL_ID.GRID;      
        animation.id    = TOOLBAR_TOOL_ID.ANIMATION; 

        const toolBarPanel = new UIToolBarPanel();

        toolBarPanel.addSelectableElement(pencil);
        toolBarPanel.addSelectableElement(paintbrush);
        toolBarPanel.addSelectableElement(bigbrush);
        toolBarPanel.addSelectableElement(fill);
        toolBarPanel.addSelectableElement(eraser);
        toolBarPanel.addSelectableElement(eyedropper);

        toolBarPanel.addToggleableElement(palette);
        toolBarPanel.addToggleableElement(grid);
        toolBarPanel.addToggleableElement(animation);

        return toolBarPanel;
    }

    setCurrentToolSelection(id){
        this.currentToolSelection = id;
    }

    getCurrentToolSelection(){
        return this.currentToolSelection;
    }
    
    addSelectableElement(element){
        if(DEBUG.ON) _Debug_.checkHTMLInstanceOfElement(element);

        super.panelContentAppend(element);
        element.onclick = this.toolSelectionHandler;
        this.selectables[element.id] = element;
    }

    addToggleableElement(element){
        if(DEBUG.ON) _Debug_.checkHTMLInstanceOfElement(element);

        super.panelContentAppend(element);
        element.onclick = this.toolToggleHandler;
        this.toggleables[element.id] = element;
    }

    highlightSelectable(id){
        this._processToolSelectionHighlight(id, false);
    }

    highlightToggleable(id, state){
        state ? this.toggleables[id].classList.add(EXCSS.ToolbarItemSelected) : this.toggleables[id].classList.remove(EXCSS.ToolbarItemSelected);
    }

    hideToolItem(toolid){
        if(this.selectables[toolid]){
            this.selectables[toolid].style.setProperty('display', 'none');
        }
        else if(this.toggleables[toolid])
        {
            this.toggleables[toolid].style.setProperty('display', 'none');
        }
    }

    unhideToolItem(toolid){
        if(this.selectables[toolid]){
            this.selectables[toolid].style.setProperty('display', 'block');
        }
        else if(this.toggleables[toolid])
        {
            this.toggleables[toolid].style.setProperty('display', 'block');
        }
    }

    _handleToolToggle(event){

        event.preventDefault();
        event.stopImmediatePropagation();
        
        const toggledElement = event.currentTarget;
        const classList = toggledElement.classList;

        classList.toggle(EXCSS.ToolbarItemSelected);
    
        this.emit('toolToggle', toggledElement);
    }

    _handleToolSelection(event){

        event.preventDefault();
        event.stopImmediatePropagation();
        
        const selectedElement = event.currentTarget;
    
        this._processToolSelectionHighlight(selectedElement.id, true);
    }

    _processToolSelectionHighlight(id, isEmit){
        for(const selectableId in this.selectables){
            if(selectableId === id){
                this.setCurrentToolSelection(selectableId);
                this.selectables[selectableId].classList.add(EXCSS.ToolbarItemSelected);
                if(isEmit) this.emit('toolSelect', this.selectables[selectableId]);
            }else{
                this.selectables[selectableId].classList.remove(EXCSS.ToolbarItemSelected);
                this.emit('toolDeselect', this.selectables[selectableId]);
            }
        }
    }
}

