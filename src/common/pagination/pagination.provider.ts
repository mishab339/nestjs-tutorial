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
    const result = await repository.find(findOption);
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / (paginationQueryDto.limit ?? 10));
    const currentPage = paginationQueryDto.page;
    const nextPage =
      paginationQueryDto.page === totalPages
        ? paginationQueryDto.page
        : (paginationQueryDto.page = 1);
    const prevPage =
      paginationQueryDto.page === 1
        ? paginationQueryDto.page
        : (paginationQueryDto.page = 1);

    const response = {
      data: result,
      meta: {
        itemsPerPage: paginationQueryDto.limit,
        totalItems: totalItems,
        currentPage: paginationQueryDto.page,
        totalPages: totalPages,
      },
      links: {
        first: 'http://localhost:3000/tweets?page=1&limit=10',
        last: 'http://localhost:3000/tweets?page=10&limit=10',
        previous: 'http://localhost:3000/tweets?page=1&limit=10',
        current: 'http://localhost:3000/tweets?page=1&limit=10',
        next: 'http://localhost:3000/tweets?page=2&limit=10',
      },
    };
  }
}
