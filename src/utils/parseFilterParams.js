const parseContactType = (value) => {
  if (typeof value !== 'string') {
    return 'personal';
  }
  if (['work', 'home', 'personal'].includes(value) !== true) {
    return 'personal';
  }
  return value;
};

const parseIsFavourite = (value) => {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return undefined;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
