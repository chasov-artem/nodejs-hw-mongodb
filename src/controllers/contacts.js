import {
  getAllContacts,
  findContactById,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const getContactsCtrl = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

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
};

export const getContactByIdCtrl = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const contact = await findContactById(id, userId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).send({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
};

export const createContactCtrl = async (req, res) => {
  let photo = null;

  if (typeof req.file !== 'undefined') {
    if (process.env.ENABLE_CLOUDINARY === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);

      photo = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src', 'public', 'photos', req.file.filename),
      );

      photo = `http://localhost:3000/photos/${req.file.filename}`;
    }
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
  const result = await createContact(contact);

  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: result,
  });
};

export const deleteContactCtrl = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const result = await deleteContact(id, userId);
  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};

export const updateContactCtrl = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  let updatedData = { ...req.body };

  if (typeof req.file !== 'undefined') {
    let photo;

    if (process.env.ENABLE_CLOUDINARY === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);

      photo = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src', 'public', 'photos', req.file.filename),
      );

      photo = `http://localhost:3000/photos/${req.file.filename}`;
    }

    updatedData.photo = photo;
  }

  const result = await updateContact(id, updatedData, userId);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated a contact!',
    data: result.contact,
  });
};
