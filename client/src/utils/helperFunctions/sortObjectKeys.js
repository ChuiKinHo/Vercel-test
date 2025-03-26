const sortObjectKeys = (obj, order = "asc") => {
  return Object.keys(obj)
    .sort((a, b) => (order === "asc" ? a.localeCompare(b) : b.localeCompare(a)))
    .reduce((sortedObj, key) => {
      sortedObj[key] = obj[key];
      return sortedObj;
    }, {});
};

export default sortObjectKeys;
