import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { PostModule } from './post/post.module.js';
import { CategoryModule } from './category/category.module.js';
import { SubCategoryModule } from './sub-category/subCategory.module.js';
import { BrandModule } from './brand/brand.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import z from 'zod';
import { MongooseModule } from '@nestjs/mongoose';
import { SecurityModule } from './common/security/security.module.js';
import { HashService } from './common/security/hash.service.js';
import { EncryptionService } from './common/security/enctryption.service.js';
import { buildSchema } from './common/models/user.model.js';
import { CacheModule } from '@nestjs/cache-manager';
import { Keyv, KeyvCacheableMemory } from 'cacheable';
import { createKeyv } from '@keyv/redis';
export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    UserModule,
    PostModule,
    CategoryModule,
    SubCategoryModule,
    BrandModule,
    ConfigModule.forRoot({
      envFilePath: "./config/.env",
      isGlobal: true,
      validationSchema: z.object({
        PORT: z.string(),
        DB_URL: z.url()
      })
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule, SecurityModule],
      inject: [ConfigService, HashService, EncryptionService], // env
      useFactory: (
        configService: ConfigService,
        hashService: HashService,
        encryptionService: EncryptionService
      ) => {

        buildSchema(hashService, encryptionService)
        return {
          uri: configService.get<string>('DB_URL'),// Reads: process.env.DB_URL,
          onConnectionCreate: (connection) => {
            connection.on('connected', () => console.log('connected'));
            connection.on('open', () => console.log('open'));
            connection.on('disconnected', () => console.log('disconnected'));
            connection.on('reconnected', () => console.log('reconnected'));
            connection.on('disconnecting', () => console.log('disconnecting'));
            return connection;
          },
          serverSelectionTimeoutMS: 5000,

        }

      },

    }),
    SecurityModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [
            createKeyv('redis://127.0.0.1:6379'),
            new Keyv({
              store: new KeyvCacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
          ]
        }
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() { }
}
