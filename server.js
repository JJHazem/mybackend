const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const port = 3000;
// Initialize app and middleware

const app = express();

const corsOptions = {
    origin: 'https://capitalhillsdevelopments.com', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
// Body parser middleware
app.use(express.json()); // For parsing application/json


mongoose.connect('mongodb://hazem:CHDahmed135@37.148.206.181:27017/capital', {
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

// Route to get data for a specific project within a city
app.get('/units/:cityName/projects/:projectName', async (req, res) => {
    const { cityName, projectName } = req.params;
    console.log('Received city name:', cityName);
    console.log('Received project name:', projectName);
    
    try {
        const cityData = await Unit.findOne({ _id: cityName }).exec();
        if (!cityData) {
            console.log('No city data found for:', cityName);
            return res.json(null);  // Return null if no data is found
        }

        // Find the specific project by its name
        const projectData = cityData.projects.find(project => project.name === projectName);
        
        if (!projectData) {
            console.log(`No project data found for: ${projectName} in ${cityName}`);
            return res.json(null);
        }

        console.log('Project data fetched:', projectData);
        res.json(projectData);  // Send the specific project data
    } catch (error) {
        console.error('Error fetching city or project data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get data for a specific city by its name (or _id)
app.get('/units/:cityName', async (req, res) => {
    const cityName = req.params.cityName;
    try {
        const cityData = await Unit.findOne({ _id: cityName }).exec();
        console.log(cityData); // Log the data to check if it includes the units
        res.json(cityData);
    } catch (error) {
        console.error('Error fetching city data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/units/:cityName/projects', async (req, res) => {
    const { cityName } = req.params;
    const newProjectData = req.body;

    try {
        const cityData = await Unit.findOne({ _id: cityName });
        if (!cityData) return res.status(404).json({ error: `City ${cityName} not found` });

        const projectExists = cityData.projects.some(project => project.name === newProjectData.name);
        if (projectExists) return res.status(400).json({ error: `Project ${newProjectData.name} already exists` });

        cityData.projects.push(newProjectData);
        await cityData.save();

        res.status(201).json({ message: 'Project added successfully', project: newProjectData });
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// PUT route to update an existing project
app.put('/units/:cityName/projects/:projectName', async (req, res) => {
    const { cityName, projectName } = req.params;
    const updatedProjectData = req.body;

    try {
        const cityData = await Unit.findOne({ _id: cityName });
        if (!cityData) return res.status(404).json({ error: `City ${cityName} not found` });

        const project = cityData.projects.find(project => project.name === projectName);
        if (!project) return res.status(404).json({ error: `Project ${projectName} not found` });

        Object.assign(project, updatedProjectData);
        await cityData.save();

        res.status(200).json({ message: 'Project updated successfully', project });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





// DELETE route to remove a project
app.delete('/units/:cityName/projects/:projectName', async (req, res) => {
    const { cityName, projectName } = req.params;

    try {
        const cityData = await Unit.findOne({ _id: cityName });
        if (!cityData) return res.status(404).json({ error: `City ${cityName} not found` });

        const projectIndex = cityData.projects.findIndex(project => project.name === projectName);
        if (projectIndex === -1) return res.status(404).json({ error: `Project ${projectName} not found` });

        cityData.projects.splice(projectIndex, 1);
        await cityData.save();

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// Start the server
app.listen(3000, () => {
    console.log('Server is running on https://vps.chd-egypt.com:3000');
});
