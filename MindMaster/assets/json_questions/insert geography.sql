use jeu;
-- Question 1
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Easy',
    'What is the largest ocean in the world ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Atlantic', 0),
(LAST_INSERT_ID(), 'B', 'Indian', 0),
(LAST_INSERT_ID(), 'C', 'Arctic', 0),
(LAST_INSERT_ID(), 'D', 'Pacific', 1);

-- Question 2
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Easy',
    'What is the capital of France ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Lyon', 0),
(LAST_INSERT_ID(), 'B', 'Marseille', 0),
(LAST_INSERT_ID(), 'C', 'Paris', 1),
(LAST_INSERT_ID(), 'D', 'Toulouse', 0);

-- Question 3
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Easy',
    'On which continent is the Sahara Desert located ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Asia', 0),
(LAST_INSERT_ID(), 'B', 'Africa', 1),
(LAST_INSERT_ID(), 'C', 'America', 0),
(LAST_INSERT_ID(), 'D', 'Australia', 0);

-- Question 4
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Easy',
    'How many continents are there on Earth ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', '5', 0),
(LAST_INSERT_ID(), 'B', '6', 0),
(LAST_INSERT_ID(), 'C', '7', 1),
(LAST_INSERT_ID(), 'D', '8', 0);

-- Question 5
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Easy',
    'The Nile River primarily flows through :'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Morocco', 0),
(LAST_INSERT_ID(), 'B', 'Nigeria', 0),
(LAST_INSERT_ID(), 'C', 'Egypt', 1),
(LAST_INSERT_ID(), 'D', 'South Africa', 0);

-- Question 6
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Easy',
    'Mount Everest is located in :'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'The Alps', 0),
(LAST_INSERT_ID(), 'B', 'The Himalayas', 1),
(LAST_INSERT_ID(), 'C', 'The Rockies', 0),
(LAST_INSERT_ID(), 'D', 'The Andes', 0);

-- Question 7
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Easy',
    'What is the capital of Canada ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Toronto', 0),
(LAST_INSERT_ID(), 'B', 'Vancouver', 0),
(LAST_INSERT_ID(), 'C', 'Ottawa', 1),
(LAST_INSERT_ID(), 'D', 'Montreal', 0);

-- Question 8
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Easy',
    'What is the largest island in the world ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Madagascar', 0),
(LAST_INSERT_ID(), 'B', 'Australia', 0),
(LAST_INSERT_ID(), 'C', 'Greenland', 1),
(LAST_INSERT_ID(), 'D', 'Iceland', 0);

-- Question 9 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Difficult',
    'Which country shares the longest land border with the United States ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Mexico', 0),
(LAST_INSERT_ID(), 'B', 'Canada', 1),
(LAST_INSERT_ID(), 'C', 'Russia', 0),
(LAST_INSERT_ID(), 'D', 'Brazil', 0);

-- Question 10 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Difficult',
    'The Strait of Gibraltar connects the Mediterranean Sea to :'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'The Indian Ocean', 0),
(LAST_INSERT_ID(), 'B', 'The Black Sea', 0),
(LAST_INSERT_ID(), 'C', 'The Atlantic Ocean', 1),
(LAST_INSERT_ID(), 'D', 'The Red Sea', 0);

-- Question 11 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Difficult',
    'Lake Titicaca is shared between :'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Chile and Argentina', 0),
(LAST_INSERT_ID(), 'B', 'Bolivia and Peru', 1),
(LAST_INSERT_ID(), 'C', 'Colombia and Venezuela', 0),
(LAST_INSERT_ID(), 'D', 'Ecuador and Peru', 0);

-- Question 12 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Difficult',
    'Which country has the largest land area in the world ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'China', 0),
(LAST_INSERT_ID(), 'B', 'United States', 0),
(LAST_INSERT_ID(), 'C', 'Canada', 0),
(LAST_INSERT_ID(), 'D', 'Russia', 1);

-- Question 13 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Difficult',
    'The Amazon River flows into :'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'The Caribbean Sea', 0),
(LAST_INSERT_ID(), 'B', 'The Indian Ocean', 0),
(LAST_INSERT_ID(), 'C', 'The Atlantic Ocean', 1),
(LAST_INSERT_ID(), 'D', 'The Pacific Ocean', 0);

-- Question 14 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Difficult',
    'Indonesia is an archipelago located between :'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'The Indian Ocean and the Pacific Ocean', 1),
(LAST_INSERT_ID(), 'B', 'The Red Sea and the Mediterranean Sea', 0),
(LAST_INSERT_ID(), 'C', 'The Atlantic Ocean and the North Sea', 0),
(LAST_INSERT_ID(), 'D', 'The Caspian Sea and the Arctic Ocean', 0);

-- Question 15 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Difficult',
    'Mount Kilimanjaro is located in :'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Ethiopia', 0),
(LAST_INSERT_ID(), 'B', 'Uganda', 0),
(LAST_INSERT_ID(), 'C', 'Tanzania', 1),
(LAST_INSERT_ID(), 'D', 'Kenya', 0);

-- Question 16 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Easy',
    'The capital of Spain is ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Barcelona', 0),
(LAST_INSERT_ID(), 'B', 'Seville', 0),
(LAST_INSERT_ID(), 'C', 'Madrid', 1),
(LAST_INSERT_ID(), 'D', 'Valencia', 0);

-- Question 17 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Easy',
    'The river that flows through Paris is ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'The Rhine', 0),
(LAST_INSERT_ID(), 'B', 'The Garonne', 0),
(LAST_INSERT_ID(), 'C', 'The Seine', 1),
(LAST_INSERT_ID(), 'D', 'The Loire', 0);

-- Question 18 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Easy',
    'The continent located south of Europe is ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Asia', 0),
(LAST_INSERT_ID(), 'B', 'Africa', 1),
(LAST_INSERT_ID(), 'C', 'America', 0),
(LAST_INSERT_ID(), 'D', 'Oceania', 0);

-- Question 19 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Easy',
    'The country shaped like a boot is ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Greece', 0),
(LAST_INSERT_ID(), 'B', 'Italy', 1),
(LAST_INSERT_ID(), 'C', 'Spain', 0),
(LAST_INSERT_ID(), 'D', 'Portugal', 0);

-- Question 20 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Easy',
    'The largest hot desert in the world is the ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Gobi', 0),
(LAST_INSERT_ID(), 'B', 'Atacama', 0),
(LAST_INSERT_ID(), 'C', 'Sahara', 1),
(LAST_INSERT_ID(), 'D', 'Kalahari', 0);

-- Question 21 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Easy',
    'Brazil is located on the ____ continent.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'North American', 0),
(LAST_INSERT_ID(), 'B', 'South American', 1),
(LAST_INSERT_ID(), 'C', 'African', 0),
(LAST_INSERT_ID(), 'D', 'Asian', 0);

-- Question 22 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Easy',
    'Tokyo is the capital of ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Vietnam', 0),
(LAST_INSERT_ID(), 'B', 'Japan', 1),
(LAST_INSERT_ID(), 'C', 'South Korea', 0),
(LAST_INSERT_ID(), 'D', 'Thailand', 0);

-- Question 23 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Easy',
    'The North Pole is located in the ____ Ocean.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Atlantic', 0),
(LAST_INSERT_ID(), 'B', 'Indian', 0),
(LAST_INSERT_ID(), 'C', 'Arctic', 1),
(LAST_INSERT_ID(), 'D', 'Pacific', 0);

-- Question 24 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Difficult',
    'The longest river in Asia is the ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Mekong', 0),
(LAST_INSERT_ID(), 'B', 'Yangtze', 1),
(LAST_INSERT_ID(), 'C', 'Ganges', 0),
(LAST_INSERT_ID(), 'D', 'Amur', 0);

-- Question 25 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Difficult',
    'The equatorial climate is primarily ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Dry', 0),
(LAST_INSERT_ID(), 'B', 'Cold', 0),
(LAST_INSERT_ID(), 'C', 'Hot and humid', 1),
(LAST_INSERT_ID(), 'D', 'Temperate', 0);

-- Question 26 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Difficult',
    'Australia is bordered to the east by the ____ Ocean.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Atlantic', 0),
(LAST_INSERT_ID(), 'B', 'Indian', 0),
(LAST_INSERT_ID(), 'C', 'Arctic', 0),
(LAST_INSERT_ID(), 'D', 'Pacific', 1);

-- Question 27 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Difficult',
    'The country landlocked between India and China is ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Nepal', 1),
(LAST_INSERT_ID(), 'B', 'Bhutan', 0),
(LAST_INSERT_ID(), 'C', 'Laos', 0),
(LAST_INSERT_ID(), 'D', 'Bangladesh', 0);

-- Question 28 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Difficult',
    'The capital of New Zealand is ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Auckland', 0),
(LAST_INSERT_ID(), 'B', 'Wellington', 1),
(LAST_INSERT_ID(), 'C', 'Christchurch', 0),
(LAST_INSERT_ID(), 'D', 'Hamilton', 0);

-- Question 29 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Difficult',
    'The mountain range that runs through South America is the ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Sierra Madre', 0),
(LAST_INSERT_ID(), 'B', 'Andes', 1),
(LAST_INSERT_ID(), 'C', 'Appalachians', 0),
(LAST_INSERT_ID(), 'D', 'Cordillera Blanca', 0);

-- Question 30 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Geography'),
    'Difficult',
    'The sea located between Arabia and Africa is the ____ Sea.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Red', 1),
(LAST_INSERT_ID(), 'B', 'Mediterranean', 0),
(LAST_INSERT_ID(), 'C', 'Caspian', 0),
(LAST_INSERT_ID(), 'D', 'Black', 0);

