/* Counts up the frequences of all elements or element properties
   specified by fieldName, or sub-properties specified by
   subFieldName.  It also keeps track of the most frequent
   key in '_maxKey' and any elements with that maximum frequency
   of occurrences (could be more than one).  Same for minimum
   frequency.  Returns undefined if arr is undefined or null
   Inputs:
     arr: array of atomic values or dict objects
     fieldName: the first-level field name to reference within array objects
     subFieldName: the second-level field name to reference within array objects
     ignore: an array of values to not count
   Outputs:
     result: a dict object containing key-value pairs corresponding
             to unique element occurrences (as keys) and the frequency
             of those occurrences (as values).  The element(s) with the
             most occurrences are stored in an array (key '_maxKeyArr')
             while the element(s) with the least occurrences are stored
             in an arrat (key '_minKeyArr') */
const frequencyCounter = (arr, fieldName=null, subFieldName=null, ignore=null) => {
  if (Array.isArray(arr)) {
    let occurrence;
    const result = {};
    result['_maxFreq'] = 0;
    result['_minFreq'] = Number.MAX_SAFE_INTEGER;
    result['_maxKeyArr'] = [];
    result['_minKeyArr'] = [];
    result['_totalCount'] = 0;

    for (const elem of arr) {
      if(fieldName) {
        if(subFieldName) {
          occurrence = elem[fieldName][subFieldName];
        } else {
          occurrence = elem[fieldName];
        }
      } else {
        occurrence = elem;
      }

      /* See if we should ignore this occurrence */
      if (Array.isArray(ignore) && ignore.includes(occurrence)) {
        continue;
      }

      if (occurrence in result) {
        result[occurrence]++;
      } else {
        result[occurrence] = 1;
      }

      if (result[occurrence] > result['_maxFreq']) {
        result['_maxFreq'] = result[occurrence];
        result['_maxKeyArr'] = [occurrence];
      } else if (result[occurrence] === result['_maxFreq']) {
        result['_maxKeyArr'].push(occurrence);
      }

      /* If the occurrence is already in the array of minKeys,
         do one of two things.  If it's the only element, then
         leave it and just increment the minFreq.  If there
         are other minKeys besides this occurrence, remove
         this occurrence from the array. */
      if (result['_minKeyArr'].includes(occurrence)) {
        if (result['_minKeyArr'].length === 1) {
          result['_minFreq']++;
        } else {
          // Remove the occurrence from the min array because others have a lower freq
          const tempMinArr = [];
          for (const elem of result['_minKeyArr']) {
            if (elem !== occurrence) {
              tempMinArr.push(elem);
            }
          }
          result['_minKeyArr'] = tempMinArr;
        }
      } else {
        /* This occurrence is not in the minKeys array.  If the 
           minKeys array is empty, add it.  If not, see if the
           frequency is higher than existing (ignore), equal
           to existing (add, but don't change minFreq), or lower
           than the existing (replace array and reset freq) */
        if (result[occurrence] === result['_minFreq']) {
          result['_minKeyArr'].push(occurrence);
        } else if (result[occurrence] < result['_minFreq']) {
          result['_minKeyArr'] = [occurrence];
          result['_minFreq'] = result[occurrence];
        }
      }

      result['_totalCount']++;
    }

    return result;
  }
};

export default frequencyCounter;