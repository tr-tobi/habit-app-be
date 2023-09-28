var app = require("../app");
const request = require("supertest");
var { usersData } = require("../db/seed/data/test-data/users");
var { habitsData } = require("../db/seed/data/test-data/habits");
var {
  habitCompletionData,
} = require("../db/seed/data/test-data/habit-completion");
var mongoose = require("mongoose");
const usersJson = require("../db/seed/data/test-data/json/test.users.json");
var {
  insertUsers,
  insertCompletion,
  insertHabits,
  insertNotes,
  insertChallenges,
} = require("../db/seed/run-seed");
const completionJson = require("../db/seed/data/test-data/json/test.habit_completion.json");
const habitsJson = require("../db/seed/data/test-data/json/test.habits.json");
const notesJson = require("../db/seed/data/test-data/json/notesTest.json");
const challengesJson = require("../db/seed/data/test-data/json/challengesTest.json");
var endpoints = require("../endpoints.json");

let session: any;

beforeEach(async () => {
  session = await mongoose.startSession();
  session.startTransaction();
  await mongoose.connection.collection("users").deleteMany({});
  await mongoose.connection.collection("habit_completion").deleteMany({});
  await mongoose.connection.collection("habits").deleteMany({});
  await mongoose.connection.collection("notes").deleteMany({});
  await mongoose.connection.collection("challenges").deleteMany({});

  await Promise.all([
    insertUsers(usersJson),
    insertCompletion(completionJson),
    insertHabits(habitsJson),
    insertNotes(notesJson),
    insertChallenges(challengesJson),
  ]);
});

afterAll(async () => {
  await session.abortTransaction();
  session.endSession();
});

describe("/api/", () => {
  test("GET:200 sends an object of all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response: any) => {
        expect(response.body).toEqual(endpoints);
      });
  });
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
  test("POST:200 returns an object with false for incorrect password", () => {
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
  test("POST:404 returns an not found for a username not in the database", () => {
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
      completed: "true",
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
      .get("/api/categories/happy123")
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
  test("POST:400 request contains an empty category", () => {
    return request(app)
      .post("/api/categories/happy123")
      .send({ newCategory: "  " })
      .expect(400)
      .then((response: any) => {
        expect(response.body.msg).toBe("Please input non-empty category");
      });
  });
  test("POST:400 request contains an existing category", () => {
    return request(app)
      .post("/api/categories/user1")
      .send({ newCategory: "Health" })
      .expect(400)
      .then((response: any) => {
        expect(response.body.msg).toBe("Category already exists");
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
      occurrence: ["Daily"],
      username: "user11",
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
        expect(res.body.habit).toHaveProperty("habit_id");
        expect(res.body.habit).toHaveProperty("username");
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
        expect(res.body.msg).toBe("Bad Request");
      });
  });
});
describe("/api/habits/:username", () => {
  test("GET: sends a habit for a user", () => {
    return request(app)
      .get("/api/users/user2/habits/h4")
      .expect(200)
      .then((res: any) => {
        expect(res.body.habit).toHaveProperty("habit_id");
        expect(res.body.habit).toHaveProperty("date");
        expect(res.body.habit).toHaveProperty("habit_name");
        expect(res.body.habit).toHaveProperty("habit_category");
        expect(res.body.habit).toHaveProperty("description");
        expect(res.body.habit).toHaveProperty("occurrence");
      });
  });
  test("GET: sends a habit for a user", () => {
    return request(app)
      .get("/api/habits/user5")
      .expect(200)
      .then((res: any) => {
        const { habits } = res.body;
        expect(habits).toBeInstanceOf(Array);
        habits.forEach((habit: any) => {
          expect(habit).toHaveProperty("habit_id");
          expect(habit).toHaveProperty("date");
          expect(habit).toHaveProperty("habit_name");
          expect(habit).toHaveProperty("habit_category");
          expect(habit).toHaveProperty("description");
          expect(habit).toHaveProperty("occurrence");
          expect(habit).toHaveProperty("username");
        });
      });
  });
  test("GET:404 sends a not found message for non-existant username", () => {
    return request(app)
      .get("/api/habits/banana")
      .expect(404)
      .then((response: any) => {
        expect(response.body.msg).toEqual("User Not Found");
      });
  });
});
describe("/api/users/:username/habits/:habit_id", () => {
  test("PATCH:201 updates a habit by id", () => {
    const newHabit: object = {
      habit_name: "Sleep",
      habit_category: "Mindfulness",
      description: "Sleep every evening.",
      occurrence: ["Weekly"],
    };
    return request(app)
      .patch("/api/users/user2/habits/h2")
      .send(newHabit)
      .expect(201)
      .then((res: any) => {
        expect(res.body.habit).toHaveProperty("date");
        expect(res.body.habit.habit_name).toEqual("Sleep");
        expect(res.body.habit.habit_category).toEqual("Mindfulness");
        expect(res.body.habit.description).toEqual("Sleep every evening.");
        expect(res.body.habit.occurrence).toEqual(["Weekly"]);
        expect(res.body.habit.habit_id).toEqual("h2");
      });
  });
  test("PATCH:404 sends an appropriate error message when given a valid but non-existent id", () => {
    return request(app)
      .patch("/api/users/user2/habits/650c2a6958e406e373639780")
      .send({ occurrence: ["Daily"] })
      .expect(404)
      .then((res: any) => {
        expect(res.body.msg).toBe("Habit not found");
      });
  });
});
describe.only("/api/users/:username/habits/:habit_id", () => {
  test("DELETE: 204 deletes the given habit by_id and sends no body back", () => {
    return request(app).delete("/api/users/user2/habits/h2").expect(204);
  });
  test("DELETE: 404 responds with appropriate error message when given non-existent id", () => {
    return request(app)
      .delete("/api/users/user2/habits/650c5a7b2a297337f65c6967")
      .expect(404)
      .then((res: any) => {
        expect(res.body.msg).toBe("Habit not found");
      });
  });
});

describe("/api/users/:username/notes", () => {
  test("GET: 200 gets list of all notes made by a user", () => {
    return request(app)
      .get("/api/users/user2/notes")
      .expect(200)
      .then((response: any) => {
        expect(response.body.notes[0]).toHaveProperty("username");
        expect(response.body.notes[0]).toHaveProperty("_id");
        expect(response.body.notes[0]).toHaveProperty("date");
        expect(response.body.notes[0]).toHaveProperty("body");
        expect(response.body.notes[0]).toHaveProperty("note_id");
      });
  });
  test("GET:404 sends a not found message for non-existant username", () => {
    return request(app)
      .get("/api/users/banana/notes")
      .expect(404)
      .then((response: any) => {
        expect(response.body.msg).toEqual("User Not Found");
      });
  });
  test("POST: 201 adds a new note to a users notes list", () => {
    const bodyObj = { body: "This is a test for the notes body" };
    return request(app)
      .post("/api/users/user2/notes")
      .send(bodyObj)
      .expect(201)
      .then((response: any) => {
        expect(response.body.newNote).toHaveProperty("username");
        expect(response.body.newNote).toHaveProperty("note_id");
        expect(response.body.newNote).toHaveProperty("_id");
        expect(response.body.newNote).toHaveProperty("date");
        expect(response.body.newNote.body).toEqual(
          "This is a test for the notes body"
        );
      });
  });
  test("POST:400 request contains no body property", () => {
    return request(app)
      .post("/api/users/user2/notes")
      .send({ noBody: "  " })
      .expect(400)
      .then((response: any) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});
describe("/api/users/:username/challenges", () => {
  test("GET: 200 gets list of all challenges made by a user", () => {
    return request(app)
      .get("/api/users/user1/challenges")
      .expect(200)
      .then((response: any) => {
        expect(response.body.challenges.length).toEqual(2);
        expect(response.body.challenges[0]).toHaveProperty("challenge_id");
        expect(response.body.challenges[0]).toHaveProperty("username");
        expect(response.body.challenges[0]).toHaveProperty("_id");
        expect(response.body.challenges[0]).toHaveProperty("start_date");
        expect(response.body.challenges[0]).toHaveProperty("end_date");
        expect(response.body.challenges[0]).toHaveProperty("pass_requirement");
        expect(response.body.challenges[0]).toHaveProperty("habits_tracked");
        expect(response.body.challenges[0]).toHaveProperty("description");
      });
  });
  test("GET:404 sends a not found message for non-existant username", () => {
    return request(app)
      .get("/api/users/banana/challenges")
      .expect(404)
      .then((response: any) => {
        expect(response.body.msg).toEqual("User Not Found");
      });
  });
  test("POST: 201 adds a new note to a users notes list", () => {
    const reqObj = {
      challenge_name: "Read for a whole month",
      start_date: "2023-09-30",
      end_date: "2023-10-30",
      description: "Read for 1 hour every day for the next 30 days",
      pass_requirement: 80,
      habits_tracked: ["h1"],
    };
    return request(app)
      .post("/api/users/user1/challenges")
      .send(reqObj)
      .expect(201)
      .then((response: any) => {
        expect(response.body.newChallenge.username).toEqual("user1");
        expect(response.body.newChallenge.challenge_name).toEqual(
          "Read for a whole month"
        );
        expect(response.body.newChallenge).toHaveProperty("_id");

        expect(response.body.newChallenge.start_date).toEqual("2023-09-30");
        expect(response.body.newChallenge.end_date).toEqual("2023-10-30");
        expect(response.body.newChallenge.pass_requirement).toEqual(80);
        expect(response.body.newChallenge.habits_tracked).toEqual(["h1"]);
        expect(response.body.newChallenge.description).toEqual(
          "Read for 1 hour every day for the next 30 days"
        );
      });
  });
  test("POST:400 request contains no body property", () => {
    return request(app)
      .post("/api/users/user1/challenges")
      .send({ noBody: "  " })
      .expect(400)
      .then((response: any) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/users/:username/notes/:note_id", () => {
  test("PATCH:201 updates a note body", () => {
    return request(app)
      .patch(`/api/users/user1/notes/n1`)
      .send({ note_body: "update note test" })
      .expect(201)
      .then((response: any) => {
        const newNote = response.body;
        expect(newNote.username).toBe("user1");
        expect(newNote.note_id).toBe("n1");
        expect(newNote.body).toBe("update note test");
      });
  });
  test("PATCH:400 no note sent", () => {
    return request(app)
      .patch(`/api/users/user1/notes/n1`)
      .send({ note_body: "  " })
      .expect(400)
      .then((response: any) => {
        expect(response.body.msg).toBe("No note body provided");
      });
  });
  test("PATCH:404 given a non-existent note id", () => {
    return request(app)
      .patch(`/api/users/user1/notes/n100`)
      .send({ note_body: "update note test" })
      .expect(404)
      .then((response: any) => {
        expect(response.body.msg).toBe("Note not found");
      });
  });
  test("DELETE:204 deletes a note", () => {
    return request(app).delete(`/api/users/user1/notes/n1`).expect(204);
  });
  test("DELETE:404 given a non-existent note id", () => {
    return request(app)
      .delete(`/api/users/user1/notes/n100`)
      .expect(404)
      .then((response: any) => {
        expect(response.body.msg).toBe("Note not found");
      });
  });
});
describe("/api/users/:username/challenges/:challenge_id", () => {
  test("GET: 200 gets a single challenge by challenge_id", () => {
    return request(app)
      .get("/api/users/user1/challenges/c1")
      .expect(200)
      .then((response: any) => {
        expect(response.body.challenge).toHaveProperty("challenge_name");
        expect(response.body.challenge).toHaveProperty("_id");
        expect(response.body.challenge).toHaveProperty("start_date");
        expect(response.body.challenge).toHaveProperty("end_date");
        expect(response.body.challenge).toHaveProperty("pass_requirement");
        expect(response.body.challenge).toHaveProperty("habits_tracked");
        expect(response.body.challenge).toHaveProperty("description");
        expect(response.body.challenge).toHaveProperty("username");
      });
  });
  test("GET:404 sends a not found message for non-existant username", () => {
    return request(app)
      .get("/api/users/banana/challenges")
      .expect(404)
      .then((response: any) => {
        expect(response.body.msg).toEqual("User Not Found");
      });
  });
  test("DELETE: 204 deletes the given challenge by_id and sends no body back", () => {
    return request(app).delete("/api/users/user2/challenges/c2").expect(204);
  });
  test("DELETE: 404 responds with appropriate error message when given non-existent id", () => {
    return request(app)
      .delete("/api/users/user2/challenges/blabla")
      .expect(404)
      .then((res: any) => {
        expect(res.body.msg).toBe("Challenge not found");
      });
  });
});
