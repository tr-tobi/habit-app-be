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

describe("/api/users/:username", () => {
  test("GET:200 sends a user object for a user present in the api", () => {
    return request(app)
      .get("/api/users/user2")
      .expect(200)
      .then((response: any) => {
        expect(response.body.user[0]).toEqual({
          username: "user2",
          email: "user2@example.com",
          password: "password2",
          habit_categories: ["Mindfulness", "Coding", "Cooking"],
          challenges: ["Daily Meditation Challenge"],
          habits: ["h2", "h4"],
          notes: [],
        });
      });
  });
  test("GET:404 sends a bad request message for non-existant username", () => {
    return request(app)
      .get("/api/users/banana")
      .expect(404)
      .then((response: any) => {
        expect(response.body.msg).toEqual("User Not Found");
      });
  });
  test("PATCH:200 updates user password by username", () => {
    const newPassword = {
      password: "newpassword",
    };
    return request(app)
      .patch("/api/users/happy123")
      .send(newPassword)
      .expect(200)
      .then((response: any) => {
        expect(response.body).toMatchObject({
          username: "happy123",
          email: "happy123@example.com",
          password: "newpassword",
          habit_categories: [],
          challenges: [],
          habits: [],
          notes: [],
          __v: 0,
        });
      });
  });
  test("PATCH:200 updates user password by username with an extra property", () => {
    const newPassword = {
      password: "newpassword",
      test: 4,
    };
    return request(app)
      .patch("/api/users/happy123")
      .send(newPassword)
      .expect(200)
      .then((response: any) => {
        expect(response.body).toMatchObject({
          username: "happy123",
          email: "happy123@example.com",
          password: "newpassword",
          habit_categories: [],
          challenges: [],
          habits: [],
          notes: [],
          __v: 0,
        });
      });
  });
  test("PATCH:400 obj contains no password property", () => {
    const newPassword = {
      test: 4,
    };
    return request(app)
      .patch("/api/users/happy123")
      .send(newPassword)
      .expect(400)
      .then((response: any) => {
        expect(response.body.msg).toBe("No password entered");
      });
  });
  test("Patch:404 sends an appropriate error message when given a valid but non-existent id with valid password", () => {
    const newPassword = {
      password: "hello",
    };
    return request(app)
      .patch("/api/users/djkfnsf")
      .send(newPassword)
      .expect(404)
      .then((response: any) => {
        expect(response.body.msg).toBe("User Not Found");
      });
  });
  test("DELETE:200 deletes the specified user by username", () => {
    return request(app)
      .delete("/api/users/test123")
      .expect(200)
      .then((response: any) => {
        expect(response.body.msg).toBe("User Deleted");
      });
  });
  test("DELETE:400 responds with an appropriate error message when given a non existant username", () => {
    return request(app)
      .delete("/api/users/ewuieh")
      .expect(404)
      .then((response: any) => {
        expect(response.body.msg).toBe("User Not Found");
      });
  });
});
