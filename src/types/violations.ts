export interface AggregateViolationByPlate {
  plate: string;
  state: string;
  total_violations: number;
  total_fines: number;
  last_violation_date: string;
}

export interface ParkingAndCameraViolation {
  plate: string;
  state: string;
  fine_amount: number;
  issue_date: string;
  summons_number: string;
}

export interface ParkingViolation {
  issue_date: string;
  fine_amount: number;
  summons_number: string;
}

export interface ParkingViolationLocation {
  street_name?: string;
  house_number?: string;
  summons_number: string;
}

export interface ViolationsDetails {
  plate: string;
  state: string;
  fine_amount: number;
  issue_date: string;
  summons_number: string;
  street_name?: string;
  house_number?: string;
}

export enum ParkingViolationsTable {
  YEAR_2016 = "kiv2-tbus",
  YEAR_2017 = "2bnn-yakx",
  YEAR_2018 = "a5td-mswe",
  YEAR_2019 = "faiq-9dfq",
  YEAR_2020 = "p7t3-5i9s",
  YEAR_2021 = "kvfd-bves",
  YEAR_2022 = "7mxj-7a6y",
  YEAR_2023 = "869v-vr48",
  YEAR_2024 = "pvqr-7yc4",
}

export enum Year {
  YEAR_2016 = 2016,
  YEAR_2017 = 2017,
  YEAR_2018 = 2018,
  YEAR_2019 = 2019,
  YEAR_2020 = 2020,
  YEAR_2021 = 2021,
  YEAR_2022 = 2022,
  YEAR_2023 = 2023,
  YEAR_2024 = 2024,
}
