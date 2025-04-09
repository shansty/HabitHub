export enum UnitOfMeasurementType {
  TIMES = 'TIMES',
  MINS = 'MINS',
  HOURS = 'HOURS',
  KM = 'KM',
  M = 'M',
  KG = 'KG',
  G = 'G',
  MG = 'MG',
  L = 'L',
  ML = 'ML',
}


export enum GoalPeriodicityType {
  PER_DAY = 'PER DAY',
  PER_WEEK = 'PER WEEK',
  PER_MONTH = 'PER MONTH',
}

export enum HabitScheduleType {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  INTERVAL = 'INTERVAL',
}


export enum HabitType {
  GOOD = 'GOOD',
  BAD = 'BAD',
}


export enum HabitStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  ABANDONED = 'ABANDONED',
}


export enum HabitDomain {
  FINANCE = 'FINANCE',
  FITNESS = 'FITNESS',
  HEALTH = 'HEALTH',
  MINDSET = 'MINDSET',
  NUTRITION = 'NUTRITION',
  CUSTOM = 'CUSTOM',
}
