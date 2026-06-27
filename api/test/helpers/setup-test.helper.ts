import { INestApplication, ValidationPipe } from "@nestjs/common";

export function setupTestApp(app: INestApplication): void {
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }))
}