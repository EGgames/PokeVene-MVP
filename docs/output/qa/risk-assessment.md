# Evaluación de Riesgos — PokeVene-MVP

> **Specs cubiertas:** SPEC-002 (Auth) · SPEC-003 (Gameplay)
> **Fecha:** 2026-04-15
> **Autor:** QA Agent (ASDD)
> **Metodología:** Regla ASD (Alto=obligatorio, Medio=recomendado, Bajo=opcional)

---

## Resumen Ejecutivo

| Nivel | Cantidad | Acción |
|-------|----------|--------|
| **Alto (A)** | 7 | Testing OBLIGATORIO — bloquea release |
| **Medio (S)** | 5 | Testing RECOMENDADO — documentar si se omite |
| **Bajo (D)** | 3 | Testing OPCIONAL — priorizar en backlog |
| **Total** | **15** | |

---

## Matriz de Riesgos

### Riesgos ALTO (A) — Testing Obligatorio

| ID | HU | Descripción del Riesgo | Probabilidad | Impacto | Nivel | Factores |
|----|----|----------------------|--------------|---------|-------|----------|
| R-001 | HU-01/02 (Auth) | **Tokens JWT mal implementados**: firma débil, payload con datos sensibles, o falta de validación de expiración permite acceso no autorizado | Media | Alto | **A** | Autenticación/autorización, compromete toda la seguridad |
| R-002 | HU-01 (Auth) | **Hashing bcrypt insuficiente**: salt rounds bajo, almacenamiento de contraseña en texto plano, o comparación insegura expone credenciales | Baja | Alto | **A** | Datos personales, operación irreversible si se compromete |
| R-003 | HU-01/02 (Auth) | **Inyección SQL en autenticación**: username o password no sanitizados permiten manipulación de consultas a PostgreSQL | Media | Alto | **A** | Autenticación, acceso a toda la BD |
| R-004 | HU-03 (Gameplay) | **Cheating en scores**: usuario manipula request POST /api/v1/scores enviando porcentajes falsos sin validación backend real | Alta | Alto | **A** | Integridad de datos, confiabilidad del leaderboard |
| R-005 | HU-03 (Gameplay) | **Guardar puntaje sin autenticación**: falta validación de token en endpoint POST /api/v1/scores permite a invitados insertar scores | Media | Alto | **A** | Autorización, integridad de leaderboard |
| R-006 | HU-02 (Auth) | **Enumeración de usuarios**: mensajes de error diferentes para "usuario no existe" vs "contraseña incorrecta" revelan usernames válidos | Media | Medio | **A** | Seguridad, información disclosure |
| R-007 | HU-01 (Auth) | **Token JWT en payload del response expuesto**: token enviado sin HTTPS o almacenado de forma insegura permite intercepción | Media | Alto | **A** | Autenticación, man-in-the-middle |

### Riesgos MEDIO (S) — Testing Recomendado

| ID | HU | Descripción del Riesgo | Probabilidad | Impacto | Nivel | Factores |
|----|----|----------------------|--------------|---------|-------|----------|
| R-008 | HU-01 (Gameplay) | **Feedback visual inconsistente**: animaciones de acierto/error no se muestran o confunden al usuario, degradando UX | Media | Medio | **S** | Alta frecuencia de uso, impacta experiencia |
| R-009 | HU-01 (Auth) | **Validaciones frontend desincronizadas con backend**: frontend acepta datos que backend rechaza o viceversa, generando confusión | Media | Medio | **S** | Código nuevo, múltiples capas de validación |
| R-010 | HU-04 (Gameplay) | **Rendimiento degradado en leaderboard**: consulta sin índice o con muchos registros causa tiempos de carga >3s | Baja | Medio | **S** | Endpoint público de alta frecuencia |
| R-011 | HU-02 (Gameplay) | **Cálculo de victoria incorrecto**: lógica de "50% + 1" mal implementada en edge cases (totales impares, exactamente en umbral) | Media | Medio | **S** | Lógica de negocio compleja, afecta quién puede guardar |
| R-012 | HU-01 (Gameplay) | **Términos repetidos en la misma partida**: lógica de exclusión de IDs falla y el usuario ve el mismo término dos veces | Media | Bajo | **S** | Experiencia de juego, código nuevo |

### Riesgos BAJO (D) — Testing Opcional

| ID | HU | Descripción del Riesgo | Probabilidad | Impacto | Nivel | Factores |
|----|----|----------------------|--------------|---------|-------|----------|
| R-013 | HU-04 (Gameplay) | **Estilos CSS del leaderboard rotos en móviles**: tabla no se adapta a viewports pequeños y las columnas se superponen | Media | Bajo | **D** | Ajuste estético, sin impacto funcional |
| R-014 | HU-05 (Gameplay) | **Textos UI no descriptivos**: mensajes como "Error" sin contexto no ayudan al usuario a entender qué ocurrió | Baja | Bajo | **D** | Feature interna, impacto limitado |
| R-015 | General | **Desbalance en seed de términos**: proporción pokemon/venezolano no es 50/50, generando partidas sesgadas | Baja | Bajo | **D** | Datos estáticos, ajustable post-release |

---

## Plan de Mitigación — Riesgos ALTO

### R-001: Tokens JWT mal implementados
- **Mitigación**:
  - Usar `JWT_SECRET` de mínimo 256 bits (32 caracteres) almacenado en variable de entorno
  - Configurar expiración de 7 días (`exp` claim)
  - Payload solo debe contener `id`, `username`, `iat`, `exp` — sin password ni datos sensibles
  - Validar firma y expiración en middleware `authMiddleware` en cada request protegido
- **Tests obligatorios**:
  - Test unitario: generación de JWT con payload correcto
  - Test unitario: validación rechaza token expirado
  - Test unitario: validación rechaza token con firma inválida
  - Test integración: endpoint protegido rechaza request sin token (401)
  - Test integración: endpoint protegido rechaza token malformado (401)
- **Test que lo cubre**: TC-AUTH-006, TC-AUTH-010, TC-AUTH-011
- **Bloqueante para release**: ✅ Sí

### R-002: Hashing bcrypt insuficiente
- **Mitigación**:
  - Usar `bcryptjs` con salt rounds = 10 (mínimo)
  - Nunca almacenar password en texto plano — solo `password_hash`
  - Usar `bcrypt.compare()` para validación (no comparación directa de strings)
  - Constraint en BD: `LENGTH(password_hash) >= 60`
- **Tests obligatorios**:
  - Test unitario: hash generado tiene formato bcrypt válido ($2b$10$...)
  - Test unitario: `bcrypt.compare()` valida password correcto
  - Test unitario: `bcrypt.compare()` rechaza password incorrecto
  - Test unitario: password_hash no contiene el password original
- **Test que lo cubre**: TC-AUTH-001, TC-AUTH-006, TC-AUTH-008
- **Bloqueante para release**: ✅ Sí

### R-003: Inyección SQL en autenticación
- **Mitigación**:
  - Usar queries parametrizadas en todos los repositorios (`$1`, `$2` en pg, o prepared statements)
  - Nunca concatenar input del usuario directamente en SQL
  - Validar formato de username con regex `^[a-zA-Z0-9_-]{3,20}$` antes de la query
  - Escapar input en capa de servicio como defensa en profundidad
- **Tests obligatorios**:
  - Test integración: registro con username `'; DROP TABLE users;--` retorna 400 (no ejecuta SQL)
  - Test integración: login con password `' OR '1'='1` retorna 401 (no bypasea auth)
  - Test unitario: validación de username rechaza caracteres no permitidos
- **Test que lo cubre**: TC-AUTH-004, TC-AUTH-005, TC-AUTH-009
- **Bloqueante para release**: ✅ Sí

### R-004: Cheating en scores
- **Mitigación**:
  - Backend DEBE re-validar: `score_percentage == (correct_count / terms_answered) * 100`
  - Backend DEBE validar: `correct_count <= terms_answered`
  - Backend DEBE validar: `terms_answered` está dentro de rango permitido (5-20)
  - Backend DEBE validar: `score_percentage >= 51` para aceptar
  - Considerar validación server-side de respuestas individuales en fase 2 (anti-cheat avanzado)
- **Tests obligatorios**:
  - Test integración: POST /scores con `correct_count > terms_answered` retorna 400
  - Test integración: POST /scores con `score_percentage` inconsistente con correct_count retorna 400
  - Test integración: POST /scores con score < 51% retorna 400
  - Test unitario: `GameService.validateScoreData()` detecta inconsistencias
- **Test que lo cubre**: TC-GAME-011, TC-GAME-012
- **Bloqueante para release**: ✅ Sí

### R-005: Guardar puntaje sin autenticación
- **Mitigación**:
  - Endpoint POST `/api/v1/scores` DEBE tener `authMiddleware` aplicado
  - Validar que `user_id` se extrae del token (no del request body)
  - Rechazar requests sin header `Authorization: Bearer {token}` con 401
- **Tests obligatorios**:
  - Test integración: POST /scores sin token retorna 401
  - Test integración: POST /scores con token expirado retorna 401
  - Test integración: POST /scores con token válido pero user_id inexistente retorna 403
- **Test que lo cubre**: TC-GAME-010, TC-GAME-011
- **Bloqueante para release**: ✅ Sí

### R-006: Enumeración de usuarios
- **Mitigación**:
  - Usar mensaje genérico "Usuario o contraseña incorrectos" tanto para username inexistente como para password incorrecto
  - Misma estructura de respuesta y mismo código HTTP (401) en ambos casos
  - Mismo tiempo de respuesta aproximado (bcrypt.compare con hash dummy si user no existe)
- **Tests obligatorios**:
  - Test integración: login con username inexistente retorna mismo mensaje que password incorrecto
  - Test unitario: servicio retorna error idéntico en ambos escenarios
- **Test que lo cubre**: TC-AUTH-007, TC-AUTH-008
- **Bloqueante para release**: ✅ Sí

### R-007: Token JWT expuesto
- **Mitigación**:
  - Almacenar token en `localStorage` (MVP) — documentar que para producción se recomienda httpOnly cookie
  - No incluir token en URLs o query parameters
  - Header `Authorization: Bearer {token}` solo via HTTPS en producción
  - Expiración de 7 días como máximo
- **Tests obligatorios**:
  - Test unitario: token no aparece en URL ni query params
  - Test integración: token se envía solo en header Authorization
- **Test que lo cubre**: TC-AUTH-006, TC-AUTH-010
- **Bloqueante para release**: ✅ Sí

---

## Plan de Mitigación — Riesgos MEDIO

### R-008: Feedback visual inconsistente
- **Mitigación**: test visual manual en Chrome/Firefox, verificar animaciones CSS
- **Tests recomendados**: test de componente QuestionCard valida clases CSS de acierto/error

### R-009: Validaciones desincronizadas FE/BE
- **Mitigación**: definir reglas de validación en constantes compartidas o documentadas
- **Tests recomendados**: tests de integración que envían datos al límite de validación desde frontend

### R-010: Rendimiento leaderboard
- **Mitigación**: índice `scores_score_percentage_idx` DESC, LIMIT 50 por defecto
- **Tests recomendados**: test con 1000+ registros verifica tiempo de respuesta < 500ms

### R-011: Cálculo de victoria incorrecto
- **Mitigación**: tabla de verdad documentada para cada total de preguntas
- **Tests recomendados**: tests parametrizados con todos los totales válidos (5, 10, 15, 20)

### R-012: Términos repetidos en partida
- **Mitigación**: parámetro `exclude_term_ids` en GET /terms/random
- **Tests recomendados**: test que simula partida completa y verifica unicidad de términos

---

## Mapa de Cobertura de Riesgos

| Riesgo | Test Cases que mitigan |
|--------|----------------------|
| R-001 | TC-AUTH-006, TC-AUTH-010, TC-AUTH-011 |
| R-002 | TC-AUTH-001, TC-AUTH-006, TC-AUTH-008 |
| R-003 | TC-AUTH-004, TC-AUTH-005, TC-AUTH-009 |
| R-004 | TC-GAME-011, TC-GAME-012 |
| R-005 | TC-GAME-010, TC-GAME-011 |
| R-006 | TC-AUTH-007, TC-AUTH-008 |
| R-007 | TC-AUTH-006, TC-AUTH-010 |
| R-008 | TC-GAME-002, TC-GAME-003 |
| R-009 | TC-AUTH-003, TC-AUTH-004, TC-GAME-008 |
| R-010 | TC-GAME-013, TC-GAME-015 |
| R-011 | TC-GAME-005, TC-GAME-006, TC-GAME-007, TC-GAME-008 |
| R-012 | TC-GAME-001, TC-GAME-004 |

---

**Versión:** 1.0
**Generado por:** QA Agent (ASDD)
