import { User } from "../types"

export const getAuthToken = () => {
  return window.localStorage.getItem('auth_token');
}
  
export const setAuthHeader = (token:string|null) => {
    if (token !== null) {
      window.localStorage.setItem("auth_token", token)
    } else {
      window.localStorage.removeItem("auth_token")
    }
}

export const getAuthUser = () => {
  const user = window.localStorage.getItem("loggedUser")
  return user ? (JSON.parse(user) as User) : null
}

export const setAuthUser = (user: User|null) => {
  if (user != null) {
    window.localStorage.setItem("loggedUser", JSON.stringify(user));
  } else {
    window.localStorage.removeItem("loggedUser");
  }
}

export const createHeaders = () => {
  const requestHeaders = new Headers();
  requestHeaders.append('Content-Type', 'application/json');

  if(getAuthToken()!=null && getAuthToken()!=''){
    requestHeaders.append('Authorization', `Bearer ${getAuthToken()}` )
  }
  
  return requestHeaders
}