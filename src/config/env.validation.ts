import * as joi from 'joi';

export default joi.object({
  NODE_ENV: joi
    .string()
    .valid('development', 'test', 'production')
    .default('development'),
  DB_PORT: joi.number().port().default(5432),
  DB_PASSWORD: joi.string().required(),
  DB_USERNAME: joi.string().required(),
  DB_NAME: joi.string().required(),
  DB_HOST: joi.string().required(),
  SECRET_KEY: joi.string().required(),
});
