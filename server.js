const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const port = 3000;

// Initialize app and middleware
const app = express();

const corsOptions = {
    origin: 'https://capitalhillsdevelopments.com', // Replace with your domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Origin, Content-Type, Accept, Authorization'], // Allowed headers
    credentials: true, // Allow cookies/auth tokens to be sent
};

// Use CORS middleware
app.use(cors(corsOptions));

app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://capitalhillsdevelopments.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
    res.sendStatus(204); // No Content
});

// Body parser middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

mongoose.connect('mongodb://admin:CHDahmed135@37.148.206.181:27017/capital?authSource=admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define schemas for English and Arabic translations
const translationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true }
});

// Define models for English and Arabic collections
const EnglishTranslation = mongoose.model('EnglishTranslation', translationSchema, 'english_translations');
const ArabicTranslation = mongoose.model('ArabicTranslation', translationSchema, 'arabic_translations');

// API route to fetch translations by language
app.get('/translations/:lang', async (req, res) => {
    const lang = req.params.lang;
    let TranslationModel;

    // Select the appropriate collection based on language
    if (lang === 'en') {
        TranslationModel = EnglishTranslation;
    } else if (lang === 'ar') {
        TranslationModel = ArabicTranslation;
    } else {
        return res.status(400).json({ error: 'Invalid language' });
    }

    try {
        // Fetch all translations from the collection
        const translations = await TranslationModel.find({});
        
        // Convert the translations to a key-value pair object
        const translationObject = {};
        translations.forEach(translation => {
            translationObject[translation.name] = translation.value;
        });

        res.json(translationObject);
    } catch (error) {
        console.error('Error fetching translations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define your schema and model for the 'units' collection
const unitSchema = new mongoose.Schema({
    _id: { type: String, required: true },  // The city ID (e.g., 'new-cairo')
    name: { type: String, required: true },
    image: { type: String, required: true }, // City name (e.g., 'New Cairo')
    projects: [
        {
            name: { type: String, required: true },
            overview: { type: String, required: true },
            masterplan: { type: String, required: true },
            units: [
                {
                    id: { type: Number, required: true },
                    type: { type: String, required: true },
                    rooms: { type: Number, required: true },
                    area: { type: Number, required: true },
                    image: { type: String, required: true },
                    modal1:{ type: String, required: true },
                    modal2:{ type: String, required: true },
                    modal3:{ type: String, required: true },
                    name: { type: String, required: true },
                    details: { type: String, required: true }
                }
            ],
            amenities: { type: String, required: true },
            construction: { type: String, required: true },
            brochure: { type: String, required: true }
        }
    ]
});

const Unit = mongoose.model('Unit', unitSchema); // Using the 'units' collection

// POST route to add a new unit
app.post('/units/:cityName/projects/:projectName/units', async (req, res) => {
    const { cityName, projectName } = req.params;
    const newUnit = req.body;

    try {
        const cityData = await Unit.findOne({ _id: cityName }).exec();
        if (!cityData) {
            return res.status(404).json({ error: `City ${cityName} not found` });
        }

        const project = cityData.projects.find(project => project.name === projectName);
        if (!project) {
            return res.status(404).json({ error: `Project ${projectName} not found in ${cityName}` });
        }

        // Add the new unit to the project
        project.units.push(newUnit);
        await cityData.save();

        res.status(201).json({ message: 'Unit added successfully', unit: newUnit });
    } catch (error) {
        console.error('Error adding new unit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT route to update an existing unit
app.put('/units/:cityName/projects/:projectName/units/:unitId', async (req, res) => {
    const { cityName, projectName, unitId } = req.params;
    const updatedUnitData = req.body;

    try {
        const cityData = await Unit.findOne({ _id: cityName }).exec();
        if (!cityData) {
            return res.status(404).json({ error: `City ${cityName} not found` });
        }

        const project = cityData.projects.find(project => project.name === projectName);
        if (!project) {
            return res.status(404).json({ error: `Project ${projectName} not found in ${cityName}` });
        }

        const unit = project.units.find(unit => unit.id === parseInt(unitId)); // Ensure unitId is an integer
        if (!unit) {
            return res.status(404).json({ error: `Unit with ID ${unitId} not found in project ${projectName}` });
        }

        // Update the unit with new data
        Object.assign(unit, updatedUnitData);
        await cityData.save();

        res.status(200).json({ message: 'Unit updated successfully', unit });
    } catch (error) {
        console.error('Error updating unit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE route to remove a unit
app.delete('/units/:cityName/projects/:projectName/units/:unitId', async (req, res) => {
    const { cityName, projectName, unitId } = req.params;

    try {
        const cityData = await Unit.findOne({ _id: cityName }).exec();
        if (!cityData) {
            return res.status(404).json({ error: `City ${cityName} not found` });
        }

        const project = cityData.projects.find(project => project.name === projectName);
        if (!project) {
            return res.status(404).json({ error: `Project ${projectName} not found in ${cityName}` });
        }

        const unitIndex = project.units.findIndex(unit => unit.id === parseInt(unitId)); // Ensure unitId is an integer
        if (unitIndex === -1) {
            return res.status(404).json({ error: `Unit with ID ${unitId} not found in project ${projectName}` });
        }

        // Remove the unit from the units array
        project.units.splice(unitIndex, 1);
        await cityData.save();

        res.status(200).json({ message: 'Unit deleted successfully' });
    } catch (error) {
        console.error('Error deleting unit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
