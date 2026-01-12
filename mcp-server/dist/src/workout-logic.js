/**
 * Workout generation logic for the AI Fitness Coach demo.
 * Creates personalized workouts based on user preferences.
 */
import { getExercises, getExerciseById, } from "./exercises.js";
// Map focus areas to muscle groups
const FOCUS_AREA_MUSCLES = {
    full_body: ["chest", "back", "shoulders", "arms", "core", "legs"],
    upper_body: ["chest", "back", "shoulders", "arms"],
    lower_body: ["legs", "core"],
    cardio: ["full_body", "legs", "core"],
    core: ["core", "back"],
};
// Map equipment levels to available equipment
const EQUIPMENT_LEVELS = {
    none: ["none"],
    dumbbells: ["none", "dumbbells"],
    full_gym: ["none", "dumbbells", "barbell", "kettlebell", "resistance_band", "pull_up_bar", "bench"],
};
// Average time per exercise (sets * (reps_time + rest)) in seconds
function estimateExerciseTime(exercise, sets, reps, restSeconds) {
    // Estimate ~3 seconds per rep for strength, actual seconds for cardio/flexibility
    const timePerRep = exercise.category === "strength" ? 3 : 1;
    const exerciseTime = sets * (reps * timePerRep + restSeconds);
    return exerciseTime;
}
/**
 * Generate a workout based on the given parameters.
 */
export function generateWorkout(params) {
    const { duration, focus, equipment, difficulty } = params;
    const targetSeconds = duration * 60;
    const allExercises = getExercises();
    const availableEquipment = EQUIPMENT_LEVELS[equipment];
    const targetMuscles = FOCUS_AREA_MUSCLES[focus];
    // Filter exercises by equipment and difficulty
    let eligibleExercises = allExercises.filter((ex) => {
        // Check equipment compatibility
        const hasRequiredEquipment = ex.equipment.every((eq) => availableEquipment.includes(eq));
        if (!hasRequiredEquipment)
            return false;
        // Check difficulty (allow same or easier)
        const difficultyOrder = ["beginner", "intermediate", "advanced"];
        const exerciseDiffIdx = difficultyOrder.indexOf(ex.difficulty);
        const targetDiffIdx = difficultyOrder.indexOf(difficulty);
        if (exerciseDiffIdx > targetDiffIdx)
            return false;
        // Check if exercise targets relevant muscles
        const targetsMuscles = ex.muscleGroups.some((mg) => targetMuscles.includes(mg));
        const isCardio = focus === "cardio" && ex.category === "cardio";
        if (!targetsMuscles && !isCardio)
            return false;
        return true;
    });
    // If cardio focus, prioritize cardio exercises
    if (focus === "cardio") {
        const cardioExercises = eligibleExercises.filter((ex) => ex.category === "cardio");
        const otherExercises = eligibleExercises.filter((ex) => ex.category !== "cardio");
        eligibleExercises = [...cardioExercises, ...otherExercises];
    }
    // Adjust sets/reps based on difficulty
    const setsMultiplier = difficulty === "beginner" ? 0.75 : difficulty === "advanced" ? 1.25 : 1;
    const repsMultiplier = difficulty === "beginner" ? 0.8 : difficulty === "advanced" ? 1.2 : 1;
    // Build workout by adding exercises until we hit duration
    const workoutExercises = [];
    let totalSeconds = 0;
    let usedExerciseIds = new Set();
    let order = 1;
    // Shuffle eligible exercises for variety
    const shuffled = [...eligibleExercises].sort(() => Math.random() - 0.5);
    for (const exercise of shuffled) {
        if (usedExerciseIds.has(exercise.id))
            continue;
        const sets = Math.max(2, Math.round(exercise.defaultSets * setsMultiplier));
        const reps = Math.max(5, Math.round(exercise.defaultReps * repsMultiplier));
        const restSeconds = exercise.restSeconds;
        const exerciseTime = estimateExerciseTime(exercise, sets, reps, restSeconds);
        // Check if adding this exercise would exceed target duration
        if (totalSeconds + exerciseTime > targetSeconds * 1.1) {
            // Allow 10% overflow
            if (workoutExercises.length >= 3)
                break; // Minimum 3 exercises
        }
        workoutExercises.push({
            exercise,
            sets,
            reps,
            restSeconds,
            completed: false,
            order: order++,
        });
        totalSeconds += exerciseTime;
        usedExerciseIds.add(exercise.id);
        // Stop if we've hit the target
        if (totalSeconds >= targetSeconds * 0.9)
            break;
    }
    // Calculate total calories
    const totalCalories = workoutExercises.reduce((sum, we) => {
        return sum + we.exercise.caloriesPerSet * we.sets;
    }, 0);
    return {
        id: `workout-${Date.now()}`,
        exercises: workoutExercises,
        focusArea: focus,
        difficulty,
        targetDurationMinutes: duration,
        actualDurationMinutes: Math.round(totalSeconds / 60),
        totalCalories,
        createdAt: new Date().toISOString(),
    };
}
/**
 * Adjust workout difficulty - make it harder or easier.
 */
export function adjustWorkoutDifficulty(workout, adjustment) {
    const multiplier = adjustment === "harder" ? 1.25 : 0.75;
    const adjustedExercises = workout.exercises.map((we) => ({
        ...we,
        sets: Math.max(2, Math.round(we.sets * multiplier)),
        reps: Math.max(5, Math.round(we.reps * multiplier)),
    }));
    // Recalculate duration and calories
    let totalSeconds = 0;
    let totalCalories = 0;
    for (const we of adjustedExercises) {
        totalSeconds += estimateExerciseTime(we.exercise, we.sets, we.reps, we.restSeconds);
        totalCalories += we.exercise.caloriesPerSet * we.sets;
    }
    return {
        ...workout,
        exercises: adjustedExercises,
        actualDurationMinutes: Math.round(totalSeconds / 60),
        totalCalories,
    };
}
/**
 * Skip an exercise and optionally replace it with another.
 */
export function skipExercise(workout, exerciseId, replaceWithId) {
    const exerciseIndex = workout.exercises.findIndex((we) => we.exercise.id === exerciseId);
    if (exerciseIndex === -1)
        return workout;
    let newExercises = [...workout.exercises];
    if (replaceWithId) {
        const replacement = getExerciseById(replaceWithId);
        if (replacement) {
            newExercises[exerciseIndex] = {
                ...newExercises[exerciseIndex],
                exercise: replacement,
                sets: replacement.defaultSets,
                reps: replacement.defaultReps,
                restSeconds: replacement.restSeconds,
                completed: false,
            };
        }
        else {
            // Remove if replacement not found
            newExercises = newExercises.filter((_, i) => i !== exerciseIndex);
        }
    }
    else {
        // Just remove the exercise
        newExercises = newExercises.filter((_, i) => i !== exerciseIndex);
    }
    // Recalculate order
    newExercises = newExercises.map((we, i) => ({ ...we, order: i + 1 }));
    // Recalculate totals
    let totalSeconds = 0;
    let totalCalories = 0;
    for (const we of newExercises) {
        totalSeconds += estimateExerciseTime(we.exercise, we.sets, we.reps, we.restSeconds);
        totalCalories += we.exercise.caloriesPerSet * we.sets;
    }
    return {
        ...workout,
        exercises: newExercises,
        actualDurationMinutes: Math.round(totalSeconds / 60),
        totalCalories,
    };
}
/**
 * Mark an exercise as completed.
 */
export function completeExercise(workout, exerciseId, setsCompleted) {
    const newExercises = workout.exercises.map((we) => {
        if (we.exercise.id === exerciseId) {
            return { ...we, completed: true, sets: setsCompleted };
        }
        return we;
    });
    return { ...workout, exercises: newExercises };
}
/**
 * Get workout progress as a percentage.
 */
export function getWorkoutProgress(workout) {
    if (workout.exercises.length === 0)
        return 0;
    const completed = workout.exercises.filter((we) => we.completed).length;
    return Math.round((completed / workout.exercises.length) * 100);
}
/**
 * Get the next uncompleted exercise in the workout.
 */
export function getNextExercise(workout) {
    return workout.exercises.find((we) => !we.completed) || null;
}
//# sourceMappingURL=workout-logic.js.map