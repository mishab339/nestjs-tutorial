import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { Paginated } from './pagination.interface';

@Injectable()
export class PaginationProvider {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    repository: Repository<T>,
    where?: FindOptionsWhere<T>,
    relations?: string[],
  ): Promise<Paginated<T>> {
    const findOption: FindManyOptions<T> = {
      skip:
        ((paginationQueryDto.page ?? 1) - 1) * (paginationQueryDto.limit ?? 10),
      take: paginationQueryDto.limit ?? 10,
    };
    if (where) {
      findOption.where = where;
    }
    if (relations) {
      findOption.relations = relations;
    }
    const result = await repository.find(findOption);
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / (paginationQueryDto.limit ?? 10));
    const currentPage = paginationQueryDto.page ?? 1;
    const nextPage = currentPage === totalPages ? currentPage : currentPage + 1;
    const prevPage = currentPage === 1 ? currentPage : currentPage - 1;
    const baseUrl =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newUrl = new URL(this.request.url, baseUrl);
    const response: Paginated<T> = {
      data: result,
      meta: {
        itemsPerPage: paginationQueryDto.limit ?? 10,
        totalItems: totalItems,
        currentPage: paginationQueryDto.page ?? 1,
        totalPages: totalPages,
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=1`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${totalPages}`,
        previous: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${prevPage}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${currentPage}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${nextPage}`,
      },
    };
    return response;
  }
}
