/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CategoryInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: findCategoryBySlug
// ====================================================

export interface findCategoryBySlug_findCategoryBySlug_category {
  __typename: "Category";
  id: number;
  name: string;
  coverImg: string | null;
  slug: string;
  restaurantCount: number;
}

export interface findCategoryBySlug_findCategoryBySlug_restaurants_category {
  __typename: "Category";
  name: string;
}

export interface findCategoryBySlug_findCategoryBySlug_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string | null;
  category: findCategoryBySlug_findCategoryBySlug_restaurants_category | null;
  address: string;
  isPromoted: boolean;
}

export interface findCategoryBySlug_findCategoryBySlug {
  __typename: "CategoryOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  category: findCategoryBySlug_findCategoryBySlug_category | null;
  restaurants: findCategoryBySlug_findCategoryBySlug_restaurants[] | null;
  totalResults: number | null;
}

export interface findCategoryBySlug {
  findCategoryBySlug: findCategoryBySlug_findCategoryBySlug;
}

export interface findCategoryBySlugVariables {
  input: CategoryInput;
}
