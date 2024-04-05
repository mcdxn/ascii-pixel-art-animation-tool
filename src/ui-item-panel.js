'use strict';

import { UIPanel }  from './ui-panel';
import { UIItem }   from './ui-item';
import { IndexManager } from './index-manager';
import { _Debug_ } from './debug';

export class UIItemPanel extends UIPanel {

    constructor(id){
        super(id);

        this.items = [];
        this.itemIdCounter = 0;

        this.prevItems = null;
        this.prevItemIdCounter = null;

        this.currentSelectedItem = null;

        this.isItemInsertionModeNormal  = true;
        this.isItemLabelByNumber        = false;
        this.isItemLabelRenameDisabled  = false;

        this.itemViewWidth = null;
        this.itemViewHeight = null;

        this.addButtonElement = null;
        this.delButtonElement = null;

        this.labelSize          = null;
        this.labelItemZero      = null;
        this.labelItemDefault   = null;

        this.handleItemMove     = this._handleItemMove.bind(this);
        this.handleItemSelect   = this._handleItemSelect.bind(this);
        this.handleItemHide     = this._handleItemHide.bind(this);
        this.handleItemAdd      = this._handleItemAdd.bind(this);
        this.handleItemDel      = this._handleItemDel.bind(this);
    }

    setItemViewDimensions(width, height){
        this.itemViewWidth = width;
        this.itemViewHeight = height;
    }

    setItemLabelSize(value){
        this.labelSize = value;
    }

    setItemLabelByNumber(value){
        this.isItemLabelByNumber = value;
    }

    checkItemLabelByNumber(){
        return this.isItemLabelByNumber;
    }

    updateItemLabelByNumber(){
        for(const i in this.items){
            this.items[i].setItemLabel(`${i}`);
        }
    }

    disableItemLabelRename(){
        this.isItemLabelRenameDisabled = true;
    }

    setItemLabelZero(label){
        this.labelItemZero = label;
    }

    setItemLabelDefault(label){
        this.labelItemDefault = label;
    }

    setItemInsertionModeNormal(value){
        this.isItemInsertionModeNormal = value;
    }

    setItemIdCounter(value){
        this.prevItemIdCounter = this.itemIdCounter;
        this.itemIdCounter = value;
    }

    getItemIdCounter(){
        return this.itemIdCounter;
    }

    getPrevItemIdCounter(){
        return this.prevItemIdCounter;
    }

    setItems(items){
        this.prevItems = this.items;
        this.items = items;
        this.refreshItems();
    }

    getItems(){
        return this.items;
    }

    getPrevItems(){
        return this.prevItems;
    }

    refreshItems(){
        super.removePanelContentAllItems();
        for(const item of this.items){
            super.panelContentAppend(item.getItemContainerElement());
        }
    }

    resetAllItems(){
        this.itemIdCounter = 0;
        this.items = [];
        super.removePanelContentAllItems();
    }

    addItem(item, emit = true){
        
        const newItemId = this.itemIdCounter++;

        item.on('selectItem', this.handleItemSelect);
        item.on('hideItem', this.handleItemHide);
        item.on('moveItem', this.handleItemMove);
       
        item.setItemId(newItemId);

        if(this.labelSize) item.setItemLabelSize(this.labelSize);
        if(this.isItemLabelRenameDisabled) item.disableItemLabelRename();

        if(super.isPanelHorizontal()){
            item.displayItemHorizontal();
            item.setItemViewDimensions(this.itemViewWidth, this.itemViewHeight);       
        }

        const itemContainerElement = item.getItemContainerElement();

        if(this.isItemInsertionModeNormal)
        {
            if(newItemId === 0)
            {
                this.isItemLabelByNumber ? item.setItemLabel('0') : item.setItemLabel(this.labelItemZero || 'New Item');
                super.appendPanelContentItem(itemContainerElement);
            }
            else
            {
                this.isItemLabelByNumber ? item.setItemLabel(`${newItemId}`) : item.setItemLabel(this.labelItemDefault || 'New Item');
                super.insertPanelContentItem(itemContainerElement);
            }
        }
        else
        {
            this.isItemLabelByNumber ? item.setItemLabel(`${newItemId}`) : item.setItemLabel(this.labelItemDefault || 'New Item');
            super.appendPanelContentItem(itemContainerElement);
        }
        
        this.items.push(item);
        IndexManager.updateIndexes(this.items);
        this._moveHorizontalScroll();
        if(emit) this.emit('addItem', item.getItemId());
    }

    deleteItem(item){
        item.unregisterEventListeners();
        super.removePanelContentItem(item.getItemContainerElement());
        this.items.splice(item.getIndexPosition(), 1);
        IndexManager.updateIndexes(this.items);
    }

    getItemByIndex(index){
        for(const item of this.items){
            if(item.getIndexPosition() === index){
                return item;
            }
        }
    }

    getPanelFooterElement(){
        return this.panelFooterElement;
    }

    setAddButton(element){
        this.addButtonElement = element;
        element.addEventListener('click', this.handleItemAdd);
        super.addPanelFooterButton(element);
    }

    setDeleteButton(element){
        this.delButtonElement = element;
        element.addEventListener('click', this.handleItemDel);
        super.addPanelFooterButton(element);
    }

    selectItem(item){

        const itemContainerElement = item.getItemContainerElement();
        const panelContentElement = this.getPanelContentElement();
        const panelContentElementChildren = panelContentElement.children;

        for(const child of panelContentElementChildren) child.classList.remove('panel-item-select');

        itemContainerElement.classList.add('panel-item-select');
        
        this.currentSelectedItem = item;

        this.emit('selectItem', item.getItemId());
    }

    _moveHorizontalScroll(){
        if(super.isPanelHorizontal()){
            const panelContentElement = this.getPanelContentElement();
            panelContentElement.scrollLeft += super.getPanelWidth();
        }
    }

    _moveItem(fromIndex, toIndex){
        IndexManager.moveIndexes(this.items, fromIndex, toIndex);
        IndexManager.updateIndexes(this.items);
    }

    _handleItemSelect(item){
        this.selectItem(item);
    }

    _handleItemHide(id, value){
        this.emit('hideItem', id, value);
    }

    _handleItemAdd(){
        const item = UIItem.create();
        this.addItem(item);
        this.selectItem(item);        
    }

    _handleItemDel(){

        const currItemId = this.currentSelectedItem.getItemId();
        
        if(this.items.length === 1) return;

        const nextContainerElementSibling = this.currentSelectedItem.getItemContainerElementNextSibling();
        const prevContainerElementSibling = this.currentSelectedItem.getItemContainerElementPreviousSibling();

        this.deleteItem(this.currentSelectedItem);
        this.emit('deleteItem', this.currentSelectedItem.getItemId());

        return new Promise(()=>{
            if(nextContainerElementSibling){
                const siblingId = nextContainerElementSibling.id;
    
                for(const item of this.items){
                    if(item.getItemElementId() === siblingId){
                        this.selectItem(item);
                    }
                }
            }else if(prevContainerElementSibling){
                const siblingId = prevContainerElementSibling.id;
    
                for(const item of this.items){
                    if(item.getItemElementId() === siblingId){
                        this.selectItem(item);
                    }
                }
            }
    
            for(const index in this.items){
                const item = this.items[index];
                if(item.getItemId() === currItemId){
                    this.items.splice(index, 1);
                }
            }
        });
    }

    _handleItemMove(itemIndexA, itemIndexB){
        const panelContentElement = this.getPanelContentElement();

        const itemA = this.getItemByIndex(itemIndexA);
        const itemB = this.getItemByIndex(itemIndexB);

        const itemAContainerElement = panelContentElement.removeChild(itemA.getItemContainerElement());
        const itemBContainerElement = itemB.getItemContainerElement();

        if(super.isPanelHorizontal()){
            if(itemIndexA < itemIndexB) itemBContainerElement.insertAdjacentElement('afterend', itemAContainerElement);
            if(itemIndexA > itemIndexB) itemBContainerElement.insertAdjacentElement('beforebegin', itemAContainerElement);
        }else{
            if(itemIndexA < itemIndexB) itemBContainerElement.insertAdjacentElement('beforebegin', itemAContainerElement);
            if(itemIndexA > itemIndexB) itemBContainerElement.insertAdjacentElement('afterend', itemAContainerElement);
        }
       
        this._moveItem(itemIndexA, itemIndexB);
        IndexManager.updateIndexes(this.items);

        this.emit('moveItem', itemIndexA, itemIndexB);
    }

}