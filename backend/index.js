const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { db } = require('./firebaseAdmin');
const verifyToken = require('./middleware/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main Applications router
const applicationsRouter = express.Router();

// 1. Enforce authentication on all application routes
applicationsRouter.use(verifyToken);

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
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. POST a new application
applicationsRouter.post('/', async (req, res) => {
  try {
    const newApplication = {
      ...req.body,
      userId: req.user.uid,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('applications').add(newApplication);
    res.status(201).json({ id: docRef.id, ...newApplication });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. PUT update an application
applicationsRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('applications').doc(id);
    
    // Safety check: ensure user owns this doc
    const doc = await docRef.get();
    if (!doc.exists || doc.data().userId !== req.user.uid) {
      return res.status(403).json({ error: 'Forbidden. You do not own this application.' });
    }

    await docRef.update(req.body);
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      return res.status(403).json({ error: 'Forbidden' });
    }

    await docRef.delete();
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/applications', applicationsRouter);

app.listen(PORT, () => {
  console.log(`JobTracker Backend running connected to Firebase on port ${PORT}`);
});
