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
  LINKED_DATA.tissue_sample_names_by_id = {}
  LINKED_DATA.tissue_sample_ids_by_name = {}

  const tissue_sample_table = 'tbliGPwuWUq0KnIH4'
  const records = await base(tissue_sample_table).select().all();

  records.forEach(function(record) {
    id = record.id
    field_name = record.get('Tissue')
    LINKED_DATA.tissue_sample_names_by_id[id] = field_name
    LINKED_DATA.tissue_sample_ids_by_name[field_name] = id
});

  return LINKED_DATA
}

// This function wraps everything else for now; once we switch to postgres
// it will be removed
preLoadData().then((result)=>{
  const airtable_data = result
  console.log("🟢 App online 🟢")
  console.log("Preloaded data:")
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
    list.push(record.get(fields[0]))
});
  return list
}


const getResults = async(table, types) => {

  const list = []
  try{
  // TODO: add pagination? Check if table will get much bigger
  const records = await base(table).select().all();

  // TODO: Look into inverting this: Look up samples, and then query the machines/assays linked field.
  // Might be simpler/faster?

  records.forEach(function(record) {
    if (record.fields['Required Sample Types']){
      const rField = record.fields['Required Sample Types'];
      const idKeys = types.map(type => airtable_data.tissue_sample_ids_by_name[type])
      if (rField.some(item => idKeys.includes(item))) {
        const sample_names = record.fields['Required Sample Types'].map(r => airtable_data.tissue_sample_names_by_id[r])
        record.tissue_sample_name = sample_names;
        list.push(record)
      }
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
  const tissueType = req.body.tissueType;
  getResults('tblAyos67WFzbHe5C', tissueType).then((result)=>{
      res.send({data: result})
  })
})


  app.listen(port, () => console.log(`Listening on port ${port}`));
})
