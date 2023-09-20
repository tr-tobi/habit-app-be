const app = require('../app')
const request = require("supertest");
const { usersData } = require('../db/seed/data/test-data/users')
const { habitsData } = require('../db/seed/data/test-data/habits')
const { habitCompletionData } = require('../db/seed/data/test-data/habit-completion')

describe("/api/users", () => {
    test("GET:200 sends an array of users objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          expect(response.body.users).toEqual(expect.any(Array));
          expect(Object.keys(response.body.users[0])).toEqual.toHaveProperty("username");
        });
    });
  });