import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hashtag } from './hashtag.entity';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { HashtagService } from './hashtag.service';

@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}
  @Post()
  public CreateNewHashtag(@Body() createHashtagDto: CreateHashtagDto) {
    this.hashtagService.createHashtag(createHashtagDto);
  }

  @Delete(':id')
  public DeleteHashtag(@Param('id', ParseIntPipe) id: number) {
    return this.hashtagService.deleteHashtag(id);
  }

  @Delete('soft-delete/:id')
  public SoftDeleteHashtag(@Param('id', ParseIntPipe) id: number) {
    return this.hashtagService.softDeleteHashtag(id);
  }
}
