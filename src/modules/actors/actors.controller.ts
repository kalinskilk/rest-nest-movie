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
import { ActorsService } from './actors.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';

@ApiTags('Actors')
@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}

  @Post()
  create(@Body() createActorDto: CreateActorDto) {
    return this.actorsService.create(createActorDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('offset') offset: number) {
    return this.actorsService.findAll(+page, +offset);
  }

  @Get(':idActors')
  findOne(@Param('idActors') idActors: string) {
    return this.actorsService.findOne({ where: { idActors: +idActors } });
  }

  @Get('byMovie/:idMovies')
  findByMovie(
    @Param('idMovies') idMovies: string,
    @Query('page') page: number,
    @Query('offset') offset: number,
  ) {
    return this.actorsService.findByMovie(+idMovies, page, offset);
  }

  @Patch(':idActors')
  update(
    @Param('idActors') idActors: string,
    @Body() updateActorDto: UpdateActorDto,
  ) {
    return this.actorsService.update(+idActors, updateActorDto);
  }

  @Delete(':idActors')
  remove(@Param('idActors') idActors: string) {
    return this.actorsService.remove(+idActors);
  }
}
