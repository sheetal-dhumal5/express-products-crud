const express = require('express');
const router = express.Router();
const products = require('./../data/products.json');
const fs = require('fs');
const Joi = require('joi');
const filePath = './data/products.json';    

fs.readFile(filePath, (err, data) => {
    if (err) {
        res.send(500).send('Internal server error');
    };
    const responseData = JSON.parse(data);
    processFile(responseData);    // not the content variable itself 
});
    
function processFile(content) {
    return content;
}

const saveProductData = (data) => {
    fs.writeFile(filePath, JSON.stringify(data), err => {
        if (err) {
            res.send(500).status('Internal server error'); 
        }
        return data; // Success
    });
}

//get all records api
router.get('/', (req,res) => {
    const existProducts = processFile(products);
    res.send(existProducts);
});

//get by id parameter - single record api
router.get('/:id', (req,res) => {
    const paramId = Number(req.params.id);
    const existProducts = processFile(products);
    const findExist = existProducts.find( product => product.id === paramId )
    if (!findExist) {
        return res.status(404).send(`Record with id ${paramId} does not exist`);
    }
    res.send(findExist);
});

//post api - to add data
router.post('/', (req,res) =>  {
    let maxProductId = Math.max(...products.map(({ id }) => id));
    const product = {
        //id: products.length + 1,
        id: maxProductId + 1,
        name: req.body.name
    };

    products.push(product);
    fs.writeFile(filePath, JSON.stringify(products), err => {
        if (err) {
            res.send(500).status('Internal server error'); 
        }
        res.status(201).send(product); // Success
    });
});

//put api for update data by id parameter
router.put('/:id', (req, res) => {
    const paramId  = Number(req.params.id);
    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required()
    });
    const { error } = schema.validate(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    const product = {
        id:paramId,
        name: req.body.name
    };

    const existProducts = processFile(products);
    const findExist = existProducts.find( prod => prod.id === paramId )
    if (!findExist) {
        return res.status(404).send(`Record with id ${paramId} does not exist`);
    }
    const updateProduct = existProducts.filter( prod => prod.id !== paramId );
    updateProduct.push(product);
    saveProductData(updateProduct);
    res.send({success: true, msg: `Product data updated successfully for id ${paramId}`});
});

//delete api by id parammeter
router.delete('/:id', (req,res) =>  {
    const paramId = Number(req.params.id);
    const existProducts = processFile(products);
        const filterProduct = existProducts.filter( product => product.id !== paramId )
        if (existProducts.length === filterProduct.length ) {
            return res.status(404).send(`Record with id ${paramId} does not exist`);
        }
        saveProductData(filterProduct);
        res.send({success: true, msg: `Record with id: ${paramId} removed successfully`});
});

module.exports = router;
