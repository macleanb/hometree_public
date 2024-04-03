/* Determines whether an object with a given ID exists in an array
   Inputs: 
      arr: an array of dicts containing id fields (integers)
      ID: an integer representing an ID
    Outputs:
      boolean
*/
const arrHasElementID = (arr, ID) => {
  if (Array.isArray(arr) && Number.isInteger(ID)) {
    for (const elem of arr) {
      if (elem?.id) {
        if (elem.id === ID) {
          return true;
        }
      }
    }
  }

  return false;
};

export default arrHasElementID;