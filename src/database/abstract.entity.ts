import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * AbstractEntity is a base class for database entities that provides common fields and functionality.
 *
 * This class is intended to be used as a base class for database entities, providing common
 * timestamp fields (`createdAt` and `updatedAt`) and a convenient way to initialize entities
 * with partial data, such as when mapping from DTOs or query results.
 *
 * The constructor of this class constructs a new instance of the entity by copying properties from a partial object.
 *
 * @param partial - An object containing a subset of properties of type `T` to initialize the entity instance.
 *
 * The constructor uses `Object.assign` to copy all enumerable properties from the `partial` object
 * to the new entity instance, allowing for flexible and concise initialization.
 *
 * Usage example:
 * ```typescript
 * class User extends AbstractEntity<User> {
 *   id: number;
 *   name: string;
 * }
 *
 * const user = new User({ name: 'Alice' });
 * ```
 */
export class AbstractEntity<T> {
  @CreateDateColumn({})
  createdAt: Date;
  @UpdateDateColumn({})
  updatedAt: Date;

  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }
}
