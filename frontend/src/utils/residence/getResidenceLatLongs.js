const getResidenceLatLongs = async (allResidenceDataArr) => {
  const result = [];
  if (Array.isArray(allResidenceDataArr) && allResidenceDataArr.length > 0) {
    for (const residence of allResidenceDataArr) {
      /* Insert GAPI-validated geolocs for each residence */
      result.push({ 
        street: residence.street,
        lat: residence.lat,
        lng: residence.lng
      });
    }
  }

  return result;
};

export default getResidenceLatLongs;