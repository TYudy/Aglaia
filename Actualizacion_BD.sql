CREATE DATABASE IF NOT EXISTS AGLAIA;

USE AGLAIA;

CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    apellido VARCHAR(45) NOT NULL,
    email VARCHAR(45) NOT NULL UNIQUE,
    contraseña VARCHAR(45) NOT NULL UNIQUE,
    role VARCHAR(45) NOT NULL
);

CREATE TABLE Categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(45) NOT NULL,
    descripcion TEXT,
    imagen VARCHAR(255)
);

CREATE TABLE Emprendimientos (
    id_emprendimiento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    miembros INT NOT NULL,
    nombre_miembros TEXT,
    logo LONGBLOB,
    aprobado BOOLEAN NOT NULL DEFAULT FALSE,
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
    nombre_empresa VARCHAR(45) NOT NULL UNIQUE,
    persona_contacto VARCHAR(45) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_registro DATE NOT NULL,
    anos_mercado INT NOT NULL,
    usuario_id INT NOT NULL,
    ReLleno boolean  default not null false,
    logo blob not null,
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
    aprobado BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (categoria_id) REFERENCES Categorias(id_categoria)
);

-- Inserciones


INSERT INTO Categorias (nombre_categoria, descripcion) VALUES
('Viaje', 'Productos relacionados con viajes y turismo'),
('Moda', 'Ropa, accesorios y artículos de moda'),
('Comida', 'Productos alimenticios y gastronomía'),
('Tecnología', 'Productos electrónicos y tecnológicos'),
('Fitness', 'Artículos deportivos y de fitness'),
('Hogar', 'Artículos para el hogar y decoración'),
('Libros', 'Libros impresos y electrónicos'),
('Juguetes', 'Juguetes y juegos para todas las edades'),
('Arte', 'Obras de arte y artesanías'),
('Instrumentos Musicales', 'Instrumentos musicales y accesorios');


INSERT INTO Emprendimientos (nombre, descripcion, categoria_id, usuario_id) VALUES

INSERT INTO Administradores (nombre, apellido, usuario_id) VALUES
('Yudy', 'Benavides', 1),
('Carlos', 'García', 2),
('Darwin', 'Rodríguez', 3),
('Esteban', 'López', 4);

INSERT INTO Patrocinadores (nombre_empresa, persona_contacto, telefono, fecha_registro, usuario_id) VALUES


INSERT INTO Productos (nombre, descripcion, precio, emprendimiento_id, categoria_id, imagen, stock, fecha_publicacion) VALUES


INSERT INTO Anuncios (titulo, descripcion, usuario_id, fecha_creacion, fecha_expiracion, costo, categoria_id, imagen) VALUES




SELECT * FROM Usuarios;
SELECT * FROM Administradores;
SELECT * FROM Emprendimientos;





ALTER TABLE Usuarios MODIFY contraseña VARCHAR(255);

SELECT email, role FROM Usuarios;
