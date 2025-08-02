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
  Req,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { GetTweetQueryDto } from './dto/get-tweet-query.dto';
import { request } from 'http';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';

@Controller('tweet')
export class TweetController {
  constructor(private tweetService: TweetService) {}

  @Get(':userId')
  public GetTweet(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() getTweetQueryDto:GetTweetQueryDto
  ) {
    console.log(getTweetQueryDto);
    return this.tweetService.getTweets(userId,getTweetQueryDto);
  }

  @Post()
  public CreateTweet(@Body() tweet: CreateTweetDto, @ActiveUser('sub') userId) {
    return this.tweetService.createTweet(tweet,userId);
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
