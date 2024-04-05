'use strict';

import { Emitter }      from './emitter';
import { Draggable }    from './draggable';
import { Util } from './util';

/*eslint no-undef: "off"*/

export class UIPanel extends Emitter {
    constructor(id){
        super();

        const windowDiv         = document.createElement('div');
        const headerDiv         = document.createElement('div');
        const headerLabelDiv    = document.createElement('div');
        const contentDiv        = document.createElement('div'); 
        const footerDiv         = document.createElement('div');

        windowDiv.id        = id;
        headerDiv.id        = 'windowheader';
        headerLabelDiv.id   = 'windowheaderlabel';
        contentDiv.id       = 'windowcontent';
        footerDiv.id        = 'windowfooter';

        windowDiv.classList.add('panel-window');
        headerDiv.classList.add('panel-header');
        headerLabelDiv.classList.add('panel-header-label');
        contentDiv.classList.add('panel-content');
        
        footerDiv.classList.add('panel-footer');

        headerDiv.appendChild(headerLabelDiv);

        windowDiv.appendChild(headerDiv);
        windowDiv.appendChild(contentDiv);
        windowDiv.appendChild(footerDiv);

        document.getElementById('maincontainer').appendChild(windowDiv);

        this.isHidden = false;
        this.isHorizontal = false;
        this.draggable = Draggable.makeElementDraggable(windowDiv, headerDiv);

        this.panelId                    = id;
        this.panelWindowElement         = windowDiv;
        this.panelHeaderElement         = headerDiv;
        this.panelHeaderLabelElement    = headerLabelDiv;
        this.panelContentElement        = contentDiv;
        this.panelFooterElement         = footerDiv;

        this.busy                       = false;
        this.lastScrollPositionX        = 0;
        this.lastScrollPositionY        = 0;
        this.handleScroll               = this._handleScroll.bind(this);
        this.handlePanelSelect          = this._handlePanelSelect.bind(this);
        this.updateOnScroll             = this._updateScrollPosition.bind(this);
        this.updateVisiblePosition      = this._updateVisiblePosition.bind(this);

        headerDiv.addEventListener('mousedown', this.handlePanelSelect, false);
        window.addEventListener('scroll', this.handleScroll, false);
        window.addEventListener('resize', this.updateVisiblePosition, false);

        contentDiv.addEventListener('mousedown', this.handlePanelSelect, false);
        footerDiv.addEventListener('mousedown', this.handlePanelSelect, false);
    }

    getPanelId(){
        return this.panelId;
    }

    highlightPanelLabel(value){
        if(value){
            this.panelHeaderLabelElement.style.setProperty('color', 'white');
            this.panelHeaderLabelElement.style.setProperty('font-weight', 'bold');

        }else{
            this.panelHeaderLabelElement.style.setProperty('color', 'grey');
            this.panelHeaderLabelElement.style.setProperty('font-weight', 'normal');
        } 
    }

    setPanelLabel(label){
        this.panelHeaderLabelElement.innerHTML = label;
    }

    getPanelLabel(){
        return this.panelLabel;
    }

    toggleHidePanel(){
        this.isHidden = !this.isHidden;
        this.isHidden ? this.hidePanel() : this.unhidePanel();
    }

    setZIndex(value){
        this.panelWindowElement.style.setProperty('z-index', `${value}`);
    }

    showPanel(){
        this.unhidePanel();
    }

    hidePanel(){
        this.isHidden = true;
        this.panelWindowElement.style.display = 'none';
    }

    unhidePanel(){
        this.isHidden = false;
        this.panelWindowElement.style.display = 'block';
        this.panelWindowElement.style.zIndex = '1000';
        this._updateVisiblePosition();
    }

    isPanelHidden(){
        return this.isHidden;
    }

    getPanelWindowElement(){
        return this.panelWindowElement;
    }

    getPanelHeaderElement(){
        return this.panelHeaderElement;
    }

    getPanelContentElement(){
        return this.panelContentElement;
    }

    showPanelFooter(value){
        const result = value ? 'inline-block' : 'none';
        this.panelFooterElement.style.setProperty('display', result);
    }

    addPanelFooterButton(button){
        this.panelFooterAppend(button);
    }

    replacePanelContentClass(oldValue, value){
        this.panelContentElement.classList.replace(oldValue, value);
    }

    addPanelContentClass(...value){
        this.panelContentElement.classList.add(value);
    }

    removePanelContentClass(...value){
        this.panelContentElement.classList.remove(value);
    }

    clearDefaultPanelContentClass(){
        this.panelContentElement.classList.remove('panel-content');
    }

    showPanelHorizontal(){
        this.isHorizontal = true;
        this.panelContentElement.classList.remove('panel-content-vertical');
        this.panelContentElement.classList.add('panel-content-horizontal');
    }

    showPanelVertical(){
        this.isHorizontal = false;
        this.panelContentElement.classList.remove('panel-content-horizontal');
        this.panelContentElement.classList.add('panel-content-vertical');
    }

    setPanelWidth(width){
        this.panelContentElement.style.setProperty('width', `${width}px`); 
    }

    getPanelWidth(){
        const width = this.panelContentElement.style.getPropertyValue('width'); 
        return Util.extractNumberFromStringFontSize(width);
    }

    setPanelHeight(height){
        this.panelContentElement.style.setProperty('height', `${height}px`); 
    }

    isPanelHorizontal(){
        return this.isHorizontal;
    }

    displayPanelContentHorizontal(){
        this.isHorizontal = true;
        this.panelContentElement.style.setProperty('height', 'auto');
        this.panelContentElement.style.setProperty('width', DEFAULTS.panelContentHorizontalWidth);
        let child = this.panelContentElement.firstChild;
        do{
            child.style.setProperty('display', 'inline-block');
            child = child.nextElementSibling;
        }while(child);
    }

    displayPanelContentVertical(){
        this.isHorizontal = false;
        this.panelContentElement.style.setProperty('height', DEFAULTS.panelContentVerticalHeight);
        this.panelContentElement.style.setProperty('width', 'auto');
        let child = this.panelContentElement.firstChild;
        do{
            child.style.setProperty('display', 'block');
            child = child.nextElementSibling;
        }while(child);
    }

    panelFooterAppend(element){
        this.panelFooterElement.appendChild(element);
    } 

    panelContentAppend(element){
        this.panelContentElement.appendChild(element);
    }

    insertPanelContentItem(element){
        this.panelContentElement.insertAdjacentElement('afterbegin', element);
    }

    appendPanelContentItem(element){
        this.panelContentElement.appendChild(element);
    }

    removePanelContentItem(element){
        this.panelContentElement.removeChild(element);
    }

    removePanelContentAllItems(){
        const contentItems = this.panelContentElement;
        let  child = null;
        do{
            child = contentItems.firstChild;
            if(child) this.panelContentElement.removeChild(child);

        }while(child);
    }

    _updateVisiblePosition(){

        return new Promise((resolve)=>{
            const viewWidth = window.innerWidth;
            const viewHeight = window.innerHeight;
            const windowPanel = this.panelWindowElement;
    
            const {top, left, bottom, right} = windowPanel.getBoundingClientRect();
    
            if(left <= 0 || left > viewWidth){
                window.requestAnimationFrame(()=>{
                    windowPanel.style.left = `${(viewWidth/2)-((Math.abs(right)-Math.abs(left))/2)}px`;
                });
            }
    
            if(top <= 0|| top > viewHeight){
                window.requestAnimationFrame(()=>{
                    windowPanel.style.top = `${(viewHeight/2)-((Math.abs(bottom)-Math.abs(top))/2)}px`;
                });
            }

            resolve();
        });

    }

    _updateScrollPosition() {
        this.panelWindowElement.style.transform = `translate(${this.lastScrollPositionX}px, ${this.lastScrollPositionY}px)`;
        this.busy = false;
    }

    _handleScroll(event){
        event.preventDefault();

        if(!this.busy){
            window.requestAnimationFrame(this.updateOnScroll);
            this.busy = true;
        }

        this.lastScrollPositionX = window.scrollX;
        this.lastScrollPositionY = window.scrollY;
    }

    _handlePanelSelect(event){
        super.emit('panelSelect', this);
    }
}