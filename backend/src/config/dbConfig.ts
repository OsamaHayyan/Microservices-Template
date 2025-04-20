const dbConfig = (): string => {
    const mode = process.env.MONGODB_MODE;
    const user = process.env.MONGODB_USERNAME;
    const pass = process.env.MONGODB_PASSWORD;
    const db = process.env.MONGODB_DB;

    switch (mode) {
        case 'docker':
            return `mongodb://${user}:${pass}@mongo-primary:27017,mongo-secondary-2:27018,mongo-secondary-3:27019/${db}?authSource=admin&replicaSet=rs0`;
        case 'local':
        default:
            if (user && pass) {
                return `mongodb://${user}:${pass}@localhost:27017/${db}?authSource=admin`;
            } else {
                return `mongodb://localhost:27017/${db}`;
            }
    }
};

export default dbConfig;
