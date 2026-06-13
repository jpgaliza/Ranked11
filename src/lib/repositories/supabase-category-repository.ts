import type { CategoryDefinition, CategoryManifest } from "@/types/category";
import type { CategoryRepository } from "./types";

/**
 * Post-MVP: Supabase-backed category repository.
 * Replace LocalJsonCategoryRepository when database is ready.
 */
export class SupabaseCategoryRepository implements CategoryRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_supabaseUrl: string, _supabaseKey: string) {}

  async getManifest(): Promise<CategoryManifest> {
    throw new Error("SupabaseCategoryRepository not implemented — use LocalJsonCategoryRepository for MVP");
  }

  async getCategoryById(_id: string): Promise<CategoryDefinition | null> {
    throw new Error("SupabaseCategoryRepository not implemented");
  }

  async getAllCategories(): Promise<CategoryDefinition[]> {
    throw new Error("SupabaseCategoryRepository not implemented");
  }
}
