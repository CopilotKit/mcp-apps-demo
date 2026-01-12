/**
 * Recipe database for the Recipe Chef demo.
 * Contains mock recipe data with ingredients, steps, and nutritional info.
 */
export type Cuisine = "italian" | "mexican" | "asian" | "american" | "mediterranean";
export type Dietary = "none" | "vegetarian" | "vegan" | "gluten-free" | "keto";
export type RecipeDifficulty = "easy" | "medium" | "hard";
/**
 * Represents a single ingredient in a recipe.
 */
export interface Ingredient {
    name: string;
    amount: number;
    unit: string;
    optional?: boolean;
}
/**
 * Represents a cooking step in a recipe.
 */
export interface Step {
    number: number;
    instruction: string;
    time?: number;
}
/**
 * Nutritional information per serving.
 */
export interface Nutrition {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
}
/**
 * Represents a complete recipe.
 */
export interface Recipe {
    id: string;
    name: string;
    description: string;
    icon: string;
    cuisine: Cuisine;
    dietary: Dietary[];
    prepTime: number;
    cookTime: number;
    servings: number;
    difficulty: RecipeDifficulty;
    ingredients: Ingredient[];
    steps: Step[];
    nutrition: Nutrition;
    tags: string[];
}
/**
 * Get all recipes in the database.
 */
export declare function getRecipes(): Recipe[];
/**
 * Get recipe by ID.
 */
export declare function getRecipeById(id: string): Recipe | undefined;
/**
 * Filter recipes by criteria.
 */
export declare function filterRecipes(options: {
    cuisine?: Cuisine;
    dietary?: Dietary;
    maxTime?: number;
    difficulty?: RecipeDifficulty;
}): Recipe[];
/**
 * Generate a recipe based on user preferences.
 * Returns the best matching recipe or a random one if no exact match.
 */
export declare function generateRecipe(options: {
    cuisine?: Cuisine;
    dietary?: Dietary;
    maxTime?: number;
    servings?: number;
}): Recipe;
/**
 * Adjust recipe ingredient amounts for different serving sizes.
 * Note: Nutrition values are per-serving and remain unchanged when scaling.
 */
export declare function adjustServings(recipe: Recipe, newServings: number): Recipe;
//# sourceMappingURL=recipes.d.ts.map