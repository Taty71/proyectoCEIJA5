const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const [modalidades] = await db.query('SELECT * FROM modalidades');
        res.json(modalidades);
    } catch (error) {
        console.error('Error al obtener modalidades:', error);
        res.status(500).json({ message: 'Error al obtener modalidades.' });
    }
});

module.exports = router;