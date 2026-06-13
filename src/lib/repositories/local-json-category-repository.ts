import type { CategoryDefinition, CategoryManifest } from "@/types/category";
import type { CategoryRepository } from "./types";
import {
  categoryManifest,
  getCategoryById as loadCategory,
  getAllCategories as loadAll,
} from "@/lib/categories/loader";

export class LocalJsonCategoryRepository implements CategoryRepository {
  async getManifest(): Promise<CategoryManifest> {
    return categoryManifest;
  }

  async getCategoryById(id: string): Promise<CategoryDefinition | null> {
    return loadCategory(id) ?? null;
  }

  async getAllCategories(): Promise<CategoryDefinition[]> {
    return loadAll();
  }
}

export const localJsonCategoryRepository = new LocalJsonCategoryRepository();
