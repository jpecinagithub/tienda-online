-- =====================================================
-- SEED DATA - DATOS DE EJEMPLO
-- =====================================================

USE tienda_online;

-- =====================================================
-- USUARIOS (password: 12345678 hasheado con bcrypt)
-- =====================================================
-- Admin: admin@tienda.com / 12345678
-- Cliente: cliente@tienda.com / 12345678
INSERT INTO usuarios (email, password, nombre, apellido, telefono, direccion, rol) VALUES
('admin@tienda.com', '$2b$10$rQZ8K8Y8Y8Y8Y8Y8Y8Y8YOQXQXQXQXQXQXQXQXQXQXQXQXQXQXQ', 'Admin', 'Principal', '600000001', 'Calle Admin 1, Madrid', 'admin'),
('cliente@tienda.com', '$2b$10$rQZ8K8Y8Y8Y8Y8Y8Y8Y8YOQXQXQXQXQXQXQXQXQXQXQXQXQXQ', 'Juan', 'Pérez', '600000002', 'Calle Cliente 2, Barcelona', 'cliente'),
('maria@tienda.com', '$2b$10$rQZ8K8Y8Y8Y8Y8Y8Y8Y8YOQXQXQXQXQXQXQXQXQXQXQXQXQXQ', 'María', 'García', '600000003', 'Calle María 3, Valencia', 'cliente');

-- =====================================================
-- CATEGORÍAS
-- =====================================================
INSERT INTO categorias (nombre, descripcion, imagen) VALUES
('Electrónica', 'Dispositivos electrónicos y accesorios', '/images/categorias/electronica.jpg'),
('Ropa', 'Prendas de vestir para hombre y mujer', '/images/categorias/ropa.jpg'),
('Hogar', 'Muebles y decoración para el hogar', '/images/categorias/hogar.jpg'),
('Deportes', 'Equipamiento y ropa deportiva', '/images/categorias/deportes.jpg'),
('Libros', 'Libros de todas las categorías', '/images/categorias/libros.jpg');

-- =====================================================
-- PRODUCTOS
-- =====================================================
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, imagen, sku, destacado) VALUES
-- Electrónica (categoria 1)
('Smartphone Pro', 'Teléfono inteligente de última generación, 256GB', 799.99, 50, 1, 'https://picsum.photos/seed/phone1/400/400', 'ELEC-001', TRUE),
('Auriculares Wireless', 'Auriculares bluetooth con cancelación de ruido', 149.99, 100, 1, 'https://picsum.photos/seed/headphones/400/400', 'ELEC-002', TRUE),
('Smartwatch Sport', 'Reloj inteligente resistente al agua', 199.99, 75, 1, 'https://picsum.photos/seed/watch/400/400', 'ELEC-003', FALSE),
('Tablet 10 pulgadas', 'Tablet android con pantalla HD', 299.99, 30, 1, 'https://picsum.photos/seed/tablet/400/400', 'ELEC-004', FALSE),

-- Ropa (categoria 2)
('Camisa Casual', 'Camisa de algodón para uso diario', 39.99, 200, 2, 'https://picsum.photos/seed/shirt/400/400', 'ROPA-001', TRUE),
('Pantalones Vaqueros', 'Pantalones vaqueros经典的', 49.99, 150, 2, 'https://picsum.photos/seed/jeans/400/400', 'ROPA-002', FALSE),
('Chaqueta de Invierno', 'Chaqueta acolchada para el frío', 89.99, 80, 2, 'https://picsum.photos/seed/jacket/400/400', 'ROPA-003', TRUE),
('Zapatillas Running', 'Zapatillas deportivas ligeras', 79.99, 120, 2, 'https://picsum.photos/seed/sneakers/400/400', 'ROPA-004', FALSE),

-- Hogar (categoria 3)
('Lámpara de Mesa', 'Lámpara LED regulable', 34.99, 60, 3, 'https://picsum.photos/seed/lamp/400/400', 'HOGAR-001', FALSE),
('Juego de Sábanas', 'Sábanas de algodon 200 hilos', 49.99, 90, 3, 'https://picsum.photos/seed/bedsheets/400/400', 'HOGAR-002', FALSE),
('Cojines Decorativos', 'Set de 4 cojines', 29.99, 100, 3, 'https://picsum.photos/seed/pillows/400/400', 'HOGAR-003', FALSE),
('Espejo Grande', 'Espejo de pared rectangular', 79.99, 25, 3, 'https://picsum.photos/seed/mirror/400/400', 'HOGAR-004', FALSE),

-- Deportes (categoria 4)
('Balón de Fútbol', 'Balón profesional de fútbol', 24.99, 200, 4, 'https://picsum.photos/seed/football/400/400', 'DEPO-001', FALSE),
('Raqueta Tenis', 'Raqueta de carbono profesional', 89.99, 40, 4, 'https://picsum.photos/seed/tennis/400/400', 'DEPO-002', FALSE),
('Esterilla Yoga', 'Esterilla antideslizante', 19.99, 150, 4, 'https://picsum.photos/seed/yoga/400/400', 'DEPO-003', TRUE),
('Mancanas 10kg', 'Set de mancuernas ajustables', 59.99, 60, 4, 'https://picsum.photos/seed/dumbbell/400/400', 'DEPO-004', FALSE),

-- Libros (categoria 5)
('El Gran Libro de JS', 'Guía completa de JavaScript', 39.99, 80, 5, 'https://picsum.photos/seed/jsbook/400/400', 'LIBRO-001', TRUE),
('Python para Todos', 'Aprende Python desde cero', 29.99, 100, 5, 'https://picsum.photos/seed/pythonbook/400/400', 'LIBRO-002', FALSE),
('Historia Universal', 'Gran obra de historia', 49.99, 50, 5, 'https://picsum.photos/seed/historybook/400/400', 'LIBRO-003', FALSE),
('Cocina Mediterránea', 'Recetas saludables', 24.99, 70, 5, 'https://picsum.photos/seed/cookbook/400/400', 'LIBRO-004', FALSE);

-- =====================================================
-- PEDIDOS DE EJEMPLO
-- =====================================================
INSERT INTO pedidos (usuario_id, estado_pago, estado_envio, direccion_envio, total, metodo_pago) VALUES
(2, 'aprobado', 'entregado', 'Calle Cliente 2, Barcelona', 189.97, 'tarjeta'),
(2, 'aprobado', 'enviado', 'Calle Cliente 2, Barcelona', 119.98, 'tarjeta'),
(3, 'aprobado', 'procesando', 'Calle María 3, Valencia', 79.99, 'paypal');

-- =====================================================
-- DETALLES PEDIDO DE EJEMPLO
-- =====================================================
-- Pedido 1
INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1, 799.99, 799.99),
(1, 2, 1, 149.99, 149.99);

-- Pedido 2
INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(2, 5, 2, 39.99, 79.98),
(2, 6, 1, 49.99, 49.99);

-- Pedido 3
INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(3, 15, 1, 19.99, 19.99),
(3, 13, 1, 59.99, 59.99);
