
CREATE SCHEMA IF NOT EXISTS `aglaia` DEFAULT CHARACTER SET utf8mb4 ;
USE `aglaia` ;

-- -----------------------------------------------------
-- Table `aglaia`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aglaia`.`usuarios` (
  `id_usuario` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `contraseña` VARCHAR(255) NULL DEFAULT NULL,
  `role` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `email` (`email` ASC) VISIBLE,
  UNIQUE INDEX `contraseña` (`contraseña` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `aglaia`.`administradores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aglaia`.`administradores` (
  `id_administrador` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido` VARCHAR(45) NOT NULL,
  `usuario_id` INT(11) NOT NULL,
  PRIMARY KEY (`id_administrador`),
  INDEX `usuario_id` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `administradores_ibfk_1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `aglaia`.`usuarios` (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `aglaia`.`categorias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aglaia`.`categorias` (
  `id_categoria` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre_categoria` VARCHAR(45) NOT NULL,
  `descripcion` TEXT NULL DEFAULT NULL,
  `imagen` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id_categoria`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `aglaia`.`anuncios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aglaia`.`anuncios` (
  `id_anuncio` INT(11) NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(45) NOT NULL,
  `descripcion` TEXT NULL DEFAULT NULL,
  `usuario_id` INT(11) NOT NULL,
  `fecha_creacion` DATE NULL DEFAULT NULL,
  `fecha_expiracion` DATE NULL DEFAULT NULL,
  `costo` DECIMAL(10,2) NULL DEFAULT NULL,
  `categoria_id` INT(11) NOT NULL,
  `imagen` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id_anuncio`),
  INDEX `usuario_id` (`usuario_id` ASC) VISIBLE,
  INDEX `categoria_id` (`categoria_id` ASC) VISIBLE,
  CONSTRAINT `anuncios_ibfk_1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `aglaia`.`usuarios` (`id_usuario`),
  CONSTRAINT `anuncios_ibfk_2`
    FOREIGN KEY (`categoria_id`)
    REFERENCES `aglaia`.`categorias` (`id_categoria`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `aglaia`.`emprendimientos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aglaia`.`emprendimientos` (
  `id_emprendimiento` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `descripcion` TEXT NULL DEFAULT NULL,
  `categoria_id` INT(11) NOT NULL,
  `usuario_id` INT(11) NOT NULL,
  PRIMARY KEY (`id_emprendimiento`),
  UNIQUE INDEX `nombre` (`nombre` ASC) VISIBLE,
  INDEX `categoria_id` (`categoria_id` ASC) VISIBLE,
  INDEX `usuario_id` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `emprendimientos_ibfk_1`
    FOREIGN KEY (`categoria_id`)
    REFERENCES `aglaia`.`categorias` (`id_categoria`),
  CONSTRAINT `emprendimientos_ibfk_2`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `aglaia`.`usuarios` (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `aglaia`.`patrocinadores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aglaia`.`patrocinadores` (
  `id_patrocinador` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre_empresa` VARCHAR(45) NOT NULL,
  `persona_contacto` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(20) NOT NULL,
  `fecha_registro` DATE NULL DEFAULT NULL,
  `usuario_id` INT(11) NOT NULL,
  PRIMARY KEY (`id_patrocinador`),
  UNIQUE INDEX `nombre_empresa` (`nombre_empresa` ASC) VISIBLE,
  INDEX `usuario_id` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `patrocinadores_ibfk_1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `aglaia`.`usuarios` (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `aglaia`.`productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aglaia`.`productos` (
  `id_producto` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `descripcion` TEXT NULL DEFAULT NULL,
  `precio` DECIMAL(10,2) NULL DEFAULT NULL,
  `emprendimiento_id` INT(11) NOT NULL,
  `categoria_id` INT(11) NOT NULL,
  `imagen` VARCHAR(255) NULL DEFAULT NULL,
  `stock` INT(11) NULL DEFAULT NULL,
  `fecha_publicacion` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`id_producto`),
  INDEX `emprendimiento_id` (`emprendimiento_id` ASC) VISIBLE,
  INDEX `categoria_id` (`categoria_id` ASC) VISIBLE,
  CONSTRAINT `productos_ibfk_1`
    FOREIGN KEY (`emprendimiento_id`)
    REFERENCES `aglaia`.`emprendimientos` (`id_emprendimiento`),
  CONSTRAINT `productos_ibfk_2`
    FOREIGN KEY (`categoria_id`)
    REFERENCES `aglaia`.`categorias` (`id_categoria`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `aglaia`.`sala`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aglaia`.`sala` (
  `idsala` INT NOT NULL,
  `fecha` DATE NOT NULL,
  PRIMARY KEY (`idsala`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `aglaia`.`mensaje`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aglaia`.`mensaje` (
  `idMensaje` INT NOT NULL,
  `Mensaje` VARCHAR(500) NOT NULL,
  `url` VARCHAR(45) NULL,
  `Fecha` DATE NOT NULL,
  `sala_idsala` INT NOT NULL,
  `usuarios_id_usuario` INT(11) NOT NULL,
  PRIMARY KEY (`idMensaje`, `sala_idsala`, `usuarios_id_usuario`),
  INDEX `fk_mensaje_sala1_idx` (`sala_idsala` ASC) VISIBLE,
  INDEX `fk_mensaje_usuarios1_idx` (`usuarios_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_mensaje_sala1`
    FOREIGN KEY (`sala_idsala`)
    REFERENCES `aglaia`.`sala` (`idsala`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_mensaje_usuarios1`
    FOREIGN KEY (`usuarios_id_usuario`)
    REFERENCES `aglaia`.`usuarios` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

