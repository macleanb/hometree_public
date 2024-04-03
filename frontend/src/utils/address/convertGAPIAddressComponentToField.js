const convertGAPIAddressComponentToField = (addrComponent) => {
    if (addrComponent && typeof addrComponent === 'string') {
      switch (addrComponent) {
        case 'premise':
          return 'street';
        case 'subpremise':
          return 'street_2';
        case 'street_number':
          return 'street';
        case 'route':
          return 'street';
        case 'locality':
          return 'city';
        case 'administrative_area_level_1':
          return 'addr_state';
        case 'postal_code':
          return 'zipcode';
        default:
          return '';
      }
    }
  };
  
  export default convertGAPIAddressComponentToField;