import api from './axios';

export const getAllProperties = () => api.get('/properties/getAll');
export const getPropertyById = (id) => api.get(`/properties/getById/${id}`);
export const getPropertiesByAgent = (agentId) => api.get(`/properties/getByAgent/${agentId}`);
export const getPropertiesByPriceRange = (min, max) => api.get(`/properties/price-range?min=${min}&max=${max}`);
export const getPropertiesByRooms = (rooms) => api.get(`/properties/rooms/${rooms}`);
export const searchProperties = (keyword) => api.get(`/properties/search?keyword=${keyword}`);
export const getPropertiesByCity = (city) => api.get(`/properties/city/${city}`);
export const createProperty = (property) => api.post('/properties/create', property);
export const updateProperty = (property) => api.put('/properties/update', property);
export const deleteProperty = (id) => api.delete(`/properties/delete/${id}`);
