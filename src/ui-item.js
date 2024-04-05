'use strict';

import { Emitter } from './emitter';

export class UIItem extends Emitter {
    constructor(){
        super();

        const containerElement  = document.createElement('div');
        const eyeElement        = document.createElement('div');
        const labelElement      = document.createElement('div');
        const inputElement      = document.createElement('input');

        containerElement.id     = 'itemcontainerelement';
        eyeElement.id           = 'eyeelement';
        labelElement.id         = 'itemlabelelement';
        inputElement.id         = 'iteminputelement';
        
        inputElement.setAttribute('type', 'text');
        inputElement.classList.add('panel-item-input');

        eyeElement.classList.add('panel-item-button');
        eyeElement.classList.add('far', 'fa-eye');

        labelElement.appendChild(inputElement);
        labelElement.classList.add('panel-item-label');

        containerElement.classList.add('panel-item');
        containerElement.setAttribute('draggable', 'true');
        containerElement.appendChild(eyeElement);
        containerElement.appendChild(labelElement);

        this.isHidden = false;
        this.isItemLabelRenameEnabled = true;

        this.itemId = 0;    
        this.indexPosition  = 0;

        this.itemContainerElement   = containerElement;
        this.itemLabelElement       = labelElement;
        this.itemEyeElement         = eyeElement;
        this.itemInputElement       = inputElement;

        this.handleMouseClick       = this._handleMouseClick.bind(this);
        this.handleMouseHover       = this._handleMouseHover.bind(this);
        this.handleMouseLeave       =  this._handleMouseLeave.bind(this);
        this.handleKeyboardEnter    = this._handleKeyboardEnter.bind(this);
        this.handleDoubleClick      = this._handleDoubleClick.bind(this);
        this.handleEyeClick         = this._handleEyeClick.bind(this);

        this.handleDragStart    = this._handleDragStart.bind(this);
        this.handleDragDrop     = this._handleDragDrop.bind(this);
        this.handleDragOver     = this._handleDragOver.bind(this);

        eyeElement.addEventListener('click', this.handleEyeClick, false);
        
        containerElement.addEventListener('click', this.handleMouseClick, false);
        containerElement.addEventListener('mouseover', this.handleMouseHover, false);

        containerElement.addEventListener('dragstart', this.handleDragStart, false);
        containerElement.addEventListener('drop', this.handleDragDrop, false);
        containerElement.addEventListener('dragover', this.handleDragOver, false);
        
    }

    static create(){
        return new UIItem();
    }

    disableEyeElement(){
        this.itemEyeElement.removeEventListener(this.handleEyeClick, false);
        this.itemContainerElement.removeChild(this.itemEyeElement);
    }

    disableItemLabelRename(){
        this.isItemLabelRenameEnabled = false;
    }

    displayItemHorizontal(){
        this.itemContainerElement.style.setProperty('display', 'inline-block');
    }

    displayItemVertical(){
        this.itemContainerElement.style.setProperty('display', 'block');
    }

    setItemLabelSize(value){
        this.itemLabelElement.style.setProperty('font-size', `${value}pt`);
    }

    setItemId(id){
        this.itemId = id;
        this.itemContainerElement.id = `item-${id}`;

        const label = id ? this.itemLabelDefault : this.itemLabelZero;
        this.setItemLabel(label);

    }
    
    setItemViewDimensions(width, height){
        this.itemContainerElement.style.setProperty('width', `${width}px`);
        this.itemContainerElement.style.setProperty('height', `${height}px`);
    }

    setItemLabel(label){
        this.itemLabelElement.innerText = label;
    }

    getItemId(){
        return this.itemId;
    }

    getItemElementId(){
        return this.itemContainerElement.id;
    }

    setIndexPosition(value){
        this.indexPosition = value;
    }

    getIndexPosition(){
        return this.indexPosition;
    }

    setItemHidden(value){
        this.isHidden = value;
    }

    isItemHidden(){
        return this.isHidden;
    }    

    getItemLabelElement(){
        return this.itemLabelElement;
    }

    getItemContainerElement(){
        return this.itemContainerElement;
    }

    getItemContainerElementNextSibling(){
        return this.itemContainerElement.nextElementSibling;
    }

    getItemContainerElementPreviousSibling(){
        return this.itemContainerElement.previousElementSibling;
    }

    getItemEyeElement(){
        return this.itemEyeElement;
    }

    unregisterEventListeners(){
        this.itemEyeElement.addEventListener('click', this.handleEyeClick, false);

        this.itemContainerElement.addEventListener('click', this.handleMouseClick, false);
        this.itemContainerElement.addEventListener('mouseover', this.handleMouseHover, false);

        this.itemContainerElement.addEventListener('ondragstart', this.handleDragStart, false);
        this.itemContainerElement.addEventListener('ondrop', this.handleDragDrop, false);
        this.itemContainerElement.addEventListener('ondragover', this.handleDragOver, false);
    }

    _handleEyeClick(event){
        event.preventDefault();
        event.stopImmediatePropagation();

        this.setItemHidden(!this.isItemHidden());

        if(this.isItemHidden()){
            this.itemEyeElement.classList.replace('fa-eye', 'fa-eye-slash');
        }else{
            this.itemEyeElement.classList.replace('fa-eye-slash', 'fa-eye');
        }

        super.emit('hideItem', this.itemId, this.isHidden);
    }

    _handleMouseClick(event){
        event.preventDefault();
        event.stopImmediatePropagation();

        super.emit('selectItem', this);
    }

    _handleMouseHover(event){
        event.preventDefault();
        if(this.isItemLabelRenameEnabled) this.itemContainerElement.addEventListener('dblclick', this.handleDoubleClick, false);
    }

    _handleMouseLeave(event){
        event.preventDefault();
        event.stopImmediatePropagation();

        this.itemContainerElement.removeEventListener('dblclick', this.handleDoubleClick, false);
        this.itemContainerElement.removeEventListener('mouseleave', this.handleMouseLeave, false);

        this.itemInputElement.removeEventListener('keydown', this.handleKeyboardEnter, false);
   
        this.itemInputElement.style.setProperty('display', 'none');
        this.itemInputElement.style.setProperty('top', 'auto');
    }

    _handleDoubleClick(event){
        event.preventDefault();
        event.stopImmediatePropagation();

        this.itemContainerElement.removeEventListener('dblclick', this.handleDoubleClick, false);

        this.itemContainerElement.addEventListener('mouseleave', this.handleMouseLeave, false);

        this.itemInputElement.addEventListener('keydown', this.handleKeyboardEnter, false);

        this.itemInputElement.value = this.itemLabelElement.innerText;
        this.itemInputElement.style.setProperty('display', 'block');

        this.itemContainerElement.appendChild(this.itemInputElement);

        this.itemInputElement.focus();
        this.itemInputElement.select();

        const posInput = this.itemContainerElement.offsetTop;

        this.itemInputElement.style.setProperty('top', `${posInput}px`);
    }

    _handleKeyboardEnter(event){
        if(event.key === 'Enter'){
            const labelLength = this.itemInputElement.value.length;
            if(labelLength) {
                if(labelLength > 20){
                    this.itemLabelElement.innerText = this.itemInputElement.value.slice(1, 30);
                }else{
                    this.itemLabelElement.innerText = this.itemInputElement.value;
                }
            }else{
                this.itemLabelElement.innerText = 'No Name';
            }

            this.itemInputElement.style.setProperty('display', 'none');
            this.itemInputElement.style.setProperty('top', 'auto');
        }
    }

    _handleDragStart(event){
        event.dataTransfer.setData('text', this.indexPosition);
    }

    _handleDragDrop(event){
        event.preventDefault();
        const data = parseInt(event.dataTransfer.getData('text'), 10);
        if(data !== this.indexPosition) this.emit('moveItem', data, this.indexPosition);
    }

    _handleDragOver(event){
        event.preventDefault();
    }
}