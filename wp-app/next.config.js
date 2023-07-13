/** @type {import('next').NextConfig} */
const nextConfig = {
    /*webpack: (config, { isServer }) => {
       if (!isServer) {
            // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
            config.resolve.fallback = {
                fs: false            
            }
        }

        return config;
    }*/
    /*experimental: {
        outputFileTracingRoot: path.join(__dirname, '../../'),
        outputFileTracingExcludes: {
          '*': [
            'node_modules/canvas',
          ],
        },
    }*/
}    

module.exports = nextConfig
