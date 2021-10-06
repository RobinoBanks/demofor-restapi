const express = require('express'); //Import Express
const { ValidationError } = require('joi');
const Joi = require('joi'); //Import Joi
const app = express(); //Create Express Applicaiton on the app variable
app.use(express.json()); //Used the Json file

//Give data to the server
const customers = [
    { title: 'George', id: 1 },
    { title: 'Josh', id: 2 },
    { title: 'Tyler', id: 3 },
    { title: 'alice', id: 4 },
    { title: 'Candice', id: 5 },
]

//READ Request Handlers
//Display the Message when the URL consist of '/'
app.get('/', (req, res) => {
    res.send('Welcome to the REST API demo!');
});

//Display the list of Customers when the URL consists of api customers by returning customer object
app.get('/api/customers', (req, res) => {
    res.send(customers);
});

//Display the information of specific customer when you mention the id
app.get('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));

    //If there is no valid customer ID, then display an error with the following message
    if (!customer) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Sorry, we cannot find the page you requested.</h2>');
    res.send(customer);
});

//CREATE Request Handler
//Create new customer information
app.post('/api/customers', (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }
    //Increment the customer id
    const customer = {
        id: customers.length + 1,
        title: req.body.title
    };
    //Increases the stack
    customers.push(customer);
    res.send(customer);
});

//UPDATE Request Handler
//Update existing customer information
app.put('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Not Found!</h2>');

    const { error } = validateCustomer(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    customer.title = req.body.title;
    res.send(customer);
});

//DELETE Request Handler
//Delete customer details
app.delete('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Not Found!</h2>');

    const index = customers.indexOf(customer);
    customers.splice(index, 1);

    res.send(customer);
});
//Validate information - customer must have minimum of 3 characters
function validateCustomer(customer) {
    const schema = Joi.object({
        title: Joi.string().min(3).required()
    });
    return schema.validate(customer);
}

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port 8080..'));