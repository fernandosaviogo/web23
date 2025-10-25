import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import Block from '../src/lib/block';
import BlockInfo from '../src/lib/blockInfo';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';
import TransactionInput from '../src/lib/transactionInput';


jest.mock('../src/lib/transaction');
jest.mock('../src/lib/transactionInput');

describe("Block tests", () => {

    const exampleDifficulty = 1;
    const exampleMiner = "Fernando"
    let genesis: Block;

    /**
     * Initializes the genesis variable
     */
    beforeAll(() => {
        genesis = new Block({
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)]
        } as Block);
    })

    test('Should be valid', () =>{
        const block = new Block({
            index: 1, 
            previousHash: genesis.hash,
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)]
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner
        }as Transaction))

        block.hash = block.getHash();

        block.mine(exampleDifficulty, exampleMiner);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeTruthy();
    })

    test('Should NOT be valid (no fee)', () =>{
        const block = new Block({
            index: 1, 
            previousHash: genesis.hash,
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)]
        } as Block);

        block.mine(exampleDifficulty, exampleMiner);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test('Should creat from block info', () =>{
        const block = Block.fromBlockInfo({
            transaction: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)],
            difficulty: exampleDifficulty,
            feePerTx: 1,
            index: 1,
            maxDifficulty: 62,
            previousHash: genesis.hash
        } as BlockInfo);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner
        }as Transaction))

        block.hash = block.getHash();

        block.mine(exampleDifficulty, exampleMiner);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeTruthy();
    })

    test('Should NOT be valid (2 FEE)', () =>{
        const block = new Block({
            index: 1, 
            previousHash: genesis.hash,
            transactions: [
                new Transaction({
                    type: TransactionType.FEE,
                    txInput: new TransactionInput()
                } as Transaction),
                new Transaction({
                    type: TransactionType.FEE,
                    txInput: new TransactionInput()
                } as Transaction)
            ]
        } as Block);
        block.mine(exampleDifficulty, exampleMiner);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test('Should NOT be valid (invalid tx)', () =>{
        const block = new Block({
            index: 1, 
            previousHash: genesis.hash,
            transactions: [new Transaction]
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner
        }as Transaction))

        block.hash = block.getHash();

        block.mine(exampleDifficulty, exampleMiner);

        block.transactions[0].to = "";

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test('Should be NOT be valid (fallbacks)', () =>{
        const block = new Block();

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner
        }as Transaction))

        block.hash = block.getHash();

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test('Should NOT be valid (invalid previous hash)', () =>{
        const block = new Block({
            index: 1, 
            previousHash: "abc",
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)]
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner
        }as Transaction))

        block.hash = block.getHash();
        block.mine(exampleDifficulty, exampleMiner);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test('Should NOT be valid (invalid timestamp)', () =>{
        const block = new Block({
            index: 1, 
            previousHash: genesis.hash,
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)]
        } as Block);
        block.timestamp = -1;

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner
        }as Transaction))

        block.hash = block.getHash();
        block.mine(exampleDifficulty, exampleMiner);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test('Should NOT be valid (empty hash)', () =>{
        const block = new Block({
            index: 1, 
            previousHash: genesis.hash,
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)]
        } as Block);
        block.mine(exampleDifficulty, exampleMiner);

        block.hash = '';

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test('Should NOT be valid (Invalid hash.)' , () =>{
        const block = new Block({
            index: 1, 
            previousHash: genesis.hash,
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)]
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner,
            hash: "123"
        }as Transaction))

        block.mine(exampleDifficulty, exampleMiner);

        block.hash = "invalid-hash-insertion"

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test('Should NOT be valid (no miner)', () =>{
        const block = new Block({
            index: 1, 
            nonce: 0,
            miner: exampleMiner,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)]
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner
        }as Transaction))

        block.hash = block.getHash();

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test('Should NOT be valid (txInput)', () =>{
        const txInput = new TransactionInput();
        txInput.amount = -1;

        const block = new Block({
            index: 1, 
            previousHash: genesis.hash,
            transactions: [new Transaction({
                txInput
            } as Transaction)]
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner
        }as Transaction))

        block.hash = block.getHash();

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test('Should NOT be valid (invalid index)', () =>{
        const block = new Block({
            index: -1, 
            previousHash: genesis.hash,
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)]
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner
        }as Transaction))

        block.hash = block.getHash();
        block.mine(exampleDifficulty, exampleMiner);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

})