export const plugins = [
  {
    name: '@egglib/test2',
    importer: () => import(/* webpackChunkName: 'test2' */ '@egglib/test2'),
  },
];
