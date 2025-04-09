import { HabitDomain, UnitOfMeasurementType } from './habit_enums';

export const HabitCategoryConfig: Record<HabitDomain,
  {
    icon: string;
    defaultUnit: UnitOfMeasurementType;
    allowedUnits: UnitOfMeasurementType[];
  }
> = {
  FINANCE: {
    icon: '💰',
    defaultUnit: UnitOfMeasurementType.TIMES,
    allowedUnits: [UnitOfMeasurementType.TIMES],
  },
  FITNESS: {
    icon: '💪',
    defaultUnit: UnitOfMeasurementType.TIMES,
    allowedUnits: [
      UnitOfMeasurementType.TIMES,
      UnitOfMeasurementType.MINS,
      UnitOfMeasurementType.HOURS,
      UnitOfMeasurementType.KM,
      UnitOfMeasurementType.M,
    ],
  },
  HEALTH: {
    icon: '🩺',
    defaultUnit: UnitOfMeasurementType.TIMES,
    allowedUnits: [
      UnitOfMeasurementType.TIMES,
      UnitOfMeasurementType.MINS,
      UnitOfMeasurementType.HOURS,
    ],
  },
  MINDSET: {
    icon: '🧠',
    defaultUnit: UnitOfMeasurementType.TIMES,
    allowedUnits: [UnitOfMeasurementType.TIMES, UnitOfMeasurementType.MINS],
  },
  NUTRITION: {
    icon: '🥗',
    defaultUnit: UnitOfMeasurementType.G,
    allowedUnits: [
      UnitOfMeasurementType.G,
      UnitOfMeasurementType.MG,
      UnitOfMeasurementType.KG,
      UnitOfMeasurementType.L,
      UnitOfMeasurementType.ML,
    ],
  },
  CUSTOM: {
    icon: '', 
    defaultUnit: UnitOfMeasurementType.TIMES, 
    allowedUnits: Object.values(UnitOfMeasurementType),
  },
};
