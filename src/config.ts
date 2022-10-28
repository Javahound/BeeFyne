import 'dotenv/config'
import * as yup from 'yup'
import logger from './log'

export const getEnvironmentConfig = () => {
    const environmentConfigSchema = yup.object({
        host: yup.string().required(),
        port: yup.number().required(),
        username: yup.string().required(),
        password: yup.string().required(),
        database: yup.string().required(),
        synchronize: yup.boolean().required(),
        logging: yup.boolean().required(),
        discordToken: yup.string().required(),
        clientId: yup.string().required(),
        guildId: yup.string().required(),
    })

    const unverifiedEnvironmentConfig = {
        host: process.env.TYPEORM_HOST,
        port: process.env.TYPEORM_PORT,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        synchronize: process.env.TYPEORM_SYNCHRONIZE,
        logging: process.env.TYPEORM_LOGGING,
        discordToken: process.env.DISCORDTOKEN,
        clientId: process.env.CLIENTID,
        guildId: process.env.GUILDID,
    }

    logger.info('Validating Connection Config')

    // Throws error when validation fails.
    const verifiedEnvironmentConfig = environmentConfigSchema.validateSync(
        unverifiedEnvironmentConfig,
        {
            strict: false,
            abortEarly: false,
            stripUnknown: true,
            recursive: true,
        }
    )

    logger.info('Validated Connection Config')

    return verifiedEnvironmentConfig
}
