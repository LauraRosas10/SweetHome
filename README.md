# 🏡 Sweet Home - Sistema de Venta de Garage  

**Spring Boot + JavaScript + MySQL**  

Sweet Home es una aplicación web para la **compra y venta de artículos usados**, tipo “venta de garage”.  
Permite a los usuarios **publicar productos**, **comunicarse con vendedores** y **gestionar pedidos** fácilmente desde cualquier dispositivo.  

---

## Vista Previa del Proyecto  

| Página Principal | Login | Registrarse como usuario |
|------------------|-----------------------|----------------------|
| ![Home](src_readme/home.png) | ![Login](src_readme/inicio_sesion.png) | ![Registro](src_readme/registro.png) |


| Gestión de categorías | Catálogo de Productos | Gestión de Productos |
|------------------|-----------------------|----------------------|
| ![categorias](src_readme/gestion_categorias.png) | ![catalogo](src_readme/productos.png) | ![productos](src_readme/gestion_productos.png) |

| Gestión de usuarios | 
|----------|
| ![usuarios](src_readme/gestion_usuarios.png) | 

---

## Características Principales  

-Gestión de Productos
-Pedidos
-Búsqueda Avanzada — Filtra por nombre, categoría
-Comunicación Directa — Contacto rápido entre comprador y vendedor  
-Diseño Responsive — Adaptado a móviles, tablets y desktops  
-Seguridad JWT — Autenticación y control de acceso con Spring Security  
---

##  Tabla de Contenidos
1. [Instalación y Configuración](#instalación-y-configuración)  
2. [Ejecución del Proyecto](#-ejecución-del-proyecto)  
3. [Solución de Problemas](#-solución-de-problemas)  
4. [Tecnologías Utilizadas](#-tecnologías-utilizadas)  
5. [Estructura del Proyecto](#️-estructura-del-proyecto)  
6. [Arquitectura de Datos](#-arquitectura-de-datos)  
7. [API Endpoints](#-api-endpoints)  
8. [Roadmap](#-roadmap)  
9. [Contribución](#-contribución)  
10. [Equipo de Desarrollo](#-equipo-de-desarrollo)  
11. [Contacto y Soporte](#-contacto-y-soporte)  

---

## Instalación y Configuración

### 🔧 Requisitos Previos  
Asegúrate de tener instalado:  
-  **Java 17 o superior** – [Descargar](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)  
-  **Spring Boot 3.5.5**  
-  **MySQL** – [Descargar](https://dev.mysql.com/downloads/)    
-  **Git** – [Descargar](https://git-scm.com/)  


---

### Instalación Paso a Paso

####  Clonar el Repositorio  
```bash
git clone https://github.com/TU_USUARIO/SweetHome.git
cd SweetHome
```


2️⃣ Configurar Backend (Spring Boot + MySQL)

Crear la base de datos ejecutando el script SQL:

src/backend-springboot/sweet_home.sql


Editar el archivo src/backend-springboot/src/main/resources/application.properties con tus credenciales:
```bash
spring.datasource.url=jdbc:mysql://localhost:3306/sweet_home
spring.datasource.username=<usuario>
spring.datasource.password=<contraseña>
```

Ejecutar el backend:
```bash
cd src/backend-springboot
mvn clean install
mvn spring-boot:run
```
3️⃣ Configurar Frontend (JavaScript)
```bash
cd src/frontend-js
npm install
npm start
```
🚀 Ejecución del Proyecto
Servicio	Puerto	URL
🖥️ Backend (API)	8080	http://localhost:8080/api/

💻 Frontend (App Web)	3000	http://localhost:3000
🧩 Solución de Problemas
Error	Causa	Solución
❌ Cannot connect to MySQL	Credenciales incorrectas o BD no creada	Verifica usuario, contraseña y base de datos
⚠️ CORS policy blocked	Falta de configuración en backend	Agrega @CrossOrigin o configura CORS globalmente
🕳️ Página sin datos	Backend apagado o endpoint erróneo	Asegúrate de que el servidor esté corriendo y las rutas coincidan
🧠 Tecnologías Utilizadas
🔙 Backend

☕ Java 17

🌱 Spring Boot 3.5.5

🔐 Spring Security + JWT

🧱 Maven

🗄️ MySQL

🎨 Frontend

🟨 JavaScript Vanilla (ES6)

🧰 HTML5 + CSS3 + Bootstrap 5

🎨 Diseño Responsive

🏗️ Estructura del Proyecto
```bash
SweetHome/
├── src/
│   ├── backend-springboot/
│   │   ├── src/main/java/com/sweethome/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   └── security/
│   │   ├── src/main/resources/application.properties
│   │   └── sweet_home.sql
│   │
│   ├── frontend-js/
│   │   ├── index.html
│   │   ├── js/
│   │   ├── css/
│   │   └── package.json
│   │
│   └── start-all.bat
├── docs/
│   └── screenshots/
└── README.md
```
🧬 Arquitectura de Datos
🧾 Modelos Principales
👤 Usuario
Campo	Tipo	Descripción
id_usuario	int	Identificador único
nombre	string	Nombre completo
correo	string	Único por usuario
contraseña	string	Encriptada
rol	string	CLIENTE / VENDEDOR
🛍️ Producto
Campo	Tipo	Descripción
id_producto	int	Identificador del producto
nombre	string	Nombre del producto
descripción	string	Detalle del artículo
categoría	string	Clasificación
precio	double	Valor
imagen	string	URL o ruta local
usuario	Usuario	Vendedor propietario
📦 Pedido
Campo	Tipo	Descripción
id_pedido	int	Identificador
usuario	Usuario	Comprador
fecha	date	Fecha del pedido
estado	string	Pendiente / Enviado / Entregado
🧾 DetallePedido
Campo	Tipo	Descripción
pedido	Pedido	Pedido asociado
producto	Producto	Producto comprado
cantidad	int	Cantidad comprada
subtotal	double	Precio total parcial
🌐 API Endpoints Principales
Método	Endpoint	Descripción
GET	/api/productos/	Listar productos
POST	/api/productos/	Crear producto
GET/PUT/DELETE	/api/productos/{id}	Ver / Editar / Eliminar producto
GET	/api/pedidos/	Listar pedidos del usuario
POST	/api/pedidos/	Crear nuevo pedido
GET/POST	/api/usuarios/	Registro y gestión de usuarios
🛣️ Roadmap
Versión	Estado	Descripción
v1.0	✅ Actual	CRUD de productos y pedidos, login básico
v1.1	🚧 Próximamente	Perfil de usuario, estadísticas, búsqueda avanzada
v2.0	🧩 Futuro	Integración con pagos, chat interno, notificaciones en tiempo real, PWA
🤝 Contribución

Las contribuciones son bienvenidas 💖

Pasos:

Haz un fork del repositorio

Clona tu fork
```bash
git clone https://github.com/TU_USUARIO/SweetHome.git
```

Crea una nueva rama
```bash
git checkout -b feature/nueva-funcionalidad
```

Realiza tus cambios y haz commit
```bash
git commit -m "feat: agregar nueva funcionalidad"
```

Sube tu rama
```bash
git push origin feature/nueva-funcionalidad
```

Crea un Pull Request explicando tus cambios

👨‍💻 Equipo de Desarrollo
Nombre	Rol
Laura Rosas	Product Owner & Desarrolladora Principal
Juan Pérez	Scrum Master & Backend
Carlos García	Frontend Developer
📞 Contacto y Soporte

📬 Correo: contacto@sweethome.com

🐞 Reporta errores o solicita funciones en la sección de Issues del repositorio
📖 Consulta la Wiki para documentación adicional



