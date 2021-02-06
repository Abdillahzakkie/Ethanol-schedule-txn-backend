const router = require('express').Router();

const { 
    addTransaction,
    findTransactionByAddress,
    getAllTransactions
} = require('../helpers/index');

router.get('/', async (req, res) => {
    try {
        const result = await getAllTransactions();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(401).json(error);
    }
})

router.get('/findTransactionByAddress/', async (req, res) => {
    try {
        const { user } = req.body;
        const result = await findTransactionByAddress(user);
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


module.exports = router;