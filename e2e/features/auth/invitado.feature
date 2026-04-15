#language: es

Característica: Jugar como Invitado
  Como usuario nuevo sin cuenta
  Quiero poder jugar sin necesidad de registrarme inmediatamente
  Para probar el juego antes de decidir si crearme una cuenta

  @happy-path @critico
  Escenario: CRITERIO-3.1 — Acceso como invitado al juego
    Dado que el usuario no ha iniciado sesión
    Cuando accede a la pantalla del juego
    Entonces puede ver el primer término de la partida
    Y puede interactuar con los botones "Pokémon" y "Venezolano"
    Y puede completar una partida de 10 preguntas
    Y al finalizar, ve la opción "Crear Cuenta para Guardar"
    Y puede elegir reiniciar otra partida sin registrarse

  @error-path @seguridad @wip
  Escenario: CRITERIO-3.2 — Invitado sin acceso a paneles protegidos
    Dado que el usuario está jugando como invitado sin sesión iniciada
    Cuando intenta acceder a la tabla de posiciones o al perfil
    Entonces el sistema lo redirige a la pantalla de inicio de sesión
    Y muestra el mensaje "Debes iniciar sesión para acceder aquí"
