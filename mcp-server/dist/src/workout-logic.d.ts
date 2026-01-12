/**
 * Workout generation logic for the AI Fitness Coach demo.
 * Creates personalized workouts based on user preferences.
 */
import { Exercise, Difficulty } from "./exercises.js";
export type FocusArea = "full_body" | "upper_body" | "lower_body" | "cardio" | "core";
export type EquipmentLevel = "none" | "dumbbells" | "full_gym";
export type Duration = 15 | 30 | 45 | 60;
/**
 * Represents a single exercise in a workout with specific sets/reps.
 */
export interface WorkoutExercise {
    exercise: Exercise;
    sets: number;
    reps: number;
    restSeconds: number;
    completed: boolean;
    order: number;
}
/**
 * A complete workout plan.
 */
export interface Workout {
    id: string;
    exercises: WorkoutExercise[];
    focusArea: FocusArea;
    difficulty: Difficulty;
    targetDurationMinutes: number;
    actualDurationMinutes: number;
    totalCalories: number;
    createdAt: string;
}
/**
 * Parameters for generating a workout.
 */
export interface GenerateWorkoutParams {
    duration: Duration;
    focus: FocusArea;
    equipment: EquipmentLevel;
    difficulty: Difficulty;
}
/**
 * Generate a workout based on the given parameters.
 */
export declare function generateWorkout(params: GenerateWorkoutParams): Workout;
/**
 * Adjust workout difficulty - make it harder or easier.
 */
export declare function adjustWorkoutDifficulty(workout: Workout, adjustment: "harder" | "easier"): Workout;
/**
 * Skip an exercise and optionally replace it with another.
 */
export declare function skipExercise(workout: Workout, exerciseId: string, replaceWithId?: string): Workout;
/**
 * Mark an exercise as completed.
 */
export declare function completeExercise(workout: Workout, exerciseId: string, setsCompleted: number): Workout;
/**
 * Get workout progress as a percentage.
 */
export declare function getWorkoutProgress(workout: Workout): number;
/**
 * Get the next uncompleted exercise in the workout.
 */
export declare function getNextExercise(workout: Workout): WorkoutExercise | null;
//# sourceMappingURL=workout-logic.d.ts.map