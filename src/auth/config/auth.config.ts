import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  sharedSecrete: process.env.SECRET_KEY,
}));
