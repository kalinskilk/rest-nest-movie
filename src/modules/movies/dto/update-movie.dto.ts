import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { GenreMoviesEnum } from 'src/enums/genre.enum';
import { MovieDto } from './movie.dto';

export class UpdateMovieDto extends OmitType(MovieDto, [
  'idMovies',
  'actors',
] as const) {
  @ApiProperty({
    required: false,
    enum: GenreMoviesEnum,
    example: 0,
    description: 'Enter the genre of movie',
  })
  genre: GenreMoviesEnum;

  @ApiProperty({
    required: false,
    example: 'https://site.com/image',
    description: 'Enter the url of image preview',
  })
  imagePreview: string;

  @ApiProperty({
    required: false,
    example: 'Titanic',
    description: 'Enter the title of movie',
  })
  title: string;

  @ApiProperty({
    required: false,
    description: 'Describe the film',
    example: 'Titanic sank in 1912. etc...',
  })
  synopsis: string;
}
