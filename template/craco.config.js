const { default: lessPlugin } = require('craco-plugin-less');

const pathSeparatorPattern = '[/\\\\]';

module.exports = {
  babel: {
    plugins: [
      [
        'import',
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true,
        },
      ],
    ],
  },
  jest: {
    configure: (jestConfig) => {
      const transformIgnorePatterns = jestConfig.transformIgnorePatterns;

      const indexOfNodeModulesPattern = transformIgnorePatterns.findIndex((p) =>
        p.includes(`node_modules${pathSeparatorPattern}`)
      );
      if (indexOfNodeModulesPattern === -1) {
        throw new Error(
          "Can't find node_modules pattern in transformIgnorePatterns!"
        );
      }

      const nodeModulesPattern =
        transformIgnorePatterns[indexOfNodeModulesPattern];
      transformIgnorePatterns[indexOfNodeModulesPattern] =
        nodeModulesPattern.replace(
          `node_modules${pathSeparatorPattern}`,
          `node_modules${pathSeparatorPattern}(?!(antd|@ant-design|rc-.+?|@babel/runtime)${pathSeparatorPattern})`
        );

      return jestConfig;
    },
  },
  plugins: [
    {
      plugin: lessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
