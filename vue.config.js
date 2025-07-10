module.exports = {
    devServer: {
        port: 80,
        host: '0.0.0.0', // quan trọng để không bị xung đột với PID 4 (127.0.0.1)
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                pathRewrite: { '^/api': '' }
            }
        }
    }
}
