import { getAllContacts, findContactById } from '../services/contacts.js';

export const getContacts = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch {
    res.status(500).json({ message: 'Failed to retrieve contacts.' });
  }
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  try {
    const contact = await findContactById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully found contact with id {contactId}!',
      data: contact,
    });
  } catch {
    res.status(500).json({ message: 'Failed to retrieve contact' });
  }
};
