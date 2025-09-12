import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useForm } from '../hooks/useForm';
import { validationRules } from '../utils/validation';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const { values, errors, touched, handleChange, handleBlur, validateForm, setValues } = useForm(
    {
      name: user?.name || '',
      email: user?.email || '',
      course: user?.course || '',
      semester: user?.semester?.toString() || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    },
    {
      name: [validationRules.required, validationRules.minLength(2)],
      email: [validationRules.required, validationRules.email],
      course: [validationRules.required],
      semester: [validationRules.required, validationRules.positiveNumber],
      phone: [validationRules.phone],
      bio: [validationRules.maxLength(500)],
    }
  );

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValues({
      name: user?.name || '',
      email: user?.email || '',
      course: user?.course || '',
      semester: user?.semester?.toString() || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const profileData = {
        name: values.name,
        email: values.email,
        course: values.course,
        semester: parseInt(values.semester),
        phone: values.phone,
        bio: values.bio,
      };

      await updateProfile(profileData);
      setSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validações do arquivo
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (file.size > maxSize) {
      setError('A imagem deve ter no máximo 5MB');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setError('Apenas imagens JPG, PNG e GIF são permitidas');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      await authService.uploadAvatar(file);
      setSuccess('Foto atualizada com sucesso!');
      // Recarregar a página para atualizar o avatar
      window.location.reload();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div
              onClick={handleAvatarClick}
              className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center cursor-pointer hover:bg-primary-200 transition-colors"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-primary-600 font-bold text-2xl">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-600">{user?.course} - {user?.semester}º período</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          <div>
            {!isEditing ? (
              <Button onClick={handleEdit}>
                Editar Perfil
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} loading={isLoading}>
                  Salvar
                </Button>
              </div>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />
      </div>

      {/* Messages */}
      {(error || success) && (
        <div className={`rounded-md p-4 ${
          error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
        }`}>
          <p className={`text-sm ${error ? 'text-red-600' : 'text-green-600'}`}>
            {error || success}
          </p>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome completo"
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              disabled={!isEditing}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Curso"
              name="course"
              type="text"
              value={values.course}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.course}
              touched={touched.course}
              disabled={!isEditing}
              required
            />

            <Input
              label="Período/Semestre"
              name="semester"
              type="number"
              min="1"
              max="20"
              value={values.semester}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.semester}
              touched={touched.semester}
              disabled={!isEditing}
              required
            />
          </div>

          <Input
            label="Telefone (opcional)"
            name="phone"
            type="tel"
            placeholder="(83) 99999-9999"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.phone}
            touched={touched.phone}
            disabled={!isEditing}
          />

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Biografia (opcional)
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              placeholder="Conte um pouco sobre você, seus interesses acadêmicos, etc."
              value={values.bio}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!isEditing}
              className={`input-field ${touched.bio && errors.bio ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
            />
            {touched.bio && errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {values.bio.length}/500 caracteres
            </p>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Informações da Conta</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Membro desde</span>
            <span className="text-sm text-gray-900">
              {new Date(user?.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Última atualização</span>
            <span className="text-sm text-gray-900">
              {new Date(user?.updatedAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
