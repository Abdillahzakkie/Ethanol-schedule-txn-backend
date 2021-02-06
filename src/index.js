const express = require('express');
const cors = require('cors');
const connectDB = require('./DB/index');
const transactionRouter = require('./routes/transaction.router');

const { loadBlockchainData } = require('./helpers/index')


const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use("/api/v1/txns", transactionRouter);

app.listen(port, async () => {
    await connectDB();
    await loadBlockchainData();
    console.log(`Server listeninig at port: http://localhost:${port}`)
});

