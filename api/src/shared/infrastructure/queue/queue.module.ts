import { BullModule } from "@nestjs/bullmq";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Global()
@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    connection: {
                        host: configService.get<string>('REDIS_HOST', 'redis'),
                        port: configService.get<number>('REDIS_PORT', 6379),
                        password: configService.get<string>('REDIS_PASSWORD', '')
                    },
                    defaultJobOptions: {
                        removeOnComplete: true,
                        removeOnFail: false
                    }
                }
            }
        })
    ],
    exports: [BullModule]
})

export class QueueModule { }