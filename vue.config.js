module.exports = {
    devServer: {
        port: 80,             
        host: 'localhost',   
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                pathRewrite: { '^/api': '' }
            }
        }
    }
}
