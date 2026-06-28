import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { UserModule } from './modules/users/user.module';
import { TenantModule } from './modules/tenants/tenant.module';
import { TaskModule } from './modules/tasks/task.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    TenantModule,
    TaskModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
