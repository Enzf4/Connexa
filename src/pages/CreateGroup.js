import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../services/groupService';
import { useForm } from '../hooks/useForm';
import { validationRules } from '../utils/validation';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const CreateGroup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { values, errors, touched, handleChange, handleBlur, validateForm } = useForm(
    {
      subject: '',
      objective: '',
      location: '',
      description: '',
      maxMembers: '10',
      meetingTime: '',
      meetingDays: '',
    },
    {
      subject: [validationRules.required, validationRules.minLength(2)],
      objective: [validationRules.required, validationRules.minLength(5)],
      location: [validationRules.required, validationRules.minLength(2)],
      description: [validationRules.minLength(10)],
      maxMembers: [validationRules.required, validationRules.positiveNumber],
      meetingTime: [validationRules.required],
      meetingDays: [validationRules.required],
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const groupData = {
        subject: values.subject,
        objective: values.objective,
        location: values.location,
        description: values.description,
        maxMembers: parseInt(values.maxMembers),
        meetingTime: values.meetingTime,
        meetingDays: values.meetingDays.split(',').map(day => day.trim()),
      };

      const newGroup = await groupService.createGroup(groupData);
      navigate(`/groups/${newGroup.id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Criar Grupo de Estudo</h1>
        <p className="mt-2 text-gray-600">
          Preencha as informações abaixo para criar um novo grupo de estudo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h2>
          
          <div className="space-y-4">
            <Input
              label="Matéria/Disciplina"
              name="subject"
              type="text"
              placeholder="Ex: Cálculo I, Física II, Programação"
              value={values.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.subject}
              touched={touched.subject}
              required
            />

            <Input
              label="Objetivo do Grupo"
              name="objective"
              type="text"
              placeholder="Ex: Preparação para prova final, Exercícios práticos"
              value={values.objective}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.objective}
              touched={touched.objective}
              required
            />

            <Input
              label="Local de Encontro"
              name="location"
              type="text"
              placeholder="Ex: Biblioteca Central, Sala 205, Online"
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.location}
              touched={touched.location}
              required
            />

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Descreva mais detalhes sobre o grupo, metodologia de estudo, etc."
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-field ${touched.description && errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              />
              {touched.description && errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações</h2>
          
          <div className="space-y-4">
            <Input
              label="Máximo de Participantes"
              name="maxMembers"
              type="number"
              placeholder="10"
              min="2"
              max="50"
              value={values.maxMembers}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.maxMembers}
              touched={touched.maxMembers}
              required
            />

            <Input
              label="Horário de Encontro"
              name="meetingTime"
              type="time"
              value={values.meetingTime}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.meetingTime}
              touched={touched.meetingTime}
              required
            />

            <div>
              <label htmlFor="meetingDays" className="block text-sm font-medium text-gray-700 mb-2">
                Dias da Semana *
              </label>
              <input
                id="meetingDays"
                name="meetingDays"
                type="text"
                placeholder="Ex: Segunda, Quarta, Sexta"
                value={values.meetingDays}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-field ${touched.meetingDays && errors.meetingDays ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                required
              />
              {touched.meetingDays && errors.meetingDays && (
                <p className="mt-1 text-sm text-red-600">{errors.meetingDays}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Separe os dias por vírgula (ex: Segunda, Quarta, Sexta)
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/groups')}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
          >
            Criar Grupo
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;
