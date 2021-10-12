const CracoLessPlugin = require('craco-less');

// The following override should have been in CracoLessPlugin
CracoLessPlugin.overrideJestConfig = ({ context, jestConfig }) => {
  const moduleNameMapper = jestConfig.moduleNameMapper;
  const cssModulesPattern = Object.keys(moduleNameMapper).find((p) =>
    p.match(/\\\.module\\\.\(.*?css.*?\)/)
  );

  if (!cssModulesPattern) {
    throw new Error(
      `Can't find CSS Modules pattern under moduleNameMapper in the ${context.env} jest config!`
    );
  }

  moduleNameMapper[cssModulesPattern.replace('css', 'css|less')] =
    moduleNameMapper[cssModulesPattern];
  delete moduleNameMapper[cssModulesPattern];

  const transformIgnorePatterns = jestConfig.transformIgnorePatterns;
  const cssModulesPatternIndex = transformIgnorePatterns.findIndex((p) =>
    p.match(/\\\.module\\\.\(.*?css.*?\)/)
  );
  if (cssModulesPatternIndex === -1) {
    throw new Error(
      `Can't find CSS Modules pattern under transformIgnorePatterns in the ${context.env} jest config!`
    );
  }

  transformIgnorePatterns[cssModulesPatternIndex] = transformIgnorePatterns[
    cssModulesPatternIndex
  ].replace('css', 'css|less');

  return jestConfig;
};

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
        p.includes('node_modules[/\\\\]')
      );
      if (indexOfNodeModulesPattern === -1) {
        throw new Error(
          "Can't find node_modules pattern in transformIgnorePatterns!"
        );
      }

      transformIgnorePatterns.splice(indexOfNodeModulesPattern, 1);

      return jestConfig;
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
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
