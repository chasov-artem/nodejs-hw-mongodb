const parseSortBy = (value) => {
  if (typeof value !== 'string') {
    return '_id';
  }
  const keys = ['_id', 'name', 'phoneNumber', 'createdAt', 'updatedAt'];
  if (keys.includes(value) !== true) {
    return '_id';
  }
  return value;
};

const parseSortOrder = (value) => {
  if (typeof value !== 'string') {
    return 'asc';
  }
  if (['asc', 'desc'].includes(value) !== true) {
    return 'asc';
  }
  return value;
};

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
