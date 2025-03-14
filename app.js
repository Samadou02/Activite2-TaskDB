const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect('mongodb+srv://samadouaboudou925:samadou@cluster0.jmwml.mongodb.net/taskDB',)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Définition du schéma et du modèle Task
const taskSchema = new mongoose.Schema({
    
    nom: {type: String},
    description: {type: String},

});
const Task = mongoose.model('Task', taskSchema);

// Récupérer toutes les tâches
app.get('/task', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
    }
});

// Récupérer une tâche par son ID
app.get('/task/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ error: 'Tâche non trouvée' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la tâche' });
    }
});

// Ajouter une tâche
app.post('/tasks', async (req, res) => {
    try {
        const newTask = new Task({ description: req.body.description });
        await newTask.save();
        res.status(201).json({ message: 'Tâche ajoutée avec succès', task: newTask });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de l ajout de la tâche' });
    }
});

// Modifier une tâche
app.put('/task/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, { description: req.body.description }, { new: true });
        if (updatedTask) {
            res.json({ message: 'Tâche mise à jour avec succès', task: updatedTask });
        } else {
            res.status(404).json({ error: 'Tâche non trouvée' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la tâche' });
    }
});

// Supprimer une tâche
app.delete('/task/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (deletedTask) {
            res.json({ message: 'Tâche supprimée avec succès' });
        } else {
            res.status(404).json({ error: 'Tâche non trouvée' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la tâche' });
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur écoutant sur le port ${port}`);
});

