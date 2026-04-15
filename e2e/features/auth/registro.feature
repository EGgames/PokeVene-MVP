#language: es

Característica: Registro de Usuarios
  Como usuario interesado en el juego
  Quiero poder crear una cuenta con mi nombre de usuario y contraseña
  Para guardar mis puntajes y aparecer en la tabla general de clasificación

  Antecedentes:
    Dado que el usuario se encuentra en la pantalla de registro

  @happy-path @critico @smoke
  Escenario: CRITERIO-1.1 — Registro exitoso con credenciales válidas
    Dado que no existe un usuario con nombre "caraquenio_gamer"
    Cuando el usuario ingresa el nombre "caraquenio_gamer"
    Y ingresa la contraseña "M4racucho#2026"
    Y presiona el botón "Crear Cuenta"
    Entonces el sistema crea la cuenta exitosamente
    Y retorna un código de estado 201
    Y retorna un token de sesión válido
    Y el usuario es redirigido a la pantalla del juego
    Y el token queda almacenado en el navegador

  @error-path @seguridad @wip
  Escenario: CRITERIO-1.2 — Username duplicado rechazado
    Dado que ya existe un usuario registrado con nombre "pokefan_vzla"
    Cuando otro usuario intenta registrarse con el nombre "pokefan_vzla"
    Y ingresa la contraseña "Contr4sena_Valida!"
    Y presiona el botón "Crear Cuenta"
    Entonces el sistema retorna un código de estado 409
    Y muestra el mensaje "El nombre de usuario ya existe"
    Y la cuenta no es creada

  @error-path @wip
  Escenario: CRITERIO-1.3 — Contraseña débil rechazada
    Dado que no existe un usuario con nombre "nuevo_jugador"
    Cuando el usuario ingresa el nombre "nuevo_jugador"
    Y ingresa la contraseña "corta"
    Y presiona el botón "Crear Cuenta"
    Entonces el sistema retorna un código de estado 400
    Y muestra el mensaje "La contraseña debe tener al menos 8 caracteres"
    Y la cuenta no es creada

  @error-path @wip
  Escenario: CRITERIO-1.4 — Campo requerido faltante
    Cuando el usuario deja el campo de nombre de usuario vacío
    Y ingresa la contraseña "M4racucho#2026"
    Y presiona el botón "Crear Cuenta"
    Entonces el sistema retorna un código de estado 400
    Y muestra el mensaje indicando que el campo "username" es requerido
    Y la cuenta no es creada

  @edge-case @wip
  Escenario: CRITERIO-1.5 — Username con caracteres especiales permitidos
    Dado que no existe un usuario con nombre "poke_fan-123"
    Cuando el usuario ingresa el nombre "poke_fan-123"
    Y ingresa la contraseña "Gu4r0_Seguro99"
    Y presiona el botón "Crear Cuenta"
    Entonces el sistema acepta el nombre de usuario con guiones y guiones bajos
    Y crea la cuenta exitosamente
    Y retorna un código de estado 201
