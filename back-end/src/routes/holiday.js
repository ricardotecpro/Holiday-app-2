const express = require('express');
const { Holiday } = require('../models');
const authMiddleware = require('./authMiddleware');
const fetch = require('node-fetch');
const { body, validationResult, param } = require('express-validator');
const apicache = require('apicache');

const router = express.Router();
const cache = apicache.middleware;

//Rotas com login
router.use(authMiddleware);


//Buscar feriados na API externa 
router.get('/:year/:countryCode', cache('1 hour'), async (req, res) => {
  const { year, countryCode } = req.params;

  if (!year || !countryCode) {
    return res.status(400).json({ error: "Ano e código do país são obrigatórios." });
  }

  try {
    const apiUrl = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(500).json({ error: "Erro ao consultar a API externa." });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro no servidor ao buscar feriados." });
  }
});


//Listar feriados personalizados
router.get('/', async (req, res) => {
  const holidays = await Holiday.findAll({ where: { userId: req.user.id } });
  res.json(holidays);
});

//Criar feriados personalizados
router.post('/',
  [
    body('name').trim().escape().isString().notEmpty().withMessage('Nome do feriado é obrigatório.'),
    body('date').trim().isISO8601().withMessage('Data inválida. Use o formato YYYY-MM-DD.'),
    body('countryCode').trim().isLength({ min: 2, max: 2 }).withMessage('Código do país deve ter 2 letras.'),
    body('type').trim().escape().isString().notEmpty().withMessage('Tipo é obrigatório.'),
  ], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, date, countryCode, type } = req.body;

    try {
      const holiday = await Holiday.create({
        name,
        date,
        countryCode,
        type,
        userId: req.user.id,
      });
      res.status(201).json(holiday);
    } catch (err) {
      res.status(400).json({ message: 'Erro ao inserir feriado.', error: err.message });
    }
  });


//Atualizar feriados personalizados
router.put('/:id',
  [
    param('id').isInt().withMessage('ID inválido.'),
    body('name').trim().escape().isString().notEmpty().withMessage('Nome do feriado é obrigatório.'),
    body('date').trim().isISO8601().withMessage('Data inválida. Use o formato YYYY-MM-DD.'),
    body('countryCode').trim().isLength({ min: 2, max: 2 }).withMessage('Código do país deve ter 2 letras.'),
    body('type').trim().escape().isString().notEmpty().withMessage('Tipo é obrigatório.'),
  ], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { name, date, countryCode, type } = req.body;

    try {
      const holiday = await Holiday.findOne({ where: { id, userId: req.user.id } });

      if (!holiday) {
        return res.status(404).json({ message: 'Feriado não encontrado.' });
      }

      holiday.name = name;
      holiday.date = date;
      holiday.countryCode = countryCode;
      holiday.type = type;

      await holiday.save();
      res.json(holiday);
    } catch (err) {
      res.status(400).json({ message: 'Erro ao atualizar feriado.', error: err.message });
    }
  });

//Excluir feriados personalizados
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const holiday = await Holiday.findOne({ where: { id, userId: req.user.id } });

    if (!holiday) {
      return res.status(404).json({ message: 'Feriado não encontrado.' });
    }

    await holiday.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: 'Erro ao excluir feriado.', error: err.message });
  }
});

module.exports = router;
