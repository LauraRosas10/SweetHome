

-- Crear la nueva base de datos
CREATE DATABASE sweet_home_db;

-- Usar la base de datos recién creada
USE sweet_home_db;

-- Creacion tabla ROLES

CREATE TABLE Rol (
	Id_rol INT PRIMARY KEY AUTO_INCREMENT,
	Nombre VARCHAR(100),
	Estado VARCHAR(50)
);


-- Creación de la tabla Usuarios
CREATE TABLE Usuario (
    Id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100),
    Apellidos VARCHAR(100),
    Email VARCHAR(150) ,  
    Contraseña VARCHAR(50),
    Rol int,
    Telefono VARCHAR(20),
	
	FOREIGN KEY (Rol) REFERENCES Rol(Id_rol)
);

-- Creación de la tabla Categoria
CREATE TABLE Categoria (
    Id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(200),
    Descripcion VARCHAR(300),
	Estado VARCHAR(50)
);


-- Creación de la tabla Producto
CREATE TABLE Producto(
    Id_producto INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(150),
    Stock INT,
    Precio FLOAT,
    Descripcion VARCHAR(300),
    Imagen longtext,
    Estado varchar(60),
    Id_categoria INT,
    Id_usuario INT,
    FOREIGN KEY (Id_categoria) REFERENCES Categoria(Id_categoria),
    FOREIGN KEY (Id_usuario) REFERENCES Usuario(Id_usuario)
);

-- Creación de la tabla Pedido
CREATE TABLE Pedido (
    Id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    Id_usuario INT,
    Fecha DATE,
    Total FLOAT,
    Estado VARCHAR(100),
    Direccion VARCHAR(150),
    Tipo_pago VARCHAR(100),
    FOREIGN KEY (Id_usuario) REFERENCES Usuario(Id_usuario)
);

-- Creación de la tabla DetallePedido
CREATE TABLE DetallePedido (
    Id_detalle_pedido INT PRIMARY KEY AUTO_INCREMENT,
    Id_pedido INT,
    Id_producto INT,
    Cantidad INT,
    Precio_unitario FLOAT,
    FOREIGN KEY (Id_pedido) REFERENCES Pedido(Id_pedido),
    FOREIGN KEY (Id_producto) REFERENCES Producto(Id_producto)
);


INSERT INTO `rol` VALUES (1,'Administrador','Activo'),(2,'Vendedor-Comprador','Activo');
INSERT INTO `usuario` VALUES (1,'Laura','Rosas','lala@gmail.com','lala',1,'3142105956'),(2,'Angie','Rosas','angie@gmail.com','1234',1,'3242567892'),(8,'Lucia','Gomez','afkjh@gmail.com','12345678',2,'3138762774'),(10,'Marisol','Joya','marisol@gmail.com','alicia123',2,'3112411768'),(23,'Maria','Joya','lalalalal@gmail.com','123456789',2,'3118765342'),(24,'Claudia','Rosales','claudia@gmail.com','claudia',1,'3219067547');
INSERT INTO `categoria` VALUES (1,'Baño','Accesorios, toallas, cortinas de ducha y decoración para el baño.','ACTIVO'),(2,'Limpieza y Organización','Productos de limpieza, cestas, cajas organizadoras y perchas.','ACTIVO'),(3,'Cocina y Comedor','Utensilios, electrodomésticos, vajilla, cristalería y mantelería, se proporcionan en esta categoria.','ACTIVO'),(4,'Decoración','Arte, iluminación, espejos, cortinas, cojines y objetos decorativos.','ACTIVO'),(5,'Dormitorio','Ropa de cama, almohadas, colchas y elementos decorativos específicos de la habitación.','ACTIVO'),(6,'Muebles','Sillas, mesas, estanterías, sofás y camas.','ACTIVO');
