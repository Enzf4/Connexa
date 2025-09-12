import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Estado para armazenar nosso valor
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Obter do localStorage
      const item = window.localStorage.getItem(key);
      // Parse armazenado json ou se nenhum retornar initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Se erro também retornar initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Retornar uma versão wrapped da função setState do useState que ...
  // ... persiste o novo valor para localStorage.
  const setValue = (value) => {
    try {
      // Permitir que value seja uma função para que tenhamos a mesma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Salvar estado
      setStoredValue(valueToStore);
      // Salvar para localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Uma implementação mais avançada lidaria com o caso de erro
      console.log(error);
    }
  };

  return [storedValue, setValue];
};
