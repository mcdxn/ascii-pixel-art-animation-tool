'use strict';

import { Command } from './command';

export class AlgoBase extends Command {
    
    constructor(algo){
        
        super();

        this.algo = algo;
    }

    setAlgo(algo){
        this.algo = algo;
    }
}
