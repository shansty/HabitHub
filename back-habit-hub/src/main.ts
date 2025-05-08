import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { loadEnv } from './config/loadEnv'

loadEnv();


async function start() {
    const PORT = process.env.PORT || 3000

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: {
            origin: process.env.LOCAL_HOST,
            credentials: true
        },
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    })
    app.useGlobalPipes(new ValidationPipe())
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    })
    await app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server started on port ${PORT}`)
    })
}
start()
