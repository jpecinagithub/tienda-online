import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { generateToken } from '../middleware/auth.js';

export const register = async (req, res) => {
  try {
    const { email, password, nombre, apellido, telefono, direccion } = req.body;

    if (!email || !password || !nombre || !apellido) {
      return res.status(400).json({ error: 'Email, password, nombre y apellido son obligatorios' });
    }

    const [existing] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO usuarios (email, password, nombre, apellido, telefono, direccion, rol) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, nombre, apellido, telefono || null, direccion || null, 'cliente']
    );

    const [users] = await pool.query('SELECT id, email, nombre, apellido, rol FROM usuarios WHERE id = ?', [result.insertId]);
    const user = users[0];

    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son obligatorios' });
    }

    const [users] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = users[0];
    if (!user.activo) {
      return res.status(401).json({ error: 'Usuario inactivo' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = generateToken(user);

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, email, nombre, apellido, telefono, direccion, rol, activo, created_at FROM usuarios WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { nombre, apellido, telefono, direccion } = req.body;

    await pool.query(
      'UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ?, direccion = ? WHERE id = ?',
      [nombre, apellido, telefono, direccion, req.user.id]
    );

    const [users] = await pool.query(
      'SELECT id, email, nombre, apellido, telefono, direccion, rol FROM usuarios WHERE id = ?',
      [req.user.id]
    );

    res.json(users[0]);
  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};
