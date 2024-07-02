import { Module } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ActorsController } from './actors.controller';
import { actorsProviders } from './actors.provider';
import { ActorsService } from './actors.service';

@Module({
  controllers: [ActorsController],
  providers: [ActorsService, ...actorsProviders, EntityManager],
  exports: [ActorsService],
})
export class ActorsModule {}
