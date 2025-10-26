const FilterObject = (obj: Record<string, any>): Record<string, any> => {
  const filteredObj: Record<string, any> = {};

  Object.entries(obj).forEach(([key, value]) => {		
		if (value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)) {
      if (typeof value === 'boolean') {
        value = value.toString(); // Convert boolean to string as it ignored
      }

      if (key.endsWith('Operator')) {
        const baseKey = key.slice(0, -8); // Remove 'Operator' suffix
        if (obj[baseKey] !== undefined && obj[baseKey] !== ''){
          filteredObj[key] = value;
        }
      } else {
        filteredObj[key] = value;
      }
    }
  });
	console.log(filteredObj);
  return filteredObj;
};

export default FilterObject;
