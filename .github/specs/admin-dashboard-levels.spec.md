---
id: SPEC-004
status: IMPLEMENTED
feature: admin-dashboard-levels
created: 2026-04-18
updated: 2026-04-18
author: spec-generator
version: "1.0"
related-specs: [SPEC-002, SPEC-003]
---

# Spec: Sistema de Administración, Dashboard, Niveles y Sugerencias

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN\_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción
Sistema integral que agrega roles de administrador, dashboard de usuario con acceso al juego, sistema de niveles basado en experiencia (XP), y la posibilidad de que usuarios avanzados (nivel 10+) sugieran nuevos términos que un administrador puede aprobar o rechazar. Los administradores pueden banear usuarios, gestionar términos y configurar el umbral de nivel para sugerencias.

### Requerimiento de Negocio
- Agregar usuario administrador que pueda nombrar otros usuarios como admin.
- Dashboard de admin con capacidad de: banear usuarios, agregar nuevos términos (pokémon/venezolano), aceptar nombres sugeridos por usuarios.
- Dashboard de usuario con botón para comenzar partida.
- Sistema de niveles. A partir del nivel 10 (configurable por admin), los usuarios pueden sugerir nuevos nombres de pokémon o venezolano.

### Historias de Usuario

#### HU-01: Rol de Administrador y Promoción

```
Como:        Administrador
Quiero:      poder asignar el rol de administrador a otros usuarios
Para:        delegar la gestión de la plataforma

Prioridad:   Alta
Estimación:  M
Dependencias: Ninguna
Capa:        Backend + Frontend
```

#### Criterios de Aceptación — HU-01

**Happy Path**
```gherkin
CRITERIO-1.1: Admin promueve usuario a admin
  Dado que:  el usuario autenticado tiene rol "admin"
  Cuando:    envía PATCH /api/v1/admin/users/:id/role con { "role": "admin" }
  Entonces:  el sistema actualiza el rol del usuario objetivo a "admin"
  Y:         retorna 200 con los datos del usuario actualizado
```

**Error Path**
```gherkin
CRITERIO-1.2: Usuario sin permisos intenta promover
  Dado que:  el usuario autenticado tiene rol "user"
  Cuando:    envía PATCH /api/v1/admin/users/:id/role
  Entonces:  el sistema retorna 403 "No tienes permisos de administrador"
```

```gherkin
CRITERIO-1.3: Admin intenta promover usuario inexistente
  Dado que:  el usuario autenticado tiene rol "admin"
  Cuando:    envía PATCH /api/v1/admin/users/:id/role con un ID inexistente
  Entonces:  el sistema retorna 404 "Usuario no encontrado"
```

---

#### HU-02: Banear Usuarios

```
Como:        Administrador
Quiero:      poder banear usuarios que incumplan las reglas
Para:        mantener la integridad de la comunidad

Prioridad:   Alta
Estimación:  M
Dependencias: HU-01
Capa:        Backend + Frontend
```

#### Criterios de Aceptación — HU-02

**Happy Path**
```gherkin
CRITERIO-2.1: Admin banea un usuario
  Dado que:  el usuario autenticado es admin
  Cuando:    envía PATCH /api/v1/admin/users/:id/ban
  Entonces:  el sistema marca al usuario con banned_at = NOW()
  Y:         retorna 200 con { "message": "Usuario baneado exitosamente" }
  Y:         el usuario baneado no puede iniciar sesión
```

```gherkin
CRITERIO-2.2: Admin desbanea un usuario
  Dado que:  el usuario autenticado es admin
  Y:         el usuario objetivo está baneado
  Cuando:    envía PATCH /api/v1/admin/users/:id/unban
  Entonces:  el sistema marca banned_at = NULL
  Y:         retorna 200 con { "message": "Usuario desbaneado exitosamente" }
```

**Error Path**
```gherkin
CRITERIO-2.3: Usuario baneado intenta iniciar sesión
  Dado que:  el usuario tiene banned_at != NULL
  Cuando:    intenta hacer POST /api/v1/auth/login
  Entonces:  el sistema retorna 403 "Tu cuenta ha sido suspendida"
```

---

#### HU-03: Admin Gestiona Términos

```
Como:        Administrador
Quiero:      poder agregar nuevos términos (pokémon o venezolano) al juego
Para:        mantener el contenido fresco y variado

Prioridad:   Alta
Estimación:  S
Dependencias: HU-01
Capa:        Backend + Frontend
```

#### Criterios de Aceptación — HU-03

**Happy Path**
```gherkin
CRITERIO-3.1: Admin agrega un nuevo término
  Dado que:  el usuario autenticado es admin
  Cuando:    envía POST /api/v1/admin/terms con { "text": "Totodile", "category": "pokemon" }
  Entonces:  el sistema crea el término y retorna 201
```

```gherkin
CRITERIO-3.2: Admin elimina un término existente
  Dado que:  el usuario es admin y el término existe
  Cuando:    envía DELETE /api/v1/admin/terms/:id
  Entonces:  el sistema elimina el término y retorna 204
```

**Error Path**
```gherkin
CRITERIO-3.3: Admin intenta agregar término duplicado
  Dado que:  ya existe un término con text "Pikachu"
  Cuando:    envía POST /api/v1/admin/terms con { "text": "Pikachu", "category": "pokemon" }
  Entonces:  retorna 409 "El término ya existe"
```

---

#### HU-04: Dashboard de Usuario

```
Como:        Usuario autenticado
Quiero:      tener un dashboard personal donde pueda iniciar partidas y ver mi progreso
Para:        tener una experiencia centralizada y personalizada

Prioridad:   Alta
Estimación:  M
Dependencias: SPEC-002 (auth), SPEC-003 (gameplay)
Capa:        Frontend (mayormente)
```

#### Criterios de Aceptación — HU-04

**Happy Path**
```gherkin
CRITERIO-4.1: Usuario ve su dashboard tras iniciar sesión
  Dado que:  el usuario ha iniciado sesión exitosamente
  Cuando:    accede a /dashboard
  Entonces:  ve su nombre de usuario, nivel actual, XP acumulado
  Y:         ve un botón "Comenzar Partida"
  Y:         ve su historial de puntajes recientes
```

```gherkin
CRITERIO-4.2: Usuario inicia partida desde el dashboard
  Dado que:  el usuario está en /dashboard
  Cuando:    presiona el botón "Comenzar Partida"
  Entonces:  navega a /game e inicia una nueva partida
```

```gherkin
CRITERIO-4.3: Usuario nivel 10+ ve opción de sugerir términos
  Dado que:  el usuario tiene nivel >= al umbral de sugerencias (default 10)
  Cuando:    accede a /dashboard
  Entonces:  ve la sección "Sugerir Término" con un formulario
```

**Edge Case**
```gherkin
CRITERIO-4.4: Usuario nivel < 10 no ve opción de sugerencias
  Dado que:  el usuario tiene nivel inferior al umbral
  Cuando:    accede a /dashboard
  Entonces:  no ve la sección de sugerencias
  Y:         ve un mensaje "Alcanza el nivel {umbral} para sugerir términos"
```

---

#### HU-05: Sistema de Niveles y XP

```
Como:        Usuario
Quiero:      ganar experiencia (XP) al completar partidas y subir de nivel
Para:        sentir progresión y desbloquear la funcionalidad de sugerencias

Prioridad:   Alta
Estimación:  L
Dependencias: SPEC-003 (gameplay)
Capa:        Backend + Frontend
```

#### Criterios de Aceptación — HU-05

**Happy Path**
```gherkin
CRITERIO-5.1: Usuario gana XP al completar partida
  Dado que:  el usuario autenticado completa una partida
  Cuando:    el backend guarda el score (POST /api/v1/scores)
  Entonces:  el sistema calcula XP ganado basado en el porcentaje de aciertos
  Y:         actualiza el XP total y el nivel del usuario
  Y:         retorna el nuevo nivel y XP en la respuesta
```

```gherkin
CRITERIO-5.2: Fórmula de XP
  Dado que:  la partida tiene 10 preguntas
  Cuando:    el usuario obtiene un porcentaje de score_percentage
  Entonces:  XP ganado = score_percentage (1% = 1 XP, 100% = 100 XP)
```

```gherkin
CRITERIO-5.3: Fórmula de nivel
  Dado que:  el usuario tiene xp_total acumulado
  Cuando:    el sistema calcula el nivel
  Entonces:  nivel = floor(xp_total / 100)
  Y:         nivel máximo no tiene límite superior
```

**Edge Case**
```gherkin
CRITERIO-5.4: Invitado no acumula XP
  Dado que:  el usuario juega como invitado sin autenticación
  Cuando:    completa una partida
  Entonces:  no se acumula XP ni nivel
```

---

#### HU-06: Sugerencias de Términos por Usuarios

```
Como:        Usuario de nivel 10+
Quiero:      poder sugerir nuevos nombres de pokémon o venezolano
Para:        contribuir al contenido del juego

Prioridad:   Media
Estimación:  L
Dependencias: HU-04, HU-05
Capa:        Backend + Frontend
```

#### Criterios de Aceptación — HU-06

**Happy Path**
```gherkin
CRITERIO-6.1: Usuario sugiere un nuevo término
  Dado que:  el usuario tiene nivel >= umbral_sugerencias
  Cuando:    envía POST /api/v1/suggestions con { "text": "Typhlosion", "category": "pokemon" }
  Entonces:  el sistema crea la sugerencia con status "pending"
  Y:         retorna 201
```

```gherkin
CRITERIO-6.2: Admin aprueba una sugerencia
  Dado que:  existe una sugerencia pendiente
  Cuando:    el admin envía PATCH /api/v1/admin/suggestions/:id con { "status": "approved" }
  Entonces:  el sistema crea el término en la tabla terms
  Y:         actualiza la sugerencia a status "approved"
  Y:         retorna 200
```

```gherkin
CRITERIO-6.3: Admin rechaza una sugerencia
  Dado que:  existe una sugerencia pendiente
  Cuando:    el admin envía PATCH /api/v1/admin/suggestions/:id con { "status": "rejected" }
  Entonces:  actualiza la sugerencia a status "rejected"
  Y:         retorna 200 con razón opcional
```

**Error Path**
```gherkin
CRITERIO-6.4: Usuario sin nivel suficiente intenta sugerir
  Dado que:  el usuario tiene nivel < umbral_sugerencias
  Cuando:    envía POST /api/v1/suggestions
  Entonces:  retorna 403 "Necesitas nivel {umbral} para sugerir términos"
```

```gherkin
CRITERIO-6.5: Usuario sugiere término que ya existe
  Dado que:  ya existe el término "Pikachu" en terms o en sugerencias pendientes
  Cuando:    envía POST /api/v1/suggestions con { "text": "Pikachu" }
  Entonces:  retorna 409 "Este término ya existe o ya fue sugerido"
```

---

#### HU-07: Dashboard de Admin

```
Como:        Administrador
Quiero:      tener un panel centralizado para gestionar usuarios, términos y sugerencias
Para:        administrar la plataforma eficientemente

Prioridad:   Alta
Estimación:  XL
Dependencias: HU-01, HU-02, HU-03, HU-06
Capa:        Frontend
```

#### Criterios de Aceptación — HU-07

**Happy Path**
```gherkin
CRITERIO-7.1: Admin accede al panel de administración
  Dado que:  el usuario tiene rol "admin"
  Cuando:    accede a /admin
  Entonces:  ve el dashboard con tres secciones: Usuarios, Términos, Sugerencias
```

```gherkin
CRITERIO-7.2: Admin ve listado de usuarios
  Dado que:  el admin está en /admin
  Cuando:    accede a la sección Usuarios
  Entonces:  ve tabla con: username, nivel, rol, estado (activo/baneado), acciones
```

```gherkin
CRITERIO-7.3: Admin ve sugerencias pendientes
  Dado que:  el admin está en /admin
  Cuando:    accede a la sección Sugerencias
  Entonces:  ve tabla con: texto sugerido, categoría, usuario que sugirió, fecha, acciones (aprobar/rechazar)
```

**Error Path**
```gherkin
CRITERIO-7.4: Usuario normal intenta acceder al panel admin
  Dado que:  el usuario tiene rol "user"
  Cuando:    intenta navegar a /admin
  Entonces:  es redirigido a /dashboard
  Y:         ve mensaje "No tienes permisos de administrador"
```

---

#### HU-08: Configuración del Umbral de Sugerencias

```
Como:        Administrador
Quiero:      poder cambiar el nivel mínimo requerido para sugerir términos
Para:        ajustar la mecánica según la comunidad crezca

Prioridad:   Media
Estimación:  S
Dependencias: HU-05, HU-07
Capa:        Backend + Frontend
```

#### Criterios de Aceptación — HU-08

**Happy Path**
```gherkin
CRITERIO-8.1: Admin actualiza el umbral de sugerencias
  Dado que:  el admin está en el panel de configuración
  Cuando:    envía PUT /api/v1/admin/settings con { "suggestion_level_threshold": 15 }
  Entonces:  el sistema actualiza el umbral
  Y:         los usuarios que antes podían sugerir pero están bajo el nuevo umbral ya no pueden
```

---

### Reglas de Negocio

1. **Roles**: Solo existen dos roles: `user` (default) y `admin`. El primer admin se crea mediante seed o manualmente en DB.
2. **Ban**: Un usuario baneado (`banned_at IS NOT NULL`) no puede hacer login. Su JWT existente sigue activo hasta expirar, pero el middleware debe validar `banned_at` en cada request protegida.
3. **XP**: Se gana solo al guardar score (partida ganada, ≥51%). XP ganado = `score_percentage` (redondeado). No se gana XP como invitado.
4. **Niveles**: `nivel = floor(xp / 100)`. Nivel 0 con 0-99 XP, nivel 1 con 100-199 XP, etc.
5. **Sugerencias**: Un usuario puede tener máximo 5 sugerencias pendientes simultáneamente.
6. **Umbral de sugerencias**: Default = 10. Configurable por admin en tabla `settings`. Mínimo 1, máximo 100.
7. **Términos**: text es único (case-insensitive). category solo acepta `pokemon` o `venezolano`.
8. **Admin no se puede auto-banear** ni bajar su propio rol.

---

## 2. DISEÑO

### Modelos de Datos

#### Entidades afectadas
| Entidad | Almacén | Cambios | Descripción |
|---------|---------|---------|-------------|
| `users` | tabla `users` | modificada | Agregar columns: `role`, `banned_at`, `xp`, `level` |
| `term_suggestions` | tabla `term_suggestions` | nueva | Sugerencias de términos por usuarios |
| `settings` | tabla `settings` | nueva | Configuración global (key-value) |

#### Cambios a tabla `users`
| Campo | Tipo | Obligatorio | Validación | Descripción |
|-------|------|-------------|------------|-------------|
| `role` | VARCHAR(10) | sí | DEFAULT 'user', CHECK IN ('user','admin') | Rol del usuario |
| `banned_at` | TIMESTAMPTZ | no | NULL = activo | Timestamp de baneo |
| `xp` | INTEGER | sí | DEFAULT 0, >= 0 | Experiencia acumulada |
| `level` | INTEGER | sí | DEFAULT 0, >= 0 | Nivel calculado = floor(xp/100) |

#### Tabla `term_suggestions` (nueva)
| Campo | Tipo | Obligatorio | Validación | Descripción |
|-------|------|-------------|------------|-------------|
| `id` | UUID | sí | auto-generado | PK |
| `user_id` | UUID (FK) | sí | REFERENCES users(id) | Usuario que sugiere |
| `text` | VARCHAR(100) | sí | Único entre sugerencias pendientes + terms | Texto del término |
| `category` | VARCHAR(20) | sí | CHECK IN ('pokemon','venezolano') | Categoría |
| `status` | VARCHAR(20) | sí | DEFAULT 'pending', CHECK IN ('pending','approved','rejected') | Estado |
| `reviewed_by` | UUID (FK) | no | REFERENCES users(id) | Admin que revisó |
| `review_note` | VARCHAR(255) | no | | Nota del admin al rechazar |
| `created_at` | TIMESTAMPTZ | sí | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | sí | DEFAULT NOW() | Fecha de actualización |

#### Tabla `settings` (nueva)
| Campo | Tipo | Obligatorio | Validación | Descripción |
|-------|------|-------------|------------|-------------|
| `key` | VARCHAR(100) | sí | PK, UNIQUE | Clave de configuración |
| `value` | VARCHAR(255) | sí | | Valor de configuración |
| `updated_at` | TIMESTAMPTZ | sí | DEFAULT NOW() | Última actualización |
| `updated_by` | UUID (FK) | no | REFERENCES users(id) | Admin que actualizó |

#### Índices / Constraints
- `term_suggestions`: INDEX on `status` (búsqueda frecuente de pendientes)
- `term_suggestions`: INDEX on `user_id` (conteo de pendientes por usuario)
- `term_suggestions`: UNIQUE on `text` WHERE `status = 'pending'` (evitar duplicados pendientes)
- `users`: INDEX on `role` (filtro de admin)
- `settings`: PK on `key`

### API Endpoints

#### Rutas Admin — prefijo `/api/v1/admin` (requieren rol admin)

##### GET /api/v1/admin/users
- **Descripción**: Lista todos los usuarios con paginación
- **Auth**: sí (admin)
- **Query params**: `limit` (default 50), `offset` (default 0), `search` (buscar por username)
- **Response 200**:
  ```json
  {
    "users": [
      { "id": "uuid", "username": "str", "role": "user|admin", "level": 5, "xp": 520, "banned_at": null, "created_at": "iso8601" }
    ],
    "total": 150
  }
  ```
- **Response 403**: no es admin

##### PATCH /api/v1/admin/users/:id/role
- **Descripción**: Cambia el rol de un usuario
- **Auth**: sí (admin)
- **Request Body**: `{ "role": "admin" | "user" }`
- **Response 200**: usuario actualizado
- **Response 403**: no es admin / intenta cambiar su propio rol
- **Response 404**: usuario no encontrado

##### PATCH /api/v1/admin/users/:id/ban
- **Descripción**: Banea un usuario
- **Auth**: sí (admin)
- **Response 200**: `{ "message": "Usuario baneado exitosamente" }`
- **Response 403**: no es admin / intenta banearse a sí mismo
- **Response 404**: usuario no encontrado

##### PATCH /api/v1/admin/users/:id/unban
- **Descripción**: Desbanea un usuario
- **Auth**: sí (admin)
- **Response 200**: `{ "message": "Usuario desbaneado exitosamente" }`
- **Response 404**: usuario no encontrado

##### POST /api/v1/admin/terms
- **Descripción**: Agrega un nuevo término al juego
- **Auth**: sí (admin)
- **Request Body**: `{ "text": "string", "category": "pokemon|venezolano" }`
- **Response 201**: término creado
- **Response 409**: término ya existe

##### DELETE /api/v1/admin/terms/:id
- **Descripción**: Elimina un término
- **Auth**: sí (admin)
- **Response 204**: eliminado
- **Response 404**: no encontrado

##### GET /api/v1/admin/suggestions
- **Descripción**: Lista sugerencias (filtrable por status)
- **Auth**: sí (admin)
- **Query params**: `status` (pending|approved|rejected, default: pending), `limit`, `offset`
- **Response 200**:
  ```json
  {
    "suggestions": [
      { "id": "uuid", "text": "Typhlosion", "category": "pokemon", "status": "pending", "username": "pokefan123", "created_at": "iso8601" }
    ],
    "total": 10
  }
  ```

##### PATCH /api/v1/admin/suggestions/:id
- **Descripción**: Aprueba o rechaza una sugerencia
- **Auth**: sí (admin)
- **Request Body**: `{ "status": "approved|rejected", "review_note": "string (opcional)" }`
- **Response 200**: sugerencia actualizada (si approved → término creado automáticamente)
- **Response 404**: sugerencia no encontrada
- **Response 409**: término ya existe (si se aprobó pero alguien lo creó antes)

##### GET /api/v1/admin/settings
- **Descripción**: Lista configuraciones
- **Auth**: sí (admin)
- **Response 200**: `{ "suggestion_level_threshold": "10" }`

##### PUT /api/v1/admin/settings
- **Descripción**: Actualiza una configuración
- **Auth**: sí (admin)
- **Request Body**: `{ "suggestion_level_threshold": 15 }`
- **Response 200**: configuraciones actualizadas

#### Rutas Sugerencias — prefijo `/api/v1/suggestions`

##### POST /api/v1/suggestions
- **Descripción**: Crea una sugerencia de término
- **Auth**: sí (usuario con nivel >= umbral)
- **Request Body**: `{ "text": "string", "category": "pokemon|venezolano" }`
- **Response 201**: sugerencia creada
- **Response 403**: nivel insuficiente
- **Response 409**: término/sugerencia ya existe

##### GET /api/v1/suggestions/me
- **Descripción**: Lista las sugerencias del usuario autenticado
- **Auth**: sí
- **Response 200**: array de sugerencias del usuario

#### Cambios a rutas existentes

##### POST /api/v1/auth/login (MODIFICAR)
- Agregar validación: si `banned_at IS NOT NULL` → retornar 403 "Tu cuenta ha sido suspendida"

##### POST /api/v1/scores (MODIFICAR)
- Después de guardar score, calcular y actualizar XP y nivel del usuario
- Agregar al response: `{ ..., "xp_gained": N, "total_xp": N, "level": N, "leveled_up": bool }`

##### GET /api/v1/auth/me (MODIFICAR)
- Agregar al response: `{ ..., "role": "user|admin", "xp": N, "level": N }`

### Diseño Frontend

#### Componentes nuevos
| Componente | Archivo | Props principales | Descripción |
|------------|---------|------------------|-------------|
| `LevelBadge` | `components/ui/LevelBadge` | `level, xp` | Badge visual con nivel y barra XP |
| `SuggestionForm` | `components/dashboard/SuggestionForm` | `onSubmit, isLoading` | Formulario para sugerir término |
| `UserTable` | `components/admin/UserTable` | `users, onBan, onUnban, onRoleChange` | Tabla de gestión de usuarios |
| `TermManager` | `components/admin/TermManager` | `onAdd, onDelete` | Gestión de términos |
| `SuggestionReview` | `components/admin/SuggestionReview` | `suggestions, onApprove, onReject` | Lista de sugerencias para revisar |
| `AdminProtectedRoute` | `components/AdminProtectedRoute` | `children` | HOC que verifica rol admin |

#### Páginas nuevas
| Página | Archivo | Ruta | Protegida |
|--------|---------|------|-----------|
| `DashboardPage` | `pages/DashboardPage` | `/dashboard` | sí (auth) |
| `AdminPage` | `pages/AdminPage` | `/admin` | sí (admin) |

#### Hooks y State
| Hook | Archivo | Retorna | Descripción |
|------|---------|---------|-------------|
| `useDashboard` | `hooks/useDashboard` | `{ user, level, xp, scores, canSuggest }` | Estado del dashboard |
| `useAdmin` | `hooks/useAdmin` | `{ users, suggestions, settings, banUser, ... }` | CRUD admin |
| `useSuggestions` | `hooks/useSuggestions` | `{ suggestions, submit, loading }` | Sugerencias del usuario |

#### Services (llamadas API)
| Función | Archivo | Endpoint |
|---------|---------|---------|
| `getUsers(token, params)` | `services/adminService` | `GET /api/v1/admin/users` |
| `updateUserRole(id, role, token)` | `services/adminService` | `PATCH /api/v1/admin/users/:id/role` |
| `banUser(id, token)` | `services/adminService` | `PATCH /api/v1/admin/users/:id/ban` |
| `unbanUser(id, token)` | `services/adminService` | `PATCH /api/v1/admin/users/:id/unban` |
| `addTerm(data, token)` | `services/adminService` | `POST /api/v1/admin/terms` |
| `deleteTerm(id, token)` | `services/adminService` | `DELETE /api/v1/admin/terms/:id` |
| `getSuggestions(token, params)` | `services/adminService` | `GET /api/v1/admin/suggestions` |
| `reviewSuggestion(id, data, token)` | `services/adminService` | `PATCH /api/v1/admin/suggestions/:id` |
| `getSettings(token)` | `services/adminService` | `GET /api/v1/admin/settings` |
| `updateSettings(data, token)` | `services/adminService` | `PUT /api/v1/admin/settings` |
| `submitSuggestion(data, token)` | `services/suggestionService` | `POST /api/v1/suggestions` |
| `getMySuggestions(token)` | `services/suggestionService` | `GET /api/v1/suggestions/me` |

#### Cambios a rutas existentes (App.jsx)
- Login exitoso → redirect a `/dashboard` en vez de `/game`
- Registro exitoso → redirect a `/dashboard` en vez de `/game`
- Agregar rutas `/dashboard` y `/admin`

### Arquitectura y Dependencias
- **Paquetes**: Ninguno nuevo requerido
- **Middleware nuevo**: `adminMiddleware.js` — verifica `req.user.role === 'admin'`, retorna 403 si no
- **Middleware modificado**: `authMiddleware.js` — agregar check de `banned_at`, incluir `role`, `xp`, `level` en `req.user`
- **Nuevas capas backend**:
  - `repositories/adminRepository.js` — queries de admin (users, settings)
  - `repositories/suggestionRepository.js` — CRUD de sugerencias
  - `services/adminService.js` — lógica de admin
  - `services/suggestionService.js` — lógica de sugerencias
  - `services/levelService.js` — cálculo de XP y nivel
  - `routes/adminRoutes.js` — endpoints de admin
  - `routes/suggestionRoutes.js` — endpoints de sugerencias

### Notas de Implementación
> - El stack real del proyecto es **Node.js/Express + PostgreSQL** (no Python/FastAPI/MongoDB).
> - El primer admin debe crearse via migration/seed: `UPDATE users SET role = 'admin' WHERE username = '<admin_username>';` o una migration que inserte un usuario admin.
> - El cálculo de nivel es determinístico: `level = floor(xp / 100)`. Se almacena como columna computada para queries eficientes.
> - El campo `level` en `users` se actualiza junto con `xp` en la misma transacción al guardar un score.
> - Las sugerencias aprobadas crean el término en `terms` dentro de una transacción (sugerencia + término atómicamente).
> - El middleware de ban debe validar en cada request autenticada, no solo en login, para invalidar sesiones activas inmediatamente.

---

## 3. LISTA DE TAREAS

> Checklist accionable para todos los agentes. Marcar cada ítem (`[x]`) al completarlo.

### Backend

#### Migraciones
- [ ] Crear `004_alter_users_add_role_ban_xp.sql` — ADD columns `role`, `banned_at`, `xp`, `level`
- [ ] Crear `005_create_term_suggestions_table.sql` — tabla de sugerencias
- [ ] Crear `006_create_settings_table.sql` — tabla de configuraciones
- [ ] Crear seed `002_default_settings.sql` — insertar `suggestion_level_threshold = 10`
- [ ] Crear seed `003_admin_user.sql` — promover primer admin (o crear uno)

#### Middleware
- [ ] Crear `adminMiddleware.js` — verificar rol admin
- [ ] Modificar `authMiddleware.js` — check banned\_at + incluir role/xp/level en req.user

#### Repositories
- [ ] Crear `adminRepository.js` — listUsers, updateRole, banUser, unbanUser
- [ ] Crear `suggestionRepository.js` — create, findById, findByUserId, findPending, updateStatus, countPendingByUser
- [ ] Crear `settingsRepository.js` — get, set
- [ ] Modificar `userRepository.js` — agregar updateXpAndLevel
- [ ] Modificar `termRepository.js` — agregar create, deleteById

#### Services
- [ ] Crear `adminService.js` — lógica de gestión de usuarios, términos, sugerencias, settings
- [ ] Crear `suggestionService.js` — lógica de creación de sugerencias con validaciones
- [ ] Crear `levelService.js` — calculateXp, calculateLevel, applyXp
- [ ] Modificar `authService.js` — check banned\_at en login, incluir role/xp/level en profile
- [ ] Modificar `scoreService.js` — integrar levelService al guardar score

#### Routes
- [ ] Crear `adminRoutes.js` — todos los endpoints de admin
- [ ] Crear `suggestionRoutes.js` — endpoints de sugerencias
- [ ] Modificar `authRoutes.js` — agregar role/xp/level al response de /me
- [ ] Registrar nuevas rutas en `app.js`

#### Tests Backend
- [ ] `test_admin_middleware_blocks_non_admin`
- [ ] `test_admin_ban_user_success`
- [ ] `test_admin_ban_self_forbidden`
- [ ] `test_banned_user_cannot_login`
- [ ] `test_admin_add_term_success`
- [ ] `test_admin_add_term_duplicate_conflict`
- [ ] `test_admin_approve_suggestion_creates_term`
- [ ] `test_admin_reject_suggestion`
- [ ] `test_suggestion_level_check`
- [ ] `test_suggestion_max_pending_limit`
- [ ] `test_xp_calculation_on_score_save`
- [ ] `test_level_calculation`
- [ ] `test_settings_update`

### Frontend

#### Implementación
- [ ] Crear `services/adminService.js` — funciones para endpoints admin
- [ ] Crear `services/suggestionService.js` — funciones para endpoints sugerencias
- [ ] Crear `hooks/useDashboard.js` — estado del dashboard de usuario
- [ ] Crear `hooks/useAdmin.js` — estado del panel admin
- [ ] Crear `hooks/useSuggestions.js` — estado de sugerencias del usuario
- [ ] Crear `components/ui/LevelBadge.jsx` + estilos
- [ ] Crear `components/dashboard/SuggestionForm.jsx` + estilos
- [ ] Crear `components/admin/UserTable.jsx` + estilos
- [ ] Crear `components/admin/TermManager.jsx` + estilos
- [ ] Crear `components/admin/SuggestionReview.jsx` + estilos
- [ ] Crear `components/AdminProtectedRoute.jsx`
- [ ] Crear `pages/DashboardPage.jsx` + estilos
- [ ] Crear `pages/AdminPage.jsx` + estilos
- [ ] Modificar `App.jsx` — registrar rutas `/dashboard`, `/admin`
- [ ] Modificar redirect post-login y post-registro → `/dashboard`
- [ ] Modificar `useAuth.js` — incluir role/xp/level en user state

#### Tests Frontend
- [ ] `[LevelBadge] renders level and xp correctly`
- [ ] `[DashboardPage] renders user info and play button`
- [ ] `[DashboardPage] shows suggestion form when level >= threshold`
- [ ] `[DashboardPage] hides suggestion form when level < threshold`
- [ ] `[AdminPage] renders admin sections`
- [ ] `[AdminProtectedRoute] redirects non-admin users`
- [ ] `[UserTable] calls onBan when button clicked`
- [ ] `[SuggestionForm] submits with correct data`

### QA
- [ ] Ejecutar skill `/gherkin-case-generator` → criterios 1.1 a 8.1
- [ ] Ejecutar skill `/risk-identifier` → clasificación ASD de riesgos
- [ ] Revisar cobertura de tests contra criterios de aceptación
- [ ] Validar que todas las reglas de negocio están cubiertas
- [ ] Actualizar estado spec: `status: IMPLEMENTED`
