export const validationRules = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'Este campo é obrigatório';
    }
    return '';
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return 'Digite um email válido';
    }
    return '';
  },

  institutionalEmail: (value) => {
    const institutionalDomains = [
      '@gmail.com',
      '@outlook.com',
      '@hotmail.com',
      '@yahoo.com',
      '@estudante.ufpb.br',
      '@academico.ufpb.br',
      '@ufpb.br',
      '@estudante.uepb.edu.br',
      '@uepb.edu.br',
      '@estudante.ifpb.edu.br',
      '@ifpb.edu.br',
    ];
    
    if (value && !institutionalDomains.some(domain => value.endsWith(domain))) {
      return 'Digite um email institucional válido';
    }
    return '';
  },

  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Mínimo de ${min} caracteres`;
    }
    return '';
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Máximo de ${max} caracteres`;
    }
    return '';
  },

  password: (value) => {
    if (!value) return '';
    
    const hasMinLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!hasMinLength) {
      return 'A senha deve ter pelo menos 8 caracteres';
    }
    if (!hasUpperCase) {
      return 'A senha deve conter pelo menos uma letra maiúscula';
    }
    if (!hasLowerCase) {
      return 'A senha deve conter pelo menos uma letra minúscula';
    }
    if (!hasNumbers) {
      return 'A senha deve conter pelo menos um número';
    }
    if (!hasSpecialChar) {
      return 'A senha deve conter pelo menos um caractere especial';
    }
    return '';
  },

  confirmPassword: (password) => (value) => {
    if (value && value !== password) {
      return 'As senhas não coincidem';
    }
    return '';
  },

  phone: (value) => {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (value && !phoneRegex.test(value)) {
      return 'Digite um telefone válido (ex: (83) 99999-9999)';
    }
    return '';
  },

  positiveNumber: (value) => {
    if (value && (isNaN(value) || value <= 0)) {
      return 'Digite um número positivo';
    }
    return '';
  },

  url: (value) => {
    const urlRegex = /^https?:\/\/.+/;
    if (value && !urlRegex.test(value)) {
      return 'Digite uma URL válida (ex: https://exemplo.com)';
    }
    return '';
  },
};

export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: '', color: '' };

  let strength = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  strength = Object.values(checks).filter(Boolean).length;

  const strengthLevels = [
    { strength: 0, label: '', color: '' },
    { strength: 1, label: 'Muito fraca', color: 'text-red-500' },
    { strength: 2, label: 'Fraca', color: 'text-orange-500' },
    { strength: 3, label: 'Regular', color: 'text-yellow-500' },
    { strength: 4, label: 'Boa', color: 'text-blue-500' },
    { strength: 5, label: 'Muito forte', color: 'text-green-500' },
  ];

  return strengthLevels[strength];
};

export const formatPhoneNumber = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} dia${days > 1 ? 's' : ''} atrás`;
  if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
  if (minutes > 0) return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
  return 'Agora mesmo';
};
