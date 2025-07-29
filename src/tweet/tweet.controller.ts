import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

@Controller('tweet')
export class TweetController {
  constructor(private tweetService: TweetService) {}

  @Get(':userId')
  public GetTweet(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() paginationQueryDto:PaginationQueryDto
  ) {
    return this.tweetService.getTweets(userId,paginationQueryDto);
  }

  @Post()
  public CreateTweet(@Body() tweet: CreateTweetDto) {
    return this.tweetService.createTweet(tweet);
  }

  @Patch()
  public UpdateTweet(@Body() tweet: UpdateTweetDto){
    return this.tweetService.updateTweet(tweet);
  }

  @Delete(':id')
  public DeleteTweet(@Param('id',ParseIntPipe) id:number){
    return this.tweetService.deleteTweet(id);
  }
}
