import { getAllContacts } from '../services/contacts';

export const getContacts = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contact!',
      data: contacts,
    });
  } catch {
    res.status(500).json({ message: 'Failed to retrieve contacts.' });
  }
};
