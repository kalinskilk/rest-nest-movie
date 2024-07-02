import { Module } from '@nestjs/common';
import { ActorsModule } from '../actors/actors.module';
import { MoviesController } from './movies.controller';
import { moviesProviders } from './movies.provider';
import { MoviesService } from './movies.service';

@Module({
  imports: [ActorsModule],
  controllers: [MoviesController],
  providers: [MoviesService, ...moviesProviders],
  exports: [MoviesService],
})
export class MoviesModule {}
