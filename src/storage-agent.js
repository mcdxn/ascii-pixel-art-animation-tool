'use strict';

export class StorageAgent {
    static isStorageAvailable(){
        return window.localStorage ? true : false;
    }

    static setItem(name, value){
        if(window.localStorage){
            window.localStorage.setItem(name, value);
        }
    }

    static getItem(name){
        if(window.localStorage){
            return window.localStorage.getItem(name);
        }
    }
}