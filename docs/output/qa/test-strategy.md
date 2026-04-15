# Estrategia QA — PokeVene-MVP

> **Specs cubiertas:** SPEC-002 (Auth) · SPEC-003 (Gameplay)
> **Fecha:** 2026-04-15
> **Autor:** QA Agent (ASDD)

---

## 1. Alcance

| Feature | Spec | HUs cubiertas | Prioridad |
|---------|------|---------------|-----------|
| Autenticación JWT | SPEC-002 | HU-01 (Registro), HU-02 (Login), HU-03 (Invitado) | Alta |
| Mecánica de Juego | SPEC-003 | HU-01 (Partida), HU-02 (Score), HU-03 (Guardar), HU-04 (Leaderboard), HU-05 (Reiniciar) | Alta |

**Fuera de alcance:** panel de administración, métricas de analytics, rate limiting avanzado, internacionalización.

---

## 2. Niveles de Prueba y Distribución

```
┌─────────────────────────────────────────────┐
│              E2E (~10%)                      │
│        Serenity BDD + WebDriver              │
│   Flujos críticos cross-feature              │
├─────────────────────────────────────────────┤
│          Integración (~20%)                  │
│   Jest (backend) · Vitest (frontend)         │
│   API endpoints · Hooks + Services           │
├─────────────────────────────────────────────┤
│           Unitarias (~70%)                   │
│   Jest (backend) · Vitest (frontend)         │
│   Services · Repositories · Componentes      │
└─────────────────────────────────────────────┘
```

| Nivel | % Objetivo | Herramienta | Scope |
|-------|-----------|-------------|-------|
| Unitarias | ~70% | Jest (BE), Vitest (FE) | Funciones puras, services, repositories, modelos, hooks, componentes aislados |
| Integración | ~20% | Jest + supertest (BE), Vitest + MSW (FE) | Endpoints API completos, hooks con services mockeados, flujos de componentes |
| E2E | ~10% | Serenity BDD + WebDriver | Registro → Login → Jugar → Guardar → Leaderboard |

---

## 3. Herramientas

| Herramienta | Uso | Ambiente |
|-------------|-----|----------|
| **Jest** | Tests unitarios e integración backend | Local + CI |
| **Vitest** | Tests unitarios e integración frontend | Local + CI |
| **supertest** | Tests de endpoints HTTP backend | Local + CI |
| **MSW (Mock Service Worker)** | Mock de API en tests frontend | Local + CI |
| **Serenity BDD + WebDriver** | Tests E2E cross-browser | CI |
| **ESLint + eslint-plugin-security** | SAST estático | Local + CI |
| **GitHub Actions** | Pipeline CI/CD | CI |

---

## 4. Quality Gates

| Gate | Criterio | Bloqueante |
|------|----------|------------|
| Cobertura de código | ≥ 80% líneas (backend + frontend) | ✅ Sí |
| Bugs críticos | 0 bugs severidad Alta/Crítica abiertos | ✅ Sí |
| SAST clean | 0 vulnerabilidades High/Critical en linter de seguridad | ✅ Sí |
| Tests unitarios | 100% passing | ✅ Sí |
| Tests integración | 100% passing | ✅ Sí |
| Tests E2E smoke | 100% passing en flujos `@critico` | ✅ Sí |
| Revisión de código | Al menos 1 aprobación en PR | ✅ Sí |

---

## 5. Ambientes

| Ambiente | Propósito | Base de datos | Configuración |
|----------|-----------|---------------|---------------|
| **Local** | Desarrollo + tests unitarios/integración | PostgreSQL local o SQLite en memoria | `.env.local` |
| **CI (GitHub Actions)** | Pipeline automatizado: lint → test → build | PostgreSQL service container | `.env.ci` / secrets |

---

## 6. Criterios de Entrada (DoR) y Salida (DoD)

### Definition of Ready (DoR)
- [ ] Spec aprobada (`status: APPROVED`) en `.github/specs/`
- [ ] Criterios de aceptación definidos en formato Gherkin
- [ ] Datos de prueba identificados
- [ ] Dependencias técnicas resueltas (DB migrations, seeds)
- [ ] Ambiente de pruebas disponible y estable

### Definition of Done (DoD)
- [ ] Código implementado y revisado (PR aprobado)
- [ ] Tests unitarios escritos y passing (cobertura ≥ 80%)
- [ ] Tests de integración escritos y passing
- [ ] Escenarios Gherkin `@critico` validados manualmente o via E2E
- [ ] 0 bugs críticos abiertos
- [ ] SAST sin vulnerabilidades High/Critical
- [ ] Documentación actualizada si aplica

---

## 7. Matriz de Trazabilidad HU → Test Cases

### SPEC-002: Autenticación

| HU | Criterio | Tipo Test | ID Test Case | Descripción |
|----|----------|-----------|--------------|-------------|
| HU-01 | CRITERIO-1.1 | Unit + Integ | TC-AUTH-001 | Registro exitoso con credenciales válidas |
| HU-01 | CRITERIO-1.2 | Unit + Integ | TC-AUTH-002 | Registro rechazado por username duplicado (409) |
| HU-01 | CRITERIO-1.3 | Unit + Integ | TC-AUTH-003 | Registro rechazado por contraseña débil (400) |
| HU-01 | CRITERIO-1.4 | Unit + Integ | TC-AUTH-004 | Registro rechazado por campo faltante (400) |
| HU-01 | CRITERIO-1.5 | Unit | TC-AUTH-005 | Username con caracteres especiales permitidos |
| HU-02 | CRITERIO-2.1 | Unit + Integ + E2E | TC-AUTH-006 | Login exitoso con credenciales válidas |
| HU-02 | CRITERIO-2.2 | Unit + Integ | TC-AUTH-007 | Login rechazado por username inexistente (401) |
| HU-02 | CRITERIO-2.3 | Unit + Integ | TC-AUTH-008 | Login rechazado por contraseña incorrecta (401) |
| HU-02 | CRITERIO-2.4 | Unit + Integ | TC-AUTH-009 | Login rechazado por campo faltante (400) |
| HU-03 | CRITERIO-3.1 | Integ + E2E | TC-AUTH-010 | Acceso como invitado a /game sin token |
| HU-03 | CRITERIO-3.2 | Integ + E2E | TC-AUTH-011 | Invitado redirigido al acceder a ruta protegida |

### SPEC-003: Gameplay

| HU | Criterio | Tipo Test | ID Test Case | Descripción |
|----|----------|-----------|--------------|-------------|
| HU-01 | CRITERIO-1.1 | Unit + Integ | TC-GAME-001 | Iniciar partida y cargar primer término |
| HU-01 | CRITERIO-1.2 | Unit | TC-GAME-002 | Respuesta correcta incrementa aciertos |
| HU-01 | CRITERIO-1.3 | Unit | TC-GAME-003 | Respuesta incorrecta muestra feedback y respuesta correcta |
| HU-01 | CRITERIO-1.4 | Integ + E2E | TC-GAME-004 | Finalizar partida navega a resultado |
| HU-02 | CRITERIO-2.1 | Unit | TC-GAME-005 | Cálculo correcto de porcentaje |
| HU-02 | CRITERIO-2.2 | Unit | TC-GAME-006 | Victoria cuando porcentaje > 51% |
| HU-02 | CRITERIO-2.3 | Unit | TC-GAME-007 | Derrota cuando porcentaje ≤ 51% |
| HU-02 | CRITERIO-2.4 | Unit | TC-GAME-008 | Cálculo con diferentes totales de preguntas |
| HU-03 | CRITERIO-3.1 | Integ | TC-GAME-009 | Usuario autenticado ve botón guardar tras ganar |
| HU-03 | CRITERIO-3.2 | Integ + E2E | TC-GAME-010 | Guardar puntaje en backend exitosamente |
| HU-03 | CRITERIO-3.3 | Unit + Integ | TC-GAME-011 | Backend rechaza score < 51% |
| HU-03 | CRITERIO-3.4 | Unit + Integ | TC-GAME-012 | Prevención de puntaje duplicado |
| HU-04 | CRITERIO-4.1 | Integ | TC-GAME-013 | Leaderboard carga top 50 ordenado |
| HU-04 | CRITERIO-4.2 | Unit + Integ | TC-GAME-014 | Tabla renderiza filas con ranking correcto |
| HU-04 | CRITERIO-4.3 | Integ | TC-GAME-015 | Leaderboard accesible sin autenticación |
| HU-04 | CRITERIO-4.4 | Integ | TC-GAME-016 | Refresco de leaderboard |
| HU-05 | CRITERIO-5.1 | Integ + E2E | TC-GAME-017 | Reiniciar partida desde resultado |
| HU-05 | CRITERIO-5.2 | Integ | TC-GAME-018 | Volver al inicio sin guardar datos |
| HU-05 | CRITERIO-5.3 | Integ + E2E | TC-GAME-019 | Invitado ganador redirigido a registro |

### Flujos E2E Críticos (Smoke)

| ID E2E | Flujo | Tags |
|--------|-------|------|
| E2E-001 | Registro → Login → Jugar partida → Ganar → Guardar score → Ver leaderboard | `@smoke @critico` |
| E2E-002 | Invitado → Jugar partida → Ganar → Crear cuenta → Guardar score | `@smoke @critico` |
| E2E-003 | Login → Jugar → Perder → Reintentar → Ganar | `@smoke` |

---

**Versión:** 1.0
**Generado por:** QA Agent (ASDD)
