import api from './axios';

export const getNotesByAgent = (agentId) => api.get(`/notes/agent/${agentId}`);
export const createNote = (note) => api.post('/notes/create', note);
export const updateNote = (note) => api.put('/notes/update', note);
export const deleteNote = (id) => api.delete(`/notes/delete/${id}`);
