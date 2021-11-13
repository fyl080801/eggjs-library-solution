import { Container } from 'typedi';

export const getService = () => {};

export const serviceProvider = () => {};

export const useServiceProvider = (provide) => {
  return provide({
    addProvider: () => {},
  });
};

useServiceProvider(({ addProvider }) => {
  const serviceToken = Symbol('serviceToken');

  addProvider(serviceToken);

  return ({ addService }) => {
    addService(serviceToken, () => {});
  };
});

export const useXxxService = serviceProvider();
