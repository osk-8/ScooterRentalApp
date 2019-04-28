
--rejestracja uzytkownika

CREATE FUNCTION ride.waliduj_rejestracje()
	RETURNS TRIGGER AS
$$
	BEGIN
		IF (NOT(ride.czy_uzytkownik_istnieje(NEW.adres_email::VARCHAR)) AND LENGTH(NEW.imie::VARCHAR) > 0 AND LENGTH(NEW.imie::VARCHAR) < 20 
														  		   		AND LENGTH(NEW.nazwisko::VARCHAR) > 0 AND LENGTH(NEW.nazwisko::VARCHAR) < 30) THEN
			RETURN NEW;
		END IF;

		RAISE EXCEPTION 'Nieprawidlowe dane podczas rejestracji';
	END
$$ LANGUAGE plpgsql;

CREATE TRIGGER waliduj_rejestracje_trigger
	BEFORE INSERT ON ride.uzytkownicy
	FOR EACH ROW EXECUTE PROCEDURE ride.waliduj_rejestracje();

CREATE FUNCTION ride.czy_uzytkownik_istnieje(adresEmail VARCHAR)
	RETURNS BOOLEAN AS 
$$
	BEGIN
		IF (adresEmail ~* '^[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,4}$') THEN
			RETURN EXISTS(SELECT * FROM ride.uzytkownicy WHERE uzytkownicy.adres_email = CAST(adresEmail AS ride.typ_adres_email));
		END IF;

		RAISE EXCEPTION 'Nieprawidlowy adres email';
	END
$$ LANGUAGE plpgsql;






--usuwanie karty kredytowej usunietego uzytkownika

CREATE FUNCTION ride.usun_karte_kredytowa()
	RETURNS TRIGGER AS
$$
	BEGIN
		DELETE FROM ride.karty_kredytowe
		WHERE karty_kredytowe.nr_karty_kredytowej = OLD.nr_karty_kredytowej;
		-- DELETE FROM ride.karty_kredytowe
		-- WHERE ride.PGP_SYM_DECRYPT(karty_kredytowe.nr_karty_kredytowej, 'PROJEKT_BD') = ride.PGP_SYM_DECRYPT(OLD.nr_karty_kredytowej, 'PROJEKT_BD');
		
		RETURN OLD;
	END
$$ LANGUAGE plpgsql;

CREATE TRIGGER usun_karte_kredytowa_trigger
	AFTER DELETE ON ride.portfele
	FOR EACH ROW EXECUTE PROCEDURE ride.usun_karte_kredytowa();







--edycja danych uzytkownika

CREATE FUNCTION ride.waliduj_edycje_uzytkownika()
	RETURNS TRIGGER AS
$$
	BEGIN
		IF (NEW.adres_email ~* '^[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,4}$' AND LENGTH(NEW.imie) > 0 AND LENGTH(NEW.imie) < 20 
														  				 AND LENGTH(NEW.nazwisko) > 0 AND LENGTH(NEW.nazwisko) < 30) THEN
			RETURN NEW;
		END IF;

		RAISE EXCEPTION 'Nieprawidlwe dane';
	END
$$ LANGUAGE plpgsql;

CREATE TRIGGER waliduj_edycje_uzytkownika_trigger
	BEFORE UPDATE ON ride.uzytkownicy
	FOR EACH ROW EXECUTE PROCEDURE ride.waliduj_edycje_uzytkownika();






--tworzenie portfelu uzytkownika

CREATE FUNCTION ride.utworz_portfel_uzytkownika()
	RETURNS TRIGGER AS
$$
	BEGIN
		INSERT INTO ride.portfele(id_uzytkownika, saldo) VALUES(NEW.id_uzytkownika, 10::MONEY);
		RETURN NEW;
	END
$$ LANGUAGE plpgsql;

CREATE TRIGGER utworz_portfel_uzytkownika_trigger
	AFTER INSERT ON ride.uzytkownicy
	FOR EACH ROW EXECUTE PROCEDURE ride.utworz_portfel_uzytkownika();





--dodawanie karty kredytowej

CREATE FUNCTION ride.waliduj_nr_karty_kredytowej(nr_karty_kredytowej VARCHAR)
	RETURNS BOOLEAN AS
$$
	BEGIN
		IF (nr_karty_kredytowej ~* '^[0-9]*$' AND LENGTH(nr_karty_kredytowej) = 16) THEN
			RETURN 1;
		END IF;

		RAISE EXCEPTION 'Nieprawidlowy numer karty kredytowej';
		RETURN false;
	END
$$ LANGUAGE plpgsql;

CREATE FUNCTION ride.waliduj_dane_karty_kredytowej()
	RETURNS TRIGGER AS
$$
	BEGIN
		IF (NEW.data_waznosci > CURRENT_DATE 
			AND LENGTH(NEW.nr_csc) = 3 
			AND ride.waliduj_nr_karty_kredytowej(NEW.nr_karty_kredytowej)) THEN
			-- AND ride.waliduj_nr_karty_kredytowej(ride.PGP_SYM_DECRYPT(NEW.nr_karty_kredytowej, 'PROJEKT_BD')::VARCHAR)) THEN
			
			RETURN NEW;
		END IF;

		RAISE EXCEPTION 'Nieprawidlowe dane karty kredytowej';
	END
$$ LANGUAGE plpgsql;

CREATE FUNCTION ride.dodaj_karte_kredytowa(id_uzytkownika BIGINT, nr_karty_kredytowej VARCHAR, data_waznosci DATE, nr_csc VARCHAR)
	RETURNS VOID AS
$$	
	DECLARE
		-- nr_karty BYTEA;
	BEGIN
		-- nr_karty = ride.PGP_SYM_ENCRYPT($2, 'PROJEKT_BD');
		IF NOT EXISTS (SELECT 1 FROM ride.portfele WHERE portfele.id_uzytkownika = $1 AND portfele.nr_karty_kredytowej IS NOT NULL) THEN
			INSERT INTO ride.karty_kredytowe(nr_karty_kredytowej, data_waznosci, nr_csc) 
			VALUES($2, $3, $4);
			UPDATE ride.portfele SET nr_karty_kredytowej = $2 WHERE portfele.id_uzytkownika = $1;
		ELSE
			RAISE EXCEPTION 'Uzytkownik posiada juz dodana karte';
		END IF;
	END
$$ LANGUAGE plpgsql;

CREATE TRIGGER waliduj_dane_karty_kredytowej_trigger
	BEFORE INSERT ON ride.karty_kredytowe
	FOR EACH ROW EXECUTE PROCEDURE ride.waliduj_dane_karty_kredytowej();






--usuwanie karty kredytowej 

CREATE FUNCTION ride.usun_karte_kredytowa_uzytkownika(id_uzytkownika BIGINT)
	RETURNS VOID AS
$$
	DECLARE
		nr_karty VARCHAR;
	BEGIN
		SELECT nr_karty_kredytowej INTO nr_karty FROM ride.portfele WHERE portfele.id_uzytkownika = $1;	
		SELECT nr_karty_kredytowej INTO nr_karty FROM ride.portfele WHERE portfele.id_uzytkownika = $1;
		-- SELECT ride.PGP_SYM_DECRYPT(nr_karty_kredytowej, 'PROJEKT_BD') INTO nr_karty FROM ride.portfele WHERE portfele.id_uzytkownika = $1;
			
			IF((nr_karty = '') IS NOT TRUE) THEN
				DELETE FROM ride.karty_kredytowe WHERE nr_karty_kredytowej = nr_karty;				
				-- DELETE FROM ride.karty_kredytowe WHERE ride.PGP_SYM_DECRYPT(nr_karty_kredytowej, 'PROJEKT_BD') = nr_karty;				
				RAISE NOTICE 'Karta kredytowa zostala usunieta';
			END IF;
	END
$$ LANGUAGE plpgsql;







--zabezpieczenie usuwania karty

CREATE FUNCTION ride.usun_karte_kredytowa_z_portfela()
	RETURNS TRIGGER AS 
$$
	BEGIN 
		UPDATE ride.portfele SET nr_karty_kredytowej = NULL 
		WHERE portfele.nr_karty_kredytowej = OLD.nr_karty_kredytowej;
		-- WHERE ride.PGP_SYM_DECRYPT(portfele.nr_karty_kredytowej, 'PROJEKT_BD') = ride.PGP_SYM_DECRYPT(OLD.nr_karty_kredytowej, 'PROJEKT_BD');
		RETURN OLD;
	END
$$ LANGUAGE plpgsql;

CREATE TRIGGER usun_karte_kredytowa_z_portfela_trigger
	BEFORE DELETE ON ride.karty_kredytowe
	FOR EACH ROW EXECUTE PROCEDURE ride.usun_karte_kredytowa_z_portfela();






--doladowanie salda

CREATE FUNCTION ride.doladowanie_salda(id_uzytkownika BIGINT, kwota MONEY) 
	RETURNS VOID AS 
$$
	BEGIN
		IF NOT(kwota > 0::MONEY) THEN
			RAISE EXCEPTION 'Kwota jest ujemna';
		END IF;

		IF(SELECT data_waznosci > CURRENT_DATE 
			FROM ride.karty_kredytowe AS karty
			INNER JOIN 
			(SELECT nr_karty_kredytowej 
				FROM ride.portfele 
				WHERE portfele.id_uzytkownika = $1) portfele 
			ON karty.nr_karty_kredytowej = portfele.nr_karty_kredytowej) THEN
			-- ON ride.PGP_SYM_DECRYPT(karty.nr_karty_kredytowej, 'PROJEKT_BD') = ride.PGP_SYM_DECRYPT(portfele.nr_karty_kredytowej, 'PROJEKT_BD')) THEN

			UPDATE ride.portfele SET saldo = saldo + kwota WHERE portfele.id_uzytkownika = $1;
		ELSE
			RAISE EXCEPTION 'Nie mozna doladowac salda. Karta jest niewazna';
		END IF;

		RAISE NOTICE 'Doladowano saldo konta';
	END
$$ LANGUAGE plpgsql;






--pobranie oplaty

CREATE FUNCTION ride.pobranie_oplaty(id_uzytkownika BIGINT, kwota MONEY) 
	RETURNS VOID AS 
$$
	BEGIN
		UPDATE ride.portfele SET saldo = (saldo - kwota) WHERE portfele.id_uzytkownika = $1;

		RAISE NOTICE 'Pobrano oplate';
	END
$$ LANGUAGE plpgsql;






--wynajem hulajnogi

CREATE FUNCTION ride.start_wynajmu_hulajnogi(id_uzytkownika BIGINT, id_hulajnogi BIGINT)
	RETURNS VOID AS
$$
	BEGIN 
		IF(SELECT status_wynajmu FROM ride.hulajnogi WHERE hulajnogi.id_hulajnogi = $2) THEN
			RAISE EXCEPTION 'Nie mozna wynajac hulajnogi';
		END IF;

		IF NOT (select (saldo > 0::MONEY) OR (nr_karty_kredytowej IS NOT NULL) 
			FROM ride.portfele 
			WHERE portfele.id_uzytkownika = $1) THEN 
			
			RAISE EXCEPTION 'Dodaj karte kredytowa';
		END IF;

		UPDATE ride.hulajnogi SET status_wynajmu = TRUE WHERE hulajnogi.id_hulajnogi = $2;

		INSERT INTO ride.przejazdy (id_uzytkownika, id_hulajnogi, data_poczatku_wynajmu) VALUES($1, $2, CURRENT_TIMESTAMP);
	END
$$ LANGUAGE plpgsql;

CREATE FUNCTION ride.koniec_wynajmu_hulajnogi(id_uzytkownika BIGINT, id_hulajnogi BIGINT, pozycja JSON)
	RETURNS VOID AS
$$
	DECLARE
		nr_przejazdu BIGINT;
		czas_przejazdu INTERVAL;
		koszt_przejazdu MONEY;
	BEGIN
		SELECT p.id_przejazdu INTO nr_przejazdu FROM ride.przejazdy AS p WHERE p.id_uzytkownika = $1 AND p.id_hulajnogi = $2 AND p.koszt IS NULL; 
		UPDATE ride.hulajnogi SET status_wynajmu = FALSE, polozenie = $3 WHERE hulajnogi.id_hulajnogi = $2;
		SELECT (CURRENT_TIMESTAMP - p.data_poczatku_wynajmu) INTO czas_przejazdu FROM ride.przejazdy AS p WHERE p.id_przejazdu = nr_przejazdu;

		SELECT ((EXTRACT(EPOCH FROM czas_przejazdu) / 60) * 0.4)::NUMERIC::MONEY INTO koszt_przejazdu;
		koszt_przejazdu = koszt_przejazdu + 1.3::MONEY;
		PERFORM ride.pobranie_oplaty($1, koszt_przejazdu);
		UPDATE ride.przejazdy SET (czas_wypozyczenia, koszt) = (czas_przejazdu, koszt_przejazdu) WHERE id_przejazdu = nr_przejazdu;
	END
$$ LANGUAGE plpgsql;