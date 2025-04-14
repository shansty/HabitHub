import { HabitDomain, UnitOfMeasurementType } from './habit_enums';

export const HabitCategoryConfig: Record<HabitDomain, {
  icons: string[];
  defaultIcon: string;
  defaultUnit: UnitOfMeasurementType;
  allowedUnits: UnitOfMeasurementType[];
}> = {
  FINANCE: {
    icons: ['💰', '💳', '📈', '💵', '🪙', '🧾'],
    defaultIcon: '💰',
    defaultUnit: UnitOfMeasurementType.USD,
    allowedUnits: [
      UnitOfMeasurementType.TIMES,
      UnitOfMeasurementType.USD
    ],
  },
  FITNESS: {
    icons: ['💪', '🏃‍♂️', '🏋️‍♀️', '🚴‍♀️', '🧘‍♂️', '🤸‍♂️'],
    defaultIcon: '💪',
    defaultUnit: UnitOfMeasurementType.TIMES,
    allowedUnits: [
      UnitOfMeasurementType.TIMES,
      UnitOfMeasurementType.MINS,
      UnitOfMeasurementType.HOURS,
      UnitOfMeasurementType.KM,
      UnitOfMeasurementType.M,
      UnitOfMeasurementType.STEPS,
    ],
  },
  HEALTH: {
    icons: ['🩺', '🧬', '🏥', '🛌', '💊', '🩻'],
    defaultIcon: '🧬',
    defaultUnit: UnitOfMeasurementType.TIMES,
    allowedUnits: [
      UnitOfMeasurementType.TIMES,
      UnitOfMeasurementType.MINS,
      UnitOfMeasurementType.HOURS,
      UnitOfMeasurementType.G,
      UnitOfMeasurementType.MG,
      UnitOfMeasurementType.KCAL,
    ],
  },
  MINDSET: {
    icons: ['🧠', '📖', '✨', '🎧', '📝', '📿'],
    defaultIcon: '✨',
    defaultUnit: UnitOfMeasurementType.TIMES,
    allowedUnits: [ 
      UnitOfMeasurementType.TIMES,
      UnitOfMeasurementType.MINS,
      UnitOfMeasurementType.SESSIONS,
      UnitOfMeasurementType.BOOKS,
      UnitOfMeasurementType.TASKS
    ],
  },
  NUTRITION: {
    icons: ['🥗', '🍎', '🥦', '🍵', '🥛', '🍽️'],
    defaultIcon: '🥦',
    defaultUnit: UnitOfMeasurementType.G,
    allowedUnits: [
      UnitOfMeasurementType.G,
      UnitOfMeasurementType.MG,
      UnitOfMeasurementType.KG,
      UnitOfMeasurementType.L,
      UnitOfMeasurementType.ML,
      UnitOfMeasurementType.KCAL,
      UnitOfMeasurementType.ITEMS,
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
    defaultUnit: UnitOfMeasurementType.TIMES,
    allowedUnits: Object.values(UnitOfMeasurementType),
  },
};
