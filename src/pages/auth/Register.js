import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from '../../hooks/useForm';
import { validationRules, getPasswordStrength } from '../../utils/validation';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Register = () => {
  const { register, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validateForm } = useForm(
    {
      name: '',
      email: '',
      course: '',
      semester: '',
      password: '',
      confirmPassword: '',
    },
    {
      name: [validationRules.required, validationRules.minLength(2)],
      email: [validationRules.required, validationRules.email, validationRules.institutionalEmail],
      course: [validationRules.required],
      semester: [validationRules.required, validationRules.positiveNumber],
      password: [validationRules.required, validationRules.password],
      confirmPassword: [validationRules.required, (value, currentValues) => validationRules.confirmPassword(currentValues.password)(value)],
    }
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const passwordStrength = getPasswordStrength(values.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    const result = await register({
      name: values.name,
      email: values.email,
      course: values.course,
      semester: parseInt(values.semester),
      password: values.password,
    });
    setIsLoading(false);

    if (result.success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              entre com sua conta existente
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Nome completo"
              name="name"
              type="text"
              placeholder="Seu nome completo"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              required
            />

            <Input
              label="Email institucional"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              required
            />

            <Input
              label="Curso"
              name="course"
              type="text"
              placeholder="Ex: Ciência da Computação"
              value={values.course}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.course}
              touched={touched.course}
              required
            />

            <Input
              label="Período/Semestre"
              name="semester"
              type="number"
              placeholder="Ex: 3"
              min="1"
              max="20"
              value={values.semester}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.semester}
              touched={touched.semester}
              required
            />

            <div>
              <Input
                label="Senha"
                name="password"
                type="password"
                placeholder="Sua senha"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
                required
              />
              
              {values.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.strength === 1 ? 'bg-red-500 w-1/5' :
                          passwordStrength.strength === 2 ? 'bg-orange-500 w-2/5' :
                          passwordStrength.strength === 3 ? 'bg-yellow-500 w-3/5' :
                          passwordStrength.strength === 4 ? 'bg-blue-500 w-4/5' :
                          passwordStrength.strength === 5 ? 'bg-green-500 w-full' :
                          'bg-gray-300 w-0'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirmar senha"
              name="confirmPassword"
              type="password"
              placeholder="Confirme sua senha"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            className="w-full"
          >
            Criar conta
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
