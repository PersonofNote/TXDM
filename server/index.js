const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv').config()
const Airtable = require('airtable');

// ENV VARIABLES
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const FRONTEND_URL = process.env.FRONTEND_URL;
const AIRTABLE_TABLE_IDS = process.env.AIRTABLE_TABLE_IDS;

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
  const table_id = AIRTABLE_TABLE_IDS[table]
  const formatTableName = (table) => {
    return table.split('_')
  }
  console.log(formatTableName(table))
  const list = []
  const records = await base(table).select().all();
  records.forEach(function(record) {
    // TODO: Filter by supplied fields
    console.log('Retrieved', record.get(fields[0]));
    list.push(record.get(fields[0]))
});
  return list
}

const getResults = async(table) => {
  const list = []
  const records = await base(table).select().all();

  records.forEach(function(record) {
    // TODO: Filter by supplied fields
    console.log('Retrieved', record.id );
    // TODO: filter  by includes any of the inputs and return Data Type (must fetch from other table as well), Company and Description. (Possibly do on client side)
    if (record.fields['Required Sample Types'] && record.fields['Required Sample Types'].includes('reczCaSqvunbPx7KE')){
      list.push(record)
    }
    //console.log(list)
});

  return list
}



app.get('/api', (req, res) => { 
  res.send({ msg: 'API is functioning' });
});

app.get('/api/users/:table', (req, res) => {
 const usersList = printTable(`${req.params.table}`, ["Full Name"]).then((result)=>res.send({data: result}))
  .catch((err)=>{console.log("ERR: ", err)});
})

app.post('/api/post_sample', (req, res) => {
  console.log(req.body)
  const results = getResults('tblAyos67WFzbHe5C').then((result)=>{
    res.send({data: result})
  })
})