import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { UserModule } from './modules/users/user.module';
import { TenantModule } from './modules/tenants/tenant.module';
import { TaskModule } from './modules/tasks/task.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransformInterceptor } from './shared/infrastructure/interceptors/transform.interceptor';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtAuthGuard } from './shared/infrastructure/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([{
      ttl: 10000,
      limit: 5
    }]),
    PrismaModule,
    UserModule,
    TenantModule,
    TaskModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
})
export class AppModule { }
