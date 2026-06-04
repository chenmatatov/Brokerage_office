import api from './axios';

export const getAllAgents = () => api.get('/agents/getAll');
export const getAgentById = (id) => api.get(`/agents/getById/${id}`);
export const getAgentStats = (id) => api.get(`/agents/getStats/${id}`);
export const createAgent = (agent) => api.post('/agents/create', agent);
export const updateAgent = (agent) => api.put('/agents/update', agent);
export const deleteAgent = (id) => api.delete(`/agents/delete/${id}`);
