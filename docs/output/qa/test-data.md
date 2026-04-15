# Datos de Prueba — PokeVene-MVP

> **Specs cubiertas:** SPEC-002 (Auth) · SPEC-003 (Gameplay)
> **Fecha:** 2026-04-15
> **Autor:** QA Agent (ASDD)
> **Nota:** Todos los datos son sintéticos. NUNCA usar datos de producción.

---

## 1. Usuarios — Autenticación (SPEC-002)

### Usuarios Válidos

| Campo | Valor | Escenario |
|-------|-------|-----------|
| username | `caraquenio_gamer` | Registro y login exitoso (CRITERIO-1.1, 2.1) |
| password | `M4racucho#2026` | Contraseña robusta con mayúsculas, números y especiales |
| username | `pokefan_vzla` | Usuario pre-existente para test de duplicado (CRITERIO-1.2) |
| password | `Contr4sena_Valida!` | Contraseña válida alternativa |
| username | `poke_fan-123` | Username con guiones y guiones bajos (CRITERIO-1.5) |
| password | `Gu4r0_Seguro99` | Contraseña válida con guión bajo |
| username | `margariteno_pro` | Tercer usuario para leaderboard |
| password | `1sl4Bonit4_2026` | Contraseña temática válida |

### Usuarios Inválidos

| Campo | Valor | Error esperado | Escenario |
|-------|-------|---------------|-----------|
| username | *(vacío)* | "El campo username es requerido" | CRITERIO-1.4 |
| password | *(vacío)* | "El campo password es requerido" | CRITERIO-1.4, 2.4 |
| username | `ab` | "El username debe tener entre 3 y 20 caracteres" | Validación longitud mínima |
| username | `este_username_es_demasiado_largo_para_el_sistema` | "El username debe tener entre 3 y 20 caracteres" | Validación longitud máxima |
| username | `user@#$%!` | "El username solo puede contener letras, números, guiones y guiones bajos" | Validación regex |
| password | `corta` | "La contraseña debe tener al menos 8 caracteres" | CRITERIO-1.3 |
| password | `1234567` | "La contraseña debe tener al menos 8 caracteres" | 7 caracteres, borde -1 |
| password | `12345678` | *(válido — exactamente 8 caracteres)* | Borde exacto |
| username | `pokefan_vzla` | "El nombre de usuario ya existe" (409) | CRITERIO-1.2, duplicado |

### Credenciales de Login — Error Path

| username | password | Error esperado | Escenario |
|----------|----------|---------------|-----------|
| `fantasma_inexistente` | `CualquierPass123` | "Usuario o contraseña incorrectos" (401) | CRITERIO-2.2 |
| `caraquenio_gamer` | `ContrasenaMal999` | "Usuario o contraseña incorrectos" (401) | CRITERIO-2.3 |
| `caraquenio_gamer` | *(vacío)* | "El campo password es requerido" (400) | CRITERIO-2.4 |
| *(vacío)* | `M4racucho#2026` | "El campo username es requerido" (400) | CRITERIO-2.4 |

### Datos de Inyección SQL (Seguridad)

| Campo | Valor malicioso | Resultado esperado |
|-------|----------------|-------------------|
| username | `'; DROP TABLE users;--` | 400 Bad Request (caracteres no permitidos) |
| username | `admin' OR '1'='1` | 400 Bad Request (caracteres no permitidos) |
| password | `' OR '1'='1` | 401 Unauthorized (no bypasea auth) |
| username | `<script>alert(1)</script>` | 400 Bad Request (caracteres no permitidos) |

---

## 2. Tokens JWT (SPEC-002)

### Tokens Válidos

| Tipo | Descripción | Payload |
|------|-------------|---------|
| Token fresco | Generado hace < 1 minuto | `{ id: "uuid-user-1", username: "caraquenio_gamer", iat: <now>, exp: <now+7d> }` |
| Token válido a punto de expirar | Generado hace 6 días 23 horas | `{ id: "uuid-user-1", username: "caraquenio_gamer", iat: <now-6d23h>, exp: <now+1h> }` |

### Tokens Inválidos

| Tipo | Valor | Error esperado |
|------|-------|---------------|
| Ausente | Sin header `Authorization` | 401 "Token no proporcionado" |
| Vacío | `Authorization: Bearer ` | 401 "Token inválido" |
| Malformado | `Authorization: Bearer not.a.jwt` | 401 "Token inválido" |
| Firma incorrecta | JWT firmado con secret `wrong_secret_key_12345678901` | 401 "Token inválido" |
| Expirado | JWT con `exp` en el pasado (`exp: <now-1d>`) | 401 "Token expirado" |
| Sin Bearer prefix | `Authorization: not.a.jwt.token.here` | 401 "Formato de token inválido" |
| Usuario eliminado | JWT válido pero `user_id` no existe en BD | 403 "Usuario no encontrado" |

---

## 3. Términos de Juego (SPEC-003)

### Términos Pokémon (categoría: `pokemon`)

| id | text | category |
|----|------|----------|
| term-001 | Charmander | pokemon |
| term-002 | Pikachu | pokemon |
| term-003 | Bulbasaur | pokemon |
| term-004 | Snorlax | pokemon |
| term-005 | Jigglypuff | pokemon |
| term-006 | Geodude | pokemon |
| term-007 | Mewtwo | pokemon |
| term-008 | Eevee | pokemon |
| term-009 | Squirtle | pokemon |
| term-010 | Gengar | pokemon |

### Términos Venezolanos (categoría: `venezolano`)

| id | text | category |
|----|------|----------|
| term-011 | Arepa | venezolano |
| term-012 | Chimbo | venezolano |
| term-013 | Chamo | venezolano |
| term-014 | Pana | venezolano |
| term-015 | Cachapa | venezolano |
| term-016 | Guarapo | venezolano |
| term-017 | Catire | venezolano |
| term-018 | Maracucho | venezolano |
| term-019 | Burda | venezolano |
| term-020 | Hallaca | venezolano |

### Términos Ambiguos (para edge cases)

| text | category | Nota |
|------|----------|------|
| Lickitung | pokemon | Suena a jerga |
| Tepuy | venezolano | Poco conocido fuera de Venezuela |

---

## 4. Scores — Guardar Puntaje (SPEC-003)

### Scores Válidos

| score_percentage | terms_answered | correct_count | Resultado | Escenario |
|-----------------|---------------|---------------|-----------|-----------|
| 80.0 | 10 | 8 | Victoria ✅ | CRITERIO-3.2 — Happy path |
| 60.0 | 10 | 6 | Victoria ✅ | Umbral mínimo para ganar (10 preguntas) |
| 100.0 | 10 | 10 | Victoria ✅ | Score perfecto |
| 70.0 | 10 | 7 | Victoria ✅ | CRITERIO-2.1 |
| 60.0 | 5 | 3 | Victoria ✅ | Umbral mínimo (5 preguntas) |
| 55.0 | 20 | 11 | Victoria ✅ | CRITERIO-2.4 (20 preguntas) |

### Scores Inválidos

| score_percentage | terms_answered | correct_count | Error esperado | Escenario |
|-----------------|---------------|---------------|---------------|-----------|
| 40.0 | 10 | 4 | "No puedes guardar un puntaje con menos de 51%" (400) | CRITERIO-3.3 |
| 50.0 | 10 | 5 | "No puedes guardar un puntaje con menos de 51%" (400) | Exactamente 50%, no gana |
| 0.0 | 10 | 0 | "No puedes guardar un puntaje con menos de 51%" (400) | Score mínimo |
| 80.0 | 10 | 5 | "Datos inconsistentes" (400) | Porcentaje no corresponde a correct/total |
| 70.0 | 10 | 12 | "correct_count no puede ser mayor que terms_answered" (400) | correct > total |
| -10.0 | 10 | -1 | "Valores fuera de rango" (400) | Valores negativos |
| 110.0 | 10 | 11 | "Valores fuera de rango" (400) | Porcentaje > 100% |
| 80.0 | 0 | 0 | "terms_answered debe ser mayor a 0" (400) | División por cero |
| 80.0 | 100 | 80 | "terms_answered fuera de rango permitido" (400) | Total fuera de rango (5-20) |

### Scores para Leaderboard

| rank | username | score_percentage | terms_answered | correct_count | created_at |
|------|----------|-----------------|---------------|---------------|------------|
| 1 | pokefan_vzla | 95.0 | 20 | 19 | 2026-04-15T10:30:00Z |
| 2 | margariteno_pro | 90.0 | 10 | 9 | 2026-04-15T09:15:00Z |
| 3 | caraquenio_gamer | 80.0 | 10 | 8 | 2026-04-15T08:00:00Z |
| 4 | guaro_master | 75.0 | 20 | 15 | 2026-04-14T22:45:00Z |
| 5 | oriental_gamer | 70.0 | 10 | 7 | 2026-04-14T20:30:00Z |

---

## 5. Datos por Escenario — Referencia Cruzada

| Escenario Gherkin | Dato principal | Dato secundario |
|-------------------|---------------|-----------------|
| CRITERIO-1.1 (Registro exitoso) | username: `caraquenio_gamer`, password: `M4racucho#2026` | — |
| CRITERIO-1.2 (Username duplicado) | username: `pokefan_vzla` (pre-existente) | password: `Contr4sena_Valida!` |
| CRITERIO-1.3 (Contraseña débil) | username: `nuevo_jugador`, password: `corta` | — |
| CRITERIO-1.4 (Campo faltante) | username: *(vacío)*, password: `M4racucho#2026` | — |
| CRITERIO-1.5 (Caracteres especiales) | username: `poke_fan-123`, password: `Gu4r0_Seguro99` | — |
| CRITERIO-2.1 (Login exitoso) | username: `caraquenio_gamer`, password: `M4racucho#2026` | — |
| CRITERIO-2.2 (Username inexistente) | username: `fantasma_inexistente` | password: `CualquierPass123` |
| CRITERIO-2.3 (Password incorrecto) | username: `caraquenio_gamer` | password: `ContrasenaMal999` |
| CRITERIO-2.4 (Campo faltante login) | username: `caraquenio_gamer`, password: *(vacío)* | — |
| CRITERIO-3.1 (Invitado accede) | Sin token | Juega 10 preguntas |
| CRITERIO-3.2 (Invitado ruta protegida) | Sin token, ruta: `/leaderboard` | — |
| CRITERIO-1.1 (Iniciar partida) | Término: "Charmander" (pokemon) | — |
| CRITERIO-1.2 (Respuesta correcta) | Término: "Charmander", Botón: "Pokémon" | — |
| CRITERIO-1.3 (Respuesta incorrecta) | Término: "Arepa", Botón: "Pokémon" | Correcto: "Venezolano" |
| CRITERIO-1.4 (Finalizar partida) | 7 aciertos, 2 errores + pregunta 10 | — |
| CRITERIO-2.1 (Porcentaje) | 7/10 = 70% | — |
| CRITERIO-2.2 (Victoria) | 70% > 51% | — |
| CRITERIO-2.3 (Derrota) | 5/10 = 50% ≤ 51% | — |
| CRITERIO-2.4 (Totales variables) | Ver tabla de Ejemplos en Gherkin | — |
| CRITERIO-3.1 (Ver guardar) | User: `caraquenio_gamer`, 80% | — |
| CRITERIO-3.2 (Guardar score) | 8/10, token válido | — |
| CRITERIO-3.3 (Rechazar perdedor) | 4/10 = 40%, token válido | — |
| CRITERIO-3.4 (Duplicado) | Score ya guardado | Botón deshabilitado |
| CRITERIO-4.1 (Leaderboard) | 5 scores pre-cargados | Top 50 |
| CRITERIO-4.2 (Ranking) | pokefan_vzla=95%, margariteno_pro=90%, caraquenio_gamer=80% | — |
| CRITERIO-4.3 (Sin auth) | Sin token | Acceso permitido |
| CRITERIO-4.4 (Refresco) | Nuevo score insertado | Botón "Recargar" |
| CRITERIO-5.1 (Reiniciar) | Invitado en /game-result | Reset contadores |
| CRITERIO-5.2 (Volver inicio) | Invitado en /game | — |
| CRITERIO-5.3 (Invitado ganador) | Invitado, 70% | Redirigir a /register |

---

**Versión:** 1.0
**Generado por:** QA Agent (ASDD)
