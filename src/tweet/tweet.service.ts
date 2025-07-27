import { Injectable, Param, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { UpdateTweetDto } from './dto/update-tweet.dto';

@Injectable()
export class TweetService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashtagService: HashtagService,
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
  ) {}

  public async getTweets(userId: number) {
    return await this.tweetRepository.find({
      where: { user: { id: userId } },
      relations: { user: true, hashtags: true },
    });
  }

  public async createTweet(CreateTweetDto: CreateTweetDto) {
    let user = await this.usersService.getUserById(CreateTweetDto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const hashtags = await this.hashtagService.findHashTag(
      CreateTweetDto.hashtags ?? [],
    );

    let tweet = await this.tweetRepository.create({
      ...CreateTweetDto,
      user: user,
      hashtags: hashtags,
    });
    await this.tweetRepository.save(tweet);
    return tweet;
  }

  public async updateTweet(updateTweetDto: UpdateTweetDto) {
    let hashtags = await this.hashtagService.findHashTag(
      updateTweetDto.hashtags ?? [],
    );
    let tweet = await this.tweetRepository.findOneBy({ id: updateTweetDto.id });
    if (tweet) {
      tweet.text = updateTweetDto.text ?? tweet.text;
      tweet.image = updateTweetDto.image ?? tweet.image;
      tweet.hashtags = hashtags;

      return await this.tweetRepository.save(tweet);
    }
  }

  public async deleteTweet(id: number) {
    this.tweetRepository.delete({
      id,
    });

    return { deleted: true };
  }
}
