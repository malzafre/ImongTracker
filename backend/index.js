const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { db } = require('./firebaseAdmin');
const verifyToken = require('./middleware/auth');
const {
  validateApplicationCreate,
  validateApplicationUpdate,
  validateContactCreate,
  validateContactUpdate,
} = require('./middleware/validation');
const { sendError } = require('./utils/http');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

const maxRequestsPerWindow = Number(process.env.RATE_LIMIT_MAX || 120);
const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(rateLimit({
  windowMs: rateLimitWindowMs,
  max: maxRequestsPerWindow,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again shortly.' },
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.get('/api/health', (_, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Main Applications router
const applicationsRouter = express.Router();
const contactsRouter = express.Router();

// 1. Enforce authentication on all application routes
applicationsRouter.use(verifyToken);
contactsRouter.use(verifyToken);

// 2. GET all applications assigned to the logged-in user
applicationsRouter.get('/', async (req, res) => {
  try {
    // Note: If you don't have a composite index in Firestore for userId + dateApplied, 
    // the orderBy('dateApplied', 'desc') might fail initially. Keep an eye on console logs 
    // as it will provide a link to generate the index.
    const snapshot = await db.collection('applications')
      .where('userId', '==', req.user.uid)
      // .orderBy('dateApplied', 'desc') 
      .get();
    
    const applications = [];
    snapshot.forEach(doc => {
      applications.push({ id: doc.id, ...doc.data() });
    });

    applications.sort((a, b) => {
      const aDate = a.dateApplied ? new Date(a.dateApplied).getTime() : 0;
      const bDate = b.dateApplied ? new Date(b.dateApplied).getTime() : 0;
      return bDate - aDate;
    });
    
    res.json(applications);
  } catch (error) {
    return sendError(res, 500, 'Failed to fetch applications.');
  }
});

// 3. POST a new application
applicationsRouter.post('/', validateApplicationCreate, async (req, res) => {
  try {
    const newApplication = {
      ...req.validatedBody,
      userId: req.user.uid,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('applications').add(newApplication);
    res.status(201).json({ id: docRef.id, ...newApplication });
  } catch (error) {
    return sendError(res, 500, 'Failed to create application.');
  }
});

// 4. PUT update an application
applicationsRouter.put('/:id', validateApplicationUpdate, async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('applications').doc(id);
    
    // Safety check: ensure user owns this doc
    const doc = await docRef.get();
    if (!doc.exists || doc.data().userId !== req.user.uid) {
      return sendError(res, 403, 'Forbidden. You do not own this application.');
    }

    await docRef.update(req.validatedBody);
    res.json({ id, ...req.validatedBody });
  } catch (error) {
    return sendError(res, 500, 'Failed to update application.');
  }
});

// 5. DELETE an application
applicationsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('applications').doc(id);
    
    // Safety check
    const doc = await docRef.get();
    if (!doc.exists || doc.data().userId !== req.user.uid) {
      return sendError(res, 403, 'Forbidden');
    }

    await docRef.delete();
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    return sendError(res, 500, 'Failed to delete application.');
  }
});

app.use('/api/applications', applicationsRouter);

// Contacts router
contactsRouter.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('contacts')
      .where('userId', '==', req.user.uid)
      .get();

    const contacts = [];
    snapshot.forEach((doc) => {
      contacts.push({ id: doc.id, ...doc.data() });
    });

    contacts.sort((a, b) => {
      const aName = `${a.name ?? ''}`.toLowerCase();
      const bName = `${b.name ?? ''}`.toLowerCase();
      return aName.localeCompare(bName);
    });

    res.json(contacts);
  } catch (error) {
    return sendError(res, 500, 'Failed to fetch contacts.');
  }
});

contactsRouter.post('/', validateContactCreate, async (req, res) => {
  try {
    const newContact = {
      ...req.validatedBody,
      userId: req.user.uid,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('contacts').add(newContact);
    res.status(201).json({ id: docRef.id, ...newContact });
  } catch (error) {
    return sendError(res, 500, 'Failed to create contact.');
  }
});

contactsRouter.put('/:id', validateContactUpdate, async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('contacts').doc(id);
    const doc = await docRef.get();

    if (!doc.exists || doc.data().userId !== req.user.uid) {
      return sendError(res, 403, 'Forbidden. You do not own this contact.');
    }

    await docRef.update(req.validatedBody);
    res.json({ id, ...req.validatedBody });
  } catch (error) {
    return sendError(res, 500, 'Failed to update contact.');
  }
});

contactsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('contacts').doc(id);
    const doc = await docRef.get();

    if (!doc.exists || doc.data().userId !== req.user.uid) {
      return sendError(res, 403, 'Forbidden');
    }

    await docRef.delete();
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    return sendError(res, 500, 'Failed to delete contact.');
  }
});

app.use('/api/contacts', contactsRouter);

app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return sendError(res, 403, 'Origin not allowed by CORS policy.');
  }

  console.error(err);
  return sendError(res, 500, 'Unexpected server error.');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ImongCareer backend running on port ${PORT}`);
  });
}

module.exports = app;
