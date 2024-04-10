

CREATE DATABASE IF NOT EXISTS AGLAIA;

USE AGLAIA;

CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    apellido VARCHAR(45) NOT NULL,
    email VARCHAR(45) NOT NULL unique,
    contraseña VARCHAR(45) NOT NULL unique
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

CREATE TABLE Categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(45) NOT NULL,
    descripcion TEXT,
    imagen VARCHAR(255)
);

show tables;