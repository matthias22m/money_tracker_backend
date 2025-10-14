export interface IBudget {
  id: string;
  amount: number;
  month: number;
  year: number;
  userId: string;
}

export interface IBudgetRepository {
  findAllByUserId(userId: string, filters?: any): Promise<IBudget[]>;
  findById(id: string): Promise<IBudget | null>;
  create(data: Partial<IBudget>): Promise<IBudget>;
  update(id: string, data: Partial<IBudget>): Promise<IBudget | null>;
  delete(id: string): Promise<boolean>;
}
