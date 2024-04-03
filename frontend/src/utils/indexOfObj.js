/* Returns an object's index in an array, or -1 if it doesn't exist
   Inputs: 
      arr: an array of dicts containing id field (integer, string)
      objID: an integer representing an object ID
    Outputs:
      index: integer
*/
export const indexOfObj = (objID, arr) => {
    if (Array.isArray(arr) && objID) {
      for (const index in arr) {
        if (arr[index]?.id) {
          if (arr[index].id === objID) {
            return index;
          }
        }
      }
    }
  
   return -1;
}

export default indexOfObj;