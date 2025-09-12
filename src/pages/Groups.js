import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { groupService } from '../services/groupService';
import { formatDateTime } from '../utils/validation';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    subject: '',
    location: '',
    objective: '',
  });

  useEffect(() => {
    loadGroups();
  }, [filters]);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      const data = await groupService.getGroups(filters);
      setGroups(data);
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadGroups();
      return;
    }

    try {
      setIsLoading(true);
      const data = await groupService.searchGroups(searchQuery, filters);
      setGroups(data);
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      subject: '',
      location: '',
      objective: '',
    });
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Grupos de Estudo</h1>
        <Link to="/groups/create">
          <Button>+ Criar Grupo</Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar grupos
            </label>
            <div className="flex space-x-2">
              <input
                id="search"
                type="text"
                placeholder="Digite o nome da matéria, objetivo ou local..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 input-field"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                Buscar
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Matéria
              </label>
              <input
                id="subject"
                type="text"
                placeholder="Ex: Cálculo I"
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Local
              </label>
              <input
                id="location"
                type="text"
                placeholder="Ex: Biblioteca Central"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo
              </label>
              <input
                id="objective"
                type="text"
                placeholder="Ex: Preparação para prova"
                value={filters.objective}
                onChange={(e) => handleFilterChange('objective', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={clearFilters}>
              Limpar filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Groups List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {isLoading ? 'Carregando...' : `${groups.length} grupos encontrados`}
          </h2>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum grupo encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || Object.values(filters).some(f => f) 
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Seja o primeiro a criar um grupo de estudo!'
                }
              </p>
              <div className="mt-6">
                <Link to="/groups/create">
                  <Button>Criar grupo</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {groups.map(group => (
                <div key={group.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">{group.subject}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {group.members?.length || 0}/{group.maxMembers} membros
                        </span>
                      </div>
                      
                      <p className="mt-2 text-sm text-gray-600">{group.objective}</p>
                      
                      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {group.location}
                        </div>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Criado em {formatDateTime(group.createdAt)}
                        </div>
                      </div>

                      {group.description && (
                        <p className="mt-3 text-sm text-gray-600">{group.description}</p>
                      )}
                    </div>

                    <div className="ml-4 flex-shrink-0">
                      <Link to={`/groups/${group.id}`}>
                        <Button variant="outline">
                          Ver detalhes
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Groups;
