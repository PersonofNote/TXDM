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
  
  
export const getResultsByMachine = async(table, types) => {
  
    const list = []
    try{
    // TODO: add pagination? Check if table will get much bigger
    const records = await base(table).select().all();
  
  /*
      Function looks up records in the Machine/Assays table by required sample type
      TODO: standardize column names for postgres migration
  */
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
  
  /* 
    Function looks at Data Type table and filters by required sample type
    This table doesn't use a linked record, which could require another join - leave the prefectched ids and names
    for use with this function
  */
  
export const getDataTypeBySampleType = async(table, types) => {
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
    console.log(list)
    return list
  }catch(error){
    console.log(error)
    return error
  }
  }