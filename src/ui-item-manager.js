'uset strict';

import { _Debug_ } from './debug';


export class UIItemManager {
    constructor(){
        this.savedItems = {};
    }

    static create(){
        return new UIItemManager();
    }

    saveItems(ownerId, items, itemIdCounter){
        const lastItem = items[items.length - 1];
        this.savedItems[ownerId] = {lastItem:lastItem, savedItems:items, savedLastId:itemIdCounter};
    }

    removeSavedItems(ownerId){
        this.savedItems[ownerId] = null;
        delete this.savedItems[ownerId];
        _Debug_.log(`REMOVING ANIMATION OBJECT ID: ${ownerId}`);
    }

    getSavedItems(ownerId){
        return this.savedItems[ownerId];
    }
}