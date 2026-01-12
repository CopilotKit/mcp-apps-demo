/**
 * Exercise database for the AI Fitness Coach demo.
 * Contains mock exercise data with types, muscle groups, and difficulty levels.
 */
export type ExerciseCategory = "strength" | "cardio" | "flexibility";
export type MuscleGroup = "chest" | "back" | "shoulders" | "arms" | "core" | "legs" | "full_body";
export type Equipment = "none" | "dumbbells" | "barbell" | "kettlebell" | "resistance_band" | "pull_up_bar" | "bench";
export type Difficulty = "beginner" | "intermediate" | "advanced";
/**
 * Represents a single exercise in the workout database.
 */
export interface Exercise {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: ExerciseCategory;
    muscleGroups: MuscleGroup[];
    equipment: Equipment[];
    difficulty: Difficulty;
    defaultSets: number;
    defaultReps: number;
    restSeconds: number;
    caloriesPerSet: number;
}
/**
 * Get all exercises in the database.
 */
export declare function getExercises(): Exercise[];
/**
 * Get exercises filtered by category.
 */
export declare function getExercisesByCategory(category: ExerciseCategory): Exercise[];
/**
 * Get exercises filtered by muscle group.
 */
export declare function getExercisesByMuscleGroup(muscleGroup: MuscleGroup): Exercise[];
/**
 * Get exercises filtered by equipment (exercises that require ONLY the specified equipment).
 */
export declare function getExercisesByEquipment(availableEquipment: Equipment[]): Exercise[];
/**
 * Get exercises filtered by difficulty level.
 */
export declare function getExercisesByDifficulty(difficulty: Difficulty): Exercise[];
/**
 * Get exercise by ID.
 */
export declare function getExerciseById(id: string): Exercise | undefined;
//# sourceMappingURL=exercises.d.ts.map