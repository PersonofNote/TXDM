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

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: AIRTABLE_API_KEY
});

const base = Airtable.base(AIRTABLE_BASE_ID);

const preLoadData = async() => {
  // Getting linked table data from Airtable is annoying. This function
  // Preloads data that we want and maps it to an object for display
  const LINKED_DATA = {}
  LINKED_DATA.tissue_sample_matrix = {}

  const tissue_sample_table = 'tbliGPwuWUq0KnIH4'
  const records = await base(tissue_sample_table).select().all();

  records.forEach(function(record) {
    id = record.id
    field_name = record.get('Tissue')
    LINKED_DATA.tissue_sample_matrix[id] = field_name
});

  return LINKED_DATA
}

// This function wraps everything else for now; once we switch to postgres
// it will be removed
preLoadData().then((result)=>{
  const airtable_data = result
  console.log(airtable_data)

const printTable = async(table, fields) => {
  const table_id = AIRTABLE_TABLE_IDS[table]
  const formatTableName = (table) => {
    return table.split('_')
  }
  const list = []
  const records = await base(table).select().all();
  records.forEach(function(record) {
    // TODO: Filter by supplied fields
    console.log('Retrieved', record.get(fields[0]));
    list.push(record.get(fields[0]))
});
  return list
}


const getResults = async(table, types) => {
  const list = []
  const records = await base(table).select().all();

  records.forEach(function(record) {
    // TODO: Filter by supplied fields. Will require installing bodyparser!
    console.log('Retrieved', record.id );
    if (record.fields['Required Sample Types'] && record.fields['Required Sample Types'].includes('reczCaSqvunbPx7KE')){
      list.push(record)
    }
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
  console.log("POST")
  console.log(req)
  const results = getResults('tblAyos67WFzbHe5C').then((result)=>{
    res.send({data: result})
  })
})


  app.listen(port, () => console.log(`Listening on port ${port}`));
})
