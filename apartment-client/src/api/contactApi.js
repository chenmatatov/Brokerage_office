import api from './axios';

export const sendContact = (data) => api.post('/contact/send', data);
export const getContactsByAgent = (agentId) => api.get(`/contact/agent/${agentId}`);
export const getAllContacts = () => api.get('/contact/all');
