

CREATE DATABASE IF NOT EXISTS AGLAIA;

USE AGLAIA;

CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    apellido VARCHAR(45) NOT NULL,
    email VARCHAR(45) NOT NULL unique,
    contraseña VARCHAR(45) NOT NULL unique
);

CREATE TABLE Categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(45) NOT NULL,
    descripcion TEXT,
    imagen VARCHAR(255)
);

CREATE TABLE Emprendimientos (
    id_emprendimiento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL unique,
    descripcion TEXT,
    categoria_id INT NOT NULL,
    usuario_id INT NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES Categorias(id_categoria),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id_usuario)
);

CREATE TABLE Administradores (
    id_administrador INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    apellido VARCHAR(45) NOT NULL,
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id_usuario)
);

CREATE TABLE Patrocinadores (
    id_patrocinador INT AUTO_INCREMENT PRIMARY KEY,
    nombre_empresa VARCHAR(45) NOT NULL unique,
    persona_contacto VARCHAR(45) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    fecha_registro DATE,
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id_usuario)
);

CREATE TABLE Productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2),
    emprendimiento_id INT NOT NULL,
    categoria_id INT NOT NULL,
    imagen VARCHAR(255),
    stock INT,
    fecha_publicacion DATE,
    FOREIGN KEY (emprendimiento_id) REFERENCES Emprendimientos(id_emprendimiento),
    FOREIGN KEY (categoria_id) REFERENCES Categorias(id_categoria)
);

CREATE TABLE Anuncios (
    id_anuncio INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(45) NOT NULL,
    descripcion TEXT,
    usuario_id INT NOT NULL,
    fecha_creacion DATE,
    fecha_expiracion DATE,
    costo DECIMAL(10, 2),
    categoria_id INT NOT NULL,
    imagen VARCHAR(255),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (categoria_id) REFERENCES Categorias(id_categoria)
);

show tables;

-- Usuarios
INSERT INTO Usuarios (nombre, apellido, email, contraseña) VALUES
('Ana', 'Rodríguez', 'ana@example.com', 'abc123');
('Juan', 'Pérez', 'juan@example.com', 'contraseña123'),
('María', 'González', 'maria@example.com', 'clave456'),
('Pedro', 'López', 'pedro@example.com', 'secreto789'),
('Laura', 'Martínez', 'laura@example.com', 'p@ssw0rd'),
('Ana', 'Rodríguez', 'ana@example.com', 'abc123');
('Pedro', 'López', 'pedro@example.com', 'secreto789'),
('Laura', 'Martínez', 'laura@example.com', 'p@ssw0rd'),
('Ana', 'Rodríguez', 'ana@example.com', 'abc123');

-- Categorías
INSERT INTO Categorias (nombre_categoria, descripcion, imagen) VALUES
('Viaje', 'Productos relacionados con viajes y turismo', 'viaje.jpg'),
('Moda', 'Ropa, accesorios y artículos de moda', 'moda.jpg'),
('Comida', 'Productos alimenticios y gastronomía', 'comida.jpg'),
('Tecnología', 'Productos electrónicos y tecnológicos', 'tecnologia.jpg'),
('Fitness', 'Artículos deportivos y de fitness', 'fitness.jpg');

-- Emprendimientos
INSERT INTO Emprendimientos (nombre, descripcion, categoria_id, usuario_id) VALUES
('Tienda de viajes', 'Agencia de viajes especializada en destinos internacionales.', 1, 1),
('Tienda de moda', 'Venta de ropa de diseño y accesorios de moda.', 2, 2),
('Restaurante gourmet', 'Restaurante que ofrece una experiencia culinaria única.', 3, 3),
('Tienda de tecnología', 'Venta de dispositivos electrónicos y gadgets.', 4, 4),
('Gimnasio', 'Centro de fitness con entrenamiento personalizado.', 5, 5);

-- Administradores
INSERT INTO Administradores (nombre, apellido, usuario_id) VALUES
('Yudy', 'Benavides', 1),
('Carlos', '', 2),
('Darwin', '', 3),
('Esteban', '', 4),


-- Patrocinadores
INSERT INTO Patrocinadores (nombre_empresa, persona_contacto, telefono, fecha_registro, usuario_id) VALUES
('Empresa1', 'Persona1', '123456789', '2024-04-25', 1),
('Empresa2', 'Persona2', '987654321', '2024-04-25', 2),
('Empresa3', 'Persona3', '111222333', '2024-04-25', 3),
('Empresa4', 'Persona4', '444555666', '2024-04-25', 4),
('Empresa5', 'Persona5', '777888999', '2024-04-25', 5);

-- Productos
INSERT INTO Productos (nombre, descripcion, precio, emprendimiento_id, categoria_id, imagen, stock, fecha_publicacion) VALUES
('Paquete de viaje a Europa', 'Incluye vuelos, hoteles y tours por varios países europeos.', 1500.00, 1, 1, 'europa.jpg', 10, '2024-04-25'),
('Vestido de fiesta', 'Vestido elegante para ocasiones especiales.', 99.99, 2, 2, 'vestido.jpg', 20, '2024-04-25'),
('Menú degustación', 'Experiencia gastronómica con varios platos gourmet.', 120.00, 3, 3, 'menu.jpg', 15, '2024-04-25'),
('Smartphone de última generación', 'Teléfono móvil con las últimas características tecnológicas.', 799.99, 4, 4, 'smartphone.jpg', 30, '2024-04-25'),
('Membresía mensual de gimnasio', 'Acceso ilimitado a todas las instalaciones y clases.', 50.00, 5, 5, 'gym.jpg', 50, '2024-04-25');

-- Anuncios
INSERT INTO Anuncios (titulo, descripcion, usuario_id, fecha_creacion, fecha_expiracion, costo, categoria_id, imagen) VALUES
('¡Oferta especial! Viaje a París', '¡Reserva ahora y obtén un descuento del 20% en tu viaje a París!', 1, '2024-04-25', '2024-05-25', 0.00, 1, 'paris.jpg'),
('Nueva colección de primavera', 'Descubre nuestra nueva colección de moda primavera-verano.', 2, '2024-04-25', '2024-05-25', 0.00, 2, 'coleccion.jpg'),
('Cena de San Valentín', '¡Celebra el amor con una cena romántica en nuestro restaurante!', 3, '2024-04-25', '2024-05-25', 0.00, 3, 'cena.jpg'),
('¡Lanzamiento exclusivo! Smartphone XYZ', 'Descubre el último modelo de smartphone con nosotros.', 4, '2024-04-25', '2024-05-25', 0.00, 4, 'xyz.jpg'),
('Promoción de inscripción gratuita', 'Inscríbete este mes y no pagues la inscripción.', 5, '2024-04-25', '2024-05-25', 0.00, 5, 'promo.jpg');



CREATE DATABASE Registro_usuarios;

USE Regitro_usuarios;

CREATE TABLE Registro_usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellidos VARCHAR(50) NOT NULL,
  tipo_identificacion VARCHAR(10) NOT NULL,
  numero_identificacion VARCHAR(20) NOT NULL,
  correo_electronico VARCHAR(50) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  direccion VARCHAR(100) NOT NULL,
  contrasena VARCHAR(50) NOT NULL,
  confirmacion_contrasena VARCHAR(50) NOT NULL
);
