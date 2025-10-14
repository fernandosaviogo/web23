import Block from './block';
import Validation from '../validation';

/**
 * Mocked Blockchain class
 */
export default class Blockchain {
    blocks: Block[];
    nextIndex: number = 0;

    /**
     * Creates a new mocked blockchain
     */
    constructor(){
        this.blocks = [new Block({
            index: 0,
            hash: 'abc',
            previousHash: "",
            data: "genesis Block",
            timestamp: Date.now()
        } as Block)];
        this.nextIndex++;
    }
  
    getLastBlock(): Block {
        return this.blocks[this.blocks.length - 1]!;  // O ! indica que o Block nunca retornara indefinido
    }

    addBlock(block: Block): Validation {
        if(block.index < 0) return new Validation(false, "Invalid mock block.");
        
        this.blocks.push(block);  // Adciona o bloco quando valido
        this.nextIndex++;
        
        return new Validation();
    }

    getBlock(hash: string): Block | undefined {
        return this.blocks.find(b => b.hash === hash);
    }

    isValid(): Validation {
        return new Validation();
    }
}