import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupService } from '../services/groupService';
import { useAuth } from '../context/AuthContext';
import { formatDateTime } from '../utils/validation';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGroup();
  }, [id]);

  const loadGroup = async () => {
    try {
      setIsLoading(true);
      const data = await groupService.getGroupById(id);
      setGroup(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isMember = group?.members?.some(member => member.id === user?.id);
  const isOwner = group?.owner?.id === user?.id;
  const canJoin = !isMember && !isOwner && (group?.members?.length || 0) < group?.maxMembers;

  const handleJoinGroup = async () => {
    setIsJoining(true);
    try {
      await groupService.joinGroup(id);
      await loadGroup(); // Recarregar dados do grupo
    } catch (error) {
      setError(error.message);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveGroup = async () => {
    setIsLeaving(true);
    try {
      await groupService.leaveGroup(id);
      navigate('/groups');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLeaving(false);
      setShowLeaveModal(false);
    }
  };

  const handleChatClick = () => {
    navigate(`/chat/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Erro ao carregar grupo</h3>
        <p className="mt-1 text-sm text-gray-500">{error || 'Grupo não encontrado'}</p>
        <div className="mt-6">
          <Button onClick={() => navigate('/groups')}>
            Voltar para grupos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">{group.subject}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {group.members?.length || 0}/{group.maxMembers} membros
              </span>
            </div>
            <p className="mt-2 text-lg text-gray-600">{group.objective}</p>
            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
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
          </div>

          <div className="ml-6 flex space-x-3">
            {isMember && (
              <Button onClick={handleChatClick}>
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Chat do Grupo
              </Button>
            )}

            {canJoin && (
              <Button onClick={handleJoinGroup} loading={isJoining}>
                Entrar no Grupo
              </Button>
            )}

            {isMember && !isOwner && (
              <Button variant="outline" onClick={() => setShowLeaveModal(true)}>
                Sair do Grupo
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {group.description && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Descrição</h2>
          <p className="text-gray-600">{group.description}</p>
        </div>
      )}

      {/* Meeting Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Informações de Encontro</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Horário</h3>
            <p className="text-sm text-gray-600">{group.meetingTime}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Dias da Semana</h3>
            <p className="text-sm text-gray-600">
              {Array.isArray(group.meetingDays) 
                ? group.meetingDays.join(', ') 
                : group.meetingDays
              }
            </p>
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Membros ({group.members?.length || 0})</h2>
        {group.members && group.members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.members.map(member => (
              <div key={member.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-primary-600 font-medium">
                      {member.name?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {member.name}
                    {member.id === group.owner?.id && (
                      <span className="ml-2 text-xs text-primary-600">(Criador)</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{member.course}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Nenhum membro ainda</p>
        )}
      </div>

      {/* Leave Group Modal */}
      <Modal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        title="Sair do Grupo"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Tem certeza que deseja sair do grupo <strong>{group.subject}</strong>?
          </p>
          <p className="text-sm text-gray-500">
            Você não receberá mais notificações deste grupo e perderá acesso ao chat.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowLeaveModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleLeaveGroup}
              loading={isLeaving}
            >
              Sair do Grupo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GroupDetail;
