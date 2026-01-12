/**
 * Recipe database for the Recipe Chef demo.
 * Contains mock recipe data with ingredients, steps, and nutritional info.
 */

// Recipe type definitions
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
  time?: number; // minutes for this step
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
  icon: string; // Emoji icon for UI display
  cuisine: Cuisine;
  dietary: Dietary[];
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: RecipeDifficulty;
  ingredients: Ingredient[];
  steps: Step[];
  nutrition: Nutrition;
  tags: string[];
}

/**
 * Mock recipe database with 12 recipes across different cuisines.
 */
const RECIPES: Recipe[] = [
  // ITALIAN
  {
    id: "margherita-pizza",
    name: "Classic Margherita Pizza",
    description: "Traditional Italian pizza with fresh tomatoes, mozzarella, and basil on a crispy crust.",
    icon: "🍕",
    cuisine: "italian",
    dietary: ["vegetarian"],
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: "medium",
    ingredients: [
      { name: "Pizza dough", amount: 1, unit: "lb" },
      { name: "San Marzano tomatoes", amount: 14, unit: "oz" },
      { name: "Fresh mozzarella", amount: 8, unit: "oz" },
      { name: "Fresh basil leaves", amount: 10, unit: "leaves" },
      { name: "Olive oil", amount: 2, unit: "tbsp" },
      { name: "Salt", amount: 1, unit: "tsp" },
      { name: "Garlic", amount: 2, unit: "cloves", optional: true },
    ],
    steps: [
      { number: 1, instruction: "Preheat oven to 475°F (245°C). If using a pizza stone, place it in the oven.", time: 30 },
      { number: 2, instruction: "Crush tomatoes by hand, mix with salt and a drizzle of olive oil.", time: 5 },
      { number: 3, instruction: "Stretch pizza dough into a 12-inch circle on a floured surface.", time: 5 },
      { number: 4, instruction: "Spread tomato sauce evenly, leaving a 1-inch border for the crust.", time: 2 },
      { number: 5, instruction: "Tear mozzarella into pieces and distribute over the pizza.", time: 2 },
      { number: 6, instruction: "Bake until crust is golden and cheese is bubbly, about 12-15 minutes.", time: 15 },
      { number: 7, instruction: "Top with fresh basil and a drizzle of olive oil. Slice and serve.", time: 1 },
    ],
    nutrition: { calories: 285, protein: 12, carbs: 36, fat: 10, fiber: 2 },
    tags: ["classic", "vegetarian", "pizza"],
  },
  {
    id: "spaghetti-aglio-olio",
    name: "Spaghetti Aglio e Olio",
    description: "Simple yet elegant pasta with garlic, olive oil, and red pepper flakes. Ready in 20 minutes.",
    icon: "🍝",
    cuisine: "italian",
    dietary: ["vegan"],
    prepTime: 5,
    cookTime: 15,
    servings: 4,
    difficulty: "easy",
    ingredients: [
      { name: "Spaghetti", amount: 1, unit: "lb" },
      { name: "Olive oil", amount: 0.5, unit: "cup" },
      { name: "Garlic", amount: 8, unit: "cloves" },
      { name: "Red pepper flakes", amount: 0.5, unit: "tsp" },
      { name: "Fresh parsley", amount: 0.25, unit: "cup" },
      { name: "Salt", amount: 1, unit: "tbsp" },
      { name: "Parmesan cheese", amount: 0.5, unit: "cup", optional: true },
    ],
    steps: [
      { number: 1, instruction: "Bring a large pot of salted water to boil. Cook spaghetti according to package.", time: 12 },
      { number: 2, instruction: "While pasta cooks, thinly slice garlic. Heat olive oil in a large pan over medium heat.", time: 2 },
      { number: 3, instruction: "Add garlic to oil and cook until golden (not brown), about 2 minutes.", time: 2 },
      { number: 4, instruction: "Add red pepper flakes, cook 30 seconds. Remove from heat.", time: 1 },
      { number: 5, instruction: "Reserve 1 cup pasta water, then drain spaghetti.", time: 1 },
      { number: 6, instruction: "Add pasta to garlic oil, toss with parsley and pasta water to coat.", time: 2 },
    ],
    nutrition: { calories: 420, protein: 10, carbs: 58, fat: 16, fiber: 3 },
    tags: ["quick", "vegan", "pasta", "simple"],
  },

  // MEXICAN
  {
    id: "chicken-tacos",
    name: "Grilled Chicken Tacos",
    description: "Juicy seasoned chicken in warm tortillas with fresh salsa and lime crema.",
    icon: "🌮",
    cuisine: "mexican",
    dietary: ["gluten-free"],
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: "easy",
    ingredients: [
      { name: "Chicken breast", amount: 1.5, unit: "lb" },
      { name: "Corn tortillas", amount: 12, unit: "pieces" },
      { name: "Lime juice", amount: 3, unit: "tbsp" },
      { name: "Cumin", amount: 1, unit: "tsp" },
      { name: "Chili powder", amount: 1, unit: "tsp" },
      { name: "Sour cream", amount: 0.5, unit: "cup" },
      { name: "Fresh cilantro", amount: 0.25, unit: "cup" },
      { name: "White onion", amount: 1, unit: "medium" },
      { name: "Avocado", amount: 2, unit: "pieces" },
    ],
    steps: [
      { number: 1, instruction: "Mix cumin, chili powder, salt, and 1 tbsp lime juice. Rub on chicken.", time: 5 },
      { number: 2, instruction: "Grill chicken over medium-high heat, 6-7 minutes per side until cooked through.", time: 15 },
      { number: 3, instruction: "Mix sour cream with remaining lime juice and a pinch of salt for crema.", time: 2 },
      { number: 4, instruction: "Dice onion, chop cilantro, slice avocado.", time: 5 },
      { number: 5, instruction: "Let chicken rest 5 minutes, then slice into strips.", time: 5 },
      { number: 6, instruction: "Warm tortillas on a dry skillet. Assemble tacos with chicken and toppings.", time: 3 },
    ],
    nutrition: { calories: 380, protein: 32, carbs: 28, fat: 16, fiber: 5 },
    tags: ["gluten-free", "high-protein", "tacos"],
  },
  {
    id: "vegetarian-burrito-bowl",
    name: "Vegetarian Burrito Bowl",
    description: "Colorful bowl with seasoned black beans, cilantro lime rice, and all the fixings.",
    icon: "🥗",
    cuisine: "mexican",
    dietary: ["vegetarian", "gluten-free"],
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: "easy",
    ingredients: [
      { name: "White rice", amount: 1.5, unit: "cups" },
      { name: "Black beans", amount: 15, unit: "oz" },
      { name: "Corn kernels", amount: 1, unit: "cup" },
      { name: "Cherry tomatoes", amount: 1, unit: "cup" },
      { name: "Lime", amount: 2, unit: "pieces" },
      { name: "Fresh cilantro", amount: 0.5, unit: "cup" },
      { name: "Cumin", amount: 1, unit: "tsp" },
      { name: "Avocado", amount: 2, unit: "pieces" },
      { name: "Shredded cheese", amount: 1, unit: "cup", optional: true },
    ],
    steps: [
      { number: 1, instruction: "Cook rice according to package. Fluff and mix with lime juice and cilantro.", time: 20 },
      { number: 2, instruction: "Heat black beans with cumin, salt, and a splash of water.", time: 5 },
      { number: 3, instruction: "Char corn in a dry skillet until slightly blackened.", time: 5 },
      { number: 4, instruction: "Halve cherry tomatoes, dice avocado.", time: 5 },
      { number: 5, instruction: "Assemble bowls: rice base, beans, corn, tomatoes, avocado, cheese if using.", time: 3 },
    ],
    nutrition: { calories: 425, protein: 14, carbs: 68, fat: 12, fiber: 12 },
    tags: ["bowl", "vegetarian", "healthy"],
  },

  // ASIAN
  {
    id: "chicken-stir-fry",
    name: "Chicken Vegetable Stir-Fry",
    description: "Quick and healthy stir-fry with tender chicken and crisp vegetables in savory sauce.",
    icon: "🥡",
    cuisine: "asian",
    dietary: ["gluten-free"],
    prepTime: 15,
    cookTime: 12,
    servings: 4,
    difficulty: "easy",
    ingredients: [
      { name: "Chicken breast", amount: 1, unit: "lb" },
      { name: "Broccoli florets", amount: 2, unit: "cups" },
      { name: "Bell pepper", amount: 2, unit: "medium" },
      { name: "Soy sauce (gluten-free)", amount: 3, unit: "tbsp" },
      { name: "Sesame oil", amount: 2, unit: "tbsp" },
      { name: "Ginger", amount: 1, unit: "tbsp" },
      { name: "Garlic", amount: 3, unit: "cloves" },
      { name: "Cornstarch", amount: 1, unit: "tbsp" },
      { name: "Rice", amount: 2, unit: "cups" },
    ],
    steps: [
      { number: 1, instruction: "Cut chicken into bite-sized pieces. Toss with 1 tbsp soy sauce and cornstarch.", time: 5 },
      { number: 2, instruction: "Start cooking rice. Slice bell peppers, mince garlic and ginger.", time: 5 },
      { number: 3, instruction: "Heat sesame oil in wok over high heat. Cook chicken until golden, set aside.", time: 5 },
      { number: 4, instruction: "Add vegetables to wok, stir-fry 3-4 minutes until crisp-tender.", time: 4 },
      { number: 5, instruction: "Return chicken, add remaining soy sauce, garlic, ginger. Toss to combine.", time: 2 },
      { number: 6, instruction: "Serve over rice with sesame seeds if desired.", time: 1 },
    ],
    nutrition: { calories: 350, protein: 28, carbs: 32, fat: 12, fiber: 4 },
    tags: ["quick", "healthy", "high-protein"],
  },
  {
    id: "vegetable-pad-thai",
    name: "Vegetable Pad Thai",
    description: "Classic Thai noodles with tofu, bean sprouts, and tangy tamarind sauce.",
    icon: "🍜",
    cuisine: "asian",
    dietary: ["vegan", "gluten-free"],
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: "medium",
    ingredients: [
      { name: "Rice noodles", amount: 8, unit: "oz" },
      { name: "Firm tofu", amount: 14, unit: "oz" },
      { name: "Bean sprouts", amount: 2, unit: "cups" },
      { name: "Tamarind paste", amount: 3, unit: "tbsp" },
      { name: "Brown sugar", amount: 2, unit: "tbsp" },
      { name: "Lime", amount: 2, unit: "pieces" },
      { name: "Peanuts", amount: 0.25, unit: "cup" },
      { name: "Green onions", amount: 4, unit: "stalks" },
      { name: "Vegetable oil", amount: 3, unit: "tbsp" },
    ],
    steps: [
      { number: 1, instruction: "Soak rice noodles in warm water for 30 minutes. Drain.", time: 30 },
      { number: 2, instruction: "Press tofu and cut into cubes. Mix tamarind, sugar, and 2 tbsp water for sauce.", time: 10 },
      { number: 3, instruction: "Heat oil in wok, fry tofu until golden on all sides. Set aside.", time: 8 },
      { number: 4, instruction: "Add noodles to wok with sauce, toss until coated and slightly sticky.", time: 3 },
      { number: 5, instruction: "Add tofu, bean sprouts, and green onions. Toss briefly to warm through.", time: 2 },
      { number: 6, instruction: "Serve topped with crushed peanuts and lime wedges.", time: 1 },
    ],
    nutrition: { calories: 380, protein: 16, carbs: 52, fat: 14, fiber: 3 },
    tags: ["vegan", "noodles", "thai"],
  },

  // AMERICAN
  {
    id: "classic-burger",
    name: "Classic Beef Burger",
    description: "Juicy homemade burger with all the classic toppings on a toasted bun.",
    icon: "🍔",
    cuisine: "american",
    dietary: ["none"],
    prepTime: 15,
    cookTime: 12,
    servings: 4,
    difficulty: "easy",
    ingredients: [
      { name: "Ground beef (80/20)", amount: 1.5, unit: "lb" },
      { name: "Burger buns", amount: 4, unit: "pieces" },
      { name: "Cheddar cheese", amount: 4, unit: "slices" },
      { name: "Lettuce", amount: 4, unit: "leaves" },
      { name: "Tomato", amount: 1, unit: "large" },
      { name: "Red onion", amount: 1, unit: "medium" },
      { name: "Pickles", amount: 8, unit: "slices" },
      { name: "Ketchup", amount: 4, unit: "tbsp" },
      { name: "Mustard", amount: 2, unit: "tbsp" },
    ],
    steps: [
      { number: 1, instruction: "Divide beef into 4 portions, form into patties slightly larger than buns.", time: 5 },
      { number: 2, instruction: "Season patties generously with salt and pepper on both sides.", time: 2 },
      { number: 3, instruction: "Heat grill or cast iron to high. Cook patties 4 minutes per side for medium.", time: 10 },
      { number: 4, instruction: "Add cheese in last minute of cooking, cover to melt.", time: 1 },
      { number: 5, instruction: "Toast buns on grill. Slice tomato and onion.", time: 3 },
      { number: 6, instruction: "Assemble burgers with condiments, lettuce, tomato, onion, and pickles.", time: 2 },
    ],
    nutrition: { calories: 580, protein: 38, carbs: 32, fat: 34, fiber: 2 },
    tags: ["classic", "grilling", "comfort-food"],
  },
  {
    id: "keto-bacon-egg",
    name: "Keto Bacon & Egg Breakfast",
    description: "Low-carb breakfast with crispy bacon, eggs, and avocado. Perfect for keto diet.",
    icon: "🥓",
    cuisine: "american",
    dietary: ["keto", "gluten-free"],
    prepTime: 5,
    cookTime: 15,
    servings: 2,
    difficulty: "easy",
    ingredients: [
      { name: "Bacon strips", amount: 6, unit: "pieces" },
      { name: "Eggs", amount: 4, unit: "pieces" },
      { name: "Avocado", amount: 1, unit: "piece" },
      { name: "Butter", amount: 2, unit: "tbsp" },
      { name: "Cherry tomatoes", amount: 8, unit: "pieces" },
      { name: "Salt", amount: 0.5, unit: "tsp" },
      { name: "Black pepper", amount: 0.25, unit: "tsp" },
    ],
    steps: [
      { number: 1, instruction: "Cook bacon in a cold pan, heat to medium. Cook until crispy, about 8 minutes.", time: 10 },
      { number: 2, instruction: "Remove bacon, drain on paper towels. Pour off most bacon fat.", time: 1 },
      { number: 3, instruction: "Add butter to pan, fry eggs to your liking (sunny side up or over easy).", time: 4 },
      { number: 4, instruction: "Halve avocado, remove pit, slice. Halve cherry tomatoes.", time: 3 },
      { number: 5, instruction: "Plate eggs with bacon, avocado, and tomatoes. Season with salt and pepper.", time: 1 },
    ],
    nutrition: { calories: 520, protein: 28, carbs: 8, fat: 42, fiber: 5 },
    tags: ["keto", "breakfast", "low-carb", "high-fat"],
  },

  // MEDITERRANEAN
  {
    id: "greek-salad",
    name: "Classic Greek Salad",
    description: "Fresh Mediterranean salad with tomatoes, cucumber, olives, and feta cheese.",
    icon: "🥒",
    cuisine: "mediterranean",
    dietary: ["vegetarian", "gluten-free", "keto"],
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: "easy",
    ingredients: [
      { name: "Cucumber", amount: 1, unit: "large" },
      { name: "Tomatoes", amount: 4, unit: "medium" },
      { name: "Red onion", amount: 0.5, unit: "medium" },
      { name: "Kalamata olives", amount: 0.5, unit: "cup" },
      { name: "Feta cheese", amount: 6, unit: "oz" },
      { name: "Olive oil", amount: 0.25, unit: "cup" },
      { name: "Red wine vinegar", amount: 2, unit: "tbsp" },
      { name: "Dried oregano", amount: 1, unit: "tsp" },
    ],
    steps: [
      { number: 1, instruction: "Cut cucumber and tomatoes into large chunks.", time: 5 },
      { number: 2, instruction: "Thinly slice red onion into half-moons.", time: 2 },
      { number: 3, instruction: "Combine vegetables in a large bowl with olives.", time: 2 },
      { number: 4, instruction: "Whisk olive oil, vinegar, oregano, salt, and pepper.", time: 2 },
      { number: 5, instruction: "Pour dressing over salad, toss gently.", time: 1 },
      { number: 6, instruction: "Crumble feta over top. Serve immediately.", time: 1 },
    ],
    nutrition: { calories: 240, protein: 8, carbs: 12, fat: 18, fiber: 3 },
    tags: ["no-cook", "healthy", "fresh"],
  },
  {
    id: "hummus-platter",
    name: "Homemade Hummus Platter",
    description: "Creamy homemade hummus served with warm pita and fresh vegetables.",
    icon: "🫘",
    cuisine: "mediterranean",
    dietary: ["vegan", "gluten-free"],
    prepTime: 10,
    cookTime: 0,
    servings: 6,
    difficulty: "easy",
    ingredients: [
      { name: "Chickpeas", amount: 15, unit: "oz" },
      { name: "Tahini", amount: 0.25, unit: "cup" },
      { name: "Lemon juice", amount: 3, unit: "tbsp" },
      { name: "Garlic", amount: 2, unit: "cloves" },
      { name: "Olive oil", amount: 3, unit: "tbsp" },
      { name: "Cumin", amount: 0.5, unit: "tsp" },
      { name: "Pita bread", amount: 4, unit: "pieces" },
      { name: "Carrots", amount: 2, unit: "medium" },
      { name: "Cucumber", amount: 1, unit: "medium" },
    ],
    steps: [
      { number: 1, instruction: "Drain chickpeas, reserve liquid. Rinse well.", time: 2 },
      { number: 2, instruction: "Add chickpeas, tahini, lemon juice, garlic, cumin to food processor.", time: 2 },
      { number: 3, instruction: "Blend, adding reserved liquid until smooth and creamy.", time: 3 },
      { number: 4, instruction: "Season with salt to taste. Transfer to serving bowl.", time: 1 },
      { number: 5, instruction: "Drizzle with olive oil and a sprinkle of paprika.", time: 1 },
      { number: 6, instruction: "Cut vegetables into sticks. Warm pita. Serve alongside hummus.", time: 5 },
    ],
    nutrition: { calories: 195, protein: 7, carbs: 22, fat: 9, fiber: 5 },
    tags: ["vegan", "appetizer", "healthy", "no-cook"],
  },
  {
    id: "falafel-wrap",
    name: "Falafel Wrap",
    description: "Crispy baked falafel in warm pita with tahini sauce and fresh vegetables.",
    icon: "🧆",
    cuisine: "mediterranean",
    dietary: ["vegan"],
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: "medium",
    ingredients: [
      { name: "Chickpeas (dried, soaked)", amount: 1, unit: "cup" },
      { name: "Fresh parsley", amount: 0.5, unit: "cup" },
      { name: "Fresh cilantro", amount: 0.25, unit: "cup" },
      { name: "Garlic", amount: 4, unit: "cloves" },
      { name: "Cumin", amount: 1, unit: "tsp" },
      { name: "Pita bread", amount: 4, unit: "pieces" },
      { name: "Tahini", amount: 0.25, unit: "cup" },
      { name: "Tomato", amount: 2, unit: "medium" },
      { name: "Cucumber", amount: 1, unit: "medium" },
    ],
    steps: [
      { number: 1, instruction: "Preheat oven to 375°F. Drain soaked chickpeas thoroughly.", time: 5 },
      { number: 2, instruction: "Pulse chickpeas, herbs, garlic, cumin in processor until coarse texture.", time: 5 },
      { number: 3, instruction: "Form mixture into 12 small patties. Place on oiled baking sheet.", time: 5 },
      { number: 4, instruction: "Bake 25 minutes, flipping halfway, until golden and crisp.", time: 25 },
      { number: 5, instruction: "Mix tahini with lemon juice and water for sauce.", time: 2 },
      { number: 6, instruction: "Warm pita, fill with falafel, vegetables, and tahini sauce.", time: 3 },
    ],
    nutrition: { calories: 320, protein: 12, carbs: 45, fat: 11, fiber: 8 },
    tags: ["vegan", "baked", "middle-eastern"],
  },
];

/**
 * Get all recipes in the database.
 */
export function getRecipes(): Recipe[] {
  return RECIPES;
}

/**
 * Get recipe by ID.
 */
export function getRecipeById(id: string): Recipe | undefined {
  return RECIPES.find((r) => r.id === id);
}

/**
 * Filter recipes by criteria.
 */
export function filterRecipes(options: {
  cuisine?: Cuisine;
  dietary?: Dietary;
  maxTime?: number;
  difficulty?: RecipeDifficulty;
}): Recipe[] {
  return RECIPES.filter((recipe) => {
    // Filter by cuisine
    if (options.cuisine && recipe.cuisine !== options.cuisine) {
      return false;
    }

    // Filter by dietary restriction
    if (options.dietary && options.dietary !== "none") {
      if (!recipe.dietary.includes(options.dietary)) {
        return false;
      }
    }

    // Filter by max total time (prep + cook)
    if (options.maxTime) {
      const totalTime = recipe.prepTime + recipe.cookTime;
      if (totalTime > options.maxTime) {
        return false;
      }
    }

    // Filter by difficulty
    if (options.difficulty && recipe.difficulty !== options.difficulty) {
      return false;
    }

    return true;
  });
}

/**
 * Generate a recipe based on user preferences.
 * Returns the best matching recipe or a random one if no exact match.
 */
export function generateRecipe(options: {
  cuisine?: Cuisine;
  dietary?: Dietary;
  maxTime?: number;
  servings?: number;
}): Recipe {
  let matches = filterRecipes(options);

  // If no matches, try without cuisine constraint
  if (matches.length === 0 && options.cuisine) {
    matches = filterRecipes({ ...options, cuisine: undefined });
  }

  // If still no matches, return a random recipe
  if (matches.length === 0) {
    matches = RECIPES;
  }

  // Pick a random recipe from matches
  const recipe = matches[Math.floor(Math.random() * matches.length)];

  // Adjust servings if requested
  if (options.servings && options.servings !== recipe.servings) {
    return adjustServings(recipe, options.servings);
  }

  return recipe;
}

/**
 * Adjust recipe ingredient amounts for different serving sizes.
 * Note: Nutrition values are per-serving and remain unchanged when scaling.
 */
export function adjustServings(recipe: Recipe, newServings: number): Recipe {
  const ratio = newServings / recipe.servings;

  return {
    ...recipe,
    servings: newServings,
    ingredients: recipe.ingredients.map((ing) => ({
      ...ing,
      amount: Math.round(ing.amount * ratio * 100) / 100, // Round to 2 decimal places
    })),
    // Nutrition values are per-serving and do NOT scale with serving count
  };
}
