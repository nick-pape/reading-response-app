module.exports = {
  packagerConfig: {
    asar: true,
    icon: 'assets/robot',
    ignore: [
      /node_modules\/(?!tslib)/,
      /lib(?!-commonjs)\/app/,
      /lib(?!-commonjs)\/harness/,
      /\.github/,
      /src/,
      /temp/,
      /\.eslintrc\.js/,
      /\.gitignore/,
      /forge\.config\.js/,
      /package-lock\.json/,
      /tsconfig\.json/,
      /webpack\.config\.js/
    ]
  },

  make_targets: {
    win32: ['squirrel'],
    darwin: ['zip', 'dmg'],
    linux: ['deb', 'rpm']
  },
  
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
