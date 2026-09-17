import { api } from "../../../api/axiosInstance";

/**
 * @typedef {Object} Amistad
 * @property {number} id
 * 
 * @typedef {Object} Sala
 * @property {number} id
 * 
 * @typedef {Object} ParticipacionSala
 * @property {number} id
 * 
 * @typedef {Object} Review
 * @property {number} id
 */

/**
 * @typedef {Object} Player
 * @property {number} id
 * @property {string} email
 * @property {string} nombreUsuario
 * @property {string} nombre
 * @property {string} apellido
 * @property {string|null} [apodo]
 * @property {string|null} [fotoPerfilUrl]
 * @property {'ARQUERO'|'DEFENSOR'|'MEDIOCAMPISTA'|'DELANTERO'} posicionPrincipal
 * @property {number} reputacion
 * @property {string} creadoEn
 * @property {string} actualizadoEn
 * @property {Amistad[]} solicitudesAmistadEnviadas
 * @property {Amistad[]} solicitudesAmistadRecibidas
 * @property {Sala[]} salasCreadas
 * @property {ParticipacionSala[]} participacion
 * @property {Review[]} resenasEscritas
 * @property {Review[]} resenasRecibidas
 */

/**
 * @param {string} [search] 
 * @returns {Promise<Player[]>} 
 */
export const getAvailablePlayers = async (search = "") => {
  const response = await api.get("/users", { //Por el momento se usa "users" del back como jugadores 
    params: search ? { nombre : search } : {},
  });
  return response.data;
};
