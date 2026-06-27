import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";

describe('Task Tenant Isolation', () => {
    let app: INestApplication;
    let prisma: PrismaService
})