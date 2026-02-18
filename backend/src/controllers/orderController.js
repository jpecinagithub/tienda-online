import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { items, direccion_envio, metodo_pago = 'tarjeta' } = req.body;
    const usuario_id = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'El carrito no puede estar vacío' });
    }

    if (!direccion_envio) {
      return res.status(400).json({ error: 'La dirección de envío es obligatoria' });
    }

    await connection.beginTransaction();

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const [products] = await connection.query(
        'SELECT id, nombre, precio, stock FROM productos WHERE id = ? AND activo = 1',
        [item.producto_id]
      );

      if (products.length === 0) {
        throw new Error(`Producto ${item.producto_id} no encontrado`);
      }

      const product = products[0];
      if (product.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para ${product.nombre}`);
      }

      const subtotal = product.precio * item.cantidad;
      total += subtotal;

      orderItems.push({
        producto_id: product.id,
        nombre: product.nombre,
        cantidad: item.cantidad,
        precio_unitario: product.precio,
        subtotal
      });

      await connection.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, product.id]
      );
    }

    const aprobado = Math.random() > 0.1;
    const estado_pago = aprobado ? 'aprobado' : 'rechazado';
    const numero_seguimiento = uuidv4().substring(0, 8).toUpperCase();

    const [pedidoResult] = await connection.query(
      `INSERT INTO pedidos (usuario_id, estado_pago, estado_envio, numero_seguimiento, direccion_envio, total, metodo_pago)
       VALUES (?, ?, 'pendiente', ?, ?, ?, ?)`,
      [usuario_id, estado_pago, numero_seguimiento, direccion_envio, total, metodo_pago]
    );

    const pedido_id = pedidoResult.insertId;

    for (const item of orderItems) {
      await connection.query(
        'INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [pedido_id, item.producto_id, item.cantidad, item.precio_unitario, item.subtotal]
      );
    }

    await connection.commit();

    const [pedido] = await pool.query(
      `SELECT p.*, u.nombre as usuario_nombre, u.email as usuario_email
       FROM pedidos p
       JOIN usuarios u ON p.usuario_id = u.id
       WHERE p.id = ?`,
      [pedido_id]
    );

    const [detalles] = await pool.query(
      `SELECT dp.*, pr.nombre as producto_nombre, pr.imagen
       FROM detalles_pedido dp
       JOIN productos pr ON dp.producto_id = pr.id
       WHERE dp.pedido_id = ?`,
      [pedido_id]
    );

    res.status(201).json({
      pedido: pedido[0],
      detalles: detalles,
      simulacion: {
        pago: {
          estado: estado_pago,
          mensaje: aprobado ? 'Pago aprobado correctamente' : 'Pago rechazado. Intenta con otro método.',
          transaccion_id: uuidv4()
        },
        envio: {
          numero_seguimiento,
          estado: 'pendiente',
          mensaje: 'El pedido será procesado en 24-48 horas'
        }
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error en createOrder:', error);
    res.status(400).json({ error: error.message || 'Error al crear pedido' });
  } finally {
    connection.release();
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [pedidos] = await pool.query(
      `SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [req.user.id, parseInt(limit), parseInt(offset)]
    );

    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM pedidos WHERE usuario_id = ?',
      [req.user.id]
    );

    const pedidosConDetalles = await Promise.all(
      pedidos.map(async (pedido) => {
        const [detalles] = await pool.query(
          `SELECT dp.*, pr.nombre as producto_nombre, pr.imagen
           FROM detalles_pedido dp
           JOIN productos pr ON dp.producto_id = pr.id
           WHERE dp.pedido_id = ?`,
          [pedido.id]
        );
        return { ...pedido, detalles };
      })
    );

    res.json({
      pedidos: pedidosConDetalles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Error en getMyOrders:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [pedidos] = await pool.query(
      `SELECT p.*, u.nombre as usuario_nombre, u.email as usuario_email, u.telefono as usuario_telefono
       FROM pedidos p
       JOIN usuarios u ON p.usuario_id = u.id
       WHERE p.id = ? AND p.usuario_id = ?`,
      [id, req.user.id]
    );

    if (pedidos.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const [detalles] = await pool.query(
      `SELECT dp.*, pr.nombre as producto_nombre, pr.imagen
       FROM detalles_pedido dp
       JOIN productos pr ON dp.producto_id = pr.id
       WHERE dp.pedido_id = ?`,
      [id]
    );

    res.json({ pedido: pedidos[0], detalles });
  } catch (error) {
    console.error('Error en getOrderById:', error);
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, estado_pago, estado_envio } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, u.nombre as usuario_nombre, u.email as usuario_email
      FROM pedidos p
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE 1=1
    `;
    const values = [];

    if (estado_pago) {
      query += ' AND p.estado_pago = ?';
      values.push(estado_pago);
    }
    if (estado_envio) {
      query += ' AND p.estado_envio = ?';
      values.push(estado_envio);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    values.push(parseInt(limit), parseInt(offset));

    const [pedidos] = await pool.query(query, values);

    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM pedidos');

    res.json({
      pedidos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Error en getAllOrders:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_envio, numero_seguimiento, estado_pago } = req.body;

    const [existing] = await pool.query('SELECT id FROM pedidos WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const updates = [];
    const values = [];

    if (estado_envio !== undefined && ['pendiente', 'procesando', 'enviado', 'entregado'].includes(estado_envio)) {
      updates.push('estado_envio = ?');
      values.push(estado_envio);
    }
    if (estado_pago !== undefined && ['pendiente', 'aprobado', 'rechazado'].includes(estado_pago)) {
      updates.push('estado_pago = ?');
      values.push(estado_pago);
    }
    if (numero_seguimiento !== undefined) {
      updates.push('numero_seguimiento = ?');
      values.push(numero_seguimiento);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    values.push(id);
    await pool.query(`UPDATE pedidos SET ${updates.join(', ')} WHERE id = ?`, values);

    const [pedidos] = await pool.query('SELECT * FROM pedidos WHERE id = ?', [id]);

    res.json(pedidos[0]);
  } catch (error) {
    console.error('Error en updateOrderStatus:', error);
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
};

export const simulateShippingUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_envio } = req.body;

    const estadosValidos = ['pendiente', 'procesando', 'enviado', 'entregado'];
    if (!estado_envio || !estadosValidos.includes(estado_envio)) {
      return res.status(400).json({ error: 'Estado de envío inválido' });
    }

    const [existing] = await pool.query('SELECT * FROM pedidos WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const estadoIndex = estadosValidos.indexOf(existing[0].estado_envio);
    const nuevoIndex = estadosValidos.indexOf(estado_envio);

    if (nuevoIndex < estadoIndex) {
      return res.status(400).json({ error: 'No se puede volver a un estado anterior' });
    }

    await pool.query('UPDATE pedidos SET estado_envio = ? WHERE id = ?', [estado_envio, id]);

    res.json({
      mensaje: `Estado de envío actualizado a: ${estado_envio}`,
      numero_seguimiento: existing[0].numero_seguimiento,
      estado_anterior: existing[0].estado_envio,
      estado_nuevo: estado_envio
    });
  } catch (error) {
    console.error('Error en simulateShippingUpdate:', error);
    res.status(500).json({ error: 'Error al actualizar envío' });
  }
};
