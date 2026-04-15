# Historias de Usuario (User Stories) - PokeVene

## US-01: Autenticación de Usuario (Backend-Only)
**Como** jugador interesado en competir,  
**Quiero** poder registrarme e iniciar sesión sin usar servicios externos,  
**Para** que mis puntajes queden registrados en mi perfil personal.

### Criterios de Aceptación:
- El registro requiere `username` y `password` (con hashing en DB).
- El inicio de sesión devuelve un token (JWT) para sesiones seguras.
- Se puede jugar como invitado sin necesidad de cuenta.

---

## US-02: Mecánica de Juego "Pokémon o Venezolano"
**Como** usuario del juego,  
**Quiero** ver un término y decidir si es un Pokémon o un término venezolano,  
**Para** poner a prueba mis conocimientos y ganar la partida.

### Criterios de Aceptación:
- Dos botones claros: "Pokémon" y "Venezolano".
- Feedback inmediato (acierto/error) tras la selección.
- Barra de progreso o contador de preguntas.

---

## US-03: Sistema de Puntuación y Victoria
**Como** jugador,  
**Quiero** que mi porcentaje de aciertos se calcule al final de la partida,  
**Para** saber si gané (más del 50% + 1) y decidir si quiero guardar mi puntaje.

### Criterios de Aceptación:
- El resultado se muestra como porcentaje sobre 100.
- Si el usuario es invitado, se le ofrece registro al ganar.
- Opción de reiniciar partida sin guardar datos.

---

## US-04: Tabla de Clasificación General
**Como** usuario competitivo,  
**Quiero** ver una tabla con los mejores puntajes de otros jugadores,  
**Para** comparar mi nivel con la comunidad.

### Criterios de Aceptación:
- Tabla pública accesible para todos.
- Solo los usuarios registrados pueden enviar su puntaje a la tabla.
