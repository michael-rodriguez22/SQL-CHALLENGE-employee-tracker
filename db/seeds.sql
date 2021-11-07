INSERT INTO departments (name)
VALUES 
("Administration"),
("Music"),
("Visual");

INSERT INTO roles (title, salary, department_id)
VALUES 
("CEO", 125000, 1),
("Tour Director", 70000, 1),
("Administrative Intern", 100, 1),
("Brass Arranger", 65000, 2),
("Brass Caption Head", 45000, 2),
("Brass Tech", 4000, 2),
("Percussion Arranger", 65000, 2),
("Percussion Caption Head", 45000, 2),
("Percussion Tech", 4000, 2),
("Drill Writer", 50000, 3),
("Set/Costume Designer", 50000, 3),
("Coreographer", 50000, 3),
("Visual Tech", 2000, 3);


INSERT INTO employees (first_name, last_name, role_id, manager_id, is_manager)
VALUES 
("Alex", "Afferson", 1, null, 1),
("Bailey", "Farias", 2, 1, 1),
("Drew", "Tucker", 3, 2, 0),
("Kaicey", "Micho", 4, 1, 1),
("Maximo", "Santanna", 5, 4, 1),
("Haley", "Fulton", 6, 5, 0),
("Jordan", "Masters", 7, 1, 1),
("Maggie", "June", 8, 7, 1),
("Juan", "Pablo", 9, 8, 0),
("Dominique", "Lousteau", 10, 1, 0),
("Sammi", "Rogers", 11, 1, 0),
("Sophia", "Thomason", 12, 1, 1),
("Broland", "Hernandez", 13, 12, 0);