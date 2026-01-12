/**
 * Exercise database for the AI Fitness Coach demo.
 * Contains mock exercise data with types, muscle groups, and difficulty levels.
 */
/**
 * Mock exercise database with ~20 exercises covering strength, cardio, and flexibility.
 */
const EXERCISES = [
    // STRENGTH - Chest
    {
        id: "push-ups",
        name: "Push-Ups",
        description: "Classic bodyweight exercise targeting chest, shoulders, and triceps. Keep your core tight and body in a straight line.",
        icon: "💪",
        category: "strength",
        muscleGroups: ["chest", "shoulders", "arms"],
        equipment: ["none"],
        difficulty: "beginner",
        defaultSets: 3,
        defaultReps: 12,
        restSeconds: 60,
        caloriesPerSet: 8,
    },
    {
        id: "dumbbell-bench-press",
        name: "Dumbbell Bench Press",
        description: "Lie on a bench, press dumbbells up from chest level. Great for building chest strength and stability.",
        icon: "🏋️",
        category: "strength",
        muscleGroups: ["chest", "shoulders", "arms"],
        equipment: ["dumbbells", "bench"],
        difficulty: "intermediate",
        defaultSets: 4,
        defaultReps: 10,
        restSeconds: 90,
        caloriesPerSet: 12,
    },
    {
        id: "incline-push-ups",
        name: "Incline Push-Ups",
        description: "Push-ups with hands elevated on a bench or step. Easier variation that targets upper chest.",
        icon: "📐",
        category: "strength",
        muscleGroups: ["chest", "shoulders"],
        equipment: ["bench"],
        difficulty: "beginner",
        defaultSets: 3,
        defaultReps: 15,
        restSeconds: 45,
        caloriesPerSet: 6,
    },
    // STRENGTH - Back
    {
        id: "pull-ups",
        name: "Pull-Ups",
        description: "Hang from a bar and pull yourself up until chin clears the bar. Fundamental back and bicep builder.",
        icon: "🔝",
        category: "strength",
        muscleGroups: ["back", "arms"],
        equipment: ["pull_up_bar"],
        difficulty: "intermediate",
        defaultSets: 3,
        defaultReps: 8,
        restSeconds: 90,
        caloriesPerSet: 10,
    },
    {
        id: "dumbbell-rows",
        name: "Dumbbell Rows",
        description: "Bend over with one hand on bench, row dumbbell to hip. Builds lats and mid-back thickness.",
        icon: "🚣",
        category: "strength",
        muscleGroups: ["back", "arms"],
        equipment: ["dumbbells", "bench"],
        difficulty: "beginner",
        defaultSets: 3,
        defaultReps: 12,
        restSeconds: 60,
        caloriesPerSet: 8,
    },
    {
        id: "superman-holds",
        name: "Superman Holds",
        description: "Lie face down, lift arms and legs off ground simultaneously. Strengthens lower back and glutes.",
        icon: "🦸",
        category: "strength",
        muscleGroups: ["back", "core"],
        equipment: ["none"],
        difficulty: "beginner",
        defaultSets: 3,
        defaultReps: 30, // seconds
        restSeconds: 45,
        caloriesPerSet: 5,
    },
    // STRENGTH - Shoulders
    {
        id: "overhead-press",
        name: "Overhead Press",
        description: "Press dumbbells or barbell from shoulders to overhead. Primary shoulder builder.",
        icon: "🙌",
        category: "strength",
        muscleGroups: ["shoulders", "arms"],
        equipment: ["dumbbells"],
        difficulty: "intermediate",
        defaultSets: 3,
        defaultReps: 10,
        restSeconds: 90,
        caloriesPerSet: 10,
    },
    {
        id: "lateral-raises",
        name: "Lateral Raises",
        description: "Raise dumbbells out to sides until arms parallel to floor. Targets side deltoids for wider shoulders.",
        icon: "🦅",
        category: "strength",
        muscleGroups: ["shoulders"],
        equipment: ["dumbbells"],
        difficulty: "beginner",
        defaultSets: 3,
        defaultReps: 15,
        restSeconds: 45,
        caloriesPerSet: 6,
    },
    // STRENGTH - Legs
    {
        id: "squats",
        name: "Bodyweight Squats",
        description: "Stand with feet shoulder-width, lower until thighs parallel to ground. Fundamental lower body exercise.",
        icon: "🦵",
        category: "strength",
        muscleGroups: ["legs", "core"],
        equipment: ["none"],
        difficulty: "beginner",
        defaultSets: 3,
        defaultReps: 15,
        restSeconds: 60,
        caloriesPerSet: 10,
    },
    {
        id: "goblet-squats",
        name: "Goblet Squats",
        description: "Hold dumbbell at chest, squat down keeping torso upright. Adds resistance while improving form.",
        icon: "🏆",
        category: "strength",
        muscleGroups: ["legs", "core"],
        equipment: ["dumbbells"],
        difficulty: "intermediate",
        defaultSets: 3,
        defaultReps: 12,
        restSeconds: 75,
        caloriesPerSet: 12,
    },
    {
        id: "lunges",
        name: "Walking Lunges",
        description: "Step forward into lunge, alternate legs while moving forward. Builds leg strength and balance.",
        icon: "🚶",
        category: "strength",
        muscleGroups: ["legs"],
        equipment: ["none"],
        difficulty: "beginner",
        defaultSets: 3,
        defaultReps: 12, // per leg
        restSeconds: 60,
        caloriesPerSet: 10,
    },
    {
        id: "calf-raises",
        name: "Calf Raises",
        description: "Rise up on toes, lower slowly. Simple but effective for building calf muscles.",
        icon: "🦶",
        category: "strength",
        muscleGroups: ["legs"],
        equipment: ["none"],
        difficulty: "beginner",
        defaultSets: 3,
        defaultReps: 20,
        restSeconds: 30,
        caloriesPerSet: 4,
    },
    // STRENGTH - Core
    {
        id: "plank",
        name: "Plank Hold",
        description: "Hold push-up position on forearms. Builds core stability and endurance.",
        icon: "🧱",
        category: "strength",
        muscleGroups: ["core"],
        equipment: ["none"],
        difficulty: "beginner",
        defaultSets: 3,
        defaultReps: 45, // seconds
        restSeconds: 45,
        caloriesPerSet: 5,
    },
    {
        id: "bicycle-crunches",
        name: "Bicycle Crunches",
        description: "Alternate touching elbow to opposite knee while lying on back. Targets obliques and abs.",
        icon: "🚴",
        category: "strength",
        muscleGroups: ["core"],
        equipment: ["none"],
        difficulty: "beginner",
        defaultSets: 3,
        defaultReps: 20, // per side
        restSeconds: 45,
        caloriesPerSet: 6,
    },
    // CARDIO
    {
        id: "jumping-jacks",
        name: "Jumping Jacks",
        description: "Classic cardio exercise. Jump while spreading legs and raising arms overhead.",
        icon: "⭐",
        category: "cardio",
        muscleGroups: ["full_body"],
        equipment: ["none"],
        difficulty: "beginner",
        defaultSets: 3,
        defaultReps: 45, // seconds
        restSeconds: 30,
        caloriesPerSet: 12,
    },
    {
        id: "burpees",
        name: "Burpees",
        description: "Full-body cardio blast. Drop to push-up, jump feet to hands, jump up with arms overhead.",
        icon: "🔥",
        category: "cardio",
        muscleGroups: ["full_body"],
        equipment: ["none"],
        difficulty: "advanced",
        defaultSets: 3,
        defaultReps: 10,
        restSeconds: 60,
        caloriesPerSet: 15,
    },
    {
        id: "high-knees",
        name: "High Knees",
        description: "Run in place bringing knees up to hip height. Great for elevating heart rate.",
        icon: "🏃",
        category: "cardio",
        muscleGroups: ["legs", "core"],
        equipment: ["none"],
        difficulty: "beginner",
        defaultSets: 3,
        defaultReps: 30, // seconds
        restSeconds: 30,
        caloriesPerSet: 10,
    },
    {
        id: "mountain-climbers",
        name: "Mountain Climbers",
        description: "In plank position, alternate driving knees toward chest rapidly. Cardio and core combined.",
        icon: "⛰️",
        category: "cardio",
        muscleGroups: ["core", "legs"],
        equipment: ["none"],
        difficulty: "intermediate",
        defaultSets: 3,
        defaultReps: 30, // seconds
        restSeconds: 45,
        caloriesPerSet: 12,
    },
    // FLEXIBILITY
    {
        id: "standing-toe-touch",
        name: "Standing Toe Touch",
        description: "Stand straight, bend forward reaching for toes. Stretches hamstrings and lower back.",
        icon: "🙇",
        category: "flexibility",
        muscleGroups: ["legs", "back"],
        equipment: ["none"],
        difficulty: "beginner",
        defaultSets: 2,
        defaultReps: 30, // seconds hold
        restSeconds: 15,
        caloriesPerSet: 2,
    },
    {
        id: "quad-stretch",
        name: "Standing Quad Stretch",
        description: "Stand on one leg, pull other foot to glutes. Hold for stretch in front of thigh.",
        icon: "🦩",
        category: "flexibility",
        muscleGroups: ["legs"],
        equipment: ["none"],
        difficulty: "beginner",
        defaultSets: 2,
        defaultReps: 30, // seconds per side
        restSeconds: 10,
        caloriesPerSet: 1,
    },
];
/**
 * Get all exercises in the database.
 */
export function getExercises() {
    return EXERCISES;
}
/**
 * Get exercises filtered by category.
 */
export function getExercisesByCategory(category) {
    return EXERCISES.filter((e) => e.category === category);
}
/**
 * Get exercises filtered by muscle group.
 */
export function getExercisesByMuscleGroup(muscleGroup) {
    return EXERCISES.filter((e) => e.muscleGroups.includes(muscleGroup));
}
/**
 * Get exercises filtered by equipment (exercises that require ONLY the specified equipment).
 */
export function getExercisesByEquipment(availableEquipment) {
    return EXERCISES.filter((e) => e.equipment.every((eq) => availableEquipment.includes(eq)));
}
/**
 * Get exercises filtered by difficulty level.
 */
export function getExercisesByDifficulty(difficulty) {
    return EXERCISES.filter((e) => e.difficulty === difficulty);
}
/**
 * Get exercise by ID.
 */
export function getExerciseById(id) {
    return EXERCISES.find((e) => e.id === id);
}
//# sourceMappingURL=exercises.js.map