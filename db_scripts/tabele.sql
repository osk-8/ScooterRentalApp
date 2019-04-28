DROP SCHEMA IF EXISTS ride CASCADE;
CREATE SCHEMA ride;
--CREATE EXTENSION hstore SCHEMA ride;
--CREATE EXTENSION pgcrypto SCHEMA ride;
set search_path to ride;

--uzytkownicy

CREATE DOMAIN ride.typ_adres_email AS VARCHAR(100) COLLATE "POSIX" CHECK (VALUE ~* '^[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,4}$');

CREATE SEQUENCE ride.id_uzytkownika_sekwencja INCREMENT 1 MINVALUE 1 START 1;

CREATE TABLE ride.uzytkownicy (
	id_uzytkownika 		BIGINT 					default nextval('ride.id_uzytkownika_sekwencja'),  
	imie 	 			VARCHAR(20) 			not null,
	nazwisko 			VARCHAR(30) 			not null,
	adres_email 		ride.typ_adres_email 	not null unique,							
	haslo 	 			VARCHAR(130) 			not null,  
	PRIMARY KEY (id_uzytkownika)
);

--administratorzy  -- do usuniecia

CREATE TABLE ride.administratorzy (
	id_administratora 	BIGINT	PRIMARY KEY,
	FOREIGN KEY (id_administratora) REFERENCES ride.uzytkownicy(id_uzytkownika) ON DELETE RESTRICT 
);

--hulajnogi 

CREATE SEQUENCE ride.id_hulajnogi_sekwencja INCREMENT 1 MINVALUE 1 START 1;

CREATE TABLE ride.hulajnogi (
	id_hulajnogi		BIGINT							default nextval('ride.id_hulajnogi_sekwencja'),
	polozenie			JSON							,					
	status_wynajmu 		BOOLEAN							not null,
	zasieg				NUMERIC(3, 1)					not null,
	PRIMARY KEY (id_hulajnogi)
);

--przejazdy

CREATE SEQUENCE ride.id_przejazdu_sekwencja INCREMENT 1 MINVALUE 1 START 1;

CREATE TABLE ride.przejazdy (
	id_przejazdu			BIGINT			default nextval('ride.id_przejazdu_sekwencja'),
	id_uzytkownika 			BIGINT			not null,
	id_hulajnogi 			BIGINT			not null,
	data_poczatku_wynajmu	TIMESTAMP		not null default CURRENT_TIMESTAMP,
	czas_wypozyczenia		INTERVAL  	 	, 										
	koszt					MONEY			,
	PRIMARY KEY (id_przejazdu),
	FOREIGN KEY (id_uzytkownika) REFERENCES ride.uzytkownicy (id_uzytkownika) ON DELETE CASCADE,
	FOREIGN KEY (id_hulajnogi)	REFERENCES ride.hulajnogi (id_hulajnogi) ON DELETE NO ACTION
);

--karty kredytowe

CREATE DOMAIN ride.typ_nr_karty_kredytowej AS VARCHAR(16) COLLATE "POSIX" CHECK (VALUE ~* '[0-9]{16}');
CREATE DOMAIN ride.typ_nr_csc AS VARCHAR(3) COLLATE "POSIX" CHECK (VALUE ~* '[0-9]{3}');

CREATE TABLE ride.karty_kredytowe (											
	nr_karty_kredytowej 	ride.typ_nr_karty_kredytowej 	,  					
	-- nr_karty_kredytowej     BYTEA							,
	data_waznosci			DATE							not null CHECK (date_part('day', data_waznosci) < 2 AND data_waznosci > CURRENT_DATE),			
	nr_csc 					ride.typ_nr_csc					not null,			
	PRIMARY KEY (nr_karty_kredytowej)	
);

--portfele

CREATE TABLE ride.portfele (
	id_uzytkownika 			BIGINT							PRIMARY KEY,
	nr_karty_kredytowej		ride.typ_nr_karty_kredytowej 	unique,
	-- nr_karty_kredytowej     BYTEA							,
	saldo					MONEY							not null default 0,						
	FOREIGN KEY (id_uzytkownika) REFERENCES ride.uzytkownicy(id_uzytkownika) ON DELETE CASCADE,
	FOREIGN KEY (nr_karty_kredytowej) REFERENCES ride.karty_kredytowe(nr_karty_kredytowej) ON DELETE RESTRICT
);

--widoki

--lokalizacje dostepnych hulajnog
CREATE VIEW ride.lokalizacje_dostepnych_hulajnog AS
	SELECT  id_hulajnogi AS numer, polozenie, zasieg FROM ride.hulajnogi WHERE status_wynajmu = false; 
