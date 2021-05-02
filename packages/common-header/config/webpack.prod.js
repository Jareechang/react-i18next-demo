module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'index.js'
    },
    mode: 'production',
    resolve: {
        extensions: [
            '.js',
            '.jsx',
            '.tsx',
            '.ts',
            '.json'
        ]
    },
    module: {
        rules: [
            {
                 test: /\.tsx?$/,
                 exclude: /node_modules/,
                 use: {
                     loader: 'babel-loader',
                     options: {
                         presets: [
                             '@babel/preset-react',
                             '@babel/preset-env',
                             '@babel/preset-typescript',
                         ],
                         plugins: [
                             '@babel/plugin-transform-runtime'
                         ]
                     }
                 }
             }
        ]
    },
    plugins: []
};


