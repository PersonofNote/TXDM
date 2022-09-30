const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
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
app.use(bodyParser.json())

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: AIRTABLE_API_KEY
});

const base = Airtable.base(AIRTABLE_BASE_ID);

const preLoadData = async() => {
  // Getting linked table data from Airtable is annoying, and temporary
  // This function preloads data that we want and maps it to an object for display

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
  try{
  const records = await base(table).select().all();
  console.log("FILTER BY")
  console.log(types)
  /*
  let records1 = await base(table).select({filterByFormula: `{Tissue Sample} = Tissue`}).all()
  console.log("TEST JOIN")
  console.log(records1)
  */

  // TODO: INVERT THIS. Look up samples, and then query the machines/assays linked field, not the other way around!!!

  records.forEach(function(record) {
    if (record.fields['Required Sample Types']){
  //pass
}
    console.log("Record:")
    console.log(record.fields['Required Sample Types'])
    if (record.fields['Required Sample Types']){
      base('Tissue Sample').find(record.fields['Required Sample Types'], function(err, r) {
        if (err) { console.error(err); return; }
        console.log('Retrieved from linked table', r);
    });
      list.push(record)
      console.log('Retrieved', record.id );
    }
  });
  
  return list
}catch(error){
  console.log(error)
  return error
}
}


app.get('/api', (req, res) => { 
  res.send({ msg: 'API is functioning' });
});

app.get('/api/users/:table', (req, res) => {
 printTable(`${req.params.table}`, ["Full Name"]).then((result)=>res.send({data: result}))
  .catch((err)=>{console.log("ERR: ", err)});
})

app.post('/api/post_sample', (req, res) => {
  console.log("POST")
  const tissueType = req.body.tissueType;
  console.log(tissueType)
  getResults('tblAyos67WFzbHe5C', tissueType).then((result)=>{
    res.send({data: result})
  })
})


  app.listen(port, () => console.log(`Listening on port ${port}`));
})
