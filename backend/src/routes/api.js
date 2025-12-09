const express = require('express');
const { saveAnswers } = require('../controllers/answersController');
const { getReport } = require('../controllers/reportController');
const { verifyName } = require('../controllers/verifyController');

const router = express.Router();

// POST /api/save - сохранение ответов
router.post('/save', saveAnswers);

// GET /api/get-report - получение отчёта в CSV
router.get('/get-report', getReport);

// POST /api/verify-name - проверка имени в БД
router.post('/verify-name', verifyName);

module.exports = router;
