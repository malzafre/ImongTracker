const { sendError } = require('../utils/http');

const allowedApplicationStatuses = new Set([
  'Wishlist',
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Rejected',
]);

const applicationAllowedFields = new Set([
  'company',
  'title',
  'status',
  'salary',
  'sourceLink',
  'contactId',
  'contactName',
  'notes',
  'dateApplied',
]);

const contactAllowedFields = new Set([
  'name',
  'role',
  'company',
  'email',
  'phone',
  'notes',
]);

const sanitizeString = (value, maxLength = 500) => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, maxLength);
};

const sanitizeOptionalUrl = (value) => {
  const cleaned = sanitizeString(value, 1000);
  if (!cleaned) {
    return '';
  }

  try {
    const normalized = /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
    const parsed = new URL(normalized);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return cleaned;
  } catch {
    return '';
  }
};

const rejectUnknownFields = (payload, allowedFields, res) => {
  const unknownKeys = Object.keys(payload).filter((key) => !allowedFields.has(key));
  if (unknownKeys.length > 0) {
    sendError(res, 400, `Invalid fields: ${unknownKeys.join(', ')}`);
    return false;
  }

  return true;
};

const sanitizeApplicationPayload = (payload, isCreate = false) => {
  const sanitized = {};

  if ('company' in payload || isCreate) {
    sanitized.company = sanitizeString(payload.company, 120);
  }

  if ('title' in payload || isCreate) {
    sanitized.title = sanitizeString(payload.title, 120);
  }

  if ('status' in payload || isCreate) {
    const status = sanitizeString(payload.status, 32);
    sanitized.status = allowedApplicationStatuses.has(status) ? status : 'Applied';
  }

  if ('salary' in payload || isCreate) {
    sanitized.salary = sanitizeString(payload.salary, 120);
  }

  if ('sourceLink' in payload || isCreate) {
    sanitized.sourceLink = sanitizeOptionalUrl(payload.sourceLink);
  }

  if ('contactId' in payload || isCreate) {
    sanitized.contactId = sanitizeString(payload.contactId, 80);
  }

  if ('contactName' in payload || isCreate) {
    sanitized.contactName = sanitizeString(payload.contactName, 120);
  }

  if ('notes' in payload || isCreate) {
    sanitized.notes = sanitizeString(payload.notes, 3000);
  }

  if ('dateApplied' in payload || isCreate) {
    const incoming = sanitizeString(payload.dateApplied, 80);
    const parsedDate = incoming ? new Date(incoming) : null;
    sanitized.dateApplied = parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toISOString()
      : new Date().toISOString();
  }

  return sanitized;
};

const sanitizeContactPayload = (payload, isCreate = false) => {
  const sanitized = {};

  if ('name' in payload || isCreate) {
    sanitized.name = sanitizeString(payload.name, 120);
  }

  if ('role' in payload || isCreate) {
    sanitized.role = sanitizeString(payload.role, 120);
  }

  if ('company' in payload || isCreate) {
    sanitized.company = sanitizeString(payload.company, 120);
  }

  if ('email' in payload || isCreate) {
    sanitized.email = sanitizeString(payload.email, 180);
  }

  if ('phone' in payload || isCreate) {
    sanitized.phone = sanitizeString(payload.phone, 60);
  }

  if ('notes' in payload || isCreate) {
    sanitized.notes = sanitizeString(payload.notes, 3000);
  }

  return sanitized;
};

const validateApplicationCreate = (req, res, next) => {
  const payload = req.body ?? {};

  if (!rejectUnknownFields(payload, applicationAllowedFields, res)) {
    return;
  }

  const sanitized = sanitizeApplicationPayload(payload, true);
  if (!sanitized.company || !sanitized.title) {
    return sendError(res, 400, 'Company and title are required.');
  }

  req.validatedBody = sanitized;
  return next();
};

const validateApplicationUpdate = (req, res, next) => {
  const payload = req.body ?? {};

  if (Object.keys(payload).length === 0) {
    return sendError(res, 400, 'No update fields provided.');
  }

  if (!rejectUnknownFields(payload, applicationAllowedFields, res)) {
    return;
  }

  const sanitized = sanitizeApplicationPayload(payload, false);
  req.validatedBody = sanitized;
  return next();
};

const validateContactCreate = (req, res, next) => {
  const payload = req.body ?? {};

  if (!rejectUnknownFields(payload, contactAllowedFields, res)) {
    return;
  }

  const sanitized = sanitizeContactPayload(payload, true);
  if (!sanitized.name) {
    return sendError(res, 400, 'Contact name is required.');
  }

  req.validatedBody = sanitized;
  return next();
};

const validateContactUpdate = (req, res, next) => {
  const payload = req.body ?? {};

  if (Object.keys(payload).length === 0) {
    return sendError(res, 400, 'No update fields provided.');
  }

  if (!rejectUnknownFields(payload, contactAllowedFields, res)) {
    return;
  }

  const sanitized = sanitizeContactPayload(payload, false);
  if ('name' in payload && !sanitized.name) {
    return sendError(res, 400, 'Contact name cannot be empty.');
  }

  req.validatedBody = sanitized;
  return next();
};

module.exports = {
  validateApplicationCreate,
  validateApplicationUpdate,
  validateContactCreate,
  validateContactUpdate,
};
