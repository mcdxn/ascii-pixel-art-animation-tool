'use strict';

export class ColorFactory {
    constructor(){
        this.fragment = document.createDocumentFragment();
    }

    static create(colorSet){
        const cf = new ColorFactory();
        cf.init(colorSet);

        return cf;
    }

    init(colorSet){

        const maxLen = colorSet.getColorSetDataLength() - 1;
        let colors = null;
        let index = 0;

        do{
            const container = document.createElement('div');
            container.style.setProperty('display', 'inline-block');
            colors = colorSet.getColorSetColors(index);

            for(const color of colors){
                container.appendChild(color.getColorElement());
            }

            this.fragment.appendChild(container);

        }while(++index <= maxLen);


    }

    getFragment(){
        return this.fragment;
    }
}