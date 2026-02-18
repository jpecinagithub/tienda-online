import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, rol, activo } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, email, nombre, apellido, telefono, rol, activo, created_at FROM usuarios';
    const conditions = [];
    const values = [];

    if (rol) {
      conditions.push('rol = ?');
      values.push(rol);
    }
    if (activo !== undefined) {
      conditions.push('activo = ?');
      values.push(activo === 'true');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(parseInt(limit), parseInt(offset));

    const [users] = await pool.query(query, values);

    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM usuarios');

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await pool.query(
      'SELECT id, email, nombre, apellido, telefono, direccion, rol, activo, created_at FROM usuarios WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Error en getUserById:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, password, nombre, apellido, telefono, direccion, rol } = req.body;

    if (!email || !password || !nombre || !apellido) {
      return res.status(400).json({ error: 'Email, password, nombre y apellido son obligatorios' });
    }

    const [existing] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRol = ['cliente', 'admin'].includes(rol) ? rol : 'cliente';

    const [result] = await pool.query(
      'INSERT INTO usuarios (email, password, nombre, apellido, telefono, direccion, rol) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, nombre, apellido, telefono || null, direccion || null, userRol]
    );

    const [users] = await pool.query(
      'SELECT id, email, nombre, apellido, telefono, direccion, rol, activo, created_at FROM usuarios WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(users[0]);
  } catch (error) {
    console.error('Error en createUser:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, telefono, direccion, rol, activo } = req.body;

    const [existing] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const updates = [];
    const values = [];

    if (nombre !== undefined) { updates.push('nombre = ?'); values.push(nombre); }
    if (apellido !== undefined) { updates.push('apellido = ?'); values.push(apellido); }
    if (telefono !== undefined) { updates.push('telefono = ?'); values.push(telefono); }
    if (direccion !== undefined) { updates.push('direccion = ?'); values.push(direccion); }
    if (rol !== undefined && ['cliente', 'admin'].includes(rol)) { updates.push('rol = ?'); values.push(rol); }
    if (activo !== undefined) { updates.push('activo = ?'); values.push(activo); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    values.push(id);
    await pool.query(`UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`, values);

    const [users] = await pool.query(
      'SELECT id, email, nombre, apellido, telefono, direccion, rol, activo, created_at FROM usuarios WHERE id = ?',
      [id]
    );

    res.json(users[0]);
  } catch (error) {
    console.error('Error en updateUser:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
    }

    const [existing] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error en deleteUser:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
