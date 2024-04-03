/* Returns an array of filtered policies.
   Parameters:
    policyArray: array of policy dicts
    search_term: string, MUST be upper case in order to work. */
const filterPolicies = (
  policyArray,
  search_term
  ) => 
{
  let result = policyArray;

  /* Only filter if there are policies and a search term, otherwise
      just return the policies that were passed in */
  if (policyArray && search_term) {
    result = policyArray.filter( (policyObj) => {
      const re = new RegExp(search_term, "g");
      const formattedDateString = new Date(
        policyObj.effective_date.split('T')[0]
      ).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"});

      /* First see if the search term matches any policy data */
      if (
        re.test(policyObj.statement.toUpperCase()) ||
        re.test(policyObj.question.toUpperCase()) ||
        (typeof policyObj.description === 'string' && re.test(policyObj.description.toUpperCase())) ||
        (formattedDateString && re.test(formattedDateString.toUpperCase()))
        )
      {
        return true;
      } 

      return false;
    });
  }

  return result;
};

export default filterPolicies;