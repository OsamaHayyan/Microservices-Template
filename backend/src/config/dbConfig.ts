import {Logger} from "@nestjs/common";

const dbConfig = (): string => {
    const logger = new Logger(dbConfig.name)
    const mode = process.env.MONGODB_MODE;
    const user = process.env.MONGODB_USERNAME;
    const pass = process.env.MONGODB_PASSWORD;
    const db = process.env.MONGODB_DB;

    switch (mode) {
        case 'docker':
            const uri = `mongodb://${user}:${pass}@mongo-primary:27017,mongo-secondary-2:27018,mongo-secondary-3:27019/${db}?authSource=admin&replicaSet=rs0`;
            logger.log("MongoDB URI: " + uri);
            return uri
        case 'local':
        default:
            if (user && pass) {
                const uri = `mongodb://${user}:${pass}@localhost:27017/${db}?authSource=admin`;
                logger.log("MongoDB URI: " + uri);
                return uri
            } else {
                const uri = `mongodb://localhost:27017/${db}`;
                logger.log("MongoDB URI: " + uri);
                return uri
            }
    }
};

export default dbConfig;
