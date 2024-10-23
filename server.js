const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const port = 3000;
// Initialize app and middleware


const app = express();

const corsOptions = {
    origin: ['https://capitalhillsdevelopments.com'],  // Replace with your domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
    allowedHeaders: ['Authorization', 'Content-Type'],  // Allowed headers
    credentials: true  // Allow cookies/auth tokens to be sent
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
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
    const city = req.params.cityName;
    const projectData = req.body;

    if (!projectData.name || !projectData.overview) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const cityData = await Unit.findOne({ _id: city });
        if (!cityData) {
            return res.status(404).json({ error: 'City not found' });
        }

        // Check for duplicate project name
        const existingProject = cityData.projects.find(project => project.name === projectData.name);
        if (existingProject) {
            return res.status(409).json({ error: 'Project with this name already exists' });
        }

        // Add the project if it's not a duplicate
        cityData.projects.push(projectData);
        await cityData.save();

        res.status(201).json(cityData);
    } catch (error) {
        console.error('Error adding project:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});


// PUT route to update an existing project
app.put('/units/:cityName/projects/:projectName', async (req, res) => {
    const cityName = req.params.cityName;
    const projectName = req.params.projectName;
    const updatedProjectData = req.body;

    console.log(`Updating project "${projectName}" in city "${cityName}" with data:`, updatedProjectData);

    try {
        // Find the city
        const cityData = await Unit.findOne({ _id: cityName });
        if (!cityData) {
            return res.status(404).json({ error: 'City not found' });
        }

        // Find the specific project within the city
        const projectIndex = cityData.projects.findIndex(project => project.name === projectName);
        if (projectIndex === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Merge the updated data into the existing project data
        Object.assign(cityData.projects[projectIndex], updatedProjectData);

        // Save the updated city data
        await cityData.save();

        res.json(cityData.projects[projectIndex]);  // Return the updated project data
    } catch (error) {
        console.error('Error updating project:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});



// DELETE route to remove a project
app.delete('/units/:cityName/projects/:projectName', async (req, res) => {
    const cityName = req.params.cityName;
    const projectName = req.params.projectName;

    console.log(`Deleting project "${projectName}" from city "${cityName}"`);

    try {
        // Find the city
        const cityData = await Unit.findOne({ _id: cityName });
        if (!cityData) {
            return res.status(404).json({ error: 'City not found' });
        }

        // Find the index of the project to delete
        const projectIndex = cityData.projects.findIndex(project => project.name === projectName);
        if (projectIndex === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Remove the project from the city's projects array
        cityData.projects.splice(projectIndex, 1);

        // Save the updated city data
        await cityData.save();

        res.status(204).send();  // Send a 204 status indicating successful deletion with no content
    } catch (error) {
        console.error('Error deleting project:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});


// Start the server
app.listen(3000, () => {
    console.log('Server is running on https://vps.chd-egypt.com:3000');
});
