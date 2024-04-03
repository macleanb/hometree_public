/* Takes in an array of dicts and enters each array element
   into a dict using a provided key from each dict in the 
   original array
   Inputs:
      arr: an array of dicts containing id field (integer)
      keyName: a string that should be a key in all input array elements as a key, 
               (i.e. 'id') that will reference a value (i.e. '12345').  This value 
               will become the key in the result dict.
    Outputs:
      result: a dict whose values are all the elements in the input array
*/
const convertArrayToDict = (arr, keyName, fieldName) => {
  if (arr && Array.isArray(arr)) {
    const result = {}
    for (const elem of arr) {
      if (fieldName) {
        const key = elem[fieldName][keyName];
        result[key] = elem;
      } else if (elem[keyName]) {
        const key = elem[keyName];
        result[key] = elem;
      }
    }
    return result;
  }
  return null;
}

export default convertArrayToDict;