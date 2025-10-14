import express from "express";
import morgan from "morgan";
import Blockchain from "../lib/blockchain";

const PORT: number = 3000

const app = express();

app.use(morgan('tiny'));
app.use(express.json());

// Cria o bloco genesis
const blockchain = new Blockchain();

app.get('/status', (req, res, next) => {
    res.json({
        numberOfBlocks: blockchain.blocks.length,
        isValis: blockchain.isValid(),
        lastBlock: blockchain.getLastBlock()
    })
})

app.get('/blocks/:indexOrHash', (req, res, next) => {
    if(/^[0-9]+$/.test(req.params.indexOrHash))
        return res.json(blockchain.blocks[parseInt(req.params.indexOrHash)]);
    else
        return res.json(blockchain.getBlock(req.params.indexOrHash))
})

app.listen(PORT, () => {
    console.log(`Blockchain server is running at ${PORT}`);
})