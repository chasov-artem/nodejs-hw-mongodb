import { Contact } from '../models/contact.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const query = { userId, ...filter };

  const [total, contacts] = await Promise.all([
    Contact.countDocuments(query),
    Contact.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
    page: page,
    perPage: perPage,
    totalItems: total,
    totalPages: totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages - page > 0,
  };
};

export const findContactById = async (id, userId) => {
  return Contact.findOne({ _id: id, userId });
};

export const createContact = async (contact) => {
  return await Contact.create(contact);
};

export const deleteContact = async (id, userId) => {
  return Contact.findOneAndDelete({ _id: id, userId });
};

export const updateContact = async (id, payload, userId) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: id, userId },
    payload,
    { new: true },
  );

  if (!rawResult) {
    return null;
  }

  return {
    contact: rawResult,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
