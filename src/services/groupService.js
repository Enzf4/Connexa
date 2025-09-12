import api from './api';

export const groupService = {
  async createGroup(groupData) {
    try {
      const response = await api.post('/groups', groupData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar grupo');
    }
  },

  async getGroups(filters = {}) {
    try {
      const response = await api.get('/groups', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar grupos');
    }
  },

  async getGroupById(id) {
    try {
      const response = await api.get(`/groups/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar grupo');
    }
  },

  async joinGroup(id) {
    try {
      const response = await api.post(`/groups/${id}/join`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao entrar no grupo');
    }
  },

  async leaveGroup(id) {
    try {
      const response = await api.post(`/groups/${id}/leave`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao sair do grupo');
    }
  },

  async updateGroup(id, groupData) {
    try {
      const response = await api.put(`/groups/${id}`, groupData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar grupo');
    }
  },

  async deleteGroup(id) {
    try {
      const response = await api.delete(`/groups/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar grupo');
    }
  },

  async getUserGroups() {
    try {
      const response = await api.get('/groups/my-groups');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar seus grupos');
    }
  },

  async searchGroups(query, filters = {}) {
    try {
      const response = await api.get('/groups/search', {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar grupos');
    }
  },
};
