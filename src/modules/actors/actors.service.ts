import { Inject, Injectable } from '@nestjs/common';
import {
  fieldMustBeSupply,
  maximumAllowedLength,
} from 'src/const/custom-error';
import { repoConsts } from 'src/const/repositorys';
import { BaseCrud } from 'src/interfaces/base-crud';
import { HttpResponse } from 'src/interfaces/http-response';
import {
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { ActorsDto } from './dto/actors.dto';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { ActorsEntity } from './entities/actor.entity';

@Injectable()
export class ActorsService implements BaseCrud<ActorsDto> {
  constructor(
    @Inject(repoConsts.tblActors)
    private repository: Repository<ActorsEntity>,
  ) {}

  async create(
    createActorDto: CreateActorDto,
  ): Promise<HttpResponse<ActorsDto>> {
    this.createValidate(createActorDto);
    if (!createActorDto.idActors) {
      delete createActorDto.idActors;
    }
    const data = await this.repository.save(createActorDto);
    return {
      data,
    };
  }

  createValidate(createActorDto: CreateActorDto, isBeforeCreateMovie = false) {
    if (!createActorDto.idMovies && !isBeforeCreateMovie) {
      throw new Error(fieldMustBeSupply('idMovies'));
    }
    if (!createActorDto.name) {
      throw new Error(fieldMustBeSupply('name'));
    }
    this.validateMaxLengthsFields({ name: createActorDto.name });
  }

  validateMaxLengthsFields(input: { name: string }) {
    if (input.name?.length > 255) {
      throw new Error(maximumAllowedLength('name', 255));
    }
  }

  async findAll(page: number, offset: number) {
    if (Number.isNaN(page)) {
      throw new Error(fieldMustBeSupply('page'));
    }
    if (Number.isNaN(offset)) {
      throw new Error(fieldMustBeSupply('offset'));
    }
    const data = await this.repository.find({
      skip: (page - 1) * offset,
      take: offset,
    });
    return {
      data,
    };
  }

  async findByMovie(idMovies: number, page: number, offset: number) {
    if (Number.isNaN(page)) {
      throw new Error(fieldMustBeSupply('page'));
    }
    if (Number.isNaN(offset)) {
      throw new Error(fieldMustBeSupply('offset'));
    }
    const data = await this.repository.find({
      skip: (page - 1) * offset,
      take: offset,
      where: { idMovies },
    });
    return {
      data,
    };
  }

  async findOne(options: FindOneOptions<ActorsEntity>) {
    const data = await this.repository.findOne(options);
    return {
      data,
      success: !!data,
      message: !!data ? '' : 'Actor not found.',
    };
  }

  async count(
    options: FindOneOptions<ActorsEntity>,
  ): Promise<HttpResponse<number>> {
    const data = await this.repository.count(options);
    return {
      data,
    };
  }

  async update(
    idActors: number,
    updateMovieDto: UpdateActorDto,
  ): Promise<HttpResponse<UpdateResult>> {
    await this.updateValidate(idActors, updateMovieDto);
    const data = await this.repository.update({ idActors }, updateMovieDto);
    return {
      data,
    };
  }

  async updateValidate(idActors: number, updateActorDto: UpdateActorDto) {
    if (Number.isNaN(idActors)) {
      throw new Error(fieldMustBeSupply('idActors'));
    }
    this.validateMaxLengthsFields({
      name: updateActorDto.name,
    });
  }

  async remove(idActors: number) {
    if (Number.isNaN(idActors)) {
      throw new Error(fieldMustBeSupply('idActors'));
    }
    const data = await this.repository.delete({ idActors });
    return { data: data.affected > 0 };
  }
  async removeByConditions(options: FindOptionsWhere<ActorsEntity>) {
    const data = await this.repository.delete(options);
    return { data: data.affected > 0 };
  }
}
