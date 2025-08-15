# Sistema de Gestión de Librería - Fullstack

Una aplicación web completa para la gestión de una librería, desarrollada con tecnologías modernas y siguiendo las mejores prácticas de desarrollo web.

## 🚀 Características

### Backend (API REST)
- **Autenticación de usuarios** con JWT
- **CRUD completo** para gestión de libros
- **Validación de datos** con express-validator
- **APIs externas** integradas (Pokémon y Clima)
- **Seguridad** con encriptación de contraseñas
- **Middleware de autenticación** para proteger rutas

### Frontend (Interfaz Web)
- **Interfaz moderna** con Bootstrap 5
- **Autenticación** con login y registro
- **Gestión completa de libros** (Crear, Leer, Actualizar, Eliminar)
- **APIs externas** integradas en la interfaz
- **Diseño responsive** para todos los dispositivos
- **Animaciones y efectos** visuales modernos
- **Manejo de promesas** para todas las peticiones fetch

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas
- **axios** - Cliente HTTP para APIs externas
- **express-validator** - Validación de datos
- **cors** - Middleware para CORS

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript ES6+** - Lógica de la aplicación
- **Bootstrap 5** - Framework CSS
- **Font Awesome** - Iconos
- **Fetch API** - Peticiones HTTP con promesas

### APIs Externas
- **PokéAPI** - Información de Pokémon
- **OpenWeather API** - Datos del clima

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)
- Navegador web moderno

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd project-fullstack-frontend
   ```

2. **Instalar dependencias del backend**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear un archivo `.env` en la raíz del proyecto:
   ```env
   PORT=3000
   JWT_SECRET=tu_secreto_jwt_super_seguro_cambiar_en_produccion
   OPENWEATHER_API_KEY=tu_api_key_de_openweather_aqui
   ```

4. **Iniciar el servidor backend**
   ```bash
   npm start
   # O para desarrollo con nodemon:
   npm run dev
   ```

5. **Abrir la aplicación**
   - Abrir `index.html` en tu navegador
   - O usar un servidor local como Live Server en VS Code

## 🎯 Uso de la Aplicación

### Usuarios Predefinidos
- **Admin**: `admin` / `password`
- **Usuario**: `usuario` / `password`

### Funcionalidades Principales

#### 1. Autenticación
- **Login**: Iniciar sesión con usuario y contraseña
- **Registro**: Crear nueva cuenta de usuario
- **Logout**: Cerrar sesión

#### 2. Gestión de Libros
- **Ver catálogo**: Tabla con todos los libros
- **Crear libro**: Formulario modal para agregar nuevos libros
- **Editar libro**: Modificar información existente
- **Eliminar libro**: Borrar libros del catálogo

#### 3. APIs Externas
- **Pokémon**: Cargar información de Pokémon con imágenes
- **Clima**: Obtener datos meteorológicos por ciudad

## 📁 Estructura del Proyecto

```
project-fullstack-frontend/
├── server.js              # Servidor Express principal
├── package.json           # Dependencias y scripts
├── index.html             # Interfaz principal
├── app.js                 # Lógica del frontend
├── style.css              # Estilos personalizados
└── README.md              # Documentación
```

## 🔌 Endpoints de la API

### Autenticación
- `POST /api/users/register` - Registrar nuevo usuario
- `POST /api/users/login` - Iniciar sesión

### Librería (CRUD)
- `GET /api/library/books` - Obtener todos los libros
- `GET /api/library/books/:id` - Obtener libro específico
- `POST /api/library/books` - Crear nuevo libro
- `PUT /api/library/books/:id` - Actualizar libro
- `DELETE /api/library/books/:id` - Eliminar libro

### APIs Externas
- `GET /api/external/pokemon` - Datos de Pokémon
- `GET /api/external/weather` - Datos del clima

### Utilidades
- `GET /api/health` - Estado del servidor

## 🔒 Seguridad

- **Autenticación JWT**: Tokens seguros para sesiones
- **Encriptación**: Contraseñas hasheadas con bcrypt
- **Validación**: Datos validados en frontend y backend
- **CORS**: Configurado para permitir peticiones del frontend
- **Middleware**: Protección de rutas sensibles

## 🎨 Características de Diseño

- **Diseño responsive**: Adaptable a móviles, tablets y desktop
- **Animaciones CSS**: Transiciones suaves y efectos hover
- **Gradientes**: Fondos modernos con gradientes
- **Iconos**: Font Awesome para mejor UX
- **Modales**: Formularios en ventanas modales
- **Alertas**: Notificaciones flotantes
- **Loading states**: Indicadores de carga

## 🚀 Funcionalidades Avanzadas

### Manejo de Promesas
- Todas las peticiones fetch utilizan async/await
- Manejo de errores con try/catch
- Promesas para operaciones asíncronas

### Validación de Datos
- Validación en frontend para UX inmediata
- Validación en backend para seguridad
- Mensajes de error descriptivos

### Persistencia
- Tokens JWT almacenados en localStorage
- Información de usuario persistente
- Sesiones mantenidas entre recargas

## 🔧 Configuración Avanzada

### Variables de Entorno
```env
PORT=3000                    # Puerto del servidor
JWT_SECRET=tu_secreto        # Secreto para JWT
OPENWEATHER_API_KEY=tu_key   # API key para OpenWeather
```

### Personalización
- Modificar colores en variables CSS (`:root`)
- Cambiar animaciones en `style.css`
- Ajustar validaciones en `server.js`

## 🐛 Solución de Problemas

### Error de CORS
- Verificar que el servidor esté corriendo en el puerto correcto
- Comprobar configuración de CORS en `server.js`

### Error de Autenticación
- Verificar que el token esté presente en localStorage
- Comprobar que el JWT_SECRET esté configurado

### APIs Externas No Funcionan
- Verificar conexión a internet
- Comprobar API keys configuradas
- Revisar límites de rate limiting

## 📈 Mejoras Futuras

- [ ] Base de datos persistente (MongoDB/PostgreSQL)
- [ ] Subida de imágenes para libros
- [ ] Sistema de búsqueda y filtros
- [ ] Paginación para grandes catálogos
- [ ] Sistema de roles y permisos
- [ ] Logs y monitoreo
- [ ] Tests automatizados
- [ ] Docker para despliegue

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

Desarrollado como proyecto académico para demostrar habilidades fullstack.

---

**Nota**: Este es un proyecto educativo. Para uso en producción, asegúrate de implementar medidas de seguridad adicionales y usar una base de datos real.

