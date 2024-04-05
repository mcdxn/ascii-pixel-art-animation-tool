'use strict';
import { _Debug_ }        from './debug';
import { Commander }    from './commander';

/*eslint no-undef: "off"*/

export class Algo extends Commander {

    constructor(){

        super('algo');

        this.screen         = null;
        this.layerManager   = null;
        this.state          = null;
        this.flags          = null;
        this.display        = null;
        this.width          = null;
        this.height         = null;
        this.pixels         = null;
        this.scanlines      = null;
        this.x              = 0;
        this.y              = 0;
        this.countX         = 0;
        this.countY         = 0;
        this.screenId       = 0;
        this.temp           = {};
        this.exit           = false;
    }

    static create(){
        return new Algo();
    }

    init(screen){
        this.screen         = screen;
        this.layerManager   = screen.layerManager;
        this.state          = screen.state;
        this.flags          = screen.flags;
        this.display        = screen.display;
        this.width          = this.state.getStateProperty('screenWidth');
        this.height         = this.state.getStateProperty('screenHeight');
        this.pixels         = screen.getPixels();
        this.scanlines      = screen.getScanlines();
    }

    registerCommand(command){
        if(DEBUG.ON) _Debug_.checkAlgoName(command.getCommandName());
        command.setAlgo(this);
        super.registerCommand(command);
    }

    getAlgo(name){

        if(DEBUG.ON) _Debug_.checkAlgoName(name);
        
        return this.algos[name];
    }

    executeImmediate(algo){
        return new Promise(function (resolve){
            algo.call(this);
            resolve(true);
        }.bind(this));
    }

    run(algo)
    {
        return new Promise(function (resolve){
            const exeAlgoX  = algo.X;
            const exeAlgoY  = algo.Y;
            const init      = algo.init;
            const done      = algo.done;
            const before    = algo.before;
            const after     = algo.after;
            const skipX     = algo.skipX;
            const skipY     = algo.skipY;
      
            let numXLoop = algo.numXLoop || this.width-1;
            let numYLoop = algo.numYLoop || this.height-1;
          
            this.screenId = 0;
            this.exit = false;
    
            if(init) init.call(this);
    
            if(this.exit) return;
    
            if(before) before.call(this);
    
            if(!skipY) {
                
                do {
    
                    if(!skipX) {
                        do{
        
                            if(exeAlgoX) exeAlgoX.call(this); 
            
                            if(this.exit) return;
    
                            this.countX++;
                            this.screenId++;
                        }while(this.x++ !== numXLoop);
                    }
    
                    if(exeAlgoY) exeAlgoY.call(this);
        
                    if(this.exit) return;
    
                    this.x = 0;
                    this.countY++;
    
                }while(this.y++ !== numYLoop);
            }
         
            if(after) after.call(this);
    
            if(done) done.call(this);
    
            this.x = 0;
            this.y = 0;
            this.countX = 0;
            this.countY = 0;
            this.exit   = false;
            
            this.state.setStateProperty('screenWidth', this.width);
            this.state.setStateProperty('screenHeight', this.height);

            resolve(true);
        }.bind(this));
    }
}