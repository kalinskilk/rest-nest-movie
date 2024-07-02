import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpResponse } from 'src/interfaces/http-response';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieDto } from './dto/movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesService } from './movies.service';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(
    @Body() createMovieDto: CreateMovieDto,
  ): Promise<HttpResponse<MovieDto>> {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('offset') offset: number) {
    return this.moviesService.findAll(+page, +offset);
  }

  @Get(':idMovies')
  findOne(@Param('idMovies') idMovies: string) {
    return this.moviesService.findOne({ where: { idMovies: +idMovies } });
  }

  @Get('findOneAndActors/:idMovies')
  findOneAndActors(@Param('idMovies') idMovies: string) {
    return this.moviesService.findOneAndActors({
      where: { idMovies: +idMovies },
    });
  }

  @Patch(':idMovies')
  update(
    @Param('idMovies') idMovies: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(+idMovies, updateMovieDto);
  }

  @Delete(':idMovies')
  remove(@Param('idMovies') idMovies: number) {
    return this.moviesService.remove(+idMovies);
  }
}
