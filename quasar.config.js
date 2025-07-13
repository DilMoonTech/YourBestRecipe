/* eslint-env node */

import { configure } from 'quasar/wrappers';

export default configure(function (/* ctx */) {
  return {
    eslint: {
      fix: true,
      warnings: true,
      errors: true
    },

    boot: [
      'pinia',
      'i18n',
      'axios'
    ],

    css: [
      'app.scss'
    ],

    extras: [
      'roboto-font',
      'material-icons'
    ],

    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node22'
      },

      vueRouterMode: 'history',
      alias: {
        '@assets': 'src/assets'
      },
      // vitePlugins: [
      //   ['@intlify/vite-plugin-vue-i18n', {
      //     include: [
      //       './src/i18n/**'
      //     ]
      //   }]
      // ]
    },

    devServer: {
      open: true
    },

    framework: {
      config: {},
      plugins: [
        'Notify'
      ]
    },

    animations: [],

    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: [
        'render'
      ]
    },

    pwa: {
      workboxMode: 'generateSW',
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true
    },

    electron: {
      inspectPort: 5858,
      bundler: 'packager',
      packager: {},
      builder: {
        appId: 'recipe-recover'
      }
    }

    // bex: {
    //   contentScripts: [
    //     'my-content-script'
    //   ]
    // }
  };
});