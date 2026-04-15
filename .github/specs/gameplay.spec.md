---
id: SPEC-003
status: IMPLEMENTED
feature: gameplay
created: 2026-04-14
updated: 2026-04-15
author: spec-generator
version: "1.0"
related-specs: ["SPEC-002"]
---

# Spec: Mecánica de Juego "Pokémon o Venezolano" y Rankings

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción
Implementación de la mecánica central del juego PokeVene: un sistema de preguntas dinámico donde el usuario debe identificar si un término pertenece a la franquicia Pokémon o a la jerga/cultura popular venezolana. El sistema calcula un score (porcentaje de aciertos), determina si el usuario "Gana" (50% + 1) y permite a usuarios autenticados guardar y compartir su puntaje en una tabla de clasificación pública.

### Requerimiento de Negocio (Fuente: `.github/requirements/gameplay.md`)
- Presentar términos aleatorios al usuario.
- Dos botones claramente identificados: "Pokémon" y "Venezolano".
- Validación inmediata de respuestas (feedback visual).
- Cálculo de score como porcentaje de aciertos.
- Condición de victoria: porcentaje > 50% + 1.
- Permitir guardar puntaje (usuarios autenticados).
- Tabla de clasificación pública (leaderboard).
- Opción de reiniciar partida sin guardar (invitados).

### Historias de Usuario

#### HU-01: Jugar una partida de Pokémon o Venezolano

```
Como:        Usuario (autenticado o invitado)
Quiero:      responder preguntas identificando términos como Pokémon o Venezolano
Para:        entrenarme y acumular una puntuación en la partida

Prioridad:   Alta
Estimación:  L
Dependencias: SPEC-002 (Auth) para usuarios autenticados
Capa:        Ambas (Frontend + Backend para términos)
```

#### Criterios de Aceptación — HU-01

**Happy Path**
```gherkin
CRITERIO-1.1: Iniciar partida y ver primer término
  Dado que:  el Usuario accede a /game (autenticado o como invitado)
  Cuando:    carga la página
  Entonces:  el frontend obtiene un término del backend (ej. "Charmander")
  Y:         muestra el término en grande en el centro
  Y:         muestra dos botones lado a lado: "Pokémon" y "Venezolano"
  Y:         muestra un contador "Pregunta 1 de 10" o similar
  Y:         muestra un progreso visual (barra o puntaje actual)

CRITERIO-1.2: Responder correctamente
  Dado que:  el Usuario ve el término "Charmander"
  Cuando:    presiona el botón "Pokémon"
  Entonces:  el frontend valida la respuesta (comparando con respuesta correcta almacenada localmente)
  Y:         muestra inmediatamente "¡Correcto!" con fondo verde
  Y:         incrementa el contador de aciertos
  Y:         después de 1-2 segundos, carga automáticamente el siguiente término
  Y:         repite hasta completar 10 preguntas

CRITERIO-1.3: Responder incorrectamente
  Dado que:  el Usuario ve el término "Arepita"
  Cuando:    presiona el botón "Pokémon" (respuesta incorrecta)
  Entonces:  el frontend valida la respuesta
  Y:         muestra "Incorrecto" con fondo rojo
  Y:         muestra la respuesta correcta: "Venezolano"
  Y:         incrementa el contador de errores
  Y:         después de 1-2 segundos, carga el siguiente término

CRITERIO-1.4: Finalizar partida e ir a pantalla de resultado
  Dado que:  el Usuario ha respondido las 10 preguntas
  Cuando:    termina la última pregunta
  Entonces:  el frontend navega a /game-result
  Y:         muestra: aciertos, errores, porcentaje, estado "¡Ganaste!" o "Perdiste"
```

---

#### HU-02: Calcular score y determinar si ganó la partida

```
Como:        Usuario
Quiero:      que el sistema calcule mi porcentaje de aciertos
Para:        saber si gané la partida (>50% + 1) y poder guardar mi puntaje

Prioridad:   Alta
Estimación:  M
Dependencias: HU-01
Capa:        Ambas
```

#### Criterios de Aceptación — HU-02

**Happy Path**
```gherkin
CRITERIO-2.1: Calcular porcentaje correcto
  Dado que:  el Usuario respondió 10 preguntas (ej. 7 correctas, 3 errores)
  Cuando:    termina la partida
  Entonces:  el backend/frontend calcula: (7 / 10) * 100 = 70%
  Y:         muestra la pantalla de resultado con: "70% de acierto"

CRITERIO-2.2: Determinar victoria (>50% + 1)
  Dado que:  el porcentaje de acierto es 70%
  Cuando:    se evalúa la condición de victoria
  Entonces:  el sistema detecta que 70 > 51 (50% + 1 de 10)
  Y:         muestra "¡GANASTE!" con emphasis visual (colores, tamaño font)
  Y:         si es autenticado, ofrece botón "Guardar Puntaje"

CRITERIO-2.3: Determinar derrota (<=50% + 1)
  Dado que:  el porcentaje de acierto es 50% o menos
  Cuando:    se evalúa la condición de victoria
  Entonces:  el sistema detecta que no cumple la condición
  Y:         muestra "Perdiste, intenta de nuevo" (neutral, sin rechazo)
  Y:         ofrece botón "Reintentar"

CRITERIO-2.4: Calcular correcto con diferentes totales de preguntas
  Dado que:  el juego puede tener 5, 10, 15 o 20 preguntas (configurable)
  Cuando:    varía el total de preguntas
  Entonces:  el cálculo de "50% + 1" se ajusta: 5→3 aciertos, 10→6, 15→8, 20→11
```

---

#### HU-03: Guardar puntaje en la tabla general (usuarios autenticados)

```
Como:        Usuario autenticado que ganó la partida
Quiero:      poder guardar mi puntaje en la tabla general para aparecer en el ranking
Para:        competir con otros jugadores y verificar mi posición

Prioridad:   Alta
Estimación:  M
Dependencias: HU-01, HU-02, SPEC-002 (Auth)
Capa:        Ambas
```

#### Criterios de Aceptación — HU-03

**Happy Path**
```gherkin
CRITERIO-3.1: Usuario autenticado ve opción de guardar después de ganar
  Dado que:  el Usuario autenticado ganó (porcentaje > 50% + 1)
  Cuando:    llega a /game-result
  Entonces:  ve botón "Compartir en Tabla General"
  Y:         el botón está habilitado (no deshabilitado)

CRITERIO-3.2: Guardar puntaje en backend
  Dado que:  el Usuario presiona "Compartir en Tabla General"
  Cuando:    envía token JWT y datos de puntaje al backend
  Entonces:  el backend valida el token (obtiene user_id)
  Y:         valida que score_percentage > 51
  Y:         crea registro en tabla `scores` con {user_id, score_percentage, terms_answered, correct_count, created_at}
  Y:         retorna 201 Created con {score_id, user_id, score_percentage}
  Y:         el frontend muestra "¡Puntaje guardado exitosamente!"
  Y:         ofrece botón "Ver en Tabla de Posiciones"

CRITERIO-3.3: No permitir guardar puntaje perdedor
  Dado que:  el Usuario no ganó (porcentaje <= 50% + 1)
  Cuando:    intenta llamar al endpoint POST /api/v1/scores
  Entonces:  el backend valida la condición y retorna 400 Bad Request
  Y:         el mensaje es "No puedes guardar un puntaje con menos de 51%"

CRITERIO-3.4: No duplicar puntajes en la misma partida
  Dado que:  el Usuario ya guardó el puntaje de la partida actual
  Cuando:    presiona "Guardar" nuevamente
  Entonces:  el frontend/backend evita duplicados (ej. deshabilitando botón tras primer click)
  Y:         muestra "Este puntaje ya fue guardado"
```

---

#### HU-04: Consultar tabla de clasificación general (leaderboard)

```
Como:        Cualquier usuario (autenticado o invitado)
Quiero:      ver la tabla con los puntajes más altos de otros jugadores
Para:        comparar mi desempeño y saber cómo me ubico en la comunidad

Prioridad:   Media
Estimación:  M
Dependencias: HU-03
Capa:        Ambas (Frontend + API pública)
```

#### Criterios de Aceptación — HU-04

**Happy Path**
```gherkin
CRITERIO-4.1: Acceder a tabla de posiciones
  Dado que:  el Usuario accede a /leaderboard
  Cuando:    carga la página
  Entonces:  el frontend obtiene datos de GET /api/v1/scores/leaderboard
  Y:         muestra tabla con columnas: "Posición", "Nombre de Usuario", "Puntaje", "Fecha"
  Y:         ordena descendente por puntaje (mayor a menor)
  Y:         limita a top 50 registros por defecto

CRITERIO-4.2: Visualizar tabla correctamente
  Dado que:  existen 20 puntajes guardados
  Cuando:    el Usuario consulta /leaderboard
  Entonces:  muestra 20 filas con ranking numérico (1, 2, 3...)
  Y:         el usuario con mayor puntaje está en posición 1
  Y:         muestra "Cargando..." mientras fetch está en progreso
  Y:         muestra botón de paginación si hay más de 50 registros

CRITERIO-4.3: Tabla accesible sin autenticación
  Dado que:  el Usuario es invitado (sin token)
  Cuando:    accede a /leaderboard
  Entonces:  puede ver la tabla completa
  Y:         no hay restricción de acceso
  Y:         el endpoint GET /api/v1/scores/leaderboard no requiere autenticación

CRITERIO-4.4: Tabla en vivo (refresca periódicamente)
  Dado que:  el Usuario ha estado en /leaderboard por 30 segundos
  Cuando:    otro usuario guarda un nuevo puntaje
  Entonces:  (Opcional MVP) la tabla se refresca automáticamente o el usuario ve botón "Recargar"
  Y:         muestra los datos más recientes
```

---

#### HU-05: Reiniciar partida o volver al inicio (invitados)

```
Como:        Usuario invitado que perdió o ganó
Quiero:      poder jugar otra partida sin registrar el puntaje anterior
Para:        seguir practicando sin fricción administrativo

Prioridad:   Media
Estimación:  S
Dependencias: HU-01, HU-02
Capa:        Frontend
```

#### Criterios de Aceptación — HU-05

**Happy Path**
```gherkin
CRITERIO-5.1: Opción de reintentar desde pantalla de resultado
  Dado que:  el Usuario invitado está en /game-result
  Cuando:    presiona "Jugar de Nuevo"
  Entonces:  navega a /game
  Y:         inicia una nueva partida (nuevos términos aleatorios)
  Y:         resetea contadores a 0 aciertos, 0 errores

CRITERIO-5.2: Opción de volver al inicio
  Dado que:  el Usuario invitado está en /game o /game-result
  Cuando:    presiona "Volver al Inicio" o botón "Home"
  Entonces:  navega a / (landing page o home)
  Y:         no guarda ningún dato de la partida

CRITERIO-5.3: No permitir guardar puntaje para invitado
  Dado que:  el Usuario invitado ganó
  Cuando:    llega a /game-result
  Entonces:  NO ve botón "Guardar Puntaje"
  Y:         ve botón "Crear Cuenta para Guardar Este Puntaje"
  Y:         al presionarlo, redirige a /register (pasando score_percentage en query param o state)
```

---

### Reglas de Negocio
1. **Total de Preguntas por Partida**: 10 (configurable en backend).
2. **Condición de Victoria**: `(aciertos / total) * 100 > 50 + (100 / total)` → en 10 preguntas: 6 aciertos mínimo (60%).
3. **Términos Únicos por Partida**: No se repite el mismo término en una partida.
4. **Score Público**: Solo usuarios autenticados pueden guardar puntajes. El leaderboard es público (sin auth).
5. **Validación en Backend**: Aunque la validación inmediata ocurre en frontend, el backend debe re-validar antes de guardar (prevenir cheating).
6. **Persistencia**: Scores guardados en tabla `scores` de PostgreSQL, ligados a `user_id`.
7. **Sin Puntajes Negativos**: Como invitado, el usuario no aparece en ningún registro permanente.
8. **Timestamp UTC**: Todos los `created_at` en UTC.

---

## 2. DISEÑO

### Modelos de Datos

#### Tabla: `terms`
| Campo | Tipo | Obligatorio | Validación | Descripción |
|-------|------|-------------|------------|-------------|
| `id` | UUID / Serial | sí | auto-generado, PK | Identificador del término |
| `text` | VARCHAR(100) | sí | not null, unique | Texto del término (ej. "Charmander", "Arepita") |
| `category` | ENUM('pokemon', 'venezolano') | sí | not null | Categoría correcta |
| `difficulty` | VARCHAR(20) | no | DEFAULT 'normal' | Dificultad (opcional, para fase 2) |
| `created_at` | TIMESTAMP | sí | DEFAULT NOW(), UTC | Fecha de creación |

#### Tabla: `scores`
| Campo | Tipo | Obligatorio | Validación | Descripción |
|-------|------|-------------|------------|-------------|
| `id` | UUID / Serial | sí | auto-generado, PK | Identificador del puntaje |
| `user_id` | UUID | sí | not null, FK → users.id | Usuario que guardó el puntaje |
| `score_percentage` | FLOAT | sí | not null, 0-100 | Porcentaje de acierto (validado >= 51 para MVP) |
| `terms_answered` | INTEGER | sí | not null | Número total de preguntas respondidas (ej. 10) |
| `correct_count` | INTEGER | sí | not null | Número de respuestas correctas |
| `created_at` | TIMESTAMP | sí | DEFAULT NOW(), UTC | Fecha de la partida |

#### Índices
- `scores_user_id_idx`: INDEX en `scores.user_id` (búsqueda de puntajes por usuario).
- `scores_score_percentage_idx`: INDEX en `scores.score_percentage` DESC (ordenamiento leaderboard).
- `scores_created_at_idx`: INDEX en `scores.created_at` DESC (análisis temporal).
- `terms_category_idx`: INDEX en `terms.category` (filtrado de términos).

#### Seeds / Datos Iniciales
- Mínimo 100-200 términos en tabla `terms`: ~50 Pokémon, ~50 Venezolanos, balance.
- Script de seeding en `backend/seeds/terms.seed.js` o SQL.

---

### API Endpoints

#### GET `/api/v1/terms/random`
- **Descripción**: Obtiene un término aleatorio (no incluye la respuesta correcta en campo visible, solo el `id` y `text`)
- **Auth requerida**: No (invitados también pueden jugar)
- **Query Parameters** (opcional):
  - `exclude_term_ids`: lista de IDs ya usados en la partida actual (para evitar repetición)
- **Response 200 OK**:
  ```json
  {
    "id": "5f8d6c3a-1b2e-4e5f-9a3c-7b6d2e8f1a4c",
    "text": "Pikachu",
    "category": "pokemon"  // ← enviado para validación frontend (o sin este campo y solo en backend)
  }
  ```
- **Response 400 Bad Request**: parámetro inválido
- **Response 500 Internal Server Error**: error en BD

---

#### POST `/api/v1/scores`
- **Descripción**: Guarda un nuevo score (solo usuarios autenticados, score >= 51%)
- **Auth requerida**: Sí (`Authorization: Bearer {token}`)
- **Request Body**:
  ```json
  {
    "score_percentage": 75.0,
    "terms_answered": 10,
    "correct_count": 8
  }
  ```
- **Response 201 Created**:
  ```json
  {
    "id": "score-uuid-here",
    "user_id": "user-uuid-here",
    "score_percentage": 75.0,
    "terms_answered": 10,
    "correct_count": 8,
    "created_at": "2026-04-14T15:30:00Z"
  }
  ```
- **Response 400 Bad Request**: score < 51%, campos inválidos, o data inconsistente (ej. correct_count > terms_answered)
- **Response 401 Unauthorized**: token ausente o inválido
- **Response 500 Internal Server Error**: error en BD

---

#### GET `/api/v1/scores/leaderboard`
- **Descripción**: Obtiene el top 50 de usuarios con mayor puntaje promedio (o último puntaje, según regla de negocio)
- **Auth requerida**: No (acceso público)
- **Query Parameters**:
  - `limit`: número de registros (default 50, max 100)
  - `offset`: paginación (default 0)
- **Response 200 OK**:
  ```json
  [
    {
      "rank": 1,
      "user_id": "user-uuid",
      "username": "pokefan123",
      "score_percentage": 95.0,
      "created_at": "2026-04-14T14:20:00Z"
    },
    {
      "rank": 2,
      "user_id": "user-uuid-2",
      "username": "venezolano_pro",
      "score_percentage": 90.0,
      "created_at": "2026-04-14T13:10:00Z"
    }
  ]
  ```
- **Response 500 Internal Server Error**: error en BD

---

#### GET `/api/v1/scores/user/{user_id}` (Opcional MVP)
- **Descripción**: Obtiene todos los puntajes de un usuario específico
- **Auth requerida**: Recomendado (o públicos si regla de negocio lo permite)
- **Response 200 OK**: array de scores del usuario
- **Response 404 Not Found**: usuario no existe

---

### Diseño Frontend

#### Componentes Nuevos
| Componente | Archivo | Props principales | Descripción |
|------------|---------|------------------|-------------|
| `GamePlay` | `src/components/GamePlay/GamePlay.jsx` | `onGameEnd` | Pantalla principal del juego |
| `QuestionCard` | `src/components/GamePlay/QuestionCard.jsx` | `term, onAnswer, isLoading` | Tarjeta con término y botones |
| `GameResult` | `src/components/GamePlay/GameResult.jsx` | `score, won, onSaveScore, onRetry` | Pantalla de resultado |
| `Leaderboard` | `src/components/Leaderboard/Leaderboard.jsx` | `onRefresh` | Tabla de clasificación |
| `LeaderboardRow` | `src/components/Leaderboard/LeaderboardRow.jsx` | `rank, username, score, date` | Fila de la tabla |

#### Páginas Nuevas
| Página | Archivo | Ruta | Protegida |
|--------|---------|------|-----------|
| `GamePage` | `src/pages/GamePage.jsx` | `/game` | No (accesible para invitados) |
| `GameResultPage` | `src/pages/GameResultPage.jsx` | `/game-result` | No |
| `LeaderboardPage` | `src/pages/LeaderboardPage.jsx` | `/leaderboard` | No (público) |

#### Hooks y State
| Hook | Archivo | Retorna | Descripción |
|------|---------|---------|-------------|
| `useGameState` | `src/hooks/useGameState.js` | `{ currentTerm, aciertos, errores, pregunta, gameEnd, ... }` | Gestión de estado del juego |
| `useLeaderboard` | `src/hooks/useLeaderboard.js` | `{ scores, loading, error, refresh }` | Fetch y cache del leaderboard |

#### Services (Llamadas API)
| Función | Archivo | Endpoint |
|---------|---------|---------|
| `getRandomTerm(excludeIds)` | `src/services/gameService.js` | `GET /api/v1/terms/random` |
| `saveScore(score_percentage, terms_answered, correct_count, token)` | `src/services/gameService.js` | `POST /api/v1/scores` |
| `getLeaderboard(limit, offset)` | `src/services/gameService.js` | `GET /api/v1/scores/leaderboard` |

#### Interfaz Usuario (UX)
- **Game Page**: Pantalla limpia, término en grande, dos botones prominentes, barra de progreso.
- **Feedback Visual**: Animaciones cortas (0.5s) para acierto (verde) / error (rojo).
- **Result Page**: Muestra score grande, estado (¿Ganaste? ¿Perdiste?), opciones de acción.
- **Leaderboard**: Tabla scrolleable, top 50, con opción de paginación.

---

### Arquitectura y Dependencias

#### Backend (Node.js)
- **Paquetes requeridos** (probablemente ya existen):
  - `express` — framework web
  - `pg` o `sequelize` — cliente PostgreSQL
  - `jsonwebtoken` — validación de JWT (de SPEC-002)
  - `dotenv` — variables de entorno

#### Frontend (React)
- **Paquetes requeridos**:
  - `axios` — client HTTP
  - `react-router-dom` — routing
  - (Opcional) `uuid` — generar IDs únicos para términos excluidos

#### Datos Iniciales
- Script SQL: `backend/migrations/terms.sql` — inserta 100-200 términos con balance pokemon/venezolano.
- Considerar CSV o JSON para facilitar edición/adición de términos.

---

### Notas de Implementación
- **Validación Crítica en Backend**: Aunque frontend valida respuestas, backend debe re-validar score antes de guardar (anti-cheating).
- **Términos Únicos en Partida**: Mantener lista en frontend de IDs ya usados y excluir del siguiente fetch.
- **Caché de Términos**: Considerar cachear 20-30 términos en memoria en frontend para reducir latencia.
- **Rate Limiting**: Opcionalmente limitar POST /api/v1/scores por usuario/hora para evitar spam en leaderboard.

---

## 3. LISTA DE TAREAS

> Checklist accionable para todos los agentes. El Orchestrator monitorea el progreso.

### Backend

#### Modelos y Migraciones
- [ ] Crear tabla `terms` con columnas: id, text, category, difficulty, created_at
- [ ] Crear tabla `scores` con columnas: id, user_id (FK), score_percentage, terms_answered, correct_count, created_at
- [ ] Crear índices en `terms.category`, `terms.text`, `scores.user_id`, `scores.score_percentage`, `scores.created_at`
- [ ] Crear constraints: `scores.correct_count <= scores.terms_answered`, `scores.score_percentage >= 0 AND <= 100`
- [ ] Script de seeding: insertar 100-200 términos (balance pokemon/venezolano)

#### Repositorios y Services
- [ ] Crear `TermRepository` — método `getRandomTerm(excludeIds: [])` → random de términos no excluidos
- [ ] Crear `ScoreRepository` — métodos: `create(user_id, score_percentage, ...)`, `findByUserId(user_id)`, `getLeaderboard(limit, offset)`
- [ ] Crear `GameService` — métodos: `validateScoreData(score_percentage, terms_answered, correct_count)` → valida reglas de negocio
- [ ] Implementar lógica: score_percentage debe ser > 51 para guardarse (MVP)

#### Rutas y Controladores
- [ ] Crear ruta `GET /api/v1/terms/random?exclude_term_ids=...` — controller retorna término aleatorio
- [ ] Crear ruta `POST /api/v1/scores` — controller para guardar score (autenticado)
  - [ ] Validar token (`authMiddleware`)
  - [ ] Validar datos (businessValidation)
  - [ ] Llamar a `GameService.validateScoreData()`
  - [ ] Llamar a `ScoreRepository.create()`
- [ ] Crear ruta `GET /api/v1/scores/leaderboard?limit=50&offset=0` — controller para obtener top scores
  - [ ] Llamar a `ScoreRepository.getLeaderboard()`
  - [ ] Retorna array ordenado descendente por score, con ranking

#### Tests Backend
- [ ] `test_get_random_term_returns_valid_term` — happy path
- [ ] `test_get_random_term_excludes_specified_ids` — excluye términos ya usados
- [ ] `test_save_score_success_for_valid_data` — HU-03 happy path
- [ ] `test_save_score_fails_if_score_below_51_percent` — validación de victoria
- [ ] `test_save_score_fails_with_invalid_data` — ej. correct_count > terms_answered
- [ ] `test_save_score_requires_authentication` — 401 sin token
- [ ] `test_get_leaderboard_returns_top_50_ordered` — HU-04 ordering
- [ ] `test_get_leaderboard_accessible_without_auth` — público
- [ ] `test_leaderboard_pagination_works` — limit/offset

### Frontend

#### Componentes y Páginas
- [ ] Crear `GamePlay.jsx` — componente principal del juego
  - [ ] Inicializa estado (aciertos, errores, pregunta 1/10)
  - [ ] Llama a `/api/v1/terms/random` al cargar
  - [ ] Renderiza `QuestionCard` con término y botones
  - [ ] Maneja click de botones (validación local)
  
- [ ] Crear `QuestionCard.jsx` — tarjeta de pregunta
  - [ ] Muestra término en tamaño grande
  - [ ] Dos botones: "Pokémon" y "Venezolano"
  - [ ] Maneja feedback visual (green/red animación)
  - [ ] Desactiva botones mientras se carga respuesta

- [ ] Crear `GameResult.jsx` — pantalla de resultado
  - [ ] Muestra score_percentage grandes
  - [ ] Muestra "¡GANASTE!" o "Perdiste" según validación
  - [ ] Botones: "Guardar Puntaje" (autenticados) / "Crear Cuenta" (invitados)
  - [ ] Botón "Jugar de Nuevo"

- [ ] Crear `Leaderboard.jsx` — tabla del ranking
  - [ ] Fetchea GET /api/v1/scores/leaderboard al cargar
  - [ ] Renderiza tabla con columnas
  - [ ] Incluye paginación si > 50 resultados

#### Hooks y State
- [ ] Crear `useGameState.js` hook
  - [ ] Estado: currentTerm, aciertos, errores, pregunta, gameEnd, gameWon
  - [ ] Métodos: nextQuestion(), recordAnswer(), endGame()
  
- [ ] Crear `useLeaderboard.js` hook
  - [ ] Estado: scores[], loading, error
  - [ ] Método: refresh() → re-fetch leaderboard

#### Services
- [ ] Crear `gameService.js`
  - [ ] `getRandomTerm(excludeIds)` → GET /api/v1/terms/random
  - [ ] `saveScore(score_percentage, terms_answered, correct_count, token)` → POST /api/v1/scores
  - [ ] `getLeaderboard(limit, offset)` → GET /api/v1/scores/leaderboard

#### Routing y Navegación
- [ ] Registrar rutas `/game`, `/game-result`, `/leaderboard` en `App.jsx` o router
- [ ] Implementar navegaciones:
  - `/game-result` → "Guardar" → guardado exitoso → mostrar "Ver Tabla"
  - `/game-result` → "Crear Cuenta" → redirige a `/register` (con score en state/query)
  - `/game-result` → "Jugar de Nuevo" → navega a `/game` (reset state)

#### Tests Frontend
- [ ] `test_game_page_loads_first_term` — initial load
- [ ] `test_question_card_validates_answer_locally` — client-side validation
- [ ] `test_game_result_shows_correct_percentage` — cálculo de score
- [ ] `test_game_result_shows_won_message_if_score_above_51` — victoria
- [ ] `test_game_result_shows_lost_message_if_score_below_51` — derrota
- [ ] `test_authenticated_user_can_save_score` — POST /api/v1/scores
- [ ] `test_guest_user_cannot_save_score` — sin botón o deshabilitado
- [ ] `test_leaderboard_page_fetches_and_displays_top_50` — fetch + render
- [ ] `test_leaderboard_accessible_without_auth` — público
- [ ] `test_game_page_prevents_term_repetition_in_same_game` — excludeIds logic

### QA

#### Test Plan / Gherkin
- [ ] Crear `test-cases/gameplay-basic.feature` — jugar una partida (HU-01)
- [ ] Crear `test-cases/gameplay-scoring.feature` — cálculo de score (HU-02)
- [ ] Crear `test-cases/gameplay-save-score.feature` — guardar puntaje (HU-03)
- [ ] Crear `test-cases/gameplay-leaderboard.feature` — ver tabla (HU-04)

#### Escenarios Críticos
- [ ] Happy path: jugar partida completa, ganar, guardar score
- [ ] Error path: respuestas incorrectas, perder partida
- [ ] Edge case: exactamente 50% de acierto (no debe ganar con 5/10)
- [ ] Edge case: 10 aciertos, 0 errores (max score = 100%)
- [ ] Edge case: invitado intenta guardar (debe redirigir a registro)
- [ ] Leaderboard actualización en tiempo real (si se implementa polling)

#### Test de Integridad
- [ ] Validar que backend re-valida score antes de guardar
- [ ] Validar que no se permite score < 51%
- [ ] Validar que leaderboard ordena correctamente (descendente)
- [ ] Validar timestamps UTC en todas las respuestas

---

**Versión**: 1.0  
**Último actualizado**: 2026-04-14  
**Generada por**: spec-generator
