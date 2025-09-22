import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { dataSourceOptions } from './datasource';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...dataSourceOptions,
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {
  static forFeature(entities: EntityClassOrSchema[]): DynamicModule {
    return TypeOrmModule.forFeature([...entities]);
  }
}
