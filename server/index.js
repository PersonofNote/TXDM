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
  LINKED_DATA.providers = {}

  const tissue_sample_table = 'tbliGPwuWUq0KnIH4'
  const tissue_records = await base(tissue_sample_table).select().all();
  const providers_table = 'tbl8atXH48SRFZVBv'

  tissue_records.forEach(function(record) {
    id = record.id
    field_name = record.get('Tissue')
    LINKED_DATA.tissue_sample_names_by_id[id] = field_name
    LINKED_DATA.tissue_sample_ids_by_name[field_name] = id
});

  provider_records = await base(providers_table).select().all();
  provider_records.forEach(record => {
    id = record.id
    provider_name = record.get('Name')
    logo = record.get('DX co Logo')
    url = record.get('Website')
    LINKED_DATA.providers[id] = {
      "name": provider_name,
      "logo": logo,
      "url": url
    }
  })

  return LINKED_DATA
}

// This function wraps everything else for now; once we switch to postgres
// it will be removed
preLoadData().then((result)=>{
  const airtable_data = result
  console.log("🟢 App online 🟢")
  console.log("Preloaded data:")
  console.log(airtable_data)

    /* 
    Function looks at Data Type table and filters by required sample type
    This table doesn't use a linked record, which could require another join - leave the prefectched ids and names
    for use with this function
  */
  
const getDataTypeBySampleType = async(table, types) => {
  const list = []
  try{
  // TODO: add pagination? Check if table will get much bigger, but I think it is a fixed length
  const records = await base(table).select().all();

  records.forEach(function(record) {
    if (record.fields['Sample Type']){
      let rField = record.fields['Sample Type']
      if (typeof(rField) === 'string') {
        rField = rField.split(",")
      }
      if (rField.some(item => types.includes(item))) {
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
  /*
  getResults('tblAyos67WFzbHe5C', tissueType).then((result)=>{
      res.send({data: result})
  })
  */
 getDataTypeBySampleType('tbl9mBFgW23Si1zEp', tissueType).then((result) => {
  res.send({data:result})
 })
})


  app.listen(port, () => console.log(`Listening on port ${port}`));
})
