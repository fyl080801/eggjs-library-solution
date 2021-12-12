import { Container } from 'typedi';

const addService = (name, provider) => {
  Container.set(name, provider);
};

export const useServiceProvider = (register) => {
  register({ addService });
};

export const getService = (name) => {
  const provider = Container.get(name);

  return provider(Container);
};

export const startup = (packages) => {};
