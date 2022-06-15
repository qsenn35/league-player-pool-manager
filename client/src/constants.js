const SERVER_URL = proccess.env.NODE_ENV === "production" ? "http://66.228.51.122/api" : "http://localhost:3000/api"

export {
  SERVER_URL,
}