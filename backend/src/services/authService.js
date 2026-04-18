// Service: Lógica de negocio de autenticación — orquesta UserRepository (SPEC-002)

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateRegisterInput, validateLoginInput } = require('../models/userModel');

const SALT_ROUNDS = 10;
const JWT_EXPIRES_SECONDS = 604800; // 7 días

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  _generateToken(user) {
    const expires_in = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: expires_in }
    );
  }

  _buildError(message, status_code, errors = null) {
    const err = new Error(message);
    err.statusCode = status_code;
    if (errors) err.errors = errors;
    return err;
  }

  /**
   * Registra un nuevo usuario. Valida input, verifica unicidad, hashea password y genera JWT.
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{ id, username, token, created_at }>}
   */
  async register(username, password) {
    const { valid, errors } = validateRegisterInput(username, password);
    if (!valid) {
      throw this._buildError(errors[0], 400, errors);
    }

    const existing = await this.userRepository.findByUsername(username);
    if (existing) {
      throw this._buildError('El nombre de usuario ya existe', 409);
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await this.userRepository.create(username, password_hash);
    const token = this._generateToken(user);

    return {
      id: user.id,
      username: user.username,
      role: user.role || 'user',
      xp: user.xp || 0,
      level: user.level || 1,
      token,
      created_at: user.created_at,
    };
  }

  /**
   * Autentica un usuario existente. No revela si el username existe o no.
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{ id, username, token, expiresIn }>}
   */
  async login(username, password) {
    const { valid, errors } = validateLoginInput(username, password);
    if (!valid) {
      throw this._buildError(errors[0], 400, errors);
    }

    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw this._buildError('Usuario o contraseña incorrectos', 401);
    }

    const password_match = await bcrypt.compare(password, user.password_hash);
    if (!password_match) {
      throw this._buildError('Usuario o contraseña incorrectos', 401);
    }

    if (user.banned_at !== null && user.banned_at !== undefined) {
      throw this._buildError('Tu cuenta ha sido suspendida', 403);
    }

    const token = this._generateToken(user);

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      xp: user.xp,
      level: user.level,
      token,
      expiresIn: JWT_EXPIRES_SECONDS,
    };
  }

  /**
   * Retorna el perfil de un usuario por ID (sin password_hash).
   * @param {string} userId
   * @returns {Promise<{ id, username, created_at }>}
   */
  async getProfile(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw this._buildError('Usuario no encontrado', 403);
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      xp: user.xp,
      level: user.level,
      created_at: user.created_at,
    };
  }
}

module.exports = AuthService;
