# Evaluación de Riesgos — PokeVene-MVP

> **Specs cubiertas:** SPEC-002 (Auth) · SPEC-003 (Gameplay) · SPEC-004 (Admin, Dashboard, Niveles, Sugerencias)
> **Fecha:** 2026-04-18
> **Autor:** QA Agent (ASDD)
> **Metodología:** Regla ASD (Alto=obligatorio, Medio=recomendado, Bajo=opcional)

---

## Resumen Ejecutivo

| Nivel | Cantidad | Acción |
|-------|----------|--------|
| **Alto (A)** | 11 | Testing OBLIGATORIO — bloquea release |
| **Medio (S)** | 10 | Testing RECOMENDADO — documentar si se omite |
| **Bajo (D)** | 5 | Testing OPCIONAL — priorizar en backlog |
| **Total** | **26** | |

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

### SPEC-004: Riesgos ALTO (A) — Testing Obligatorio

| ID | HU | Descripción del Riesgo | Probabilidad | Impacto | Nivel | Factores |
|----|----|----------------------|--------------|---------|-------|----------|
| R-016 | HU-01/02 (Admin) | **Escalación de privilegios / bypass de adminMiddleware**: endpoints admin accesibles sin rol admin por middleware mal aplicado o bypasseable | Media | Alto | **A** | Autenticación/autorización, compromete toda la gestión |
| R-017 | HU-02 (Admin) | **Usuario baneado con token activo no invalidado**: middleware no valida `banned_at` en cada request, permitiendo acceso con JWT aún vigente | Alta | Alto | **A** | Autorización, operación destructiva, seguridad |
| R-018 | HU-06 (Sugerencias) | **Race condition en aprobación de sugerencia**: dos admins aprueban simultáneamente o el término se crea mientras hay sugerencia pendiente, generando duplicado | Media | Alto | **A** | Integridad de datos, operación sin rollback |
| R-019 | HU-01/02 (Admin) | **Admin se auto-banea o auto-degrada**: falta validación de self-action causa lockout del sistema sin administradores | Baja | Alto | **A** | Operación destructiva irrecuperable, compromete acceso admin |

### SPEC-004: Riesgos MEDIO (S) — Testing Recomendado

| ID | HU | Descripción del Riesgo | Probabilidad | Impacto | Nivel | Factores |
|----|----|----------------------|--------------|---------|-------|----------|
| R-020 | HU-05 (XP/Niveles) | **Cálculo de XP/nivel incorrecto en edge cases**: `floor(xp/100)` mal implementado en frontera (99→100 XP), XP negativo o overflow | Media | Medio | **S** | Lógica de negocio compleja, afecta desbloqueo de sugerencias |
| R-021 | HU-06 (Sugerencias) | **Límite de 5 sugerencias pendientes no validado bajo concurrencia**: usuario envía múltiples requests antes de que el conteo se actualice | Media | Medio | **S** | Código nuevo, múltiples dependencias |
| R-022 | HU-08 (Settings) | **Cambio de umbral no aplicado inmediatamente**: cache o validación lee valor anterior, permitiendo sugerencias bajo umbral nuevo | Media | Medio | **S** | Alta frecuencia de uso, configuración dinámica |
| R-023 | HU-03/06 (Términos) | **Validación case-insensitive de duplicados inconsistente**: "pikachu" vs "Pikachu" no se detecta como duplicado entre terms y sugerencias | Media | Medio | **S** | Integridad de datos, código nuevo |
| R-024 | HU-07 (Dashboard Admin) | **Datos sensibles expuestos en listado de usuarios**: `password_hash` u otros campos internos incluidos en response del listado | Baja | Alto | **S** | Datos personales, información disclosure |

### SPEC-004: Riesgos BAJO (D) — Testing Opcional

| ID | HU | Descripción del Riesgo | Probabilidad | Impacto | Nivel | Factores |
|----|----|----------------------|--------------|---------|-------|----------|
| R-025 | HU-07 (Dashboard Admin) | **Dashboard admin no responsivo en dispositivos móviles**: tablas de usuarios y sugerencias no se adaptan a viewports pequeños | Media | Bajo | **D** | Ajuste estético, sin impacto funcional |
| R-026 | HU-04 (Dashboard) | **Dashboard de usuario muestra datos desactualizados**: XP y nivel no se refrescan tras completar partida sin recarga manual | Media | Bajo | **D** | UX, impacto limitado |

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

## Plan de Mitigación — Riesgos ALTO (SPEC-004)

### R-016: Escalación de privilegios / bypass de adminMiddleware
- **Mitigación**:
  - `adminMiddleware` debe validar `req.user.role === 'admin'` en TODAS las rutas `/api/v1/admin/*`
  - Middleware aplicado a nivel de router, no por endpoint individual
  - Verificar que `authMiddleware` se ejecuta ANTES de `adminMiddleware` (cadena correcta)
  - Rechazar con 403 y mensaje genérico — no revelar existencia de endpoints admin
- **Tests obligatorios**:
  - Test unitario: adminMiddleware rechaza usuario con role='user' (403)
  - Test unitario: adminMiddleware rechaza request sin role en req.user (403)
  - Test integración: PATCH /admin/users/:id/role sin rol admin retorna 403
  - Test integración: POST /admin/terms sin rol admin retorna 403
  - Test integración: PATCH /admin/suggestions/:id sin rol admin retorna 403
- **Test que lo cubre**: TC-ADMIN-002, TC-ADMIN-003, TC-ADMIN-008
- **Bloqueante para release**: ✅ Sí

### R-017: Usuario baneado con token activo no invalidado
- **Mitigación**:
  - `authMiddleware` DEBE consultar `banned_at` del usuario en CADA request protegida
  - Si `banned_at IS NOT NULL` → retornar 403 "Tu cuenta ha sido suspendida"
  - No depender solo de la validación en login — el ban debe ser efectivo inmediatamente
  - Considerar cache de banned UIDs con TTL corto (30s) para reducir queries a BD
- **Tests obligatorios**:
  - Test integración: usuario baneado con token válido es rechazado en endpoint protegido (403)
  - Test integración: POST /auth/login con usuario baneado retorna 403
  - Test unitario: authMiddleware detecta banned_at y rechaza
  - Test integración: usuario desbaneado puede acceder nuevamente
- **Test que lo cubre**: TC-ADMIN-005, TC-ADMIN-006, TC-BAN-001, TC-BAN-002
- **Bloqueante para release**: ✅ Sí

### R-018: Race condition en aprobación de sugerencia
- **Mitigación**:
  - Usar transacción SQL (BEGIN/COMMIT) al aprobar sugerencia: verificar que el término no exista → crear término → actualizar sugerencia → COMMIT
  - UNIQUE constraint en `terms.text` (case-insensitive) como defensa de último recurso
  - Si el INSERT del término falla por duplicado, retornar 409 y no cambiar estado de la sugerencia
- **Tests obligatorios**:
  - Test integración: aprobar sugerencia cuyo término ya fue creado retorna 409
  - Test unitario: servicio adminService.reviewSuggestion ejecuta transacción atómica
  - Test integración: aprobar sugerencia crea el término y actualiza status en la misma operación
- **Test que lo cubre**: TC-ADMIN-012, TC-SUGG-005
- **Bloqueante para release**: ✅ Sí

### R-019: Admin se auto-banea o auto-degrada
- **Mitigación**:
  - Validar `req.user.id !== targetUserId` en operaciones ban/unban y role change
  - Si se detecta self-action → retornar 403 con mensaje específico
  - Considerar validar que siempre exista al menos 1 admin en el sistema antes de revocar rol
- **Tests obligatorios**:
  - Test integración: admin intenta banearse a sí mismo retorna 403
  - Test integración: admin intenta cambiar su propio rol retorna 403
  - Test unitario: adminService.banUser valida self-ban
  - Test unitario: adminService.updateRole valida self-role-change
- **Test que lo cubre**: TC-ADMIN-004, TC-ADMIN-007
- **Bloqueante para release**: ✅ Sí

---

## Plan de Mitigación — Riesgos MEDIO (SPEC-004)

### R-020: Cálculo de XP/nivel incorrecto
- **Mitigación**: tests parametrizados con fronteras (99→100 XP, 0 XP, score de 51%)
- **Tests recomendados**: tests unitarios de levelService con todos los boundaries, esquema del escenario Gherkin 5.2/5.3

### R-021: Límite de 5 sugerencias pendientes bajo concurrencia
- **Mitigación**: conteo dentro de transacción SQL, SELECT FOR UPDATE o serializar
- **Tests recomendados**: test integración que simula 2 sugerencias simultáneas cuando el usuario tiene 4 pendientes

### R-022: Cambio de umbral no aplicado inmediatamente
- **Mitigación**: leer siempre de BD (o cache con TTL < 30s) al validar elegibilidad de sugerencia
- **Tests recomendados**: test integración que cambia umbral y verifica rechazo inmediato

### R-023: Validación case-insensitive inconsistente
- **Mitigación**: normalizar con LOWER() en queries de búsqueda de duplicados
- **Tests recomendados**: test integración que intenta crear "pikachu" cuando existe "Pikachu"

### R-024: Datos sensibles en listado de usuarios
- **Mitigación**: SELECT explícito sin password_hash, mapear DTOs antes de retornar
- **Tests recomendados**: test integración que verifica que response de GET /admin/users NO contiene password_hash

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
| R-016 | TC-ADMIN-002, TC-ADMIN-003, TC-ADMIN-008 |
| R-017 | TC-ADMIN-005, TC-ADMIN-006, TC-BAN-001, TC-BAN-002 |
| R-018 | TC-ADMIN-012, TC-SUGG-005 |
| R-019 | TC-ADMIN-004, TC-ADMIN-007 |
| R-020 | TC-XP-001, TC-XP-002, TC-XP-003, TC-XP-004 |
| R-021 | TC-SUGG-004 |
| R-022 | TC-SETTINGS-001, TC-SETTINGS-002 |
| R-023 | TC-ADMIN-010, TC-SUGG-003 |
| R-024 | TC-ADMIN-001 |

---

**Versión:** 2.0
**Generado por:** QA Agent (ASDD)
