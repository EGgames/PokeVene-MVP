#language: es

Característica: Cálculo de Score y Determinación de Victoria
  Como usuario
  Quiero que el sistema calcule mi porcentaje de aciertos
  Para saber si gané la partida y poder guardar mi puntaje

  @happy-path @critico
  Escenario: CRITERIO-2.1 — Cálculo de porcentaje correcto
    Dado que el usuario accede a la pantalla del juego
    Cuando la página termina de cargar
    Y el usuario responde correctamente 7 de 10 preguntas
    Entonces el sistema navega automáticamente a la pantalla de resultados
    Y muestra en pantalla "70%"

  @happy-path @critico
  Escenario: CRITERIO-2.2 — Victoria cuando el porcentaje supera el umbral
    Dado que el usuario accede a la pantalla del juego
    Cuando la página termina de cargar
    Y el usuario responde correctamente 7 de 10 preguntas
    Entonces el sistema navega automáticamente a la pantalla de resultados
    Y muestra el mensaje "¡GANASTE!" con énfasis visual

  @error-path @wip
  Escenario: CRITERIO-2.3 — Derrota cuando el porcentaje no supera el umbral
    Dado que el porcentaje de acierto del usuario es 50%
    Y acertó exactamente 5 de 10 preguntas
    Cuando el sistema evalúa la condición de victoria
    Entonces muestra el mensaje "Perdiste, intenta de nuevo"
    Y ofrece el botón "Reintentar"
    Y no ofrece la opción de guardar puntaje

  @edge-case @wip
  Escenario: CRITERIO-2.4 — Cálculo correcto con diferentes totales de preguntas
    Dado que el juego tiene un total de <total> preguntas
    Y el usuario acertó <aciertos> respuestas
    Cuando el sistema evalúa la condición de victoria
    Entonces el porcentaje calculado es <porcentaje>%
    Y el resultado es "<resultado>"

    Ejemplos:
      | total | aciertos | porcentaje | resultado |
      | 5     | 3        | 60         | Victoria  |
      | 5     | 2        | 40         | Derrota   |
      | 10    | 6        | 60         | Victoria  |
      | 10    | 5        | 50         | Derrota   |
      | 15    | 8        | 53         | Victoria  |
      | 15    | 7        | 47         | Derrota   |
      | 20    | 11       | 55         | Victoria  |
      | 20    | 10       | 50         | Derrota   |
