import { HabitDomain , UnitOfMeasurement } from './habit_enums';

export const HabitCategoryConfig: Record<HabitDomain , {
  icons: string[];
  defaultIcon: string;
  defaultUnit: UnitOfMeasurement;
  allowedUnits: UnitOfMeasurement[];
}> = {
  FINANCE: {
    icons: ['💰', '💳', '📈', '💵', '🪙', '🧾'],
    defaultIcon: '💰',
    defaultUnit: UnitOfMeasurement.USD,
    allowedUnits: [
      UnitOfMeasurement.TIMES,
      UnitOfMeasurement.USD
    ],
  },
  FITNESS: {
    icons: ['💪', '🏃‍♂️', '🏋️‍♀️', '🚴‍♀️', '🧘‍♂️', '🤸‍♂️'],
    defaultIcon: '💪',
    defaultUnit: UnitOfMeasurement.TIMES,
    allowedUnits: [
      UnitOfMeasurement.TIMES,
      UnitOfMeasurement.MINS,
      UnitOfMeasurement.HOURS,
      UnitOfMeasurement.KM,
      UnitOfMeasurement.M,
      UnitOfMeasurement.STEPS,
    ],
  },
  HEALTH: {
    icons: ['🩺', '🧬', '🏥', '🛌', '💊', '🩻'],
    defaultIcon: '🧬',
    defaultUnit: UnitOfMeasurement.TIMES,
    allowedUnits: [
      UnitOfMeasurement.TIMES,
      UnitOfMeasurement.MINS,
      UnitOfMeasurement.HOURS,
      UnitOfMeasurement.G,
      UnitOfMeasurement.MG,
      UnitOfMeasurement.KCAL,
    ],
  },
  MINDSET: {
    icons: ['🧠', '📖', '✨', '🎧', '📝', '📿'],
    defaultIcon: '✨',
    defaultUnit: UnitOfMeasurement.TIMES,
    allowedUnits: [ 
      UnitOfMeasurement.TIMES,
      UnitOfMeasurement.MINS,
      UnitOfMeasurement.SESSIONS,
      UnitOfMeasurement.BOOKS,
      UnitOfMeasurement.TASKS
    ],
  },
  NUTRITION: {
    icons: ['🥗', '🍎', '🥦', '🍵', '🥛', '🍽️'],
    defaultIcon: '🥦',
    defaultUnit: UnitOfMeasurement.G,
    allowedUnits: [
      UnitOfMeasurement.G,
      UnitOfMeasurement.MG,
      UnitOfMeasurement.KG,
      UnitOfMeasurement.L,
      UnitOfMeasurement.ML,
      UnitOfMeasurement.KCAL,
      UnitOfMeasurement.ITEMS,
    ],
  },
  CUSTOM: {
    icons: ['💰', '💳', '📈', '💵', '🪙', '🧾', '💪',
      '🏃‍♂️', '🏋️‍♀️', '🚴‍♀️', '🧘‍♂️', '🤸‍♂️', '🩺', '🧬', '🏥',
      '🛌', '💊', '🩻', '🧠', '📖', '🧘‍♀️', '🎧', '📝',
      '📿', '🥗', '🍎', '🥦', '🍵', '🥛', '🍽️', '🐮',
      '🐶', '🐱', '🐰', '🐹', '🦊', '🐦', '🐢', '🦋',
      '🎯', '🌟', '✨', '⭐', '📅', '📌', '📋', '🕺',
      '🧩', '⚙️', '🔔', '🕒', '🎨', '🛠️', '📍', '🎓',
      '📚', '📷', '🎶', '🌈', '🔥', '⚡', '💡', '🏆',
      '🚀', '🧭', '🌱', '🍀', '🌙', '☀️', '🌊', '🧼',
      '🙏', '👏', '🧍‍♂️', '🧍‍♀️', '🧑‍🍳', '🧑‍🎓', '🧑‍💻', '💃',
    ],
    defaultIcon: '👏',
    defaultUnit: UnitOfMeasurement.TIMES,
    allowedUnits: Object.values(UnitOfMeasurement),
  },
};
