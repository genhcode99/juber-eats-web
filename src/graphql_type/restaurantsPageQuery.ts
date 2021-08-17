/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AllRestaurantsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: restaurantsPageQuery
// ====================================================

export interface restaurantsPageQuery_allCategories_categories {
  __typename: "Category";
  id: number;
  name: string;
  coverImg: string | null;
  slug: string;
  restaurantCount: number;
}

export interface restaurantsPageQuery_allCategories {
  __typename: "AllCategoriesOutput";
  ok: boolean;
  error: string | null;
  categories: restaurantsPageQuery_allCategories_categories[] | null;
}

export interface restaurantsPageQuery_allRestaurants_results_category {
  __typename: "Category";
  name: string;
}

export interface restaurantsPageQuery_allRestaurants_results {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string | null;
  category: restaurantsPageQuery_allRestaurants_results_category | null;
  address: string;
  isPromoted: boolean;
}

export interface restaurantsPageQuery_allRestaurants {
  __typename: "AllRestaurantsOutput";
  error: string | null;
  ok: boolean;
  totalPages: number | null;
  totalResults: number | null;
  results: restaurantsPageQuery_allRestaurants_results[] | null;
}

export interface restaurantsPageQuery {
  allCategories: restaurantsPageQuery_allCategories;
  allRestaurants: restaurantsPageQuery_allRestaurants;
}

export interface restaurantsPageQueryVariables {
  input: AllRestaurantsInput;
}
