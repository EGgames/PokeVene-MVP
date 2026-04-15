#language: es

Característica: Tabla de Clasificación General (Leaderboard)
  Como cualquier usuario autenticado o invitado
  Quiero ver la tabla con los puntajes más altos de otros jugadores
  Para comparar mi desempeño y saber cómo me ubico en la comunidad

  @happy-path @critico @smoke
  Escenario: CRITERIO-4.1 — Acceder a la tabla de posiciones
    Dado que existen puntajes guardados de múltiples usuarios
    Cuando el usuario accede a la pantalla de la tabla de posiciones
    Entonces ve una tabla con las columnas "Posición", "Usuario", "Puntaje" y "Fecha"
    Y los puntajes están ordenados de mayor a menor

  @happy-path @wip
  Escenario: CRITERIO-4.2 — Tabla muestra ranking numérico correcto
    Dado que existen los siguientes puntajes guardados:
      | usuario          | puntaje |
      | pokefan_vzla     | 95%     |
      | margariteno_pro  | 90%     |
      | caraquenio_gamer | 80%     |
    Cuando el usuario consulta la tabla de posiciones
    Entonces "pokefan_vzla" aparece en la posición 1 con 95%
    Y "margariteno_pro" aparece en la posición 2 con 90%
    Y "caraquenio_gamer" aparece en la posición 3 con 80%
    Y muestra "Cargando..." mientras se obtienen los datos

  @happy-path @seguridad @wip
  Escenario: CRITERIO-4.3 — Tabla accesible sin autenticación
    Dado que el usuario es un invitado sin sesión iniciada
    Cuando accede a la pantalla de la tabla de posiciones
    Entonces puede ver la tabla completa con todos los puntajes
    Y no se le solicita iniciar sesión
    Y el endpoint público no requiere token de autenticación

  @edge-case @wip
  Escenario: CRITERIO-4.4 — Tabla se refresca con datos actualizados
    Dado que el usuario está viendo la tabla de posiciones
    Y otro jugador acaba de guardar un nuevo puntaje alto
    Cuando el usuario presiona el botón "Recargar" o espera 30 segundos
    Entonces la tabla muestra los datos más recientes
    Y el nuevo puntaje aparece en la posición correspondiente
