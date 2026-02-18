import pool from '../config/database.js';

export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, categoria, minPrecio, maxPrecio, destacado, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, c.nombre as categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = 1
    `;
    const values = [];

    if (categoria) {
      query += ' AND c.nombre = ?';
      values.push(categoria);
    }
    if (minPrecio) {
      query += ' AND p.precio >= ?';
      values.push(parseFloat(minPrecio));
    }
    if (maxPrecio) {
      query += ' AND p.precio <= ?';
      values.push(parseFloat(maxPrecio));
    }
    if (destacado === 'true') {
      query += ' AND p.destacado = 1';
    }
    if (search) {
      query += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';
      values.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    values.push(parseInt(limit), parseInt(offset));

    const [products] = await pool.query(query, values);

    let countQuery = `
      SELECT COUNT(*) as total FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = 1
    `;
    const countValues = [];
    if (categoria) {
      countQuery += ' AND c.nombre = ?';
      countValues.push(categoria);
    }

    const [countResult] = await pool.query(countQuery, countValues);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Error en getAllProducts:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await pool.query(
      `SELECT p.*, c.nombre as categoria_nombre
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id = ? AND p.activo = 1`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(products[0]);
  } catch (error) {
    console.error('Error en getProductById:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const [products] = await pool.query(
      `SELECT p.*, c.nombre as categoria_nombre
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE p.activo = 1 AND p.destacado = 1
       ORDER BY p.created_at DESC LIMIT ?`,
      [parseInt(limit)]
    );

    res.json(products);
  } catch (error) {
    console.error('Error en getFeaturedProducts:', error);
    res.status(500).json({ error: 'Error al obtener productos destacados' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria_id, imagen, sku, destacado } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }

    const [result] = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, imagen, sku, destacado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, descripcion || null, precio, stock || 0, categoria_id || null, imagen || null, sku || null, destacado || false]
    );

    const [products] = await pool.query('SELECT * FROM productos WHERE id = ?', [result.insertId]);

    res.status(201).json(products[0]);
  } catch (error) {
    console.error('Error en createProduct:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria_id, imagen, sku, activo, destacado } = req.body;

    const [existing] = await pool.query('SELECT id FROM productos WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const updates = [];
    const values = [];

    if (nombre !== undefined) { updates.push('nombre = ?'); values.push(nombre); }
    if (descripcion !== undefined) { updates.push('descripcion = ?'); values.push(descripcion); }
    if (precio !== undefined) { updates.push('precio = ?'); values.push(precio); }
    if (stock !== undefined) { updates.push('stock = ?'); values.push(stock); }
    if (categoria_id !== undefined) { updates.push('categoria_id = ?'); values.push(categoria_id); }
    if (imagen !== undefined) { updates.push('imagen = ?'); values.push(imagen); }
    if (sku !== undefined) { updates.push('sku = ?'); values.push(sku); }
    if (activo !== undefined) { updates.push('activo = ?'); values.push(activo); }
    if (destacado !== undefined) { updates.push('destacado = ?'); values.push(destacado); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    values.push(id);
    await pool.query(`UPDATE productos SET ${updates.join(', ')} WHERE id = ?`, values);

    const [products] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);

    res.json(products[0]);
  } catch (error) {
    console.error('Error en updateProduct:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM productos WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await pool.query('DELETE FROM productos WHERE id = ?', [id]);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};
