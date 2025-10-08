export interface ICategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  userId: string;
}

export interface ICategoryRepository {
  findAllByUserId(userId: string): Promise<ICategory[]>;
  findById(id: string): Promise<ICategory | null>;
  create(data: Partial<ICategory>): Promise<ICategory>;
  update(id: string, data: Partial<ICategory>): Promise<ICategory | null>;
  delete(id: string): Promise<boolean>;
}
