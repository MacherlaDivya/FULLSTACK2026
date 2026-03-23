import asyncHandler from '../utils/asyncHandler.js';
import ContactMessage from '../models/ContactMessage.js';

const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    const error = new Error('All contact fields are required');
    error.statusCode = 400;
    throw error;
  }

  const contact = await ContactMessage.create({ name, email, subject, message });

  res.status(201).json({
    success: true,
    data: contact,
  });
});

const getContactMessages = asyncHandler(async (_req, res) => {
  const contacts = await ContactMessage.find().sort({ createdAt: -1 }).lean();

  res.json({
    success: true,
    data: contacts,
  });
});

const updateContactStatus = asyncHandler(async (req, res) => {
  const contact = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!contact) {
    const error = new Error('Contact message not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    data: contact,
  });
});

export { createContactMessage, getContactMessages, updateContactStatus };
