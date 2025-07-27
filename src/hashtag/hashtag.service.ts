import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Hashtag } from './hashtag.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { In } from 'typeorm';

@Injectable()
export class HashtagService {
  constructor(
    @InjectRepository(Hashtag)
    private readonly hashtagRepository: Repository<Hashtag>,
  ) {}

  public async createHashtag(createHashtagDto: CreateHashtagDto) {
    let hashtag = this.hashtagRepository.create(createHashtagDto);
    return await this.hashtagRepository.save(hashtag);
  }

  public async findHashTag(hashtag: number[]) {
    return await this.hashtagRepository.find({
      where: { id: In(hashtag) },
    });
  }

  public async deleteHashtag(id: number) {
    await this.hashtagRepository.delete({ id });
    return { deleted: true, id };
  }

  public async softDeleteHashtag(id: number) {
    await this.hashtagRepository.softDelete({ id: id });
    return { deleted: true, id };
  }
}
