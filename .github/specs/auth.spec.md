---
id: SPEC-002
status: DRAFT
feature: auth
created: 2026-04-14
updated: 2026-04-14
author: spec-generator
version: "1.0"
related-specs: []
---

# Spec: Autenticación de Usuarios (Backend JWT)

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción
Se requiere implementar un sistema de autenticación seguro basado en JWT (JSON Web Tokens) desarrollado íntegramente en el backend de Node.js. El sistema permitirá a los usuarios autenticarse mediante un nombre de usuario y contraseña, obtener un token de sesión, y mantener su identidad autenticada para acceder a funcionalidades protegidas como guardar puntajes y participar en la tabla de clasificación.

### Requerimiento de Negocio (Fuente: `.github/requirements/auth.md`)
- Implementar registro de usuarios con nombre de usuario y contraseña.
- Implementar inicio de sesión que retorne token JWT autenticado.
- Permitir jugar como invitado sin autenticación previa.
- Al finalizar una partida como invitado, ofrecer la opción de registro.
- Almacenar contraseñas de forma segura con hashing (bcrypt).
- No utilizar servicios externos como Firebase Auth — todo en backend.
- Persistencia en PostgreSQL.

### Historias de Usuario

#### HU-01: Registrarse como nuevo usuario

```
Como:        Usuario interesado en el juego
Quiero:      poder crear una cuenta con mi nombre de usuario y contraseña
Para:        guardar mis puntajes y aparecer en la tabla general de clasificación

Prioridad:   Alta
Estimación:  M
Dependencias: Ninguna
Capa:        Ambas (Backend + Frontend)
```

#### Criterios de Aceptación — HU-01

**Happy Path**
```gherkin
CRITERIO-1.1: Registro exitoso con credenciales válidas
  Dado que:  el Usuario está en la pantalla de registro (o post-partida invitado)
  Cuando:    ingresa un username único y una contraseña con 8+ caracteres
  Y:         presiona "Crear Cuenta"
  Entonces:  el backend valida la unicidad del username
  Y:         hashea la contraseña con bcrypt
  Y:         crea un registro en tabla `users` (id, username, password_hash, created_at, updated_at)
  Y:         retorna respuesta 201 con token JWT
  Y:         el frontend almacena el token en localStorage/cookie
  Y:         redirige a /dashboard o /game
```

**Error Path**
```gherkin
CRITERIO-1.2: Username duplicado rechazado
  Dado que:  existe un usuario con username="pokefan123"
  Cuando:    otro usuario intenta registrarse con el mismo username
  Entonces:  el backend retorna 409 Conflict
  Y:         el mensaje de error es "El nombre de usuario ya existe"
  Y:         el frontend muestra la alerta al usuario

CRITERIO-1.3: Contraseña débil rechazada
  Dado que:  el Usuario ingresa una contraseña con menos de 8 caracteres
  Cuando:    presiona "Crear Cuenta"
  Entonces:  el backend valida y retorna 400 Bad Request
  Y:         el mensaje es "La contraseña debe tener al menos 8 caracteres"

CRITERIO-1.4: Campo requerido faltante
  Dado que:  el Usuario no ingresa username o contraseña
  Cuando:    presiona "Crear Cuenta"
  Entonces:  el backend retorna 400 Bad Request
  Y:         el mensaje especifica qué campo falta
```

**Edge Case**
```gherkin
CRITERIO-1.5: Username con caracteres especiales permitidos
  Dado que:  el Usuario ingresa username="poke_fan-123"
  Cuando:    presiona "Crear Cuenta"
  Entonces:  el backend acepta caracteres alfanuméricos, guiones y guiones bajos
  Y:         crea la cuenta exitosamente
```

---

#### HU-02: Iniciar sesión con credenciales registradas

```
Como:        Usuario registrado
Quiero:      poder iniciar sesión con mi username y contraseña
Para:        acceder a la aplicación y recuperar mis puntajes previos

Prioridad:   Alta
Estimación:  M
Dependencias: HU-01
Capa:        Ambas
```

#### Criterios de Aceptación — HU-02

**Happy Path**
```gherkin
CRITERIO-2.1: Login exitoso con credenciales válidas
  Dado que:  el Usuario está en la pantalla de login
  Y:         existe un usuario registrado con username="pokefan123"
  Cuando:    ingresa username="pokefan123" y password="MyPassword123"
  Y:         presiona "Iniciar Sesión"
  Entonces:  el backend valida el username en tabla `users`
  Y:         compara la contraseña con bcrypt.compare()
  Y:         genera un token JWT con payload {username, id, iat, exp}
  Y:         retorna 200 OK con {token, user: {id, username}}
  Y:         el frontend almacena el token
  Y:         redirige a /game
```

**Error Path**
```gherkin
CRITERIO-2.2: Username no encontrado
  Dado que:  el Usuario intenta login con username inexistente
  Cuando:    presiona "Iniciar Sesión"
  Entonces:  el backend retorna 401 Unauthorized
  Y:         el mensaje es "Usuario o contraseña incorrectos" (sin revelar detalles)

CRITERIO-2.3: Contraseña incorrecta
  Dado que:  el Usuario ingresa username existente pero contraseña errónea
  Cuando:    presiona "Iniciar Sesión"
  Entonces:  el backend retorna 401 Unauthorized
  Y:         el mensaje es "Usuario o contraseña incorrectos"

CRITERIO-2.4: Campo requerido faltante
  Dado que:  el Usuario deja en blanco el username o contraseña
  Cuando:    presiona "Iniciar Sesión"
  Entonces:  el backend retorna 400 Bad Request
  Y:         especifica qué campo falta
```

---

#### HU-03: Jugar como invitado sin autenticación

```
Como:        Usuario nuevo sin cuenta
Quiero:      poder jugar sin necesidad de registrarme inmediatamente
Para:        probar el juego antes de decidir si crearme una cuenta

Prioridad:   Media
Estimación:  S
Dependencias: Ninguna (independiente)
Capa:        Frontend
```

#### Criterios de Aceptación — HU-03

**Happy Path**
```gherkin
CRITERIO-3.1: Acceso como invitado
  Dado que:  el Usuario llega al sitio o presiona "Jugar como Invitado"
  Cuando:    accede a la ruta /game sin token
  Entonces:  el frontend permite la entrada a la mecánica del juego
  Y:         el usuario puede jugar una partida completa
  Y:         al finalizar, se le ofrece la opción "Crear una cuenta para guardar tu puntaje"
  Y:         si rechaza, puede reiniciar otra partida sin guardar

CRITERIO-3.2: Sin acceso a paneles protegidos
  Dado que:  el Usuario está jugando como invitado
  Cuando:    intenta acceder a /leaderboard o /profile
  Entonces:  el frontend redirige a /login
  Y:         muestra el mensaje "Debes iniciar sesión para acceder aquí"
```

---

### Reglas de Negocio
1. **Validación de Username**: Caracteres permitidos: `[a-zA-Z0-9_-]`, longitud 3-20 caracteres.
2. **Validación de Contraseña**: Mínimo 8 caracteres.
3. **Unicidad de Username**: No pueden existir dos usuarios con el mismo username (case-insensitive).
4. **Hashing de Contraseña**: Usar bcrypt con salt rounds = 10.
5. **Expiración de Token JWT**: El token debe expirar en 7 días (604800 segundos).
6. **Autenticación Requerida**: Endpoints protegidos requieren header `Authorization: Bearer {token}`.
7. **Sesión de Invitado**: Un invitado no puede guardar puntajes ni aparecer en leaderboard.

---

## 2. DISEÑO

### Modelos de Datos

#### Tabla: `users`
| Campo | Tipo | Obligatorio | Validación | Descripción |
|-------|------|-------------|------------|-------------|
| `id` | UUID / Serial | sí | auto-generado, PK | Identificador único del usuario |
| `username` | VARCHAR(20) | sí | unique, not null | Nombre de usuario único (case-insensitive) |
| `password_hash` | VARCHAR(255) | sí | not null | Hash bcrypt de la contraseña |
| `created_at` | TIMESTAMP | sí | DEFAULT NOW(), UTC | Fecha de creación de la cuenta |
| `updated_at` | TIMESTAMP | sí | DEFAULT NOW(), UTC | Última actualización de la cuenta |

#### Índices
- `users_username_unique`: UNIQUE INDEX en `username` para evitar duplicados.
- `users_created_at_idx`: INDEX en `created_at` para consultas de analytics.

#### Constraints
```sql
ALTER TABLE users ADD CONSTRAINT users_username_length 
  CHECK (LENGTH(username) >= 3 AND LENGTH(username) <= 20);

ALTER TABLE users ADD CONSTRAINT users_password_length 
  CHECK (LENGTH(password_hash) >= 60);  -- bcrypt hash min 60 chars
```

---

### API Endpoints

#### POST `/api/v1/auth/register`
- **Descripción**: Registra un nuevo usuario
- **Auth requerida**: No
- **Request Body**:
  ```json
  {
    "username": "pokefan123",
    "password": "MyPassword123"
  }
  ```
- **Response 201 Created**:
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "pokefan123",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "created_at": "2026-04-14T12:34:56Z"
  }
  ```
- **Response 400 Bad Request**: username o password inválidos
- **Response 409 Conflict**: username ya existe
- **Response 500 Internal Server Error**: error en base de datos

---

#### POST `/api/v1/auth/login`
- **Descripción**: Autentica con username y contraseña, retorna JWT
- **Auth requerida**: No
- **Request Body**:
  ```json
  {
    "username": "pokefan123",
    "password": "MyPassword123"
  }
  ```
- **Response 200 OK**:
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "pokefan123",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800
  }
  ```
- **Response 400 Bad Request**: campos faltantes o inválidos
- **Response 401 Unauthorized**: usuario no encontrado o contraseña incorrecta
- **Response 500 Internal Server Error**: error en base de datos

---

#### GET `/api/v1/auth/me`
- **Descripción**: Valida el token JWT y retorna los datos del usuario autenticado
- **Auth requerida**: Sí (`Authorization: Bearer {token}`)
- **Response 200 OK**:
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "pokefan123",
    "created_at": "2026-04-14T12:34:56Z"
  }
  ```
- **Response 401 Unauthorized**: token ausente, inválido o expirado
- **Response 403 Forbidden**: token válido pero usuario no existe

---

### Diseño Frontend

#### Componentes Nuevos
| Componente | Archivo | Props principales | Descripción |
|------------|---------|------------------|-------------|
| `RegisterForm` | `src/components/auth/RegisterForm.jsx` | `onSubmit, isLoading` | Formulario de registro |
| `LoginForm` | `src/components/auth/LoginForm.jsx` | `onSubmit, isLoading` | Formulario de login |
| `ProtectedRoute` | `src/components/routing/ProtectedRoute.jsx` | `children, redirectTo` | Wrapper para rutas protegidas |

#### Páginas Nuevas
| Página | Archivo | Ruta | Protegida |
|--------|---------|------|-----------|
| `RegisterPage` | `src/pages/RegisterPage.jsx` | `/register` | No |
| `LoginPage` | `src/pages/LoginPage.jsx` | `/login` | No |

#### Hooks y State
| Hook | Archivo | Retorna | Descripción |
|------|---------|---------|-------------|
| `useAuth` | `src/hooks/useAuth.js` | `{ user, token, isLoading, login, register, logout, isAuthenticated }` | Context/custom hook para gestión de auth global |

#### Services (Llamadas API)
| Función | Archivo | Endpoint | Descripción |
|---------|---------|---------|-------------|
| `registerUser(username, password)` | `src/services/authService.js` | `POST /api/v1/auth/register` | Registra un nuevo usuario |
| `loginUser(username, password)` | `src/services/authService.js` | `POST /api/v1/auth/login` | Autentica con credenciales |
| `validateToken(token)` | `src/services/authService.js` | `GET /api/v1/auth/me` | Valida el JWT almacenado |
| `logoutUser()` | `src/services/authService.js` | (sin endpoint) | Limpia token local |

#### Almacenamiento Local
- **Token JWT**: Guardar en `localStorage['auth_token']` o cookie segura con flag `httpOnly` (si el backend lo soporta).
- **User Info**: Guardar en `localStorage['auth_user']` (opcional, puede leerse del token decodificado).

#### Validación en Frontend
- Username: min 3, max 20 caracteres; alfanuméricos, guiones, guiones bajos.
- Password: min 8 caracteres.
- Validar en tiempo real y mostrar feedback al usuario.

---

### Arquitectura y Dependencias

#### Backend (Node.js)
- **Paquetes requeridos**:
  - `jsonwebtoken` — para generar y validar JWT
  - `bcryptjs` — para hashing de contraseñas
  - `express` — framework web (ya existente)
  - `pg` o `sequelize` — cliente PostgreSQL (ya existente)
  - `dotenv` — para variable de entorno `JWT_SECRET`

#### Frontend (React)
- **Paquetes requeridos**:
  - `axios` — cliente HTTP (probablemente ya existe)
  - `react-router-dom` — (ya existe, para routing protegido)
  - (Opcional) `jwtdecode` — para decodificar JWT sin validar firma

#### Variables de Entorno Requeridas
- **Backend**: `JWT_SECRET` (string al menos 32 caracteres), `JWT_EXPIRES_IN` (ej. "7d")
- **Frontend**: `REACT_APP_API_BASE_URL` (ej. "http://localhost:5000")

---

### Notas de Implementación
- **Middleware JWT**: Crear middleware `authMiddleware` que valide el token en endpoints protegidos.
- **CORS**: Configurar CORS para permitir credenciales si se usa cookie httpOnly.
- **Rate Limiting**: Considerar limitar intentos de login (ej. 5 intentos en 15 minutos) en fase posterior.
- **Session Cleanup**: Considerar lógica de logout que invalide tokens en lista negra (opcional para MVP).

---

## 3. LISTA DE TAREAS

> Checklist accionable para todos los agentes. El Orchestrator monitorea el progreso.

### Backend

#### Modelo y Repositorio
- [ ] Crear esquema SQL para tabla `users` con constraints y índices
- [ ] Crear modelo/DTO: `UserCreate` (username, password)
- [ ] Crear modelo/DTO: `UserResponse` (id, username, created_at)
- [ ] Crear modelo/DTO: `AuthTokenResponse` (token, expiresIn, user)
- [ ] Crear `UserRepository` — métodos: `create(username, password_hash)`, `findByUsername(username)`, `findById(id)`

#### Servicios y Lógica de Negocio
- [ ] Crear `AuthService` — métodos: `register(username, password)`, `login(username, password)`, `validateToken(token)`
- [ ] Implementar hashing con bcryptjs (salt rounds = 10)
- [ ] Implementar generación de JWT (payload: username, id, iat)
- [ ] Implementar validación de username (3-20 chars, regex `[a-zA-Z0-9_-]`)
- [ ] Implementar validación de password (min 8 chars)

#### Rutas y Controladores
- [ ] Crear ruta `POST /api/v1/auth/register` — controller para HU-01
- [ ] Crear ruta `POST /api/v1/auth/login` — controller para HU-02
- [ ] Crear ruta `GET /api/v1/auth/me` — controller para validación de token
- [ ] Implementar middleware `authMiddleware` (valida JWT en header `Authorization`)
- [ ] Registrar rutas en punto de entrada de la app

#### Tests Backend
- [ ] `test_register_success_with_valid_credentials` — HU-01 Happy Path
- [ ] `test_register_fails_with_duplicate_username` — HU-01 Error Path (409)
- [ ] `test_register_fails_with_weak_password` — HU-01 Error Path (400)
- [ ] `test_register_fails_with_missing_fields` — HU-01 Error Path (400)
- [ ] `test_login_success_with_valid_credentials` — HU-02 Happy Path
- [ ] `test_login_fails_with_invalid_username` — HU-02 Error Path (401)
- [ ] `test_login_fails_with_invalid_password` — HU-02 Error Path (401)
- [ ] `test_auth_middleware_validates_token` — autenticación en endpoints protegidos
- [ ] `test_auth_middleware_rejects_expired_token` — token expirado
- [ ] `test_crypto_password_hashing_with_bcrypt` — validación de bcrypt

### Frontend

#### Componentes
- [ ] Crear `RegisterForm.jsx` — form de registro con campos username/password
- [ ] Crear `LoginForm.jsx` — form de login con campos username/password
- [ ] Crear `ProtectedRoute.jsx` — wrapper para rutas autenticadas
- [ ] Implementar validación de campos en tiempo real (feedback visual)
- [ ] Implementar estados de carga (spinner en botones durante fetch)
- [ ] Implementar mensajes de error descriptivos en UI

#### Hooks y State Management
- [ ] Crear `useAuth.js` hook/context con estado global de autenticación
- [ ] Implementar persistencia de token en localStorage
- [ ] Implementar lógica de `login(username, password)` 
- [ ] Implementar lógica de `register(username, password)`
- [ ] Implementar lógica de `logout()`
- [ ] Validar token al cargar la app (si existe en localStorage)

#### Services API
- [ ] Crear `authService.js` con funciones de fetch a endpoints `/auth/login`, `/auth/register`, `/auth/me`
- [ ] Implementar manejo de errores HTTP (400, 401, 409, 500)
- [ ] Implementar envío de token en header `Authorization: Bearer {token}`

#### Páginas y Routing
- [ ] Crear `/register` → `RegisterPage.jsx`
- [ ] Crear `/login` → `LoginPage.jsx`
- [ ] Actualizar `App.jsx` para envolver rutas protegidas con `ProtectedRoute`
- [ ] Implementar redirección: `/login` o `/register` si no autenticado
- [ ] Implementar redirección: `/game` o `/dashboard` al autenticarse exitosamente

#### Tests Frontend
- [ ] `test_register_form_submits_on_valid_input` — input y submit
- [ ] `test_login_form_submits_on_valid_input` — input y submit
- [ ] `test_auth_service_register_returns_token` — API call success
- [ ] `test_auth_service_login_returns_token` — API call success
- [ ] `test_protected_route_redirects_unauthenticated_user` — ProtectedRoute logic
- [ ] `test_use_auth_hook_persists_token_in_storage` — localStorage persistence
- [ ] `test_use_auth_hook_clears_token_on_logout` — logout behavior

### QA

#### Test Plan
- [ ] Crear `test-cases/auth-registration.feature` — escenarios Gherkin para HU-01
- [ ] Crear `test-cases/auth-login.feature` — escenarios Gherkin para HU-02
- [ ] Crear `test-cases/auth-protected-routes.feature` — escenarios Gherkin para HU-03

#### Test de Seguridad
- [ ] Validar que contraseña no se almacena en texto plano
- [ ] Validar que token JWT no contiene información sensible en payload
- [ ] Validar que endpoints protegidos rechazan requests sin token
- [ ] Validar que tokens expirados son rechazados

#### Test de Usabilidad
- [ ] Validar que mensajes de error son claros y no revelan detalles (ej. "usuario o contraseña incorrectos")
- [ ] Validar que formularios muestran feedback en tiempo real
- [ ] Validar que redirecciones ocurren correctamente post-login

---

**Versión**: 1.0  
**Último actualizado**: 2026-04-14  
**Generada por**: spec-generator
