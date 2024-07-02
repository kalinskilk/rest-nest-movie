import { ApiProperty } from '@nestjs/swagger';
import { ActorsEntity } from '../entities/actor.entity';

export class ActorsDto implements ActorsEntity {
  @ApiProperty({
    required: false,
    description: 'Unrequired for created, but required for update.',
  })
  idActors: number;

  @ApiProperty({
    description: 'Unrequired for created, but required for update.',
  })
  idMovies: number;

  @ApiProperty({
    description: 'Name of actor',
  })
  name: string;
}
