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

const packageDependencies = (packageName) =>
  Object.keys(require(`${packageName}/package.json`).dependencies || {});

const getAllPackageNames = (packageNames) => {
  const allPackageNames = new Set(packageNames);
  for (const packageName of packageNames) {
    const dependencyNames = packageDependencies(packageName);
    for (const e of getAllPackageNames(dependencyNames)) {
      allPackageNames.add(e);
    }
  }
  return allPackageNames;
};

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

      const packageNamesPattern = [...getAllPackageNames(['antd'])]
        .map((packageName) => packageName.replace('/', pathSeparatorPattern))
        .join('|');
      const nodeModulesPattern =
        transformIgnorePatterns[indexOfNodeModulesPattern];
      transformIgnorePatterns[indexOfNodeModulesPattern] =
        nodeModulesPattern.replace(
          `node_modules${pathSeparatorPattern}`,
          `node_modules${pathSeparatorPattern}(?!(${packageNamesPattern})${pathSeparatorPattern})`
        );

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
