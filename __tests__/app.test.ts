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
describe("/api/users/:username/habits", () => {
  test("GET:200 sends an array of habit objects each habit should have the specified properties", () => {
    return request(app)
      .get("/api/users/user1/habits")
      .expect(200)
      .then((res: any) => {
        expect(res.body.habits).toEqual(expect.any(Array));
        expect(res.body.habits[0]).toHaveProperty("date");
        expect(res.body.habits[0]).toHaveProperty("habit_name");
        expect(res.body.habits[0]).toHaveProperty("habit_category");
        expect(res.body.habits[0]).toHaveProperty("description");
        expect(res.body.habits[0]).toHaveProperty("occurrence");
        });
      });
      
  test("POST:201 inserts a new habit to the db and sends the new habit to the client", () => {
        const newHabit: object = {
          habit_name: "Paint",
          habit_category: "Mindfulness",
          description: "Paint every evening.",
          occurrence: ["Daily"]
        };
        return request(app)
          .post("/api/users/user1/habits")
          .send(newHabit)
          .expect(201)
          .then((res: any) => {
            expect(res.body.habit).toHaveProperty("date");
            expect(res.body.habit).toHaveProperty("habit_name");
            expect(res.body.habit).toHaveProperty("habit_category");
            expect(res.body.habit).toHaveProperty("description");
            expect(res.body.habit).toHaveProperty("occurrence");
          });
      });
  });
  test("POST:400 sends an appropriate error message when given a bad habit (missing properties: habit_name and occurence )", () => {
    const newHabit: object = {
      habit_category: "Mindfulness",
      description: "Nap every evening.",
    };
    return request(app)
      .post("/api/users/user1/habits")
      .send(newHabit)
      .expect(400)
      .then((res: any) => {
        console.log(res)
        expect(res.body.msg).toBe('Bad Request');
      });
  });