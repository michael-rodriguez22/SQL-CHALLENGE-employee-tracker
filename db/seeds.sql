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


INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUES 
("Alex", "Afferson", null, 1),
("Penelope", "Bailey", 1, 2),
("Drew", "Tucker", 2, 3),
("Kaicey", "Micho", 1, 4),
("Maximo", "Santanna", 4, 5),
("Haley", "Fulton", 5, 6),
("Jordan", "Masters", 1, 7),
("Maggie", "June", 7, 8),
("Juan", "Pablo", 8, 9),
("Dominique", "Lousteau", 1, 10),
("Sammi", "Rogers", 1, 11),
("Sophia", "Thomason", 1, 12),
("Broland", "Hernandez", 12, 13);