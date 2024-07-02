import { ApiProperty } from '@nestjs/swagger';
import { GenreMoviesEnum } from 'src/enums/genre.enum';
import { CreateActorDto } from 'src/modules/actors/dto/create-actor.dto';
import { MovieDto } from './movie.dto';

export class CreateMovieDto extends MovieDto {
  @ApiProperty({
    required: false,
  })
  idMovies?: number;
  title: string;
  genre: GenreMoviesEnum;
  synopsis: string;

  actors: CreateActorDto[];
}
