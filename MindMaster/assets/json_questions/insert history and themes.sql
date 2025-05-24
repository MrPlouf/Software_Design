use jeu;
INSERT IGNORE INTO themes (name) VALUES
('History'),
('Science'),
('Physics'),
('Geography'),
('Mathematics'),
('English');

INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'), 
    'Easy', 
    'Who was the first President of the United States ?' 
);

INSERT INTO choices (question_id, choice_letter, choice_text, is_correct)
VALUES
    (LAST_INSERT_ID(), 'A', 'Abraham Lincoln', FALSE),
    (LAST_INSERT_ID(), 'B', 'George Washington', TRUE), -- Réponse correcte
    (LAST_INSERT_ID(), 'C', 'Thomas Jefferson', FALSE),
    (LAST_INSERT_ID(), 'D', 'John Adams', FALSE);
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Easy',
    'In which year did World War II end ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', '1940', 0),
(LAST_INSERT_ID(), 'B', '1945', 1),
(LAST_INSERT_ID(), 'C', '1950', 0),
(LAST_INSERT_ID(), 'D', '1939', 0);

-- Question 3
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Easy',
    'Which ancient civilization built the pyramids ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Romans', 0),
(LAST_INSERT_ID(), 'B', 'Greeks', 0),
(LAST_INSERT_ID(), 'C', 'Egyptians', 1),
(LAST_INSERT_ID(), 'D', 'Mayans', 0);

-- Question 4
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Easy',
    'Who discovered America in 1492 ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Ferdinand Magellan', 0),
(LAST_INSERT_ID(), 'B', 'Vasco da Gama', 0),
(LAST_INSERT_ID(), 'C', 'Marco Polo', 0),
(LAST_INSERT_ID(), 'D', 'Christopher Columbus', 1);

-- Question 5
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Easy',
    'What was the name of the ship on which the Pilgrims traveled to America ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Titanic', 0),
(LAST_INSERT_ID(), 'B', 'Santa Maria', 0),
(LAST_INSERT_ID(), 'C', 'Mayflower', 1),
(LAST_INSERT_ID(), 'D', 'Endeavour', 0);

-- Question 6
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Easy',
    'Who was the British Prime Minister during most of World War II ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Neville Chamberlain', 0),
(LAST_INSERT_ID(), 'B', 'Winston Churchill', 1),
(LAST_INSERT_ID(), 'C', 'Margaret Thatcher', 0),
(LAST_INSERT_ID(), 'D', 'Tony Blair', 0);

-- Question 7
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Easy',
    'Which empire was ruled by Julius Caesar ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Roman Empire', 1),
(LAST_INSERT_ID(), 'B', 'Greek Empire', 0),
(LAST_INSERT_ID(), 'C', 'Ottoman Empire', 0),
(LAST_INSERT_ID(), 'D', 'Persian Empire', 0);

-- Question 8
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Easy',
    'What wall divided East and West Berlin during the Cold War ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Great Wall', 0),
(LAST_INSERT_ID(), 'B', 'Berlin Wall', 1),
(LAST_INSERT_ID(), 'C', 'Iron Curtain', 0),
(LAST_INSERT_ID(), 'D', 'Wall of China', 0);

-- Question 9
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Difficult',
    'Who was the leader of the Soviet Union during the Cuban Missile Crisis ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Joseph Stalin', 0),
(LAST_INSERT_ID(), 'B', 'Leonid Brezhnev', 0),
(LAST_INSERT_ID(), 'C', 'Nikita Khrushchev', 1),
(LAST_INSERT_ID(), 'D', 'Mikhail Gorbachev', 0);

-- Question 10
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Difficult',
    'The Magna Carta was signed in which year ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', '1215', 1),
(LAST_INSERT_ID(), 'B', '1066', 0),
(LAST_INSERT_ID(), 'C', '1492', 0),
(LAST_INSERT_ID(), 'D', '1776', 0);

-- Question 11
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Difficult',
    'Which battle is considered the turning point of the American Civil War ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Battle of Antietam', 0),
(LAST_INSERT_ID(), 'B', 'Battle of Gettysburg', 1),
(LAST_INSERT_ID(), 'C', 'Battle of Bull Run', 0),
(LAST_INSERT_ID(), 'D', 'Battle of Yorktown', 0);
-- Question 12
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Difficult',
    'Who was the first emperor of the Roman Empire ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Julius Caesar', 0),
(LAST_INSERT_ID(), 'B', 'Nero', 0),
(LAST_INSERT_ID(), 'C', 'Augustus', 1),
(LAST_INSERT_ID(), 'D', 'Caligula', 0);

-- Question 13
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Difficult',
    'The Treaty of Versailles ended which war ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'World War I', 1),
(LAST_INSERT_ID(), 'B', 'World War II', 0),
(LAST_INSERT_ID(), 'C', 'Napoleonic Wars', 0),
(LAST_INSERT_ID(), 'D', 'Crimean War', 0);

-- Question 14
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Difficult',
    'Which civilization is known for developing cuneiform writing ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Egyptians', 0),
(LAST_INSERT_ID(), 'B', 'Chinese', 0),
(LAST_INSERT_ID(), 'C', 'Greeks', 0),
(LAST_INSERT_ID(), 'D', 'Sumerians', 1);

-- Question 15
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Difficult',
    'Who was the French military leader who became emperor in 1804 ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Louis XIV', 0),
(LAST_INSERT_ID(), 'B', 'Napoleon Bonaparte', 1),
(LAST_INSERT_ID(), 'C', 'Charles de Gaulle', 0),
(LAST_INSERT_ID(), 'D', 'Robespierre', 0);

-- Question 16
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Easy',
    'The Great Fire of London occurred in ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', '1666', 1),
(LAST_INSERT_ID(), 'B', '1776', 0),
(LAST_INSERT_ID(), 'C', '1066', 0),
(LAST_INSERT_ID(), 'D', '1914', 0);

-- Question 17
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Easy',
    'The Declaration of Independence was signed in ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', '1776', 1),
(LAST_INSERT_ID(), 'B', '1789', 0),
(LAST_INSERT_ID(), 'C', '1492', 0),
(LAST_INSERT_ID(), 'D', '1812', 0);

-- Question 18
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Easy',
    'The Renaissance began in ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'France', 0),
(LAST_INSERT_ID(), 'B', 'Italy', 1),
(LAST_INSERT_ID(), 'C', 'Germany', 0),
(LAST_INSERT_ID(), 'D', 'England', 0);

-- Question 19
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Easy',
    'The first man to walk on the moon was ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Buzz Aldrin', 0),
(LAST_INSERT_ID(), 'B', 'Yuri Gagarin', 0),
(LAST_INSERT_ID(), 'C', 'Neil Armstrong', 1),
(LAST_INSERT_ID(), 'D', 'Michael Collins', 0);

-- Question 20
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Easy',
    'The Cold War was primarily between the USA and ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'China', 0),
(LAST_INSERT_ID(), 'B', 'Germany', 0),
(LAST_INSERT_ID(), 'C', 'Soviet Union', 1),
(LAST_INSERT_ID(), 'D', 'Japan', 0);
-- Question 21
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Easy',
    'The Berlin Wall fell in ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', '1989', 1),
(LAST_INSERT_ID(), 'B', '1991', 0),
(LAST_INSERT_ID(), 'C', '1975', 0),
(LAST_INSERT_ID(), 'D', '1961', 0);

-- Question 22
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Easy',
    'The Black Death occurred in the ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', '14th century', 1),
(LAST_INSERT_ID(), 'B', '16th century', 0),
(LAST_INSERT_ID(), 'C', '12th century', 0),
(LAST_INSERT_ID(), 'D', '18th century', 0);

-- Question 23
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Easy',
    'The Industrial Revolution began in ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'France', 0),
(LAST_INSERT_ID(), 'B', 'Germany', 0),
(LAST_INSERT_ID(), 'C', 'England', 1),
(LAST_INSERT_ID(), 'D', 'USA', 0);

-- Question 24
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Difficult',
    'The Battle of Hastings took place in ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', '1066', 1),
(LAST_INSERT_ID(), 'B', '1215', 0),
(LAST_INSERT_ID(), 'C', '1415', 0),
(LAST_INSERT_ID(), 'D', '1588', 0);

-- Question 25
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Difficult',
    'The Bolshevik Revolution occurred in ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', '1917', 1),
(LAST_INSERT_ID(), 'B', '1905', 0),
(LAST_INSERT_ID(), 'C', '1923', 0),
(LAST_INSERT_ID(), 'D', '1939', 0);

-- Question 26
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Difficult',
    'The Thirty Years'' War ended with the Treaty of ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Versailles', 0),
(LAST_INSERT_ID(), 'B', 'Westphalia', 1),
(LAST_INSERT_ID(), 'C', 'Tordesillas', 0),
(LAST_INSERT_ID(), 'D', 'Utrecht', 0);

-- Question 27
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Difficult',
    'The ancient city of Carthage was located in present-day ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Egypt', 0),
(LAST_INSERT_ID(), 'B', 'Tunisia', 1),
(LAST_INSERT_ID(), 'C', 'Libya', 0),
(LAST_INSERT_ID(), 'D', 'Morocco', 0);

-- Question 28
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Difficult',
    'The Code of Hammurabi is associated with which civilization ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Babylonian', 1),
(LAST_INSERT_ID(), 'B', 'Egyptian', 0),
(LAST_INSERT_ID(), 'C', 'Greek', 0),
(LAST_INSERT_ID(), 'D', 'Roman', 0);

-- Question 29
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Difficult',
    'The Opium Wars were between China and ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'France', 0),
(LAST_INSERT_ID(), 'B', 'Britain', 1),
(LAST_INSERT_ID(), 'C', 'USA', 0),
(LAST_INSERT_ID(), 'D', 'Germany', 0);

-- Question 30
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'History'),
    'Difficult',
    'The Treaty of Tordesillas divided the New World between Spain and ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'France', 0),
(LAST_INSERT_ID(), 'B', 'Netherlands', 0),
(LAST_INSERT_ID(), 'C', 'England', 0),
(LAST_INSERT_ID(), 'D', 'Portugal', 1);