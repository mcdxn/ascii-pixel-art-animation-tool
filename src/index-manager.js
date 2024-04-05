'use strict';

import { _Debug_ } from './debug';


export class IndexManager {
    static updateIndexes(indexer){
        _Debug_.checkInstanceOfArray(indexer);

        let index = 0;
        for(const i in indexer){
            indexer[i].setIndexPosition(index++);
        }
    }

    static moveIndexes(indexer, fromIndex, toIndex){
        _Debug_.checkInstanceOfArray(indexer);

        let foundItem = null;
        let foundIndex = null;

        for(const i in indexer){
            const item = indexer[i];
            if(item.getIndexPosition() === fromIndex){
                foundIndex = i;
                break;
            }
        }

        foundItem = indexer.splice(foundIndex, 1);
        
        if(foundItem.length){
            indexer.splice(toIndex, 0, foundItem[0]);
        }

        IndexManager.updateIndexes(indexer);
    }
}