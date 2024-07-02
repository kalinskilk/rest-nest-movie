import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { DatabaseModule } from './core/database/database.module';
import { HttpExceptionFilter } from './filters/http-excpetion-filter';
import { Modules } from './modules/modules';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, Modules],
  controllers: [],
  providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule {}
