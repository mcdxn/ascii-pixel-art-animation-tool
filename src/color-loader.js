'use strict';

import { colorSetMaterialDesign } from '../json/color_set_material_design.json';
import { ColorSet } from './color-set';

/*eslint no-undef: "off"*/


export class ColorLoader {
    static loadColorSet(colorSet){
        switch(colorSet){
        case COLOR_SET.MaterialDesign: return ColorSet.create(colorSetMaterialDesign);
        default: return null;
        }
    }
}