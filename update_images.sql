-- Actualizar imágenes de productos
USE tienda_online;

UPDATE productos SET imagen = 'https://picsum.photos/seed/phone1/400/400' WHERE sku = 'ELEC-001';
UPDATE productos SET imagen = 'https://picsum.photos/seed/headphones/400/400' WHERE sku = 'ELEC-002';
UPDATE productos SET imagen = 'https://picsum.photos/seed/watch/400/400' WHERE sku = 'ELEC-003';
UPDATE productos SET imagen = 'https://picsum.photos/seed/tablet/400/400' WHERE sku = 'ELEC-004';

UPDATE productos SET imagen = 'https://picsum.photos/seed/shirt/400/400' WHERE sku = 'ROPA-001';
UPDATE productos SET imagen = 'https://picsum.photos/seed/jeans/400/400' WHERE sku = 'ROPA-002';
UPDATE productos SET imagen = 'https://picsum.photos/seed/jacket/400/400' WHERE sku = 'ROPA-003';
UPDATE productos SET imagen = 'https://picsum.photos/seed/sneakers/400/400' WHERE sku = 'ROPA-004';

UPDATE productos SET imagen = 'https://picsum.photos/seed/lamp/400/400' WHERE sku = 'HOGAR-001';
UPDATE productos SET imagen = 'https://picsum.photos/seed/bedsheets/400/400' WHERE sku = 'HOGAR-002';
UPDATE productos SET imagen = 'https://picsum.photos/seed/pillows/400/400' WHERE sku = 'HOGAR-003';
UPDATE productos SET imagen = 'https://picsum.photos/seed/mirror/400/400' WHERE sku = 'HOGAR-004';

UPDATE productos SET imagen = 'https://picsum.photos/seed/football/400/400' WHERE sku = 'DEPO-001';
UPDATE productos SET imagen = 'https://picsum.photos/seed/tennis/400/400' WHERE sku = 'DEPO-002';
UPDATE productos SET imagen = 'https://picsum.photos/seed/yoga/400/400' WHERE sku = 'DEPO-003';
UPDATE productos SET imagen = 'https://picsum.photos/seed/dumbbell/400/400' WHERE sku = 'DEPO-004';

UPDATE productos SET imagen = 'https://picsum.photos/seed/jsbook/400/400' WHERE sku = 'LIBRO-001';
UPDATE productos SET imagen = 'https://picsum.photos/seed/pythonbook/400/400' WHERE sku = 'LIBRO-002';
UPDATE productos SET imagen = 'https://picsum.photos/seed/historybook/400/400' WHERE sku = 'LIBRO-003';
UPDATE productos SET imagen = 'https://picsum.photos/seed/cookbook/400/400' WHERE sku = 'LIBRO-004';
