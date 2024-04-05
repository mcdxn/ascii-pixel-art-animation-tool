'use strict';

import { ColorItem } from './color-item';

export class ColorSet {
    constructor(colorSet){
        this.colorSet = colorSet;
        this.colors = [];
    }

    static create(colorSet){

        const cs = new ColorSet(colorSet);
        cs.init();

        return cs;
    }

    init(){        
        const maxlen = this.getColorSetDataLength() - 1;
        let dataIndex = 0;
        let colors = null;
        let len = 0;

        do{
            colors = this.colorSet.data[dataIndex].colors.reverse();
            len = colors.length - 1;

            for(let i=0; i <= len; i++){
                colors[i] = ColorItem.create(colors[i]);
                this.colors.push(colors[i]);
            }


        }while(++dataIndex <= maxlen);
    }

    getColorSetDataLength(){
        return this.colorSet.data.length;
    }

    getColorSetLabel(id){
        return this.colorSet.data[id].label;
    }

    getColorSetColors(id){
        return this.colorSet.data[id].colors;
    }

    getColorSetColorsLength(id){
        return this.colorSet.data[id].colors.length;
    }

    setColorSelectHandler(handler){
        for(const color of this.colors){
            color.on('colorSelect', handler);
        }
    }
}