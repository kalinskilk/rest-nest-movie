import { OmitType } from '@nestjs/swagger';
import { ActorsDto } from './actors.dto';

export class UpdateActorDto extends OmitType(ActorsDto, [
  'idActors',
  'idMovies',
] as const) {
  name: string;
}
