import { Contact } from '../models/contact.js';

export const getAllContacts = async ({ page, perPage }) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const contactQuery = Contact.find();

  const [total, contacts] = await Promise.all([
    Contact.countDocuments(contactQuery),
    Contact.find().skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(total / perPage);

  console.log(total, contacts);
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

export const findContactById = async (id) => {
  return await Contact.findById(id);
};

export const createContact = async (contact) => {
  return await Contact.create(contact);
};

export const deleteContact = async (id) => {
  return Contact.findByIdAndDelete(id);
};

export const updateContact = async (id, payload, options = {}) => {
  const rawResult = await Contact.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  if (!rawResult) {
    return null;
  }

  return {
    contact: rawResult,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
