import { Inject, Injectable } from '@nestjs/common';
import {
  fieldMustBeSupply,
  maximumAllowedLength,
  maximumAllowedLengthList,
  notFound,
  raiseDuplicateEntryError,
} from 'src/common/custom-error';
import { repoConsts } from 'src/const/repositorys';
import { BaseCrud } from 'src/interfaces/base-crud';
import { HttpResponse } from 'src/interfaces/http-response';
import { FindOneOptions, Not, Repository, UpdateResult } from 'typeorm';
import { ActorsService } from '../actors/actors.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieDto } from './dto/movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesEntity } from './entities/movie.entity';

@Injectable()
export class MoviesService implements BaseCrud<MovieDto> {
  constructor(
    @Inject(repoConsts.tblMovies)
    private repository: Repository<MoviesEntity>,
    private actorsService: ActorsService,
  ) {}

  async create(
    createMovieDto: CreateMovieDto,
  ): Promise<HttpResponse<MovieDto>> {
    if (!createMovieDto.idMovies) {
      delete createMovieDto.idMovies;
    }
    await this.createValidate(createMovieDto);
    for (const item of createMovieDto.actors) {
      this.actorsService.createValidate(item, true);
    }

    const data = await this.repository.save(createMovieDto);
    for (const item of data.actors) {
      await this.actorsService.create({
        idActors: 0,
        idMovies: data.idMovies,
        name: item.name,
      });
    }

    return { data };
  }

  async createValidate(createMovieDto: CreateMovieDto) {
    const { title, genre, imagePreview, synopsis, actors } = createMovieDto;
    if (!title) {
      throw new Error(fieldMustBeSupply('title'));
    }
    if (Number.isNaN(genre)) {
      throw new Error(fieldMustBeSupply('genre'));
    }
    if (!imagePreview) {
      throw new Error(fieldMustBeSupply('imagePreview'));
    }
    if (!actors.length) {
      throw new Error(fieldMustBeSupply('actors list'));
    }
    this.validateMaxLengthsFields({
      title,
      imagePreview,
      synopsis,
      actors: actors.length,
    });

    const hasMovieWithTitle = await this.count({
      where: { title },
    });

    if (hasMovieWithTitle.data) {
      throw new Error(raiseDuplicateEntryError('movie', 'title'));
    }
  }

  validateMaxLengthsFields(input: {
    title: string;
    imagePreview: string;
    synopsis: string;
    actors?: number;
  }) {
    if (input.title?.length > 255) {
      throw new Error(maximumAllowedLength('title', 255));
    }
    if (input.imagePreview?.length > 500) {
      throw new Error(maximumAllowedLength('imagePreview', 500));
    }
    if (input.synopsis?.length > 2000) {
      throw new Error(maximumAllowedLength('synopsis', 2000));
    }
    if (input?.actors > 50) {
      throw new Error(maximumAllowedLengthList('list actors', 50));
    }
  }

  async findAll(
    page: number,
    offset: number,
  ): Promise<HttpResponse<MovieDto[]>> {
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

  async findOne(
    options: FindOneOptions<MoviesEntity>,
  ): Promise<HttpResponse<MovieDto>> {
    const data = await this.repository.findOne(options);
    return {
      data,
      success: !!data,
      message: !!data ? '' : notFound('movie'),
    };
  }

  async findOneAndActors(
    options: FindOneOptions<MoviesEntity>,
  ): Promise<HttpResponse<MovieDto>> {
    const qb = this.repository.createQueryBuilder('movies');
    qb.leftJoin('movies.actors', 'actors');
    qb.select([
      'movies.idMovies',
      'movies.title',
      'movies.imagePreview',
      'movies.synopsis',
      'movies.genre',
      'actors.name',
    ]);
    qb.where(options.where);
    const data = await qb.getOne();
    if (!data) {
      throw new Error(notFound('movie'));
    }
    return {
      data,
    };
  }

  async count(
    options: FindOneOptions<MoviesEntity>,
  ): Promise<HttpResponse<number>> {
    const data = await this.repository.count(options);
    return {
      data,
    };
  }

  async update(
    idMovies: number,
    updateMovieDto: UpdateMovieDto,
  ): Promise<HttpResponse<UpdateResult>> {
    await this.updateValidate(idMovies, updateMovieDto);
    const data = await this.repository.update({ idMovies }, updateMovieDto);
    return {
      data,
    };
  }

  async updateValidate(idMovies: number, updateMovieDto: UpdateMovieDto) {
    if (Number.isNaN(idMovies)) {
      throw new Error(fieldMustBeSupply('idMovies'));
    }
    this.validateMaxLengthsFields({
      title: updateMovieDto.title,
      imagePreview: updateMovieDto.imagePreview,
      synopsis: updateMovieDto.synopsis,
    });
    if (updateMovieDto?.title) {
      const hasMovieWithTitle = await this.count({
        where: {
          title: updateMovieDto?.title,
          idMovies: Not(idMovies),
        },
      });
      if (hasMovieWithTitle.data) {
        throw new Error(raiseDuplicateEntryError('movie', 'title'));
      }
    }
  }

  async remove(idMovies: number): Promise<HttpResponse<boolean>> {
    if (Number.isNaN(idMovies)) {
      throw new Error(fieldMustBeSupply('idMovies'));
    }
    const data = await this.repository.delete({ idMovies });
    await this.actorsService.removeByConditions({ idMovies });
    const success = data.affected > 0;
    if (!success) {
      throw new Error('Movie not removed.');
    }
    return {
      data: success,
    };
  }
}
