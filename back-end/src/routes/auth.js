const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { body, validationResult } = require('express-validator');


const router = express.Router();

//Rota para Login

router.post('/login',
  [
    body('username').trim().escape().isString().notEmpty().withMessage('Usuário é obrigatório.'),
    body('password').trim().isString().notEmpty().withMessage('Senha é obrigatória.'),
  ], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const compare = await bcrypt.compare(password, user.passwordHash);
    if (!compare) {
      return res.status(401).json({ message: 'Senha inválida' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });

  });


// rota para popular usuário 
router.post('/user',
  [
    body('username').trim().escape().isString().notEmpty().withMessage('Usuário é obrigatório.'),
    body('password').trim().isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres.'),
  ], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash });
    res.json(user);
  });

module.exports = router;
