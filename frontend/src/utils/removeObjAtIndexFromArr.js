/* Removes a dict object from an array based on the index of the object.
   Inputs:
     index: integer
     arr: array of dicts
    Output: either the original array or a new array minus the removed object
*/
const removeObjAtIndexFromArr = (
  index,
  arr,
  setFrontEndErrors
) => 
{
  let result = arr;

  try {
    const parsedIndex = parseInt(index);

    if (parsedIndex >= 0 && Array.isArray(arr)) {
      result = [];
      
      for (let i = 0; i < arr.length; i++) {
        if (i !== parsedIndex) {
          result.push(arr[i]);
        }
      }
    }
  } catch (error) {
    setFrontEndErrors({Error: JSON.stringify(error)});
  }

  return result;
}

export default removeObjAtIndexFromArr;