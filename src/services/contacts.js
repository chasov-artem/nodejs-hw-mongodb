import { Contact } from '../models/contact.js';

export const getAllContacts = async () => {
  return await Contact.find();
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

  if (!rawResult) return null;

  return {
    contact: rawResult,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
