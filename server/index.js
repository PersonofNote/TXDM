const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv').config()
const Airtable = require('airtable');

// ENV VARIABLES
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const app = express();
const port = process.env.PORT || 5000;

const passList = {
  origin: 'http://localhost:3000'
}

app.use(cors(passList))

app.listen(port, () => console.log(`Listening on port ${port}`));

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: AIRTABLE_API_KEY
});
const base = Airtable.base(AIRTABLE_BASE_ID);

const printTable = (table, fields) => {
  base(table).select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 3,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
        // TODO: Filter by supplied fields
        console.log('Retrieved', record.get(fields[0]));
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
});
}



app.get('/api', (req, res) => { 
  res.send({ msg: 'API is functioning' });
});

app.get('/users', (req, res) => {
 const usersList = printTable('DX Users', ["Full Name"])
 res.send({data: usersList})
})