use jeu;

-- Question 1
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Easy',
    'What is the force that pulls objects toward Earth ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Magnetism', 0),
(LAST_INSERT_ID(), 'B', 'Gravity', 1),
(LAST_INSERT_ID(), 'C', 'Electricity', 0),
(LAST_INSERT_ID(), 'D', 'Friction', 0);

-- Question 2
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Easy',
    'What tool is used to measure temperature ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Thermometer', 1),
(LAST_INSERT_ID(), 'B', 'Barometer', 0),
(LAST_INSERT_ID(), 'C', 'Scale', 0),
(LAST_INSERT_ID(), 'D', 'Stopwatch', 0);

-- Question 3
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Easy',
    'Which state of matter has a definite shape and volume ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Gas', 0),
(LAST_INSERT_ID(), 'B', 'Liquid', 0),
(LAST_INSERT_ID(), 'C', 'Solid', 1),
(LAST_INSERT_ID(), 'D', 'Plasma', 0);

-- Question 4
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Easy',
    'What type of energy is stored in a battery ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Kinetic', 0),
(LAST_INSERT_ID(), 'B', 'Electrical', 0),
(LAST_INSERT_ID(), 'C', 'Chemical', 1),
(LAST_INSERT_ID(), 'D', 'Nuclear', 0);

-- Question 5
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Easy',
    'What happens to an object when it is heated ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'It shrinks', 0),
(LAST_INSERT_ID(), 'B', 'It expands', 1),
(LAST_INSERT_ID(), 'C', 'It disappears', 0),
(LAST_INSERT_ID(), 'D', 'It freezes', 0);

-- Question 6
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Easy',
    'What kind of lens is used in a magnifying glass ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Concave', 0),
(LAST_INSERT_ID(), 'B', 'Convex', 1),
(LAST_INSERT_ID(), 'C', 'Flat', 0),
(LAST_INSERT_ID(), 'D', 'Cylindrical', 0);

-- Question 7
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Easy',
    'What is the SI unit of force ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Pascal', 0),
(LAST_INSERT_ID(), 'B', 'Watt', 0),
(LAST_INSERT_ID(), 'C', 'Newton', 1),
(LAST_INSERT_ID(), 'D', 'Joule', 0);

-- Question 8
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Easy',
    'What phenomenon causes a straw to look bent in water ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Reflection', 0),
(LAST_INSERT_ID(), 'B', 'Absorption', 0),
(LAST_INSERT_ID(), 'C', 'Refraction', 1),
(LAST_INSERT_ID(), 'D', 'Diffraction', 0);

-- Question 9 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Difficult',
    'What law explains why we need seatbelts in a car crash ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Newton’s First Law', 1),
(LAST_INSERT_ID(), 'B', 'Archimedes’ Principle', 0),
(LAST_INSERT_ID(), 'C', 'Ohm’s Law', 0),
(LAST_INSERT_ID(), 'D', 'Hooke’s Law', 0);

-- Question 10 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Difficult',
    'What is the speed of light in a vacuum (approx) ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', '150,000 km/s', 0),
(LAST_INSERT_ID(), 'B', '300,000 km/s', 1),
(LAST_INSERT_ID(), 'C', '1,000,000 km/s', 0),
(LAST_INSERT_ID(), 'D', '500,000 km/s', 0);

-- Question 11 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Difficult',
    'What is the unit of electrical resistance ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Volt', 0),
(LAST_INSERT_ID(), 'B', 'Ampere', 0),
(LAST_INSERT_ID(), 'C', 'Ohm', 1),
(LAST_INSERT_ID(), 'D', 'Watt', 0);

-- Question 12 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Difficult',
    'Which particle has a negative electric charge ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Proton', 0),
(LAST_INSERT_ID(), 'B', 'Neutron', 0),
(LAST_INSERT_ID(), 'C', 'Electron', 1),
(LAST_INSERT_ID(), 'D', 'Positron', 0);

-- Question 13 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Difficult',
    'What is the energy of motion called ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Potential energy', 0),
(LAST_INSERT_ID(), 'B', 'Thermal energy', 0),
(LAST_INSERT_ID(), 'C', 'Kinetic energy', 1),
(LAST_INSERT_ID(), 'D', 'Mechanical energy', 0);

-- Question 14 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Difficult',
    'Which law states that current is directly proportional to voltage ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Coulomb’s Law', 0),
(LAST_INSERT_ID(), 'B', 'Newton’s Law', 0),
(LAST_INSERT_ID(), 'C', 'Ohm’s Law', 1),
(LAST_INSERT_ID(), 'D', 'Faraday’s Law', 0);
-- Question 15 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Difficult',
    'What kind of wave does not need a medium to travel ?'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Sound wave', 0),
(LAST_INSERT_ID(), 'B', 'Water wave', 0),
(LAST_INSERT_ID(), 'C', 'Electromagnetic wave', 1),
(LAST_INSERT_ID(), 'D', 'Seismic wave', 0);

-- Question 16 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Easy',
    'The force that resists motion between two surfaces is called ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Gravity', 0),
(LAST_INSERT_ID(), 'B', 'Friction', 1),
(LAST_INSERT_ID(), 'C', 'Tension', 0),
(LAST_INSERT_ID(), 'D', 'Acceleration', 0);

-- Question 17 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Easy',
    'Electricity flows through a ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Magnet', 0),
(LAST_INSERT_ID(), 'B', 'Conductor', 1),
(LAST_INSERT_ID(), 'C', 'Plastic', 0),
(LAST_INSERT_ID(), 'D', 'Glass', 0);

-- Question 18 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Easy',
    'Heat travels from a ____ object to a ____ object.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Cold, hot', 0),
(LAST_INSERT_ID(), 'B', 'Hot, cold', 1),
(LAST_INSERT_ID(), 'C', 'Warm, hot', 0),
(LAST_INSERT_ID(), 'D', 'Small, large', 0);

-- Question 19 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Easy',
    'The unit used to measure power is ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Newton', 0),
(LAST_INSERT_ID(), 'B', 'Joule', 0),
(LAST_INSERT_ID(), 'C', 'Watt', 1),
(LAST_INSERT_ID(), 'D', 'Volt', 0);

-- Question 20 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Easy',
    'The bouncing of light from a surface is called ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Refraction', 0),
(LAST_INSERT_ID(), 'B', 'Absorption', 0),
(LAST_INSERT_ID(), 'C', 'Reflection', 1),
(LAST_INSERT_ID(), 'D', 'Radiation', 0);

-- Question 21 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Easy',
    'A force causes an object to ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Sleep', 0),
(LAST_INSERT_ID(), 'B', 'Change motion', 1),
(LAST_INSERT_ID(), 'C', 'Stay at rest', 0),
(LAST_INSERT_ID(), 'D', 'Melt', 0);

-- Question 22 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Easy',
    'Energy stored in a stretched rubber band is called ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Kinetic', 0),
(LAST_INSERT_ID(), 'B', 'Elastic potential', 1),
(LAST_INSERT_ID(), 'C', 'Gravitational', 0),
(LAST_INSERT_ID(), 'D', 'Thermal', 0);

-- Question 23 (Easy)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Easy',
    'A circuit that has one path for current to flow is called a ____ circuit.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Parallel', 0),
(LAST_INSERT_ID(), 'B', 'Open', 0),
(LAST_INSERT_ID(), 'C', 'Closed', 0),
(LAST_INSERT_ID(), 'D', 'Series', 1);

-- Question 24 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Difficult',
    'Newton''s third law states that every action has ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'A cause', 0),
(LAST_INSERT_ID(), 'B', 'An equal and opposite reaction', 1),
(LAST_INSERT_ID(), 'C', 'A result', 0),
(LAST_INSERT_ID(), 'D', 'A force', 0);

-- Question 25 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Difficult',
    'The ability to do work is called ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Energy', 1),
(LAST_INSERT_ID(), 'B', 'Power', 0),
(LAST_INSERT_ID(), 'C', 'Mass', 0),
(LAST_INSERT_ID(), 'D', 'Force', 0);

-- Question 26 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Difficult',
    'The measure of an object’s inertia is its ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Volume', 0),
(LAST_INSERT_ID(), 'B', 'Weight', 0),
(LAST_INSERT_ID(), 'C', 'Mass', 1),
(LAST_INSERT_ID(), 'D', 'Density', 0);

-- Question 27 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Difficult',
    'The frequency of a wave is measured in ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Watts', 0),
(LAST_INSERT_ID(), 'B', 'Hertz', 1),
(LAST_INSERT_ID(), 'C', 'Amperes', 0),
(LAST_INSERT_ID(), 'D', 'Newtons', 0);

-- Question 28 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Difficult',
    'The relationship V = IR is known as ____.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Ohm’s Law', 1),
(LAST_INSERT_ID(), 'B', 'Hooke’s Law', 0),
(LAST_INSERT_ID(), 'C', 'Boyle’s Law', 0),
(LAST_INSERT_ID(), 'D', 'Newton’s Law', 0);

-- Question 29 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Difficult',
    'An object floats in a fluid if its density is ____ the fluid.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Greater than', 0),
(LAST_INSERT_ID(), 'B', 'Equal to', 0),
(LAST_INSERT_ID(), 'C', 'Less than', 1),
(LAST_INSERT_ID(), 'D', 'Zero compared to', 0);

-- Question 30 (Difficult)
INSERT INTO questions (theme_id, difficulty, question_text)
VALUES (
    (SELECT id FROM themes WHERE name = 'Physics'),
    'Difficult',
    'A transformer changes the ____ of electricity.'
);
INSERT INTO choices (question_id, choice_letter, choice_text, is_correct) VALUES
(LAST_INSERT_ID(), 'A', 'Type', 0),
(LAST_INSERT_ID(), 'B', 'Voltage', 1),
(LAST_INSERT_ID(), 'C', 'Resistance', 0),
(LAST_INSERT_ID(), 'D', 'Shape', 0);

