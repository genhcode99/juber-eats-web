/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SearchRestaurantsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: searchRestaurant
// ====================================================

export interface searchRestaurant_searchRestaurant_restaurants_category {
  __typename: "Category";
  name: string;
}

export interface searchRestaurant_searchRestaurant_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string | null;
  category: searchRestaurant_searchRestaurant_restaurants_category | null;
  address: string;
  isPromoted: boolean;
}

export interface searchRestaurant_searchRestaurant {
  __typename: "SearchRestaurantsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  restaurants: searchRestaurant_searchRestaurant_restaurants[] | null;
  totalResults: number | null;
}

export interface searchRestaurant {
  searchRestaurant: searchRestaurant_searchRestaurant;
}

export interface searchRestaurantVariables {
  input: SearchRestaurantsInput;
}
