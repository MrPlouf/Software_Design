use jeu;

-- Question 1
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Easy',
    'What is the boiling point of water at sea level ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', '90°C', 0),
(LAST_INSERT_ID(), 'B', '100°C', 1),
(LAST_INSERT_ID(), 'C', '110°C', 0),
(LAST_INSERT_ID(), 'D', '120°C', 0);

-- Question 2
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Easy',
    'Which gas do plants absorb from the atmosphere ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Oxygen', 0),
(LAST_INSERT_ID(), 'B', 'Nitrogen', 0),
(LAST_INSERT_ID(), 'C', 'Carbon Dioxide', 1),
(LAST_INSERT_ID(), 'D', 'Hydrogen', 0);

-- Question 3
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Easy',
    'What is the primary source of energy for the Earth ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Moon', 0),
(LAST_INSERT_ID(), 'B', 'Sun', 1),
(LAST_INSERT_ID(), 'C', 'Stars', 0),
(LAST_INSERT_ID(), 'D', 'Wind', 0);

-- Question 4
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Easy',
    'Which part of the plant conducts photosynthesis ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Roots', 0),
(LAST_INSERT_ID(), 'B', 'Stem', 0),
(LAST_INSERT_ID(), 'C', 'Leaves', 1),
(LAST_INSERT_ID(), 'D', 'Flowers', 0);

-- Question 5
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Easy',
    'What is the chemical symbol for water ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'H2O', 1),
(LAST_INSERT_ID(), 'B', 'O2', 0),
(LAST_INSERT_ID(), 'C', 'CO2', 0),
(LAST_INSERT_ID(), 'D', 'HO', 0);

-- Question 6
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Easy',
    'Which organ pumps blood throughout the human body ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Brain', 0),
(LAST_INSERT_ID(), 'B', 'Liver', 0),
(LAST_INSERT_ID(), 'C', 'Heart', 1),
(LAST_INSERT_ID(), 'D', 'Lungs', 0);

-- Question 7
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Easy',
    'What gas do humans exhale ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Oxygen', 0),
(LAST_INSERT_ID(), 'B', 'Nitrogen', 0),
(LAST_INSERT_ID(), 'C', 'Carbon Dioxide', 1),
(LAST_INSERT_ID(), 'D', 'Hydrogen', 0);

-- Question 8
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Easy',
    'Which planet is known as the Red Planet ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Venus', 0),
(LAST_INSERT_ID(), 'B', 'Mars', 1),
(LAST_INSERT_ID(), 'C', 'Jupiter', 0),
(LAST_INSERT_ID(), 'D', 'Saturn', 0);

-- Question 9 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Difficult',
    'What is the powerhouse of the cell ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Nucleus', 0),
(LAST_INSERT_ID(), 'B', 'Mitochondria', 1),
(LAST_INSERT_ID(), 'C', 'Ribosome', 0),
(LAST_INSERT_ID(), 'D', 'Endoplasmic Reticulum', 0);

-- Question 10 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Difficult',
    'Which element has the atomic number 1 ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Helium', 0),
(LAST_INSERT_ID(), 'B', 'Hydrogen', 1),
(LAST_INSERT_ID(), 'C', 'Oxygen', 0),
(LAST_INSERT_ID(), 'D', 'Carbon', 0);

-- Question 11 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Difficult',
    'What is the process by which plants make their food ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Respiration', 0),
(LAST_INSERT_ID(), 'B', 'Digestion', 0),
(LAST_INSERT_ID(), 'C', 'Photosynthesis', 1),
(LAST_INSERT_ID(), 'D', 'Fermentation', 0);

-- Question 12 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Difficult',
    'Which part of the human brain controls balance ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Cerebrum', 0),
(LAST_INSERT_ID(), 'B', 'Cerebellum', 1),
(LAST_INSERT_ID(), 'C', 'Medulla', 0),
(LAST_INSERT_ID(), 'D', 'Hypothalamus', 0);

-- Question 13 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Difficult',
    'What is the chemical formula for table salt ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'NaCl', 1),
(LAST_INSERT_ID(), 'B', 'KCl', 0),
(LAST_INSERT_ID(), 'C', 'NaCO3', 0),
(LAST_INSERT_ID(), 'D', 'CaCl2', 0);

-- Question 14 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Difficult',
    'Which vitamin is produced when the skin is exposed to sunlight ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Vitamin A', 0),
(LAST_INSERT_ID(), 'B', 'Vitamin B', 0),
(LAST_INSERT_ID(), 'C', 'Vitamin C', 0),
(LAST_INSERT_ID(), 'D', 'Vitamin D', 1);

-- Question 15 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Difficult',
    'What is the most abundant gas in Earth''s atmosphere ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Oxygen', 0),
(LAST_INSERT_ID(), 'B', 'Nitrogen', 1),
(LAST_INSERT_ID(), 'C', 'Carbon Dioxide', 0),
(LAST_INSERT_ID(), 'D', 'Hydrogen', 0);

-- Question 16 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Easy',
    'Water boils at ____ °C at sea level.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', '90', 0),
(LAST_INSERT_ID(), 'B', '100', 1),
(LAST_INSERT_ID(), 'C', '110', 0),
(LAST_INSERT_ID(), 'D', '120', 0);

-- Question 17 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Easy',
    'Blood is pumped by the ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'liver', 0),
(LAST_INSERT_ID(), 'B', 'brain', 0),
(LAST_INSERT_ID(), 'C', 'heart', 1),
(LAST_INSERT_ID(), 'D', 'lung', 0);

-- Question 18 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Easy',
    'The Sun is a star primarily made up of ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'carbon', 0),
(LAST_INSERT_ID(), 'B', 'hydrogen', 1),
(LAST_INSERT_ID(), 'C', 'helium', 0),
(LAST_INSERT_ID(), 'D', 'nitrogen', 0);

-- Question 19 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Easy',
    'Humans have 206 ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'muscles', 0),
(LAST_INSERT_ID(), 'B', 'bones', 1),
(LAST_INSERT_ID(), 'C', 'nerves', 0),
(LAST_INSERT_ID(), 'D', 'organs', 0);

-- Question 20 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Easy',
    'The chemical symbol for oxygen is ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Ox', 0),
(LAST_INSERT_ID(), 'B', 'Og', 0),
(LAST_INSERT_ID(), 'C', 'O', 1),
(LAST_INSERT_ID(), 'D', 'Oz', 0);

-- Question 21 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Easy',
    'The Earth completes one rotation in ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', '12 hours', 0),
(LAST_INSERT_ID(), 'B', '24 hours', 1),
(LAST_INSERT_ID(), 'C', '48 hours', 0),
(LAST_INSERT_ID(), 'D', '7 days', 0);

-- Question 22 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Easy',
    'The gas responsible for the greenhouse effect is ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'methane', 0),
(LAST_INSERT_ID(), 'B', 'nitrogen', 0),
(LAST_INSERT_ID(), 'C', 'carbon dioxide', 1),
(LAST_INSERT_ID(), 'D', 'neon', 0);

-- Question 23 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Easy',
    'The primary natural satellite of Earth is ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Mars', 0),
(LAST_INSERT_ID(), 'B', 'Moon', 1),
(LAST_INSERT_ID(), 'C', 'Venus', 0),
(LAST_INSERT_ID(), 'D', 'Mercury', 0);

-- Question 24 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Difficult',
    'The neutral pH is equal to ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', '5', 0),
(LAST_INSERT_ID(), 'B', '6', 0),
(LAST_INSERT_ID(), 'C', '7', 1),
(LAST_INSERT_ID(), 'D', '8', 0);

-- Question 25 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Difficult',
    'The chemical formula of water is ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'H2O', 1),
(LAST_INSERT_ID(), 'B', 'HO2', 0),
(LAST_INSERT_ID(), 'C', 'OH', 0),
(LAST_INSERT_ID(), 'D', 'H2O2', 0);

-- Question 26 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Difficult',
    'The most massive planet in the Solar System is ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Saturn', 0),
(LAST_INSERT_ID(), 'B', 'Uranus', 0),
(LAST_INSERT_ID(), 'C', 'Jupiter', 1),
(LAST_INSERT_ID(), 'D', 'Neptune', 0);

-- Question 27 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Difficult',
    'The organ responsible for blood filtration in the human body is the ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'pancreas', 0),
(LAST_INSERT_ID(), 'B', 'liver', 0),
(LAST_INSERT_ID(), 'C', 'kidney', 1),
(LAST_INSERT_ID(), 'D', 'lung', 0);

-- Question 28 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Difficult',
    'Light travels at approximately ____ km/s in a vacuum.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', '150,000', 0),
(LAST_INSERT_ID(), 'B', '200,000', 0),
(LAST_INSERT_ID(), 'C', '300,000', 1),
(LAST_INSERT_ID(), 'D', '400,000', 0);

-- Question 29 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Difficult',
    'The unit of force is the ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'joule', 0),
(LAST_INSERT_ID(), 'B', 'newton', 1),
(LAST_INSERT_ID(), 'C', 'watt', 0),
(LAST_INSERT_ID(), 'D', 'volt', 0);

-- Question 30 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Science'),
    'Difficult',
    'The lightest element is ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'helium', 0),
(LAST_INSERT_ID(), 'B', 'lithium', 0),
(LAST_INSERT_ID(), 'C', 'hydrogen', 1),
(LAST_INSERT_ID(), 'D', 'boron', 0);