module.exports = {
    entry: './app/index.jsx',
    output: {
        filename: './site/bundle.js'
    },
    module: {
        loaders: [
            {
              test: /\.js/,
              loader: 'babel',
              exclude: /node_modules/,
              query: {
                  presets: ['es2015', 'react']
              }
            }
        ]
    },
    devtool: 'source-map'
}
