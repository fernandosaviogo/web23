import Transaction from "./transaction";

/**
 * The blochain interface
 */
export default interface  BlockInfo {
    index: number;
    previousHash: string;
    difficulty: number;
    maxDifficulty: number;
    feePerTx: number;
    transaction: Transaction[];
}