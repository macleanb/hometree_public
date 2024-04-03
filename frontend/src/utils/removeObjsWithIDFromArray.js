/* Removes a dict object from an array based on the id of the object.
   Inputs:
     objID: integer
     arr: array of dicts
    Output: either null or a new array minus the removed object
*/
const removeObjsWithIDFromArray = (objID, arr) => {
  let result = arr;
  if (objID && arr && Array.isArray(arr)) {
    result = [];
    
    for (const dict of arr) {
      if (dict.id !== objID) {
        result.push({...dict});
      }
    }
  }
  return result;
}

export default removeObjsWithIDFromArray;