import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

@Injectable()
export class PaginationProvider {
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    repository: Repository<T>,
    where?: FindOptionsWhere<T>,
  ) {
    const findOption: FindManyOptions<T> = {
      skip:
        ((paginationQueryDto.page ?? 1) - 1) * (paginationQueryDto.limit ?? 10),
      take: paginationQueryDto.limit ?? 10,
    };
    if (where) {
      findOption.where = where;
    }
    return await repository.find(findOption);
  }
}
