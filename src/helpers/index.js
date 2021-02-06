const loadWeb3 = require('../web3/index');
const Transaction = require('../models/transaction');

let web3;

const loadBlockchainData = async () => {
    try {
        web3 = await loadWeb3();
        setInterval(async () => {
            await loadAllUnFilledTransactions();
        }, 60000);
    } catch (error) {
        console.log(error);
        return error;
    }
}

const loadAllUnFilledTransactions = async () => {
    try {
        let _curentGasPrice = await web3.eth.getGasPrice();
        _curentGasPrice = web3.utils.fromWei(_curentGasPrice, 'gwei');
        const _max = Number(_curentGasPrice) + 5;

        let result = await Transaction.find({ filled: false, cancelled: false });

        result = result.filter(async item => {
            const { rawTransaction, _id, data } = item;
            const { from, gasPrice, gas } = data;

            const _userETHBalance = await web3.eth.getBalance(web3.utils.toChecksumAddress(from));
            const _ethGasPrice = web3.utils.fromWei((gasPrice * gas).toString(), "ether");
            const _gasPrice = Number(web3.utils.fromWei(gasPrice, 'gwei'));

            if(_gasPrice <= _max || Number(_userETHBalance) < Number(_ethGasPrice)) return;

            // Note:: Methods should successfully passed if all checks are kept the same
            let _reciept =  await web3.eth.sendSignedTransaction(rawTransaction);
            _reciept = _reciept.on('reciept', async _data => {
                const _txn = await Transaction.findById(_id);
                _txn.filled = true;
                await _txn.save();
                return _data;
            });
            return _reciept
        });
    } catch (error) {
        console.log(error);
        return error;
    }
}

const addTransaction = async _data => {
    try {
        const { data, messageHash, rawTransaction, transactionHash, r, s, v } = _data;
        const _result = new Transaction({ 
            data, 
            messageHash, 
            rawTransaction, 
            transactionHash, 
            r, 
            s, 
            v 
        });

        await _result.save();
        return _result;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const findTransactionByAddress = async _account => {
    try {
        let result = await Transaction.find({  });
        result = result.filter(item => item.data.from === _account);
        return result;
    } catch (error) { return error; }
}

const getAllTransactions = async () => {
    try {
        let result = await Transaction.find({  });
        return result;
    } catch (error) {
        return error;
    }
}

const cancelTransaction = async _data => {
    try {
        const { id: _id } = _data;
        const result = await Transaction.findById(_id);
        if(!result) throw new Error({ error: "404: Bad data recieved" });
        if(result.cancelled) return new Error({ error: "Transaction have already been cancelled" });
        if(result.filled) return new Error({ error: "Transaction have already been filled" });

        result.cancelled = true;
        await result.save();
        return "success";
    } catch (error) {
        return error;
    }
}

const getAllCancelledTranscations = async () => {
    try {
        const result = await Transaction.find({ cancelled: true });
        return result;
    } catch (error) {
        return error;
    }
}

module.exports = { 
    web3,
    loadBlockchainData, 
    addTransaction, 
    findTransactionByAddress,
    getAllTransactions,
    cancelTransaction,
    getAllCancelledTranscations
}