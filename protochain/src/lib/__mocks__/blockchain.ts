import Block from './block';
import Validation from '../validation';
import BlockInfo from '../blockInfo';
import Transaction from './transaction';
import TransactionType from '../transactionType';
import TransactionSearch from '../transactionSearch';
import TransactionInput from './transactionInput';

/**
 * Mocked Blockchain class
 */
export default class Blockchain {
    // add para correção com o chat GPT
    static readonly DIFFICULTY_FACTOR = 5;
    static readonly TX_PER_BLOCK = 2;
    static readonly MAX_DIFFICULTY = 62;

    mempool: Transaction[]; 
    blocks: Block[];
    nextIndex: number = 0;

    /**
     * Creates a new mocked blockchain
     */
    constructor(){
        this.mempool = []; 
        this.blocks = [new Block({
            index: 0,
            hash: 'abc',
            previousHash: "",
            transactions: [new Transaction({
                txInput: new TransactionInput(),
                type: TransactionType.FEE
            } as Transaction)],
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

    // add correcçao do copilot (teste: GET /transactions/:hash - Should return transaction details)
    addTransaction(transaction: Transaction): Validation {
        const validation = transaction.isValid();
        if (!validation.success) 
            return new Validation(false, "invalid tx: " + validation.message);

        this.mempool.push(transaction);
        return new Validation(true, transaction.hash);
    }


    getBlock(hash: string): Block | undefined {
        return this.blocks.find(b => b.hash === hash);
    }

    isValid(): Validation {
        return new Validation();
    }

    getFeePerTx(): number {
            return 1;
        }
    
    getNextBlock(): BlockInfo {
        return {
            transaction: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)],
            difficulty: 0,
            previousHash: this.getLastBlock().hash,
            index: 1,
            feePerTx: this.getFeePerTx(),
            maxDifficulty: 62
        } as BlockInfo;
    }

    getTransaction(hash: string): TransactionSearch {
        return {
            mempoolIndex: 0,
            transaction: {
                hash
            }
        } as TransactionSearch;
    }

}