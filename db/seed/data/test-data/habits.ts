const habitsJsonData = [{
    "_id": "h1",
    "date": "2023-09-19",
    "habit_name": "Morning Run",
    "habit_category": "Fitness",
    "description": "Go for a 30-minute run every morning.",
    "occurrence": [
      "Monday",
      "Wednesday",
      "Friday"
    ]
  },
  {
    "_id": "h2",
    "date": "2023-09-20",
    "habit_name": "Read a Book",
    "habit_category": "Reading",
    "description": "Read at least one chapter of a book every evening.",
    "occurrence": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ]
  },
  {
    "_id": "h3",
    "date": "2023-09-21",
    "habit_name": "Meditation",
    "habit_category": "Mindfulness",
    "description": "Meditate for 10 minutes daily in the morning.",
    "occurrence": [
      "Daily"
    ]
  },
  {
    "_id": "h4",
    "date": "2023-09-22",
    "habit_name": "Learn Coding",
    "habit_category": "Coding",
    "description": "Spend at least 1 hour learning coding every evening.",
    "occurrence": [
      "Monday",
      "Wednesday",
      "Friday"
    ]
  },
  {
    "_id": "h5",
    "date": "2023-09-23",
    "habit_name": "Healthy Eating",
    "habit_category": "Health",
    "description": "Eat a balanced and healthy meal every day.",
    "occurrence": [
      "Daily"
    ]
  },
  {
    "_id": "h6",
    "date": "2023-09-24",
    "habit_name": "Yoga",
    "habit_category": "Fitness",
    "description": "Practice yoga for 20 minutes every morning.",
    "occurrence": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ]
  },
  {
    "_id": "h7",
    "date": "2023-09-25",
    "habit_name": "Writing Journal",
    "habit_category": "Writing",
    "description": "Write in your journal for 15 minutes every evening.",
    "occurrence": [
      "Daily"
    ]
  },
  {
    "_id": "h8",
    "date": "2023-09-26",
    "habit_name": "Cooking",
    "habit_category": "Cooking",
    "description": "Cook a new recipe every Sunday.",
    "occurrence": [
      "Sunday"
    ]
  },
  {
    "_id": "h9",
    "date": "2023-09-27",
    "habit_name": "Productivity",
    "habit_category": "Productivity",
    "description": "Complete your daily tasks on time.",
    "occurrence": [
      "Daily"
    ]
  },
  {
    "_id": "h10",
    "date": "2023-09-28",
    "habit_name": "Learn a Language",
    "habit_category": "Learning",
    "description": "Spend 30 minutes learning a new language every day.",
    "occurrence": [
      "Daily"
    ]
  }]

const habitsData = JSON.parse(JSON.stringify(habitsJsonData))

module.exports = { habitsData } 

