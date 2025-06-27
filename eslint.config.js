import '@rushstack/eslint-patch/modern-module-resolution';
import eslintPluginNext from 'eslint-config-next';

export default [
  {
    ignores: [
      '**/prisma/migrations/**',
      '.next/**',
      'node_modules/**',
    ],
  },
  ...eslintPluginNext,
];
