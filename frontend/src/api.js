import axios from 'axios';
import { mockCitationData } from './mockdata';


const API_BASE = 'https://webcite-hackdartmouth-4995e6597c1a.herokuapp.com';

export const fetchCitationData = async (id) => {
  if (id === 'mock') {
    return mockCitationData;
  }
  try {
    const response = await axios.get(`${API_BASE}/api/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch data');
  }
};

export const searchPapers = async (query) => {
  // Prepare for when backend adds search
  return [];
};