import { ApiProperty } from '@nestjs/swagger';
import { ActorsDto } from './actors.dto';

export class CreateActorDto extends ActorsDto {
  @ApiProperty({
    required: false,
    description: 'Unrequired for created, set 0',
  })
  idActors: number;

  @ApiProperty({
    required: false,
    description: 'Unrequired for created, set 0',
  })
  idMovies: number;

  name: string;
}
