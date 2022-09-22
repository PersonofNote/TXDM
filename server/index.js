const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv').config()
const Airtable = require('airtable');

// ENV VARIABLES
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const FRONTEND_URL = process.env.FRONTEND_URL;

const app = express();
const port = process.env.PORT || 5000;

const passList = {
  origin: FRONTEND_URL
}

app.use(cors(passList))

app.listen(port, () => console.log(`Listening on port ${port}`));

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: AIRTABLE_API_KEY
});
const base = Airtable.base(AIRTABLE_BASE_ID);

const printTable = async(table, fields) => {
  const list = []
  const records = await base(table).select().all();
  records.forEach(function(record) {
    // TODO: Filter by supplied fields
    console.log('Retrieved', record.get(fields[0]));
    list.push(record.get(fields[0]))
});
console.log(list)
  return list

}



app.get('/api', (req, res) => { 
  res.send({ msg: 'API is functioning' });
});

app.get('/users', (req, res) => {
 const usersList = printTable('DX Users', ["Full Name"]).then((result)=>res.send({data: result}))
  .catch((err)=>{console.log("ERR: ", err)});
})