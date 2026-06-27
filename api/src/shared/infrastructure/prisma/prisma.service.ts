import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";
import { Pool } from "pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            max: 85,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        })

        const adapter = new PrismaPg(pool);
        super({ adapter })

    }

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('🚀 Prisma connected successfully');
        } catch (error) {
            this.logger.error('❌ Failed to connect to database', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        try {
            await this.$disconnect();
            this.logger.log('👋 Prisma disconnected');
        } catch (error) {
            this.logger.error('❌ Failed to disconnect from database', error);
            throw error;
        }
    }

    async enableShutdownHooks(app: any) {
        process.on('beforeExit', async () => {
            await app.close();
        })
    }

}