"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const cors = require("cors");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cors());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Gifts API')
        .setDescription('The gifts API description')
        .setVersion('1.0')
        .addTag('gifts')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.listen(process.env.API_PORT || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map