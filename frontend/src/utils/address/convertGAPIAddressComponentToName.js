const convertGAPIAddressComponentToName = (addrComponent) => {
  if (addrComponent && typeof addrComponent === 'string') {
    switch (addrComponent) {
      case 'premise':
        return 'Street';
      case 'subpremise':
        return 'Street (2)';
      case 'street_number':
        return 'Street';
      case 'route':
        return 'Street';
      case 'locality':
        return 'City';
      case 'administrative_area_level_1':
        return 'State';
      case 'postal_code':
        return 'Zipcode';
      case 'postal_code_suffix':
        return 'Zipcode suffix ("-XXXX")';
      default:
        return '';
    }
  }
};

export default convertGAPIAddressComponentToName;