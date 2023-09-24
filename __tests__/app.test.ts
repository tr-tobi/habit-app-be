var app = require("../app");
const request = require("supertest");
var { usersData } = require("../db/seed/data/test-data/users");
var { habitsData } = require("../db/seed/data/test-data/habits");
var {
  habitCompletionData,
} = require("../db/seed/data/test-data/habit-completion");
var mongoose = require("mongoose");
const usersJson = require("../db/seed/data/test-data/json/test.users.json");
var { insertUsers, insertCompletion } = require("../db/seed/run-seed"); // Import the insertUsers function
const completionJson = require("../db/seed/data/test-data/json/test.habit_completion.json");

let session: any;

beforeEach(async () => {
  session = await mongoose.startSession();
  session.startTransaction();
  await mongoose.connection.collection("users").deleteMany({});
  await mongoose.connection.collection("habit_completion").deleteMany({});

  await Promise.all([insertUsers(usersJson), insertCompletion(completionJson)]);
});

afterAll(async () => {
  await session.abortTransaction();
  session.endSession();
});

describe("/api/users", () => {
  test("GET:200 sends an array of users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response: any) => {
        expect(response.body.users).toEqual(expect.any(Array));
        expect(response.body.users[0]).toHaveProperty("username");
        expect(response.body.users[0]).toHaveProperty("email");
        expect(response.body.users[0]).toHaveProperty("password");
        expect(response.body.users[0]).toHaveProperty("habit_categories");
        expect(response.body.users[0]).toHaveProperty("challenges");
        expect(response.body.users[0]).toHaveProperty("habits");
        expect(response.body.users[0]).toHaveProperty("notes");
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
        expect(res.body.user).not.toHaveProperty("email");
        expect(res.body.user).not.toHaveProperty("password");
        expect(res.body.user).toHaveProperty("habit_categories");
        expect(res.body.user).toHaveProperty("challenges");
        expect(res.body.user).toHaveProperty("habits");
        expect(res.body.user).toHaveProperty("notes");
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
  test("POST:400 obj contains username that already exists in the database", () => {
    const newUser: object = {
      username: "user1",
      email: "test123@gmail.com",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then((res: any) => {
        expect(res.body.msg).toBe("Username already exists");
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
        expect(response.body.user[0]).toHaveProperty("username");
        expect(response.body.user[0]).toHaveProperty("email");
        expect(response.body.user[0]).toHaveProperty("password");
        expect(response.body.user[0]).toHaveProperty("habit_categories");
        expect(response.body.user[0]).toHaveProperty("challenges");
        expect(response.body.user[0]).toHaveProperty("habits");
        expect(response.body.user[0]).toHaveProperty("notes");
      });
  });
  test("GET:404 sends a not found message for non-existant username", () => {
    return request(app)
      .get("/api/users/banana")
      .expect(404)
      .then((response: any) => {
        expect(response.body.msg).toEqual("User Not Found");
      });
  });
  test("PATCH:200 updates user password by username", async () => {
    const newPassword = {
      password: "newpassword",
    };

    return request(app)
      .patch("/api/users/user1")
      .send(newPassword)
      .expect(200)
      .then((response: any) => {
        expect(response.body.password).toBe(newPassword.password);
      });
  });
  test("PATCH:200 updates user password by username with an extra property", async () => {
    const newPassword = {
      password: "newpassword",
      test: 4,
    };

    return request(app)
      .patch("/api/users/user1")
      .send(newPassword)
      .expect(200)
      .then((response: any) => {
        expect(response.body.password).toBe(newPassword.password);
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
      .delete("/api/users/user1")
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

describe("/api/auth/:username", () => {
  test("POST:200 returns an object with true for correct password", () => {
    const userCheck: object = {
      username: "user2",
      password: "password2",
    };
    return request(app)
      .post("/api/auth/user2")
      .expect(201)
      .send(userCheck)
      .then((response: any) => {
        expect(response.body.correct).toEqual(true);
      });
  });
  test("GET:200 returns an object with false for incorrect password", () => {
    const userCheck: object = {
      username: "user2",
      password: "wrongpassword",
    };
    return request(app)
      .post("/api/auth/user2")
      .expect(201)
      .send(userCheck)
      .then((response: any) => {
        expect(response.body.correct).toEqual(false);
      });
  });
  test("GET:404 returns an not found for a username not in the database", () => {
    const userCheck: object = {
      username: "banana",
      password: "wrongpassword",
    };
    return request(app)
      .post("/api/auth/banana")
      .expect(404)
      .send(userCheck)
      .then((response: any) => {
        expect(response.body.msg).toEqual("User Not Found");
      });
  });
});

describe("/api/users/:username/habit_completion/:date", () => {
  test("GET:200 sends array of habit completion objects", () => {
    return request(app)
      .get("/api/users/user3/habit_completion/2023-09-19")
      .expect(200)
      .then((response: any) => {
        expect(response.body.habit_completion[0].habit_id).toEqual("h4");
        expect(response.body.habit_completion[0].date).toEqual("2023-09-19");
        expect(response.body.habit_completion[0].completed).toEqual(true);
        expect(response.body.habit_completion[0].username).toEqual("user3");
        expect(response.body.habit_completion[0]).toHaveProperty("_id");
      });
  });
  test("GET:404 sends a not found message for non-existant username", () => {
    return request(app)
      .get("/api/users/banana/habit_completion/2023-09-19")
      .expect(404)
      .then((response: any) => {
        expect(response.body.msg).toEqual(
          "No completions found for this user and date"
        );
      });
  });
  test("GET:404 sends a not found message for invalid date", () => {
    return request(app)
      .get("/api/users/user1/habit_completion/sdsdd")
      .expect(404)
      .then((response: any) => {
        expect(response.body.msg).toEqual(
          "No completions found for this user and date"
        );
      });
  });
  test("POST: 201 obj contains correct properties for post request", () => {
    const newHabit: object = {
      username: "user1",
      completed: "true",
      //pass habit id here
      habit_id: new mongoose.Types.ObjectId(),
    };
    return request(app)
      .post("/api/users/user1/habit_completion")
      .send(newHabit)
      .expect(201)
      .then((res: any) => {
        expect(res.body.habit).toHaveProperty("_id");
        expect(res.body.habit).toHaveProperty("completed");
        expect(res.body.habit).toHaveProperty("date");
        expect(res.body.habit).toHaveProperty("username");
        expect(res.body.habit).toHaveProperty("habit_id");
      });
  });
  test("POST:400 obj contains nothing/ no username or completed property", () => {
    const newHabit: object = {};
    return request(app)
      .post("/api/users/user1/habit_completion")
      .send(newHabit)
      .expect(400)
      .then((res: any) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test("PATCH:200 updates completed variable by habit_id", async () => {
    const updatedCompletion = {
      completed: true,
      habit_id: "h10",
    };

    return request(app)
      .patch("/api/users/user1/habit_completion")
      .send(updatedCompletion)
      .expect(200)
      .then((response: any) => {
        expect(response.body.completed).toBe(true);
      });
  });
  test("PATCH:400 obj contains no habit_id property", () => {
    const updatedCompletion = {
      test: 4,
    };
    return request(app)
      .patch("/api/users/user1/habit_completion")
      .send(updatedCompletion)
      .expect(400)
      .then((response: any) => {
        expect(response.body.msg).toBe("No 'completed' value provided");
      });
  });
  test("Patch:404 sends an appropriate error message when given an invalid user", () => {
    const updatedCompletion = {
      completed: true,
      habit_id: "650d9c2d72b9fe3db67dc6fd",
    };

    return request(app)
      .patch("/api/users/djkfnsf/habit_completion")
      .send(updatedCompletion)
      .expect(404)
      .then((response: any) => {
        expect(response.body.msg).toBe("User Not Found");
      });
  });
});

describe("/api/categories/:username", () => {
  test("GET:200 sends an array of categories", () => {
    return request(app)
      .get("/api/categories/user1")
      .expect(200)
      .then((response: any) => {
        expect(response.body.categories).toEqual([
          "Health",
          "Fitness",
          "Productivity",
        ]);
      });
  });
  test("GET:404 sends an empty array", () => {
    return request(app)
      .get("/api/categories/user11")
      .expect(404)
      .then((response: any) => {
        expect(response.body.msg).toBe("User has no categories");
      });
  });
  test("POST:201 request contains a new category", () => {
    return request(app)
      .post("/api/categories/user10")
      .send({ newCategory: "testCategory" })
      .expect(201)
      .then((response: any) => {
        expect(response.body).toEqual(["Fitness", "Exercise", "testCategory"]);
      });
  });
  test.todo("POST:400 request contains an empty category");
  test.todo("POST:400 request contains an existing category");
});
