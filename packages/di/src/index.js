import { Container } from 'typedi';

const addService = (name, provider) => {
  Container.set(name, provider);
};

export const useServiceProvider = (register) => {
  register({ addService });
};

export const getService = (name) => {
  return Container.get(name);
};

export const getServices = (name) => {
  return Container.getMany(name);
};
