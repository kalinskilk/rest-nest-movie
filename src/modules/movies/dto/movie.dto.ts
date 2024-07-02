import { ApiProperty } from '@nestjs/swagger';
import { GenreMoviesEnum } from 'src/enums/genre.enum';
import { CreateActorDto } from 'src/modules/actors/dto/create-actor.dto';
import { MoviesEntity } from '../entities/movie.entity';

export class MovieDto extends MoviesEntity {
  @ApiProperty({
    required: false,
    description: 'Unrequired for created, but required for update.',
  })
  idMovies?: number;

  @ApiProperty({
    description: 'Enter the title of movie',
    example: 'Titanic',
  })
  title: string;

  @ApiProperty({
    enum: GenreMoviesEnum,
    description: 'Enter the genre of movie',
    example: 0,
  })
  genre: GenreMoviesEnum;

  @ApiProperty({
    description: 'Enter the url of image preview',
    example: 'https://your-image.com',
  })
  imagePreview: string;

  @ApiProperty({
    description: 'Describe the film',
    example: 'Titanic sank in 1912. etc...',
  })
  synopsis: string;

  @ApiProperty({
    description: 'List of actors',
    example: [{ name: 'Leonardo DiCaprio' }, { name: 'Kate Winslet' }],
  })
  actors?: CreateActorDto[];
}
