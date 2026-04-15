#language: es

Característica: Inicio de Sesión
  Como usuario registrado
  Quiero poder iniciar sesión con mi nombre de usuario y contraseña
  Para acceder a la aplicación y recuperar mis puntajes previos

  Antecedentes:
    Dado que el usuario se encuentra en la pantalla de inicio de sesión

  @happy-path @critico @smoke
  Escenario: CRITERIO-2.1 — Login exitoso con credenciales válidas
    Dado que existe un usuario registrado con nombre "caraquenio_gamer" y contraseña "M4racucho#2026"
    Cuando el usuario ingresa el nombre "caraquenio_gamer"
    Y ingresa la contraseña "M4racucho#2026"
    Y presiona el botón "Iniciar Sesión"
    Entonces el sistema retorna un código de estado 200
    Y retorna un token de sesión válido con expiración de 7 días
    Y retorna los datos del usuario autenticado
    Y el token queda almacenado en el navegador
    Y el usuario es redirigido a la pantalla del juego

  @error-path @seguridad @wip
  Escenario: CRITERIO-2.2 — Username no encontrado
    Dado que no existe un usuario registrado con nombre "fantasma_inexistente"
    Cuando el usuario ingresa el nombre "fantasma_inexistente"
    Y ingresa la contraseña "CualquierPass123"
    Y presiona el botón "Iniciar Sesión"
    Entonces el sistema retorna un código de estado 401
    Y muestra el mensaje "Usuario o contraseña incorrectos"
    Y no revela si el nombre de usuario existe o no

  @error-path @seguridad @wip
  Escenario: CRITERIO-2.3 — Contraseña incorrecta
    Dado que existe un usuario registrado con nombre "caraquenio_gamer"
    Cuando el usuario ingresa el nombre "caraquenio_gamer"
    Y ingresa la contraseña "ContrasenaMal999"
    Y presiona el botón "Iniciar Sesión"
    Entonces el sistema retorna un código de estado 401
    Y muestra el mensaje "Usuario o contraseña incorrectos"
    Y no revela que la contraseña es el campo incorrecto

  @error-path @wip
  Escenario: CRITERIO-2.4 — Campo requerido faltante en login
    Cuando el usuario ingresa el nombre "caraquenio_gamer"
    Y deja el campo de contraseña vacío
    Y presiona el botón "Iniciar Sesión"
    Entonces el sistema retorna un código de estado 400
    Y muestra el mensaje indicando que el campo "password" es requerido
