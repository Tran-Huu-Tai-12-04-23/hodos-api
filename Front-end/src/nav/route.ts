export const AUTH_ROUTE_KEY = createEnum({
  // =================================== auth route ==================================
  INTRO: "INTRO",
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
  GET_STARTED: "GET_STARTED",
});

export const BOTTOM_TAB_ROUTE = createEnum({
  HOME: "HOME",
  PERSONAL: "PERSONAL",
  SEARCH: "SEARCH",
  SCHEDULE: "SCHEDULE",
  PREDICT_IMG: "PREDICT_IMG",
});

export const APP_ROUTE = createEnum({
  LOCATION_DETAIL: "LOCATION_DETAIL",
  SHOW_IMG: "SHOW_IMG",
  CREATE_QUIZ: "CREATE_QUIZ",
  SETTING: "SETTING",
});

function createEnum<T extends { [P in keyof T]: P }>(o: T) {
  return o;
}
