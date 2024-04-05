'use strict';

import { ResizeScreenHeight }   from './algo-resize-screen-height';
import { ResizeScreenWidth }    from './algo-resize-screen-width';

/*eslint no-undef: "off"*/

// RESIZE TOP SIDE

export class ResizeScreenIncreaseTop extends ResizeScreenHeight {

    constructor(){
        super();
        super.setCommandName(ALGO_COMMAND_NAME.ScreenIncreaseTop);
    }

    static create(){
        return new ResizeScreenIncreaseTop();
    }

    execute(){
        const algo = this.algo;
        algo.flags.setFlag('resizeMode', false);
        algo.flags.setFlag('resizeDirection', false);
        algo.run({before:super.algoIncreaseY, done:super.algoDoneY, skipY:true});
        algo.run({X:super.algoReprocessProperties});
    }
}

export class ResizeScreenDecreaseTop extends ResizeScreenHeight {
    
    constructor(){
        super();
        super.setCommandName(ALGO_COMMAND_NAME.ScreenDecreaseTop);
    }

    static create(){
        return new ResizeScreenDecreaseTop();
    }    

    execute(){
        const algo = this.algo;
        algo.flags.setFlag('resizeMode', true);
        algo.flags.setFlag('resizeDirection', false);
        algo.run({before:super.algoDecreaseY, done:super.algoDoneY, skipY:true});
        algo.run({X:super.algoReprocessProperties});
    }
}


// RESIZE BOTTOM SIDE

export class ResizeScreenIncreaseBottom extends ResizeScreenHeight {

    constructor(){
        super();
        super.setCommandName(ALGO_COMMAND_NAME.ScreenIncreaseBottom);
    }

    static create(){
        return new ResizeScreenIncreaseBottom();
    }  

    execute(){
        const algo = this.algo;
        algo.flags.setFlag('resizeMode', false);
        algo.flags.setFlag('resizeDirection', true);
        algo.run({before:super.algoIncreaseY, done:super.algoDoneY, skipY:true});
        algo.run({X:super.algoReprocessProperties});
    }
}

export class ResizeScreenDecreaseBottom extends ResizeScreenHeight {

    constructor(){
        super();
        super.setCommandName(ALGO_COMMAND_NAME.ScreenDecreaseBottom);
    }

    static create(){
        return new ResizeScreenDecreaseBottom();
    }  

    execute(){
        const algo = this.algo;
        algo.flags.setFlag('resizeMode', true);
        algo.flags.setFlag('resizeDirection', true);
        algo.run({before:super.algoDecreaseY, done:super.algoDoneY, skipY:true});
        algo.run({X:super.algoReprocessProperties});
    }
}


export class ResizeScreenIncreaseRight extends ResizeScreenWidth {

    constructor(){
        super();
        super.setCommandName(ALGO_COMMAND_NAME.ScreenIncreaseRight);
    }

    static create(){
        return new ResizeScreenIncreaseRight();
    }  

    execute(){
        const algo = this.algo;
        algo.flags.setFlag('resizeMode', false);
        algo.flags.setFlag('resizeDirection', false);
        algo.run({Y:this.algoIncreaseX, done:this.algoDoneX});
        algo.run({X:this.algoReprocessProperties});
    }
}

export class ResizeScreenDecreaseRight extends ResizeScreenWidth {
    
    constructor(){
        super();
        super.setCommandName(ALGO_COMMAND_NAME.ScreenDecreaseRight);
    }

    static create(){
        return new ResizeScreenDecreaseRight();
    } 

    execute(){
        const algo = this.algo;
        algo.flags.setFlag('resizeMode', true);
        algo.flags.setFlag('resizeDirection', false);
        algo.run({Y:this.algoDecreaseX, done:this.algoDoneX});
        algo.run({X:this.algoReprocessProperties});
    }
}


export class ResizeScreenIncreaseLeft extends ResizeScreenWidth {

    constructor(){
        super();
        super.setCommandName(ALGO_COMMAND_NAME.ScreenIncreaseLeft);
    }

    static create(){
        return new ResizeScreenIncreaseLeft();
    } 

    execute(){
        const algo = this.algo;
        algo.flags.setFlag('resizeMode', false);
        algo.flags.setFlag('resizeDirection', true);
        algo.run({Y:this.algoIncreaseX, done:this.algoDoneX});
        algo.run({X:this.algoReprocessProperties});
    }
}

export class ResizeScreenDecreaseLeft extends ResizeScreenWidth {

    constructor(){
        super();
        super.setCommandName(ALGO_COMMAND_NAME.ScreenDecreaseLeft);
    }

    static create(){
        return new ResizeScreenDecreaseLeft();
    } 

    execute(){
        const algo = this.algo;
        algo.flags.setFlag('resizeMode', true);
        algo.flags.setFlag('resizeDirection', true);
        algo.run({Y:this.algoDecreaseX, done:this.algoDoneX});
        algo.run({X:this.algoReprocessProperties});
    }
}