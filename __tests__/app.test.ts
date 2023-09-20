var app = require("../app");
const request = require("supertest");
var { usersData } = require("../db/seed/data/test-data/users");
var { habitsData } = require("../db/seed/data/test-data/habits");
var {
  habitCompletionData,
} = require("../db/seed/data/test-data/habit-completion");

describe("/api/users", () => {
  test("GET:200 sends an array of users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response: any) => {
        expect(response.body.users).toEqual(expect.any(Array));
        expect(response.body.users[0]).toEqual({
          username: "user1",
          email: "user1@example.com",
          password: "password1",
          habit_categories: ["Health", "Fitness", "Productivity"],
          challenges: [
            "30-Day Workout Challenge",
            "Read a Book a Week Challenge",
          ],
          habits: ["h1", "h3"],
          notes: [],
        });
      });
  });

  test("POST: 201 obj contains correct properties for post request", () => {
    const newUser: object = {
      username: "test123",
      email: "test123@gmail.com",
      password: "12345",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then((res: any) => {
        expect(res.body.user).toHaveProperty("username");
        expect(res.body.user).toHaveProperty("email");
        expect(res.body.user).toHaveProperty("password");
        expect(res.body.user).toHaveProperty("habit_categories");
        expect(res.body.user).toHaveProperty("challenges");
        expect(res.body.user).toHaveProperty("habits");
        expect(res.body.user).toHaveProperty("notes");
        expect(res.body.user).toHaveProperty("_id");
      });
  });
  test("POST:400 obj contains username and email but no password", () => {
    const newUser: object = {
      username: "test123",
      email: "test123@gmail.com",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then((res: any) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test("POST:400 obj contains nothing", () => {
    const newUser: object = {};
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then((res: any) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
});
