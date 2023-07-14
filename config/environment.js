const development = {
    name: 'development',
    db: 'besocial-dev',
    jwt_secret_key: 'besocial'
}

const production = {
    name: 'production',
    db: process.env.BESOCIAL_DB_NAME,
    jwt_secret_key: process.env.BESOCIAL_JWT_SECRET_KEY
}

export default eval((process.env.NODE_ENV)?eval(process.env.BESOCIAL_ENVIRONMENT):development);