const express = require('express');
const app = express();
const products = require('./routes/products');
const home = require('./routes/home');

app.use(express.json());
app.use('/api/products', products);
app.use('/', home);

app.use(express.urlencoded({extended : true}));

const port = process.env.PORT || 51174;

app.listen(port, () => {
    console.log(`Listing to port ${port}`);
});