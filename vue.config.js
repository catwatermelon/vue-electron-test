// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
    lintOnSave: false,
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                'productName': 'catwatermelon',
                'copyright': 'catwatermelon',
                // 'directories': {
                //   'output': 'build'
                // },
                'nsis': {
                    'oneClick': false,
                    'allowElevation': true,
                    'allowToChangeInstallationDirectory': true,
                    'installerIcon': 'src/assets/icon.ico',
                    'uninstallerIcon': 'src/assets/icon.ico',
                    'installerHeaderIcon': 'src/assets/icon.ico',
                    'createDesktopShortcut': true,
                    'createStartMenuShortcut': true,
                    'shortcutName': 'catwatermelon'
                },
                'win': {
                    'icon': 'src/assets/logo.ico',
                    'target': [
                        {
                            'target': 'nsis',
                            'arch': [
                                // 'x64',
                                'ia32'
                            ]
                        }
                    ]
                },
                'mac': { // mac
                    'identity': null,
                    'icon': 'src/assets/logo.icns'
                },
            }
        },
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                path.resolve(__dirname, './src/less/index.less'),
            ],
        },
    }
};
