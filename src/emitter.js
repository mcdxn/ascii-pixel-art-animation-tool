'use strict';

import { _Debug_ }        from './debug';

/*eslint no-undef: "off"*/

export class Emitter {
    constructor(){
        this.callbacks = {any:[]};
    }

    on(message, callback, id){
        if(DEBUG.ON) _Debug_.checkInstanceOfFunction(callback);

        if(!this.callbacks[message]){
            this.callbacks[message] = [{id:id, callback:callback}];
        }else{
            this.callbacks[message].push({id:id, callback:callback});
        }
    }

    emit(message, ...values){
        if(this.callbacks[message]){
            for(const cb of this.callbacks[message]){
                Reflect.apply(cb.callback, this, values);
            }
        }
    }

    emitAny(...values){
        this.emit('any', values);
    }

    removeCallback(id){
        return new Promise(function (resolve){

            const keys = Object.keys(this.callbacks);

            for(const key of keys)
            {
                const cbs = this.callbacks[key];

                for(const index in cbs)
                {
                    const cb = cbs[index];

                    if(cb.id === id)
                    {
                        cbs.splice(index, 1);
                        resolve(true);
                        break;
                    }
                }
       
            }

            if(DEBUG.ON) _Debug_.throwException(`EMITTER: NO CALLBACK REGISTERED WITH ID: ${id}`);

        }.bind(this));
    }

    removeAllCallbacks(){
        return new Promise(function (resolve){

            const keys = Object.keys(this.callbacks);

            for(const key of keys)
            {
                const cbs = this.callbacks[key];
                
                cbs.length = 0;
            }

            resolve(true);
        }.bind(this));
    }

}