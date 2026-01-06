/**
 * Configuração centralizada da API
 * Usa variável de ambiente VITE_API_URL
 * 
 * Em desenvolvimento: http://localhost:3000
 * Em produção: definir no .env de produção
 */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
