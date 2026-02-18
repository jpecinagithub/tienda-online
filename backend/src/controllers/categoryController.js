import pool from '../config/database.js';

export const getAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(
      'SELECT * FROM categorias WHERE activo = 1 ORDER BY nombre'
    );
    res.json(categories);
  } catch (error) {
    console.error('Error en getAllCategories:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const [categories] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id]);

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(categories[0]);
  } catch (error) {
    console.error('Error en getCategoryById:', error);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { nombre, descripcion, imagen } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const [result] = await pool.query(
      'INSERT INTO categorias (nombre, descripcion, imagen) VALUES (?, ?, ?)',
      [nombre, descripcion || null, imagen || null]
    );

    const [categories] = await pool.query('SELECT * FROM categorias WHERE id = ?', [result.insertId]);

    res.status(201).json(categories[0]);
  } catch (error) {
    console.error('Error en createCategory:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, imagen, activo } = req.body;

    const [existing] = await pool.query('SELECT id FROM categorias WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    const updates = [];
    const values = [];

    if (nombre !== undefined) { updates.push('nombre = ?'); values.push(nombre); }
    if (descripcion !== undefined) { updates.push('descripcion = ?'); values.push(descripcion); }
    if (imagen !== undefined) { updates.push('imagen = ?'); values.push(imagen); }
    if (activo !== undefined) { updates.push('activo = ?'); values.push(activo); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    values.push(id);
    await pool.query(`UPDATE categorias SET ${updates.join(', ')} WHERE id = ?`, values);

    const [categories] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id]);

    res.json(categories[0]);
  } catch (error) {
    console.error('Error en updateCategory:', error);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM categorias WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error en deleteCategory:', error);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};
