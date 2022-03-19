function getSQLValuesArray(array, dataType) {
  if(!array || array && array.length === 0)
    return '{}';
  if(array && array.length > 0) {
    let sqlString = '{';
    array.forEach((element,index) => {
      if(dataType === 'INTEGER') {
        sqlString += `${element}${index !== (array.length-1) ? ',' : ''}`;
      } else {
        sqlString += `'${element}'${index !== (array.length-1) ? ',' : ''}`;
      }
    });
    sqlString += '}';
    return sqlString;
  }
};

function sanitizeString(stringValue) {
  if(stringValue && typeof stringValue === 'string') {
    return stringValue.replace(/’/g, "''");
  }
  return stringValue;
}

module.exports = {
  getSQLValuesArray,
  sanitizeString
};