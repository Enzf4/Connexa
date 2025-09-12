import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { groupService } from '../services/groupService';
import { formatDateTime } from '../utils/validation';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [myGroups, setMyGroups] = useState([]);
  const [recentGroups, setRecentGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [myGroupsData, recentGroupsData] = await Promise.all([
          groupService.getUserGroups(),
          groupService.getGroups({ limit: 5 })
        ]);
        
        setMyGroups(myGroupsData);
        setRecentGroups(recentGroupsData);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo ao Connexa. Aqui você pode encontrar e criar grupos de estudo para suas matérias.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/groups/create"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Criar Grupo</h3>
              <p className="text-sm text-gray-500">Crie um novo grupo de estudo</p>
            </div>
          </div>
        </Link>

        <Link
          to="/groups"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Buscar Grupos</h3>
              <p className="text-sm text-gray-500">Encontre grupos de estudo</p>
            </div>
          </div>
        </Link>

        <Link
          to="/profile"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Meu Perfil</h3>
              <p className="text-sm text-gray-500">Gerencie suas informações</p>
            </div>
          </div>
        </Link>
      </div>

      {/* My Groups */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Meus Grupos</h2>
            <Link
              to="/groups"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Ver todos
            </Link>
          </div>
        </div>
        <div className="p-6">
          {myGroups.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum grupo ainda</h3>
              <p className="mt-1 text-sm text-gray-500">Comece criando ou entrando em um grupo de estudo.</p>
              <div className="mt-6">
                <Link
                  to="/groups/create"
                  className="btn-primary"
                >
                  Criar grupo
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {myGroups.slice(0, 3).map(group => (
                <div key={group.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{group.subject}</h3>
                    <p className="text-sm text-gray-500">{group.objective}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {group.members?.length || 0} membros • Criado em {formatDateTime(group.createdAt)}
                    </p>
                  </div>
                  <Link
                    to={`/groups/${group.id}`}
                    className="ml-4 text-sm text-primary-600 hover:text-primary-500"
                  >
                    Ver grupo
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Groups */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Grupos Recentes</h2>
            <Link
              to="/groups"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Ver todos
            </Link>
          </div>
        </div>
        <div className="p-6">
          {recentGroups.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum grupo encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">Não há grupos recentes disponíveis.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentGroups.map(group => (
                <div key={group.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{group.subject}</h3>
                    <p className="text-sm text-gray-500">{group.objective}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {group.members?.length || 0} membros • Criado em {formatDateTime(group.createdAt)}
                    </p>
                  </div>
                  <Link
                    to={`/groups/${group.id}`}
                    className="ml-4 text-sm text-primary-600 hover:text-primary-500"
                  >
                    Ver grupo
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
