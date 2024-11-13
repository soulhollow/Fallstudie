-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 13. Nov 2024 um 13:30
-- Server-Version: 10.4.32-MariaDB
-- PHP-Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `budget_management`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `budget`
--

CREATE TABLE `budget` (
  `id` bigint(20) NOT NULL,
  `approved` bit(1) DEFAULT NULL,
  `boolean_forecast` bit(1) DEFAULT NULL,
  `budget_betrag` double NOT NULL,
  `ende` datetime DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `start` datetime DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `ersteller_id` bigint(20) DEFAULT NULL,
  `manager_id` bigint(20) DEFAULT NULL,
  `owner_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `budget`
--

INSERT INTO `budget` (`id`, `approved`, `boolean_forecast`, `budget_betrag`, `ende`, `name`, `start`, `timestamp`, `ersteller_id`, `manager_id`, `owner_id`) VALUES
(1, b'1', b'0', 50000, '2024-12-31 23:59:59', 'Marketing Budget', '2024-01-01 00:00:00', '2024-10-01 15:00:27', 19, 18, 20),
(2, b'1', b'1', 75000, '2024-12-31 23:59:59', 'IT Budget', '2024-01-01 00:00:00', '2024-02-01 14:30:00', 11, 5, 20),
(3, b'1', b'1', 20000, NULL, 'Security Budget', '2024-02-01 14:30:00', '2024-02-01 14:30:00', 12, 15, 20),
(4, b'1', b'0', 999, NULL, 'Weihnachts Budget', '2024-02-01 14:30:00', '2024-02-01 14:30:00', 12, 15, 13),
(5, b'0', b'0', 200000, NULL, 'Fuhrpark', NULL, '2024-01-10 15:00:27', 19, 18, 20),
(6, b'1', b'0', 50000, NULL, 'HR Budget', NULL, '2024-01-10 15:00:27', 12, 15, 13),
(7, b'0', b'1', 13000, NULL, 'Laptop', NULL, '2024-01-10 15:00:27', 19, 18, 20),
(8, b'0', b'0', 1000, NULL, 'Geschenke', NULL, '2024-01-10 15:00:27', 17, 15, 13),
(9, b'1', b'0', 1000, NULL, 'Spesen', NULL, '2024-10-17 16:19:10', 16, 18, 13),
(10, b'1', b'1', 100000, NULL, 'Erfolgs Budget', NULL, '2024-10-17 16:19:50', 12, 18, 20),
(11, b'0', b'1', 1000, NULL, 'Sales Budget', NULL, '2024-10-17 17:19:56', 19, 18, 20),
(12, b'0', b'0', 1000, NULL, 'Post', NULL, '2024-11-08 09:53:12', 17, 15, 20);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ist`
--

CREATE TABLE `ist` (
  `id` bigint(20) NOT NULL,
  `betrag` double DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `budget_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `ist_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `ist`
--

INSERT INTO `ist` (`id`, `betrag`, `name`, `timestamp`, `budget_id`, `user_id`, `ist_id`) VALUES
(10, 5, 'Soll 8', '2024-10-17 21:52:27', 2, 5, NULL),
(11, 23456, 'Soll 2', '2024-11-03 15:43:32', 2, 5, NULL),
(12, 300, 'Lizens', '2024-10-02 16:18:15', 1, 20, NULL),
(13, 3000, 'Messe', '2024-10-16 16:18:31', 1, 20, NULL),
(14, 200, 'Follower kaufen', '2024-10-18 16:18:46', 1, 20, NULL),
(15, 22000, 'TV Werbung', '2024-10-22 16:19:10', 1, 20, NULL),
(16, 10000, 'Umfragen', '2024-10-17 16:19:36', 1, 20, NULL),
(17, 1300, 'Werbegeschenke', '2024-10-01 16:19:52', 1, 20, NULL),
(18, 8000, 'Sponsering', '2024-10-13 16:20:06', 1, 20, NULL),
(19, 4500, 'Radio Werbung', '2024-10-25 16:20:24', 1, 20, NULL),
(20, 3200, 'Instargram Werbung', '2024-10-12 16:20:51', 1, 20, NULL),
(21, 200, 'Reperatur', '2024-10-10 16:21:15', 1, 20, NULL),
(22, 1000, 'TV Werbung', '2024-11-08 09:50:43', 1, 20, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `role`
--

CREATE TABLE `role` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'Admin'),
(4, 'Finance'),
(2, 'Manager'),
(3, 'Owner');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `soll`
--

CREATE TABLE `soll` (
  `id` bigint(20) NOT NULL,
  `betrag` double DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `budget_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `soll_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `soll`
--

INSERT INTO `soll` (`id`, `betrag`, `name`, `timestamp`, `budget_id`, `user_id`, `soll_id`) VALUES
(5, 400, 'Lizens', '2024-10-01 15:29:30', 1, 5, 1),
(6, 2300, 'Messe', '2024-10-01 15:29:30', 1, 5, 1),
(7, 1000, 'Reperatur', '2024-10-01 15:29:30', 1, 5, 1),
(8, 100, 'Follower kaufen', '2024-10-01 15:29:30', 1, 5, 1),
(9, 25000, 'TV Werbung', '2024-10-01 15:29:30', 1, 5, 1),
(10, 5000, 'Instargram Werbung', '2024-10-01 15:29:30', 1, 5, 1),
(11, 800, 'Werbegeschenke', '2024-10-01 15:29:30', 1, 5, 1),
(12, 3000, 'Umfragen', '2024-10-01 15:29:30', 1, 5, 1),
(13, 4500, 'Radio Werbung', '2024-10-01 15:29:30', 1, 5, 1),
(14, 200, 'Soll 0', '2024-10-06 15:29:30', 2, 5, NULL),
(15, 12, 'Soll 1', '2024-10-06 15:29:30', 2, 5, NULL),
(16, 12, 'Soll 2', '2024-10-06 15:29:30', 2, 5, NULL),
(17, 12, 'Soll 3', '2024-10-06 15:29:30', 2, 5, NULL),
(18, 12, 'Soll 4', '2024-10-06 15:29:30', 2, 5, NULL),
(19, 12, 'Soll 5', '2024-10-06 15:29:30', 2, 5, NULL),
(20, 12, 'Soll 6', '2024-10-06 15:29:30', 2, 5, NULL),
(21, 12, 'Soll 7', '2024-10-06 15:29:30', 2, 5, NULL),
(22, 31, 'Soll 8', '2024-10-06 15:29:30', 2, 5, NULL),
(23, 12, 'Soll 9', '2024-10-06 15:29:30', 2, 5, NULL),
(24, 8000, 'Sponsering', '2024-10-07 12:00:00', 1, 5, NULL),
(25, 100, 'Termin', '2024-10-17 20:07:09', 6, 5, NULL),
(26, 100, 'Termin', '2024-10-17 20:07:18', 6, 5, NULL),
(27, 100, 'Test3', '2024-10-17 20:22:21', 6, 5, NULL),
(28, 60, 'Handy vertrag', '2024-10-17 20:46:09', 4, 5, NULL),
(29, 100, 'Geschenk', '2024-10-22 12:41:57', 11, 5, NULL),
(30, 2000, 'test2', '2024-10-22 12:42:31', 10, 5, NULL),
(31, 60, 'oifoeifoije', '2024-11-03 15:49:15', 4, 5, NULL),
(32, 400, 'Büro PC', '2024-11-07 16:37:48', 7, 20, NULL),
(33, 40, 'Headset', '2024-11-07 16:38:07', 7, 20, NULL),
(34, 500, 'Laptop', '2024-11-07 16:38:26', 7, 20, NULL),
(35, 30, 'Webcam', '2024-11-07 16:38:38', 7, 20, NULL),
(36, 20, 'Maus', '2024-11-07 16:38:46', 7, 20, NULL),
(37, 187, 'viel Erfolg', '2024-11-07 16:39:21', 10, 20, NULL),
(38, 123, 'wenig erfolg', '2024-11-07 16:39:27', 10, 20, NULL),
(39, 1234, 'komischer erfolg', '2024-11-07 16:39:35', 10, 20, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nachname` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `vorname` varchar(255) DEFAULT NULL,
  `role_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`id`, `email`, `nachname`, `password`, `vorname`, `role_id`) VALUES
(5, 'admin@admin.de', 'admin', '$2a$10$RjwfvclN5Xygqw9Tabujhe8TOV8O0MVFE0MkXweDbNJnzDsF/THR.', 'admin', 1),
(11, 'flo@ruffner.de', 'Ruffner', '$2a$10$fkPf7w9wSaiAvGN6/t0TtuzfbKTv7/7KFU6gkIMx6RX8pnwfkxDwG', 'Flo', 1),
(12, 'torwart@spiel.de', 'Neuer', '$2a$10$S1LwcbZNdBWky33T3YiCROG6X5lVyxPd2iAf.Vryorln975kf0/eu', 'Manuel', 4),
(13, 'hogwarts@hexe.de', 'Granger', '$2a$10$NfDcdItmwYb75ibZS4/XduCLHzIH33Ros/oFw8VN5i7lwsy4x0/Ve', 'Hermine', 3),
(15, 'muster@email.com', 'Mustermann', '$2a$10$2tRlt4hgr4PrNw6oqkEw..1wZMT4xrursofHyBNCFh8GPmFQBDn7.', 'Maximilian', 2),
(16, 'spoerl@martin.de', 'Fischer', '$2a$10$6ABwq.HuSwMAM6N3.6dpc.F.Q.Qhvcc4JAq50iwJaSttluF/cMUdO', 'Simon', 4),
(17, 'am.diep@thal.de', 'Diepenthal', '$2a$10$deWTQP7qewQb6AN6bW.Ps.cOySB9gws7g6eEb755PEM1NlH9ZhXrW', 'Amelie', 4),
(18, 'manager@admin.de', 'Amin', '$2a$10$njt.P/8NKWOXSQHWybn.heCwq6WK7PNEyAuLHFXgx8WFYob31zEzy', 'Manager', 2),
(19, 'finance@admin.de', 'Ruffner', '$2a$10$cEiUlNMZB0p6RBRHsbfvyuobQLqpkjjGSsoXwp1L52utowmuz04bC', 'Florian', 4),
(20, 'owner@admin.de', 'Schoening', '$2a$10$qLw5eAdscJGp.s0JLxsF3OdK2ntSgdJMM1dSMGyIAv7Ko5RuD/U/.', 'Franzi', 3),
(21, 'martin@xn--sprl-6qa.com', 'Spörl', '$2a$10$GovfCXn8Lfyl2HGHZ3v07.XKxAOfq874RmJGF2xIA4.S6Vfz/F9K.', 'Martin ', 4);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `budget`
--
ALTER TABLE `budget`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK10pisd8xskcmariu36sd5rmc0` (`ersteller_id`),
  ADD KEY `FKnbhoenhg8m3u9ovoxnptv9mf9` (`manager_id`),
  ADD KEY `FKenhjknmladswx6pg3ln5vg0y4` (`owner_id`);

--
-- Indizes für die Tabelle `ist`
--
ALTER TABLE `ist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKalv9e0sh2yra3ayaamx5pvmiq` (`budget_id`),
  ADD KEY `FKag7nkby4q9cqmu68bkxvn7ssl` (`user_id`),
  ADD KEY `FK6i739o2hmwuyqbguueqrjdi5h` (`ist_id`);

--
-- Indizes für die Tabelle `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_8sewwnpamngi6b1dwaa88askk` (`name`);

--
-- Indizes für die Tabelle `soll`
--
ALTER TABLE `soll`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK7hv5wiir20idkoyhlf22yd3kk` (`budget_id`),
  ADD KEY `FKs4ohfd9p9d51qg8u61dx2pemm` (`user_id`),
  ADD KEY `FKiw85nc46yytu236r5xf6nptke` (`soll_id`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_ob8kqyqqgmefl0aco34akdtpe` (`email`),
  ADD KEY `FKn82ha3ccdebhokx3a8fgdqeyy` (`role_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `budget`
--
ALTER TABLE `budget`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT für Tabelle `ist`
--
ALTER TABLE `ist`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT für Tabelle `role`
--
ALTER TABLE `role`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `soll`
--
ALTER TABLE `soll`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `budget`
--
ALTER TABLE `budget`
  ADD CONSTRAINT `FK10pisd8xskcmariu36sd5rmc0` FOREIGN KEY (`ersteller_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FKenhjknmladswx6pg3ln5vg0y4` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FKnbhoenhg8m3u9ovoxnptv9mf9` FOREIGN KEY (`manager_id`) REFERENCES `user` (`id`);

--
-- Constraints der Tabelle `ist`
--
ALTER TABLE `ist`
  ADD CONSTRAINT `FK6i739o2hmwuyqbguueqrjdi5h` FOREIGN KEY (`ist_id`) REFERENCES `budget` (`id`),
  ADD CONSTRAINT `FKag7nkby4q9cqmu68bkxvn7ssl` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FKalv9e0sh2yra3ayaamx5pvmiq` FOREIGN KEY (`budget_id`) REFERENCES `budget` (`id`);

--
-- Constraints der Tabelle `soll`
--
ALTER TABLE `soll`
  ADD CONSTRAINT `FK7hv5wiir20idkoyhlf22yd3kk` FOREIGN KEY (`budget_id`) REFERENCES `budget` (`id`),
  ADD CONSTRAINT `FKiw85nc46yytu236r5xf6nptke` FOREIGN KEY (`soll_id`) REFERENCES `budget` (`id`),
  ADD CONSTRAINT `FKs4ohfd9p9d51qg8u61dx2pemm` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints der Tabelle `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FKn82ha3ccdebhokx3a8fgdqeyy` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
