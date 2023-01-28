/** @type {import('next').NextConfig} */

const prodConfig = {
  images: {
    domains: ["res.cloudinary.com"]
  },
  env: {
    API_ENDPOINT: 'https://pizza-app3.netlify.app'
  },
  serverless: true,
}

const devConfig = {
  images: {
    domains: ["res.cloudinary.com"]
  },
  env: {
    API_ENDPOINT: 'http://localhost:3000'
  },
}

module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;