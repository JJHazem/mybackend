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


app.post('/units/:city/projects', async (req, res) => {
    try {
        const city = req.params.city;
        const projectData = JSON.parse(req.body.projectData); // Assuming project data is sent as JSON
        projectData.city = city;

        // Set the main image if it exists
        if (req.file) {
            projectData.mainImage = req.file.originalname;
        }

        // Update the city's projects array
        const cityUpdate = await Unit.findOneAndUpdate(
            { _id: city },
            { $push: { projects: projectData } },
            { new: true, useFindAndModify: false } // Return the updated document
        );

        if (!cityUpdate) {
            return res.status(404).json({ error: 'City not found' });
        }

        res.status(201).json(cityUpdate); // Return the updated city with the new project
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update an existing project
app.put('/units/:city/projects/:projectName', async (req, res) => {
    const city = req.params.city;
    const projectName = req.params.projectName;
    const projectData = JSON.parse(req.body.projectData); // Assuming project data is sent as JSON

    try {
        const cityData = await Unit.findOne({ _id: city });

        if (!cityData) {
            return res.status(404).json({ error: 'City not found' });
        }

        const projectIndex = cityData.projects.findIndex(project => project.name === projectName);
        if (projectIndex === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Update the project fields
        const project = cityData.projects[projectIndex];
        project.name = projectData.name || project.name;
        project.overview = projectData.overview || project.overview;
        project.masterplan = projectData.masterplan || project.masterplan;

        // Update main image if a new one is provided
        if (req.file) {
            project.mainImage = req.file.originalname;
        }

        // Update units if they exist in projectData
        if (projectData.units) {
            project.units = projectData.units.map((unit, index) => ({
                ...unit,
                id: index + 1 // Ensure unique IDs or handle as necessary
            }));
        }

        await cityData.save();
        res.json(cityData); // Return updated city data with modified project
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a project
app.delete('/units/:city/projects/:projectName', async (req, res) => {
    const city = req.params.city;
    const projectName = req.params.projectName;

    try {
        const cityData = await Unit.findOne({ _id: city });

        if (!cityData) {
            return res.status(404).json({ error: 'City not found' });
        }

        const projectIndex = cityData.projects.findIndex(project => project.name === projectName);
        if (projectIndex === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }

        cityData.projects.splice(projectIndex, 1); // Remove the project
        await cityData.save();
        
        res.status(204).send(); // No content response on successful deletion
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Start the server
app.listen(3000, () => {
    console.log('Server is running on https://chd-egypt.com:3000');
});
