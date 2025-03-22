// Base Types ---------

/**
 * All available fields present within the "Parking Violations Issued - Fiscal Year <Year>"
 * https://data.cityofnewyork.us/City-Government/Parking-Violations-Issued-Fiscal-Year-2024/pvqr-7yc4/about_data
 */
export interface ParkingViolationsIssuedTable {
  summons_number: string;
  plate: string;
  registration_state: string;
  plate_type: string;
  issue_date: string;
  violation_code: number;
  vehicle_body_type: string;
  vehicle_make: string;
  issuing_agency: string;
  street_code1: number;
  street_code2: number;
  street_code3: number;
  vehicle_expiration_date: number;
  violation_location: string;
  violation_precinct: number;
  issuer_precinct: number;
  issuer_code: number;
  issuer_command: string;
  issuer_squad: string;
  violation_time: string;
  days_parking_in_effect: string;
  from_hours_in_effect: string;
  to_hours_in_effect: string;
  vehicle_color: string;
  unregistered_vehicle: string;
  vehicle_year: number;
  meter_number: string;
  feet_from_curb: number;
  violation_post_code: string;
  violation_description: string;
  no_standing_or_stopping_violation: string;
  hydrant_violation: string;
  double_parking_violation: string;
  time_first_observed: string;
  violation_county: string;
  violation_in_front_of_or_opposite: string;
  house_number: string;
  street_name: string;
  intersecting_street: string;
  date_first_observed: number;
  law_section: number;
  sub_division: string;
  violation_legal_code: string;
}

/**
 * All available fields present within the "Open Parking and Camera Violations" dataset.
 * https://data.cityofnewyork.us/City-Government/Open-Parking-and-Camera-Violations/nc67-uf89/about_data
 */
export interface OpenParkingAndCameraViolationsTable {
  plate: string;
  state: string;
  license_type: string;
  summons_number: string;
  issue_date: string;
  violation_time: string;
  violation: string;
  judgment_entry_date: string;
  fine_amount: number;
  penalty_amount: number;
  interest_amount: number;
  reduction_amount: number;
  payment_amount: number;
  amount_due: number;
  precinct: string;
  county: string;
  issuing_agency: string;
  violation_status: string;
  summons_image: string;
}

// ------- End Base Types

type WithPotentiallyUndefined<T> = {
  [P in keyof T]: T[P] | undefined;
};

export type ParkingViolationLocation = WithPotentiallyUndefined<
  Pick<
    ParkingViolationsIssuedTable,
    "street_name" | "house_number" | "summons_number" | "intersecting_street"
  >
>;

export type IndividualViolationDetails = Pick<
  OpenParkingAndCameraViolationsTable,
  "fine_amount" | "issue_date" | "summons_number" | "violation"
> &
  ParkingViolationLocation;

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
