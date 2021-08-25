/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DishParts
// ====================================================

export interface DishParts_options_choice {
  __typename: "DishChoice";
  name: string;
  extra: number | null;
}

export interface DishParts_options {
  __typename: "DishOptions";
  name: string;
  extra: number | null;
  choice: DishParts_options_choice[] | null;
}

export interface DishParts {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  options: DishParts_options[] | null;
  description: string;
}
