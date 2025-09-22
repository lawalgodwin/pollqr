import {
  EntityManager,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SaveOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

/**
 * AbstractRepository provides a generic base class for implementing repository patterns
 * with common CRUD operations and search functionality for entities managed by TypeORM.
 *
 * This class is intended to be extended by specific repositories for different entities,
 * allowing for code reuse and consistency across data access layers.
 *
 * Key Features:
 * - Generic type parameter `T` for entity type safety.
 * - Methods for finding, creating, updating, and deleting entities.
 * - Support for transactional operations via optional `EntityManager`.
 * - Paginated search with customizable search parameters.
 *
 * Pagination Details:
 * - The `search` method uses the `skip` and `take` options in TypeORM's `findAndCount` method:
 *   - `skip`: Specifies the number of entities to skip before starting to collect the result set.
 *     This is used to offset the results for pagination (e.g., for page 2 with 10 items per page, skip = 10).
 *   - `take`: Specifies the maximum number of entities to return in the result set (i.e., the page size).
 *     In this implementation, `take` is set to 10, meaning each page contains up to 10 entities.
 *
 * @typeParam T - The entity type that extends ObjectLiteral.
 */
export class AbstractRepository<T extends ObjectLiteral> {
  constructor(private entityRepository: Repository<T>) {}
  // Common repository methods can be defined here
  async getRepository(manager?: EntityManager): Promise<Repository<T>> {
    return manager
      ? manager.getRepository(this.entityRepository.target)
      : this.entityRepository;
  }

  async findAll(): Promise<T[]> {
    // Implementation for finding all entities
    return this.entityRepository.find();
  }

  async findOneBy(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.entityRepository.findOneBy(where);
  }

  async create(entity: T, manager?: EntityManager): Promise<T> {
    // Implementation for creating a new entity
    const repository = await this.getRepository(manager);
    return repository.save(entity);
  }

  async createMany(
    entities: T[],
    options?: SaveOptions,
    manager?: EntityManager,
  ): Promise<T[]> {
    // Implementation for creating multiple new entities
    const repository = await this.getRepository(manager);
    const instances = repository.create(entities);
    return repository.save(instances, options);
  }

  async update(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
    manager?: EntityManager,
  ): Promise<T | null> {
    // Implementation for updating an existing entity
    const repository = await this.getRepository(manager);
    await repository.update(where, partialEntity);
    return this.findOneBy(where);
  }

  async delete(id: string, manager?: EntityManager): Promise<boolean> {
    // Implementation for deleting an entity
    const repository = await this.getRepository(manager);
    const result = await repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Searches for entities in the repository based on the provided search parameters and paginates the results.
   *
   * @param searchParams - An object containing the search criteria to filter entities.
   * @param page - The page number for pagination (1-based index).
   * @returns An object containing the search results, total number of entities matching the criteria,
   *          the current page, and the last page number.
   */
  async filter(
    searchParams: FindOptionsWhere<T>,
    page: number = 1,
  ): Promise<{
    results: T[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    // Implementation for searching entities with pagination
    const [results, total] = await this.entityRepository.findAndCount({
      skip: (page - 1) * 10,
      take: 10,
      where: searchParams,
    });
    return {
      results,
      total,
      page,
      lastPage: Math.ceil(total / 10),
    };
  }
}
