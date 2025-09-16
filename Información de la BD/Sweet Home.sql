

-- Crear la base de datos
CREATE DATABASE sweet_home_db;

-- Usar la base de datos 
USE sweet_home_db;

-- Creacion tabla Roles
CREATE TABLE Rol (
	Id_rol INT PRIMARY KEY AUTO_INCREMENT,
	Nombre VARCHAR(100)
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
    Nombre VARCHAR(20),
    Descripcion VARCHAR(300)
);


-- Creación de la tabla Producto
CREATE TABLE Producto(
    Id_producto INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(150),
    Stock INT,
    Precio FLOAT,
    Descripcion VARCHAR(300),
    Imagen VARCHAR(300),
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



