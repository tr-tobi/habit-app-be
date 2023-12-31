var usersJsonData = [
  {
    _id: "1",
    username: "user1",
    email: "user1@example.com",
    password: "password1",
    habit_categories: ["Health", "Fitness", "Productivity"],
    challenges: ["30-Day Workout Challenge", "Read a Book a Week Challenge"],
    habits: ["h1", "h3"],
    notes: [],
  },
  {
    _id: "2",
    username: "user2",
    email: "user2@example.com",
    password: "password2",
    habit_categories: ["Mindfulness", "Coding", "Cooking"],
    challenges: ["Daily Meditation Challenge"],
    habits: ["h2", "h4"],
    notes: [],
  },
  {
    _id: "3",
    username: "user3",
    email: "user3@example.com",
    password: "password3",
    habit_categories: ["Reading", "Writing", "Exercise"],
    challenges: [],
    habits: ["h5", "h6"],
    notes: [],
  },
  {
    _id: "4",
    username: "user4",
    email: "user4@example.com",
    password: "password4",
    habit_categories: ["Coding", "Health", "Yoga"],
    challenges: ["Daily Coding Challenge", "Weekly Yoga Challenge"],
    habits: ["h7", "h8"],
    notes: [],
  },
  {
    _id: "5",
    username: "user5",
    email: "user5@example.com",
    password: "password5",
    habit_categories: ["Productivity", "Mindfulness"],
    challenges: ["30-Day Productivity Challenge"],
    habits: ["h9"],
    notes: [],
  },
  {
    _id: "6",
    username: "user6",
    email: "user6@example.com",
    password: "password6",
    habit_categories: ["Cooking", "Fitness", "Reading"],
    challenges: [],
    habits: ["h10"],
    notes: [],
  },
  {
    _id: "7",
    username: "user7",
    email: "user7@example.com",
    password: "password7",
    habit_categories: ["Exercise", "Writing", "Coding"],
    challenges: [],
    habits: [],
    notes: [],
  },
  {
    _id: "8",
    username: "user8",
    email: "user8@example.com",
    password: "password8",
    habit_categories: ["Health", "Mindfulness", "Cooking"],
    challenges: [],
    habits: [],
    notes: [],
  },
  {
    _id: "9",
    username: "user9",
    email: "user9@example.com",
    password: "password9",
    habit_categories: ["Productivity", "Reading"],
    challenges: ["Weekly Reading Challenge"],
    habits: [],
    notes: [],
  },
  {
    _id: "10",
    username: "user10",
    email: "user10@example.com",
    password: "password10",
    habit_categories: ["Fitness", "Exercise"],
    challenges: ["Daily Workout Challenge"],
    habits: [],
    notes: [],
  },
  {
    _id: {
      $oid: "6509c608207e6bf264f1ad19",
    },
    username: "happy123",
    email: "happy123@example.com",
    password: "password123",
    habit_categories: [],
    challenges: [],
    habits: [],
    notes: [],
    __v: 0,
  },
  {
    _id: {
      $oid: "6509c7dbaeb66ae34e894f17",
    },
    username: "smiley123",
    email: "smiley@example.com",
    password: "password321",
    habit_categories: [],
    challenges: [],
    habits: [],
    notes: [],
    __v: 0,
  },
  {
    _id: {
      $oid: "6509c7fde27d54fcb5e82454",
    },
    username: "sad123",
    email: "sad@example.com",
    password: "password987",
    habit_categories: [],
    challenges: [],
    habits: [],
    notes: [],
    __v: 0,
  },
  {
    _id: {
      $oid: "6509c81de27d54fcb5e82456",
    },
    username: "sad123",
    email: "sad@example.com",
    password: "password987",
    habit_categories: [],
    challenges: [],
    habits: [],
    notes: [],
    __v: 0,
  },
  {
    _id: {
      $oid: "6509c9854c40463a20cd5458",
    },
    username: "laugh123",
    email: "laugh@example.com",
    password: "passwordl987",
    habit_categories: [],
    challenges: [],
    habits: [],
    notes: [],
    __v: 0,
  },
];

var usersData = JSON.parse(JSON.stringify(usersJsonData));

module.exports = { usersData };
