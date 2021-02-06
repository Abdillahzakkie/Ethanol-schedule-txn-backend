const router = require('express').Router();

const { 
    addTransaction,
    findTransactionByAddress,
    getAllTransactions,
    cancelTransaction,
    getAllCancelledTranscations
} = require('../helpers/index');

router.get('/', async (req, res) => {
    try {
        const result = await getAllTransactions();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(401).json(error);
    }
})

router.post('/submit_txns/', async (req, res) => {
    try {
        const _result = await addTransaction(req.body);
        res.status(201).json(_result);
    } catch (error) {
        return res.status(202).json(error);
    }
})

router.get('/findTransactionByAddress/', async (req, res) => {
    try {
        const { user } = req.query;
        const result = await findTransactionByAddress(user);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(401).json(error);
    }
})

router.patch('/cancelTransaction', async (req, res) => {
    try {
        const result = await cancelTransaction(req.body);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(404).json(error);
    }
})

router.get('/getAllCancelledTranscations', async (req, res) => {
    try {
        const result = await getAllCancelledTranscations();
        res.status(200).json(result);
    } catch (error) {
        return res.status(404).json(error);
    }
})

module.exports = router;