import path from 'node:path';
import * as fs from 'node:fs/promises';
import createHttpError from 'http-errors';
import {
  getAllContacts,
  findContactById,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const getContactsCtrl = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  try {
    const {
      data,
      page: currentPage,
      perPage: itemsPerPage,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    } = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId: req.user.id,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data,
        page: currentPage,
        perPage: itemsPerPage,
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage,
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).send({
      status: 500,
      message: 'Error fetching contacts',
    });
  }
};

export const getContactByIdCtrl = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const contact = await findContactById(id, userId);
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).send({
      status: 200,
      message: `Successfully found contact with id ${id}!`,
      data: contact,
    });
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
    res.status(error.status || 500).send({
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    });
  }
};

export const createContactCtrl = async (req, res) => {
  try {
    console.log('Incoming request body:', req.body);
    console.log('Incoming file data:', req.file);
    console.log('ENABLE_CLOUDINARY:', process.env.ENABLE_CLOUDINARY);

    let photo = null;

    if (req.file) {
      if (process.env.ENABLE_CLOUDINARY === 'true') {
        console.log('Uploading file to Cloudinary...');
        try {
          const result = await uploadToCloudinary(req.file.path);
          console.log('Cloudinary upload result:', result);
          await fs.unlink(req.file.path); // Видалення тимчасового файлу.
          photo = result.secure_url;
        } catch (cloudError) {
          console.error('Error uploading to Cloudinary:', cloudError.message);
          throw cloudError; // Перевірка, якщо завантаження на Cloudinary не вдалося.
        }
      } else {
        console.log('Saving file locally...');
        const destinationPath = path.resolve(
          'src',
          'public',
          'photos',
          req.file.filename,
        );
        console.log('Local file destination path:', destinationPath);

        try {
          await fs.mkdir(path.dirname(destinationPath), { recursive: true });
          await fs.rename(req.file.path, destinationPath);
          photo = `http://localhost:3000/photos/${req.file.filename}`;
        } catch (fsError) {
          console.error('Error saving file locally:', fsError.message);
          throw fsError; // Перевірка проблем з файловою системою.
        }
      }
    } else {
      console.warn('No file attached to the request.');
    }

    const contact = {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      isFavourite: req.body.isFavourite,
      contactType: req.body.contactType,
      userId: req.user.id,
      photo,
    };

    console.log('Creating contact with data:', contact);

    const result = await createContact(contact);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: result,
    });
  } catch (error) {
    console.error('Error in createContactCtrl:', error.message);
    res.status(500).json({
      status: 500,
      message: 'Error creating contact',
    });
  }
};

export const deleteContactCtrl = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await deleteContact(id, userId);
    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(error.status || 500).send({
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    });
  }
};

export const updateContactCtrl = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  let photo = null;

  try {
    if (req.file) {
      if (process.env.ENABLE_CLOUDINARY === 'true') {
        const result = await uploadToCloudinary(req.file.path);
        await fs.unlink(req.file.path);
        photo = result.secure_url;
      } else {
        const destinationPath = path.resolve(
          'src',
          'public',
          'photos',
          req.file.filename,
        );
        await fs.rename(req.file.path, destinationPath);
        photo = `http://localhost:3000/photos/${req.file.filename}`;
      }
    }

    const updatedData = {
      ...req.body,
      photo,
    };

    const result = await updateContact(id, updatedData, userId);

    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated the contact!',
      data: result.contact,
    });
  } catch (error) {
    console.error('Error updating contact:', error.message);
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || 'Error updating contact',
    });
  }
};
