const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

db.query('CREATE DATABASE IF NOT EXISTS voting_system;', (err) => {
    if (err) {
        console.error('Error creating database:', err);
        return;
    }
    console.log('✅ Database created (if it didn\'t exist)');

    db.query('USE voting_system;', (err) => {
        if (err) {
            console.error('Error selecting database:', err);
            return;
        }

        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_number VARCHAR(8) UNIQUE NOT NULL,
                full_name VARCHAR(100) NOT NULL,
                county VARCHAR(50) NOT NULL
            );
        `;
        db.query(createUsersTable, (err) => {
            if (err) {
                console.error('Error creating users table:', err);
                return;
            }

            const createCandidatesTable = `
                CREATE TABLE IF NOT EXISTS candidates (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    category VARCHAR(50) NOT NULL,
                    county VARCHAR(50),
                    votes INT DEFAULT 0
                );
            `;
            db.query(createCandidatesTable, (err) => {
                if (err) {
                    console.error('Error creating candidates table:', err);
                    return;
                }

                const createVotesTable = `
                    CREATE TABLE IF NOT EXISTS votes (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        voter_id INT,
                        candidate_id INT,
                        category VARCHAR(50) NOT NULL,
                        FOREIGN KEY (voter_id) REFERENCES users(id),
                        FOREIGN KEY (candidate_id) REFERENCES candidates(id),
                        UNIQUE KEY unique_vote_per_category (voter_id, category)
                    );
                `;
                db.query(createVotesTable, (err) => {
                    if (err) {
                        console.error('Error creating votes table:', err);
                        return;
                    }
                    console.log('✅ Tables created (if they didn\'t exist)');

                    // Seed users table
                    db.query('SELECT COUNT(*) AS count FROM users', (err, results) => {
                        if (err) {
                            console.error('Error checking users:', err);
                            return;
                        }
                        if (results[0].count === 0) {
                            const seedUsers = `
                                INSERT INTO users (id_number, full_name, county) VALUES
                                ('41581309', 'Precious Korir', 'Baringo'),
                                ('41581310', 'Hassan Juma', 'Mombasa'),
                                ('41581311', 'Kelvin Onyango', 'Kisumu'),
                                ('41581312', 'John Mwachia', 'Taita Taveta'),
                                ('41581313', 'Murithi Murimi', 'Embu'),
                                ('41581314', 'Esther Chebet', 'Uasin Gishu'),
                                ('41581315', 'Fatuma Ali', 'Lamu'),
                                ('41581316', 'Peter Odhiambo', 'Siaya'),
                                ('41581317', 'Grace Wanjiku', 'Nyeri'),
                                ('41581318', 'Samuel Kiprono', 'Kericho'),
                                ('41581319', 'Amina Mohammed', 'Garissa'),
                                ('41581320', 'David Mutiso', 'Machakos'),
                                ('41581321', 'Lilian Atieno', 'Homa Bay'),
                                ('41581322', 'Joseph Kiptoo', 'Elgeyo-Marakwet'),
                                ('41581323', 'Mary Wambui', 'Kiambu'),
                                ('41581324', 'Abdul Omar', 'Wajir'),
                                ('41581325', 'Mercy Chepkoech', 'Nandi'),
                                ('41581326', 'Thomas Mwangi', 'Murang’a'),
                                ('41581327', 'Rose Akinyi', 'Migori'),
                                ('41581328', 'Paul Kilonzo', 'Kitui'),
                                ('41581329', 'Halima Yusuf', 'Mandera'),
                                ('41581330', 'Isaac Cheruiyot', 'Bomet'),
                                ('41581331', 'Jane Wairimu', 'Nakuru'),
                                ('41581332', 'Ahmed Said', 'Kilifi'),
                                ('41581333', 'Patrick Otieno', 'Kakamega'),
                                ('41581334', 'Faith Jepchirchir', 'West Pokot'),
                                ('41581335', 'Daniel Kamau', 'Kirinyaga'),
                                ('41581336', 'Salma Ibrahim', 'Tana River'),
                                ('41581337', 'Moses Koech', 'Trans Nzoia'),
                                ('41581338', 'Ann Njoroge', 'Laikipia'),
                                ('41581339', 'Ruth Adhiambo', 'Busia'),
                                ('41581340', 'Elijah Mutua', 'Makueni'),
                                ('41581341', 'Zainab Hassan', 'Kwale'),
                                ('41581342', 'Simon Langat', 'Narok'),
                                ('41581343', 'Lucy Wanjiru', 'Nyandarua'),
                                ('41581344', 'Victor Ochieng', 'Bungoma'),
                                ('41581345', 'Beatrice Chepkemoi', 'Kajiado'),
                                ('41581346', 'Michael Ndegwa', 'Meru'),
                                ('41581347', 'Fatima Abdi', 'Isiolo'),
                                ('41581348', 'Charles Kipkirui', 'Samburu'),
                                ('41581349', 'Dorcas Auma', 'Vihiga'),
                                ('41581350', 'Stephen Muli', 'Marsabit'),
                                ('41581351', 'Joyce Cherop', 'Turkana'),
                                ('41581352', 'George Kariuki', 'Tharaka-Nithi'),
                                ('41581353', 'Saida Omar', 'Nairobi'),
                                ('41581354', 'Mercy Jepkemboi', 'Baringo'),
                                ('41581355', 'Hussein Farah', 'Mombasa'),
                                ('41581356', 'Brian Omondi', 'Kisumu'),
                                ('41581357', 'Pauline Mwikali', 'Taita Taveta'),
                                ('41581358', 'Martin Kimani', 'Embu'),
                                ('41581359', 'Judy Chepngetich', 'Uasin Gishu'),
                                ('41581360', 'Khadija Suleiman', 'Lamu'),
                                ('41581361', 'Alfred Okoth', 'Siaya'),
                                ('41581362', 'Esther Wambugu', 'Nyeri'),
                                ('41581363', 'Wilson Kipchumba', 'Kericho'),
                                ('41581364', 'Aisha Dahir', 'Garissa'),
                                ('41581365', 'Francis Mutuku', 'Machakos'),
                                ('41581366', 'Nancy Achieng', 'Homa Bay'),
                                ('41581367', 'Benard Kiptaiyat', 'Elgeyo-Marakwet'),
                                ('41581368', 'Catherine Njeri', 'Kiambu'),
                                ('41581369', 'Yusuf Ahmed', 'Wajir'),
                                ('41581370', 'Emily Chelangat', 'Nandi'),
                                ('41581371', 'Henry Gichuki', 'Murang’a'),
                                ('41581372', 'Lydia Anyango', 'Migori'),
                                ('41581373', 'Philip Nzomo', 'Kitui'),
                                ('41581374', 'Rahma Adan', 'Mandera'),
                                ('41581375', 'Joel Cherono', 'Bomet'),
                                ('41581376', 'Monica Wamboi', 'Nakuru'),
                                ('41581377', 'Salim Bakari', 'Kilifi'),
                                ('41581378', 'Dennis Owino', 'Kakamega'),
                                ('41581379', 'Sharon Jepkorir', 'West Pokot'),
                                ('41581380', 'Edward Karanja', 'Kirinyaga'),
                                ('41581381', 'Hawa Ismail', 'Tana River'),
                                ('41581382', 'Robert Kigen', 'Trans Nzoia'),
                                ('41581383', 'Priscilla Wangari', 'Laikipia'),
                                ('41581384', 'Mercy Adoyo', 'Busia'),
                                ('41581385', 'Anthony Kyalo', 'Makueni'),
                                ('41581386', 'Zuhura Saidi', 'Kwale'),
                                ('41581387', 'Samuel Rotich', 'Narok'),
                                ('41581388', 'Veronica Muthoni', 'Nyandarua'),
                                ('41581389', 'James Oduor', 'Bungoma'),
                                ('41581390', 'Betty Chebet', 'Kajiado'),
                                ('41581391', 'Peter Njeru', 'Meru'),
                                ('41581392', 'Naima Osman', 'Isiolo'),
                                ('41581393', 'David Kiprop', 'Samburu'),
                                ('41581394', 'Clara Akinyi', 'Vihiga'),
                                ('41581395', 'Joseph Musyoka', 'Marsabit'),
                                ('41581396', 'Faith Jepkemei', 'Turkana'),
                                ('41581397', 'Patrick Wachira', 'Tharaka-Nithi'),
                                ('41581398', 'Leyla Abdi', 'Nairobi'),
                                ('41581399', 'Christine Chepkorir', 'Baringo'),
                                ('41581400', 'Mohamed Yusuf', 'Mombasa');
                            `;
                            db.query(seedUsers, (err) => {
                                if (err) {
                                    console.error('Error seeding users:', err);
                                } else {
                                    console.log('✅ Users seeded');
                                }
                            });
                        }
                    });

                    // Seed candidates table (full 47 counties)
                    db.query('SELECT COUNT(*) AS count FROM candidates', (err, results) => {
                        if (err) {
                            console.error('Error checking candidates:', err);
                            return;
                        }
                        if (results[0].count === 0) {
                            const seedCandidates = `
                                INSERT INTO candidates (name, category, county, votes) VALUES
                                ('Paul Kipchumba', 'President', NULL, 0),
                                ('Amina Wanjiku', 'President', NULL, 0),
                                ('Hassan Otieno', 'President', NULL, 0),
                                -- Baringo
                                ('Precious Korir', 'Governors', 'Baringo', 0),
                                ('Mercy Jepkemboi', 'Governors', 'Baringo', 0),
                                ('Samuel Kiprotich', 'Governors', 'Baringo', 0),
                                ('Christine Chepkorir', 'Senators', 'Baringo', 0),
                                ('David Kiprono', 'Senators', 'Baringo', 0),
                                ('Faith Chebet', 'Senators', 'Baringo', 0),
                                ('Joseph Kiptaiyat', 'Members of the National Assembly', 'Baringo', 0),
                                ('Emily Chelangat', 'Members of the National Assembly', 'Baringo', 0),
                                ('Peter Cheruiyot', 'Members of the National Assembly', 'Baringo', 0),
                                ('Sharon Jepkorir', 'Members of County Assemblies', 'Baringo', 0),
                                ('Moses Koech', 'Members of County Assemblies', 'Baringo', 0),
                                ('Judy Chepngetich', 'Members of County Assemblies', 'Baringo', 0),
                                -- Mombasa
                                ('Hassan Juma', 'Governors', 'Mombasa', 0),
                                ('Fatuma Said', 'Governors', 'Mombasa', 0),
                                ('Ali Mohammed', 'Governors', 'Mombasa', 0),
                                ('Hussein Farah', 'Senators', 'Mombasa', 0),
                                ('Zainab Omar', 'Senators', 'Mombasa', 0),
                                ('Salim Bakari', 'Senators', 'Mombasa', 0),
                                ('Mohamed Yusuf', 'Members of the National Assembly', 'Mombasa', 0),
                                ('Aisha Suleiman', 'Members of the National Assembly', 'Mombasa', 0),
                                ('Omar Hassan', 'Members of the National Assembly', 'Mombasa', 0),
                                ('Leyla Abdi', 'Members of County Assemblies', 'Mombasa', 0),
                                ('Saida Juma', 'Members of County Assemblies', 'Mombasa', 0),
                                ('Yusuf Ahmed', 'Members of County Assemblies', 'Mombasa', 0),
                                -- Kisumu
                                ('Kelvin Onyango', 'Governors', 'Kisumu', 0),
                                ('Brian Omondi', 'Governors', 'Kisumu', 0),
                                ('Nancy Achieng', 'Governors', 'Kisumu', 0),
                                ('Peter Odhiambo', 'Senators', 'Kisumu', 0),
                                ('Alfred Okoth', 'Senators', 'Kisumu', 0),
                                ('Rose Akinyi', 'Senators', 'Kisumu', 0),
                                ('Patrick Otieno', 'Members of the National Assembly', 'Kisumu', 0),
                                ('Lilian Atieno', 'Members of the National Assembly', 'Kisumu', 0),
                                ('James Oduor', 'Members of the National Assembly', 'Kisumu', 0),
                                ('Mercy Adoyo', 'Members of County Assemblies', 'Kisumu', 0),
                                ('Clara Akinyi', 'Members of County Assemblies', 'Kisumu', 0),
                                ('Dennis Owino', 'Members of County Assemblies', 'Kisumu', 0),
                                -- Taita Taveta
                                ('John Mwachia', 'Governors', 'Taita Taveta', 0),
                                ('Pauline Mwikali', 'Governors', 'Taita Taveta', 0),
                                ('Grace Mshai', 'Governors', 'Taita Taveta', 0),
                                ('Daniel Mghanga', 'Senators', 'Taita Taveta', 0),
                                ('Esther Wakesho', 'Senators', 'Taita Taveta', 0),
                                ('Joseph Mwakio', 'Senators', 'Taita Taveta', 0),
                                ('Mercy Wanjala', 'Members of the National Assembly', 'Taita Taveta', 0),
                                ('Peter Mwadime', 'Members of the National Assembly', 'Taita Taveta', 0),
                                ('Sarah Mghoi', 'Members of the National Assembly', 'Taita Taveta', 0),
                                ('Thomas Mwaluma', 'Members of County Assemblies', 'Taita Taveta', 0),
                                ('Lucy Wambua', 'Members of County Assemblies', 'Taita Taveta', 0),
                                ('David Msagha', 'Members of County Assemblies', 'Taita Taveta', 0),
                                -- Embu
                                ('Murithi Murimi', 'Governors', 'Embu', 0),
                                ('Martin Kimani', 'Governors', 'Embu', 0),
                                ('Jane Njeru', 'Governors', 'Embu', 0),
                                ('Peter Njeru', 'Senators', 'Embu', 0),
                                ('Grace Wairimu', 'Senators', 'Embu', 0),
                                ('Samuel Njagi', 'Senators', 'Embu', 0),
                                ('Catherine Muthoni', 'Members of the National Assembly', 'Embu', 0),
                                ('John Kariuki', 'Members of the National Assembly', 'Embu', 0),
                                ('Esther Wanjiku', 'Members of the National Assembly', 'Embu', 0),
                                ('Patrick Wachira', 'Members of County Assemblies', 'Embu', 0),
                                ('Mary Wambugu', 'Members of County Assemblies', 'Embu', 0),
                                ('Joseph Muriithi', 'Members of County Assemblies', 'Embu', 0),
                                -- Uasin Gishu
                                ('Esther Chebet', 'Governors', 'Uasin Gishu', 0),
                                ('Judy Chepngetich', 'Governors', 'Uasin Gishu', 0),
                                ('Wilson Kipchumba', 'Governors', 'Uasin Gishu', 0),
                                ('Samuel Kiprono', 'Senators', 'Uasin Gishu', 0),
                                ('Mercy Chepkoech', 'Senators', 'Uasin Gishu', 0),
                                ('Joseph Kiptoo', 'Senators', 'Uasin Gishu', 0),
                                ('Emily Chelangat', 'Members of the National Assembly', 'Uasin Gishu', 0),
                                ('David Kiprotich', 'Members of the National Assembly', 'Uasin Gishu', 0),
                                ('Faith Jepkemei', 'Members of the National Assembly', 'Uasin Gishu', 0),
                                ('Sharon Jepkorir', 'Members of County Assemblies', 'Uasin Gishu', 0),
                                ('Moses Koech', 'Members of County Assemblies', 'Uasin Gishu', 0),
                                ('Betty Chebet', 'Members of County Assemblies', 'Uasin Gishu', 0),
                                -- Lamu
                                ('Fatuma Ali', 'Governors', 'Lamu', 0),
                                ('Khadija Suleiman', 'Governors', 'Lamu', 0),
                                ('Ahmed Said', 'Governors', 'Lamu', 0),
                                ('Hassan Omar', 'Senators', 'Lamu', 0),
                                ('Zainab Hassan', 'Senators', 'Lamu', 0),
                                ('Salim Bakari', 'Senators', 'Lamu', 0),
                                ('Aisha Dahir', 'Members of the National Assembly', 'Lamu', 0),
                                ('Yusuf Ahmed', 'Members of the National Assembly', 'Lamu', 0),
                                ('Saida Omar', 'Members of the National Assembly', 'Lamu', 0),
                                ('Leyla Abdi', 'Members of County Assemblies', 'Lamu', 0),
                                ('Mohamed Yusuf', 'Members of County Assemblies', 'Lamu', 0),
                                ('Hawa Ismail', 'Members of County Assemblies', 'Lamu', 0),
                                -- Siaya
                                ('Peter Odhiambo', 'Governors', 'Siaya', 0),
                                ('Alfred Okoth', 'Governors', 'Siaya', 0),
                                ('Nancy Achieng', 'Governors', 'Siaya', 0),
                                ('Kelvin Onyango', 'Senators', 'Siaya', 0),
                                ('Rose Akinyi', 'Senators', 'Siaya', 0),
                                ('Brian Omondi', 'Senators', 'Siaya', 0),
                                ('Patrick Otieno', 'Members of the National Assembly', 'Siaya', 0),
                                ('Lilian Atieno', 'Members of the National Assembly', 'Siaya', 0),
                                ('James Oduor', 'Members of the National Assembly', 'Siaya', 0),
                                ('Mercy Adoyo', 'Members of County Assemblies', 'Siaya', 0),
                                ('Clara Akinyi', 'Members of County Assemblies', 'Siaya', 0),
                                ('Dennis Owino', 'Members of County Assemblies', 'Siaya', 0),
                                -- Nyeri
                                ('Grace Wanjiku', 'Governors', 'Nyeri', 0),
                                ('Esther Wambugu', 'Governors', 'Nyeri', 0),
                                ('Thomas Mwangi', 'Governors', 'Nyeri', 0),
                                ('Daniel Kamau', 'Senators', 'Nyeri', 0),
                                ('Mary Wambui', 'Senators', 'Nyeri', 0),
                                ('John Kariuki', 'Senators', 'Nyeri', 0),
                                ('Catherine Njeri', 'Members of the National Assembly', 'Nyeri', 0),
                                ('Henry Gichuki', 'Members of the National Assembly', 'Nyeri', 0),
                                ('Jane Wairimu', 'Members of the National Assembly', 'Nyeri', 0),
                                ('Patrick Wachira', 'Members of County Assemblies', 'Nyeri', 0),
                                ('Lucy Wanjiru', 'Members of County Assemblies', 'Nyeri', 0),
                                ('George Kariuki', 'Members of County Assemblies', 'Nyeri', 0),
                                -- Kericho
                                ('Samuel Kiprono', 'Governors', 'Kericho', 0),
                                ('Wilson Kipchumba', 'Governors', 'Kericho', 0),
                                ('Isaac Cheruiyot', 'Governors', 'Kericho', 0),
                                ('Mercy Chepkoech', 'Senators', 'Kericho', 0),
                                ('Joseph Kiptoo', 'Senators', 'Kericho', 0),
                                ('Emily Chelangat', 'Senators', 'Kericho', 0),
                                ('Judy Chepngetich', 'Members of the National Assembly', 'Kericho', 0),
                                ('David Kiprotich', 'Members of the National Assembly', 'Kericho', 0),
                                ('Faith Jepkemei', 'Members of the National Assembly', 'Kericho', 0),
                                ('Sharon Jepkorir', 'Members of County Assemblies', 'Kericho', 0),
                                ('Moses Koech', 'Members of County Assemblies', 'Kericho', 0),
                                ('Betty Chebet', 'Members of County Assemblies', 'Kericho', 0),
                                -- Garissa
                                ('Amina Mohammed', 'Governors', 'Garissa', 0),
                                ('Aisha Dahir', 'Governors', 'Garissa', 0),
                                ('Hassan Omar', 'Governors', 'Garissa', 0),
                                ('Abdul Omar', 'Senators', 'Garissa', 0),
                                ('Fatima Abdi', 'Senators', 'Garissa', 0),
                                ('Yusuf Ahmed', 'Senators', 'Garissa', 0),
                                ('Halima Yusuf', 'Members of the National Assembly', 'Garissa', 0),
                                ('Salma Ibrahim', 'Members of the National Assembly', 'Garissa', 0),
                                ('Mohamed Yusuf', 'Members of the National Assembly', 'Garissa', 0),
                                ('Leyla Abdi', 'Members of County Assemblies', 'Garissa', 0),
                                ('Saida Omar', 'Members of County Assemblies', 'Garissa', 0),
                                ('Naima Osman', 'Members of County Assemblies', 'Garissa', 0),
                                -- Machakos
                                ('David Mutiso', 'Governors', 'Machakos', 0),
                                ('Francis Mutuku', 'Governors', 'Machakos', 0),
                                ('Paul Kilonzo', 'Governors', 'Machakos', 0),
                                ('Elijah Mutua', 'Senators', 'Machakos', 0),
                                ('Anthony Kyalo', 'Senators', 'Machakos', 0),
                                ('Philip Nzomo', 'Senators', 'Machakos', 0),
                                ('Joseph Musyoka', 'Members of the National Assembly', 'Machakos', 0),
                                ('Mary Wambua', 'Members of the National Assembly', 'Machakos', 0),
                                ('Stephen Muli', 'Members of the National Assembly', 'Machakos', 0),
                                ('Pauline Mwikali', 'Members of County Assemblies', 'Machakos', 0),
                                ('Mercy Wanjala', 'Members of County Assemblies', 'Machakos', 0),
                                ('Peter Mwadime', 'Members of County Assemblies', 'Machakos', 0),
                                -- Homa Bay
                                ('Lilian Atieno', 'Governors', 'Homa Bay', 0),
                                ('Nancy Achieng', 'Governors', 'Homa Bay', 0),
                                ('Rose Akinyi', 'Governors', 'Homa Bay', 0),
                                ('Peter Odhiambo', 'Senators', 'Homa Bay', 0),
                                ('Alfred Okoth', 'Senators', 'Homa Bay', 0),
                                ('Kelvin Onyango', 'Senators', 'Homa Bay', 0),
                                ('Patrick Otieno', 'Members of the National Assembly', 'Homa Bay', 0),
                                ('Brian Omondi', 'Members of the National Assembly', 'Homa Bay', 0),
                                ('James Oduor', 'Members of the National Assembly', 'Homa Bay', 0),
                                ('Mercy Adoyo', 'Members of County Assemblies', 'Homa Bay', 0),
                                ('Clara Akinyi', 'Members of County Assemblies', 'Homa Bay', 0),
                                ('Dennis Owino', 'Members of County Assemblies', 'Homa Bay', 0),
                                -- Elgeyo-Marakwet
                                ('Joseph Kiptoo', 'Governors', 'Elgeyo-Marakwet', 0),
                                ('Benard Kiptaiyat', 'Governors', 'Elgeyo-Marakwet', 0),
                                ('Samuel Kiprotich', 'Governors', 'Elgeyo-Marakwet', 0),
                                ('Mercy Chepkoech', 'Senators', 'Elgeyo-Marakwet', 0),
                                ('Wilson Kipchumba', 'Senators', 'Elgeyo-Marakwet', 0),
                                ('Emily Chelangat', 'Senators', 'Elgeyo-Marakwet', 0),
                                ('Judy Chepngetich', 'Members of the National Assembly', 'Elgeyo-Marakwet', 0),
                                ('David Kiprono', 'Members of the National Assembly', 'Elgeyo-Marakwet', 0),
                                ('Faith Jepkemei', 'Members of the National Assembly', 'Elgeyo-Marakwet', 0),
                                ('Sharon Jepkorir', 'Members of County Assemblies', 'Elgeyo-Marakwet', 0),
                                ('Moses Koech', 'Members of County Assemblies', 'Elgeyo-Marakwet', 0),
                                ('Betty Chebet', 'Members of County Assemblies', 'Elgeyo-Marakwet', 0),
                                -- Kiambu
                                ('Mary Wambui', 'Governors', 'Kiambu', 0),
                                ('Catherine Njeri', 'Governors', 'Kiambu', 0),
                                ('Grace Wanjiku', 'Governors', 'Kiambu', 0),
                                ('Daniel Kamau', 'Senators', 'Kiambu', 0),
                                ('Thomas Mwangi', 'Senators', 'Kiambu', 0),
                                ('John Kariuki', 'Senators', 'Kiambu', 0),
                                ('Jane Wairimu', 'Members of the National Assembly', 'Kiambu', 0),
                                ('Henry Gichuki', 'Members of the National Assembly', 'Kiambu', 0),
                                ('Esther Wambugu', 'Members of the National Assembly', 'Kiambu', 0),
                                ('Patrick Wachira', 'Members of County Assemblies', 'Kiambu', 0),
                                ('Lucy Wanjiru', 'Members of County Assemblies', 'Kiambu', 0),
                                ('George Kariuki', 'Members of County Assemblies', 'Kiambu', 0),
                                -- Wajir
                                ('Abdul Omar', 'Governors', 'Wajir', 0),
                                ('Yusuf Ahmed', 'Governors', 'Wajir', 0),
                                ('Hassan Omar', 'Governors', 'Wajir', 0),
                                ('Amina Mohammed', 'Senators', 'Wajir', 0),
                                ('Fatima Abdi', 'Senators', 'Wajir', 0),
                                ('Halima Yusuf', 'Senators', 'Wajir', 0),
                                ('Salma Ibrahim', 'Members of the National Assembly', 'Wajir', 0),
                                ('Aisha Dahir', 'Members of the National Assembly', 'Wajir', 0),
                                ('Mohamed Yusuf', 'Members of the National Assembly', 'Wajir', 0),
                                ('Leyla Abdi', 'Members of County Assemblies', 'Wajir', 0),
                                ('Saida Omar', 'Members of County Assemblies', 'Wajir', 0),
                                ('Naima Osman', 'Members of County Assemblies', 'Wajir', 0),
                                -- Nandi
                                ('Mercy Chepkoech', 'Governors', 'Nandi', 0),
                                ('Emily Chelangat', 'Governors', 'Nandi', 0),
                                ('Samuel Kiprono', 'Governors', 'Nandi', 0),
                                ('Joseph Kiptoo', 'Senators', 'Nandi', 0),
                                ('Wilson Kipchumba', 'Senators', 'Nandi', 0),
                                ('Judy Chepngetich', 'Senators', 'Nandi', 0),
                                ('David Kiprotich', 'Members of the National Assembly', 'Nandi', 0),
                                ('Faith Jepkemei', 'Members of the National Assembly', 'Nandi', 0),
                                ('Sharon Jepkorir', 'Members of the National Assembly', 'Nandi', 0),
                                ('Moses Koech', 'Members of County Assemblies', 'Nandi', 0),
                                ('Betty Chebet', 'Members of County Assemblies', 'Nandi', 0),
                                ('Christine Chepkorir', 'Members of County Assemblies', 'Nandi', 0),
                                -- Murang’a
                                ('Thomas Mwangi', 'Governors', 'Murang’a', 0),
                                ('Henry Gichuki', 'Governors', 'Murang’a', 0),
                                ('Daniel Kamau', 'Governors', 'Murang’a', 0),
                                ('Grace Wanjiku', 'Senators', 'Murang’a', 0),
                                ('Mary Wambui', 'Senators', 'Murang’a', 0),
                                ('John Kariuki', 'Senators', 'Murang’a', 0),
                                ('Catherine Njeri', 'Members of the National Assembly', 'Murang’a', 0),
                                ('Jane Wairimu', 'Members of the National Assembly', 'Murang’a', 0),
                                ('Esther Wambugu', 'Members of the National Assembly', 'Murang’a', 0),
                                ('Patrick Wachira', 'Members of County Assemblies', 'Murang’a', 0),
                                ('Lucy Wanjiru', 'Members of County Assemblies', 'Murang’a', 0),
                                ('George Kariuki', 'Members of County Assemblies', 'Murang’a', 0),
                                -- Migori
                                ('Rose Akinyi', 'Governors', 'Migori', 0),
                                ('Lydia Anyango', 'Governors', 'Migori', 0),
                                ('Nancy Achieng', 'Governors', 'Migori', 0),
                                ('Peter Odhiambo', 'Senators', 'Migori', 0),
                                ('Alfred Okoth', 'Senators', 'Migori', 0),
                                ('Kelvin Onyango', 'Senators', 'Migori', 0),
                                ('Patrick Otieno', 'Members of the National Assembly', 'Migori', 0),
                                ('Brian Omondi', 'Members of the National Assembly', 'Migori', 0),
                                ('James Oduor', 'Members of the National Assembly', 'Migori', 0),
                                ('Mercy Adoyo', 'Members of County Assemblies', 'Migori', 0),
                                ('Clara Akinyi', 'Members of County Assemblies', 'Migori', 0),
                                ('Dennis Owino', 'Members of County Assemblies', 'Migori', 0),
                                -- Kitui
                                ('Paul Kilonzo', 'Governors', 'Kitui', 0),
                                ('Philip Nzomo', 'Governors', 'Kitui', 0),
                                ('Elijah Mutua', 'Governors', 'Kitui', 0),
                                ('David Mutiso', 'Senators', 'Kitui', 0),
                                ('Francis Mutuku', 'Senators', 'Kitui', 0),
                                ('Anthony Kyalo', 'Senators', 'Kitui', 0),
                                ('Joseph Musyoka', 'Members of the National Assembly', 'Kitui', 0),
                                ('Mary Wambua', 'Members of the National Assembly', 'Kitui', 0),
                                ('Stephen Muli', 'Members of the National Assembly', 'Kitui', 0),
                                ('Pauline Mwikali', 'Members of County Assemblies', 'Kitui', 0),
                                ('Mercy Wanjala', 'Members of County Assemblies', 'Kitui', 0),
                                ('Peter Mwadime', 'Members of County Assemblies', 'Kitui', 0),
                                -- Mandera
                                ('Halima Yusuf', 'Governors', 'Mandera', 0),
                                ('Rahma Adan', 'Governors', 'Mandera', 0),
                                ('Amina Mohammed', 'Governors', 'Mandera', 0),
                                ('Abdul Omar', 'Senators', 'Mandera', 0),
                                ('Yusuf Ahmed', 'Senators', 'Mandera', 0),
                                ('Hassan Omar', 'Senators', 'Mandera', 0),
                                ('Fatima Abdi', 'Members of the National Assembly', 'Mandera', 0),
                                ('Salma Ibrahim', 'Members of the National Assembly', 'Mandera', 0),
                                ('Aisha Dahir', 'Members of the National Assembly', 'Mandera', 0),
                                ('Leyla Abdi', 'Members of County Assemblies', 'Mandera', 0),
                                ('Saida Omar', 'Members of County Assemblies', 'Mandera', 0),
                                ('Naima Osman', 'Members of County Assemblies', 'Mandera', 0),
                                -- Bomet
                                ('Isaac Cheruiyot', 'Governors', 'Bomet', 0),
                                ('Joel Cherono', 'Governors', 'Bomet', 0),
                                ('Samuel Kiprono', 'Governors', 'Bomet', 0),
                                ('Mercy Chepkoech', 'Senators', 'Bomet', 0),
                                ('Wilson Kipchumba', 'Senators', 'Bomet', 0),
                                ('Joseph Kiptoo', 'Senators', 'Bomet', 0),
                                ('Emily Chelangat', 'Members of the National Assembly', 'Bomet', 0),
                                ('Judy Chepngetich', 'Members of the National Assembly', 'Bomet', 0),
                                ('David Kiprotich', 'Members of the National Assembly', 'Bomet', 0),
                                ('Faith Jepkemei', 'Members of County Assemblies', 'Bomet', 0),
                                ('Sharon Jepkorir', 'Members of County Assemblies', 'Bomet', 0),
                                ('Moses Koech', 'Members of County Assemblies', 'Bomet', 0),
                                -- Nakuru
                                ('Jane Wairimu', 'Governors', 'Nakuru', 0),
                                ('Monica Wamboi', 'Governors', 'Nakuru', 0),
                                ('Grace Wanjiku', 'Governors', 'Nakuru', 0),
                                ('Daniel Kamau', 'Senators', 'Nakuru', 0),
                                ('Thomas Mwangi', 'Senators', 'Nakuru', 0),
                                ('John Kariuki', 'Senators', 'Nakuru', 0),
                                ('Catherine Njeri', 'Members of the National Assembly', 'Nakuru', 0),
                                ('Henry Gichuki', 'Members of the National Assembly', 'Nakuru', 0),
                                ('Esther Wambugu', 'Members of the National Assembly', 'Nakuru', 0),
                                ('Patrick Wachira', 'Members of County Assemblies', 'Nakuru', 0),
                                ('Lucy Wanjiru', 'Members of County Assemblies', 'Nakuru', 0),
                                ('George Kariuki', 'Members of County Assemblies', 'Nakuru', 0),
                                -- Kilifi
                                ('Ahmed Said', 'Governors', 'Kilifi', 0),
                                ('Salim Bakari', 'Governors', 'Kilifi', 0),
                                ('Fatuma Said', 'Governors', 'Kilifi', 0),
                                ('Hassan Juma', 'Senators', 'Kilifi', 0),
                                ('Zainab Omar', 'Senators', 'Kilifi', 0),
                                ('Mohamed Yusuf', 'Senators', 'Kilifi', 0),
                                ('Aisha Suleiman', 'Members of the National Assembly', 'Kilifi', 0),
                                ('Omar Hassan', 'Members of the National Assembly', 'Kilifi', 0),
                                ('Leyla Abdi', 'Members of the National Assembly', 'Kilifi', 0),
                                ('Saida Juma', 'Members of County Assemblies', 'Kilifi', 0),
                                ('Yusuf Ahmed', 'Members of County Assemblies', 'Kilifi', 0),
                                ('Hawa Ismail', 'Members of County Assemblies', 'Kilifi', 0),
                                -- Kakamega
                                ('Patrick Otieno', 'Governors', 'Kakamega', 0),
                                ('Dennis Owino', 'Governors', 'Kakamega', 0),
                                ('Peter Odhiambo', 'Governors', 'Kakamega', 0),
                                ('Kelvin Onyango', 'Senators', 'Kakamega', 0),
                                ('Alfred Okoth', 'Senators', 'Kakamega', 0),
                                ('Nancy Achieng', 'Senators', 'Kakamega', 0),
                                ('Rose Akinyi', 'Members of the National Assembly', 'Kakamega', 0),
                                ('Brian Omondi', 'Members of the National Assembly', 'Kakamega', 0),
                                ('James Oduor', 'Members of the National Assembly', 'Kakamega', 0),
                                ('Mercy Adoyo', 'Members of County Assemblies', 'Kakamega', 0),
                                ('Clara Akinyi', 'Members of County Assemblies', 'Kakamega', 0),
                                ('Lydia Anyango', 'Members of County Assemblies', 'Kakamega', 0),
                                -- West Pokot
                                ('Faith Jepchirchir', 'Governors', 'West Pokot', 0),
                                ('Sharon Jepkorir', 'Governors', 'West Pokot', 0),
                                ('Mercy Chepkoech', 'Governors', 'West Pokot', 0),
                                ('Joseph Kiptoo', 'Senators', 'West Pokot', 0),
                                ('Samuel Kiprono', 'Senators', 'West Pokot', 0),
                                ('Wilson Kipchumba', 'Senators', 'West Pokot', 0),
                                ('Emily Chelangat', 'Members of the National Assembly', 'West Pokot', 0),
                                ('Judy Chepngetich', 'Members of the National Assembly', 'West Pokot', 0),
                                ('David Kiprotich', 'Members of the National Assembly', 'West Pokot', 0),
                                ('Moses Koech', 'Members of County Assemblies', 'West Pokot', 0),
                                ('Betty Chebet', 'Members of County Assemblies', 'West Pokot', 0),
                                ('Christine Chepkorir', 'Members of County Assemblies', 'West Pokot', 0),
                                -- Kirinyaga
                                ('Daniel Kamau', 'Governors', 'Kirinyaga', 0),
                                ('Edward Karanja', 'Governors', 'Kirinyaga', 0),
                                ('Grace Wanjiku', 'Governors', 'Kirinyaga', 0),
                                ('Thomas Mwangi', 'Senators', 'Kirinyaga', 0),
                                ('Mary Wambui', 'Senators', 'Kirinyaga', 0),
                                ('John Kariuki', 'Senators', 'Kirinyaga', 0),
                                ('Catherine Njeri', 'Members of the National Assembly', 'Kirinyaga', 0),
                                ('Henry Gichuki', 'Members of the National Assembly', 'Kirinyaga', 0),
                                ('Jane Wairimu', 'Members of the National Assembly', 'Kirinyaga', 0),
                                ('Patrick Wachira', 'Members of County Assemblies', 'Kirinyaga', 0),
                                ('Lucy Wanjiru', 'Members of County Assemblies', 'Kirinyaga', 0),
                                ('George Kariuki', 'Members of County Assemblies', 'Kirinyaga', 0),
                                -- Tana River
                                ('Salma Ibrahim', 'Governors', 'Tana River', 0),
                                ('Hawa Ismail', 'Governors', 'Tana River', 0),
                                ('Fatuma Ali', 'Governors', 'Tana River', 0),
                                ('Hassan Juma', 'Senators', 'Tana River', 0),
                                ('Ahmed Said', 'Senators', 'Tana River', 0),
                                ('Zainab Omar', 'Senators', 'Tana River', 0),
                                ('Aisha Suleiman', 'Members of the National Assembly', 'Tana River', 0),
                                ('Mohamed Yusuf', 'Members of the National Assembly', 'Tana River', 0),
                                ('Omar Hassan', 'Members of the National Assembly', 'Tana River', 0),
                                ('Leyla Abdi', 'Members of County Assemblies', 'Tana River', 0),
                                ('Saida Juma', 'Members of County Assemblies', 'Tana River', 0),
                                ('Yusuf Ahmed', 'Members of County Assemblies', 'Tana River', 0),
                                -- Trans Nzoia
                                ('Moses Koech', 'Governors', 'Trans Nzoia', 0),
                                ('Robert Kigen', 'Governors', 'Trans Nzoia', 0),
                                ('Samuel Kiprono', 'Governors', 'Trans Nzoia', 0),
                                ('Joseph Kiptoo', 'Senators', 'Trans Nzoia', 0),
                                ('Mercy Chepkoech', 'Senators', 'Trans Nzoia', 0),
                                ('Wilson Kipchumba', 'Senators', 'Trans Nzoia', 0),
                                ('Emily Chelangat', 'Members of the National Assembly', 'Trans Nzoia', 0),
                                ('Judy Chepngetich', 'Members of the National Assembly', 'Trans Nzoia', 0),
                                ('David Kiprotich', 'Members of the National Assembly', 'Trans Nzoia', 0),
                                ('Faith Jepkemei', 'Members of County Assemblies', 'Trans Nzoia', 0),
                                ('Sharon Jepkorir', 'Members of County Assemblies', 'Trans Nzoia', 0),
                                ('Betty Chebet', 'Members of County Assemblies', 'Trans Nzoia', 0),
                                -- Laikipia
                                ('Ann Njoroge', 'Governors', 'Laikipia', 0),
                                ('Priscilla Wangari', 'Governors', 'Laikipia', 0),
                                ('Grace Wanjiku', 'Governors', 'Laikipia', 0),
                                ('Daniel Kamau', 'Senators', 'Laikipia', 0),
                                ('Thomas Mwangi', 'Senators', 'Laikipia', 0),
                                ('John Kariuki', 'Senators', 'Laikipia', 0),
                                ('Catherine Njeri', 'Members of the National Assembly', 'Laikipia', 0),
                                ('Henry Gichuki', 'Members of the National Assembly', 'Laikipia', 0),
                                ('Jane Wairimu', 'Members of the National Assembly', 'Laikipia', 0),
                                ('Patrick Wachira', 'Members of County Assemblies', 'Laikipia', 0),
                                ('Lucy Wanjiru', 'Members of County Assemblies', 'Laikipia', 0),
                                ('George Kariuki', 'Members of County Assemblies', 'Laikipia', 0),
                                -- Busia
                                ('Ruth Adhiambo', 'Governors', 'Busia', 0),
                                ('Mercy Adoyo', 'Governors', 'Busia', 0),
                                ('Nancy Achieng', 'Governors', 'Busia', 0),
                                ('Peter Odhiambo', 'Senators', 'Busia', 0),
                                ('Alfred Okoth', 'Senators', 'Busia', 0),
                                ('Kelvin Onyango', 'Senators', 'Busia', 0),
                                ('Patrick Otieno', 'Members of the National Assembly', 'Busia', 0),
                                ('Rose Akinyi', 'Members of the National Assembly', 'Busia', 0),
                                ('Brian Omondi', 'Members of the National Assembly', 'Busia', 0),
                                ('James Oduor', 'Members of County Assemblies', 'Busia', 0),
                                ('Clara Akinyi', 'Members of County Assemblies', 'Busia', 0),
                                ('Dennis Owino', 'Members of County Assemblies', 'Busia', 0),
                                -- Makueni
                                ('Elijah Mutua', 'Governors', 'Makueni', 0),
                                ('Anthony Kyalo', 'Governors', 'Makueni', 0),
                                ('Philip Nzomo', 'Governors', 'Makueni', 0),
                                ('David Mutiso', 'Senators', 'Makueni', 0),
                                ('Francis Mutuku', 'Senators', 'Makueni', 0),
                                ('Paul Kilonzo', 'Senators', 'Makueni', 0),
                                ('Joseph Musyoka', 'Members of the National Assembly', 'Makueni', 0),
                                ('Mary Wambua', 'Members of the National Assembly', 'Makueni', 0),
                                ('Stephen Muli', 'Members of the National Assembly', 'Makueni', 0),
                                ('Pauline Mwikali', 'Members of County Assemblies', 'Makueni', 0),
                                ('Mercy Wanjala', 'Members of County Assemblies', 'Makueni', 0),
                                ('Peter Mwadime', 'Members of County Assemblies', 'Makueni', 0),
                                -- Kwale
                                ('Zainab Hassan', 'Governors', 'Kwale', 0),
                                ('Zuhura Saidi', 'Governors', 'Kwale', 0),
                                ('Fatuma Ali', 'Governors', 'Kwale', 0),
                                ('Hassan Juma', 'Senators', 'Kwale', 0),
                                ('Ahmed Said', 'Senators', 'Kwale', 0),
                                ('Salim Bakari', 'Senators', 'Kwale', 0),
                                ('Aisha Suleiman', 'Members of the National Assembly', 'Kwale', 0),
                                ('Mohamed Yusuf', 'Members of the National Assembly', 'Kwale', 0),
                                ('Omar Hassan', 'Members of the National Assembly', 'Kwale', 0),
                                ('Leyla Abdi', 'Members of County Assemblies', 'Kwale', 0),
                                ('Saida Juma', 'Members of County Assemblies', 'Kwale', 0),
                                ('Yusuf Ahmed', 'Members of County Assemblies', 'Kwale', 0),
                                -- Narok
                                ('Simon Langat', 'Governors', 'Narok', 0),
                                ('Samuel Rotich', 'Governors', 'Narok', 0),
                                ('Joseph Kiptoo', 'Governors', 'Narok', 0),
                                ('Mercy Chepkoech', 'Senators', 'Narok', 0),
                                ('Wilson Kipchumba', 'Senators', 'Narok', 0),
                                ('Emily Chelangat', 'Senators', 'Narok', 0),
                                ('Judy Chepngetich', 'Members of the National Assembly', 'Narok', 0),
                                ('David Kiprotich', 'Members of the National Assembly', 'Narok', 0),
                                ('Faith Jepkemei', 'Members of the National Assembly', 'Narok', 0),
                                ('Sharon Jepkorir', 'Members of County Assemblies', 'Narok', 0),
                                ('Moses Koech', 'Members of County Assemblies', 'Narok', 0),
                                ('Betty Chebet', 'Members of County Assemblies', 'Narok', 0),
                                -- Nyandarua
                                ('Lucy Wanjiru', 'Governors', 'Nyandarua', 0),
                                ('Veronica Muthoni', 'Governors', 'Nyandarua', 0),
                                ('Grace Wanjiku', 'Governors', 'Nyandarua', 0),
                                ('Daniel Kamau', 'Senators', 'Nyandarua', 0),
                                ('Thomas Mwangi', 'Senators', 'Nyandarua', 0),
                                ('John Kariuki', 'Senators', 'Nyandarua', 0),
                                ('Catherine Njeri', 'Members of the National Assembly', 'Nyandarua', 0),
                                ('Henry Gichuki', 'Members of the National Assembly', 'Nyandarua', 0),
                                ('Jane Wairimu', 'Members of the National Assembly', 'Nyandarua', 0),
                                ('Patrick Wachira', 'Members of County Assemblies', 'Nyandarua', 0),
                                ('Esther Wambugu', 'Members of County Assemblies', 'Nyandarua', 0),
                                ('George Kariuki', 'Members of County Assemblies', 'Nyandarua', 0),
                                -- Bungoma
                                ('Victor Ochieng', 'Governors', 'Bungoma', 0),
                                ('James Oduor', 'Governors', 'Bungoma', 0),
                                ('Patrick Otieno', 'Governors', 'Bungoma', 0),
                                ('Peter Odhiambo', 'Senators', 'Bungoma', 0),
                                ('Alfred Okoth', 'Senators', 'Bungoma', 0),
                                ('Kelvin Onyango', 'Senators', 'Bungoma', 0),
                                ('Nancy Achieng', 'Members of the National Assembly', 'Bungoma', 0),
                                ('Rose Akinyi', 'Members of the National Assembly', 'Bungoma', 0),
                                ('Brian Omondi', 'Members of the National Assembly', 'Bungoma', 0),
                                ('Mercy Adoyo', 'Members of County Assemblies', 'Bungoma', 0),
                                ('Clara Akinyi', 'Members of County Assemblies', 'Bungoma', 0),
                                ('Dennis Owino', 'Members of County Assemblies', 'Bungoma', 0),
                                -- Kajiado
                                ('Beatrice Chepkemoi', 'Governors', 'Kajiado', 0),
                                ('Betty Chebet', 'Governors', 'Kajiado', 0),
                                ('Simon Langat', 'Governors', 'Kajiado', 0),
                                ('Mercy Chepkoech', 'Senators', 'Kajiado', 0),
                                ('Joseph Kiptoo', 'Senators', 'Kajiado', 0),
                                ('Wilson Kipchumba', 'Senators', 'Kajiado', 0),
                                ('Emily Chelangat', 'Members of the National Assembly', 'Kajiado', 0),
                                ('Judy Chepngetich', 'Members of the National Assembly', 'Kajiado', 0),
                                ('David Kiprotich', 'Members of the National Assembly', 'Kajiado', 0),
                                ('Faith Jepkemei', 'Members of County Assemblies', 'Kajiado', 0),
                                ('Sharon Jepkorir', 'Members of County Assemblies', 'Kajiado', 0),
                                ('Moses Koech', 'Members of County Assemblies', 'Kajiado', 0),
                                -- Meru
                                ('Michael Ndegwa', 'Governors', 'Meru', 0),
                                ('Peter Njeru', 'Governors', 'Meru', 0),
                                ('Martin Kimani', 'Governors', 'Meru', 0),
                                ('Grace Wanjiku', 'Senators', 'Meru', 0),
                                ('Jane Wairimu', 'Senators', 'Meru', 0),
                                ('John Kariuki', 'Senators', 'Meru', 0),
                                ('Catherine Njeri', 'Members of the National Assembly', 'Meru', 0),
                                ('Henry Gichuki', 'Members of the National Assembly', 'Meru', 0),
                                ('Esther Wambugu', 'Members of the National Assembly', 'Meru', 0),
                                ('Patrick Wachira', 'Members of County Assemblies', 'Meru', 0),
                                ('Lucy Wanjiru', 'Members of County Assemblies', 'Meru', 0),
                                ('George Kariuki', 'Members of County Assemblies', 'Meru', 0),
                                -- Isiolo
                                ('Fatima Abdi', 'Governors', 'Isiolo', 0),
                                ('Naima Osman', 'Governors', 'Isiolo', 0),
                                ('Amina Mohammed', 'Governors', 'Isiolo', 0),
                                ('Abdul Omar', 'Senators', 'Isiolo', 0),
                                ('Yusuf Ahmed', 'Senators', 'Isiolo', 0),
                                ('Hassan Omar', 'Senators', 'Isiolo', 0),
                                ('Halima Yusuf', 'Members of the National Assembly', 'Isiolo', 0),
                                ('Salma Ibrahim', 'Members of the National Assembly', 'Isiolo', 0),
                                ('Aisha Dahir', 'Members of the National Assembly', 'Isiolo', 0),
                                ('Leyla Abdi', 'Members of County Assemblies', 'Isiolo', 0),
                                ('Saida Omar', 'Members of County Assemblies', 'Isiolo', 0),
                                ('Mohamed Yusuf', 'Members of County Assemblies', 'Isiolo', 0),
                                -- Samburu
                                ('Charles Kipkirui', 'Governors', 'Samburu', 0),
                                ('David Kiprop', 'Governors', 'Samburu', 0),
                                ('Samuel Rotich', 'Governors', 'Samburu', 0),
                                ('Mercy Chepkoech', 'Senators', 'Samburu', 0),
                                ('Joseph Kiptoo', 'Senators', 'Samburu', 0),
                                ('Wilson Kipchumba', 'Senators', 'Samburu', 0),
                                ('Emily Chelangat', 'Members of the National Assembly', 'Samburu', 0),
                                ('Judy Chepngetich', 'Members of the National Assembly', 'Samburu', 0),
                                ('Faith Jepkemei', 'Members of the National Assembly', 'Samburu', 0),
                                ('Sharon Jepkorir', 'Members of County Assemblies', 'Samburu', 0),
                                ('Moses Koech', 'Members of County Assemblies', 'Samburu', 0),
                                ('Betty Chebet', 'Members of County Assemblies', 'Samburu', 0),
                                -- Vihiga
                                ('Dorcas Auma', 'Governors', 'Vihiga', 0),
                                ('Clara Akinyi', 'Governors', 'Vihiga', 0),
                                ('Nancy Achieng', 'Governors', 'Vihiga', 0),
                                ('Peter Odhiambo', 'Senators', 'Vihiga', 0),
                                ('Alfred Okoth', 'Senators', 'Vihiga', 0),
                                ('Kelvin Onyango', 'Senators', 'Vihiga', 0),
                                ('Patrick Otieno', 'Members of the National Assembly', 'Vihiga', 0),
                                ('Rose Akinyi', 'Members of the National Assembly', 'Vihiga', 0),
                                ('Brian Omondi', 'Members of the National Assembly', 'Vihiga', 0),
                                ('Mercy Adoyo', 'Members of County Assemblies', 'Vihiga', 0),
                                ('James Oduor', 'Members of County Assemblies', 'Vihiga', 0),
                                ('Dennis Owino', 'Members of County Assemblies', 'Vihiga', 0),
                                -- Marsabit
                                ('Stephen Muli', 'Governors', 'Marsabit', 0),
                                ('Joseph Musyoka', 'Governors', 'Marsabit', 0),
                                ('Elijah Mutua', 'Governors', 'Marsabit', 0),
                                ('David Mutiso', 'Senators', 'Marsabit', 0),
                                ('Francis Mutuku', 'Senators', 'Marsabit', 0),
                                ('Paul Kilonzo', 'Senators', 'Marsabit', 0),
                                ('Anthony Kyalo', 'Members of the National Assembly', 'Marsabit', 0),
                                ('Mary Wambua', 'Members of the National Assembly', 'Marsabit', 0),
                                ('Philip Nzomo', 'Members of the National Assembly', 'Marsabit', 0),
                                ('Pauline Mwikali', 'Members of County Assemblies', 'Marsabit', 0),
                                ('Mercy Wanjala', 'Members of County Assemblies', 'Marsabit', 0),
                                ('Peter Mwadime', 'Members of County Assemblies', 'Marsabit', 0),
                                -- Turkana
                                ('Joyce Cherop', 'Governors', 'Turkana', 0),
                                ('Faith Jepkemei', 'Governors', 'Turkana', 0),
                                ('Mercy Chepkoech', 'Governors', 'Turkana', 0),
                                ('Joseph Kiptoo', 'Senators', 'Turkana', 0),
                                ('Samuel Kiprono', 'Senators', 'Turkana', 0),
                                ('Wilson Kipchumba', 'Senators', 'Turkana', 0),
                                ('Emily Chelangat', 'Members of the National Assembly', 'Turkana', 0),
                                ('Judy Chepngetich', 'Members of the National Assembly', 'Turkana', 0),
                                ('David Kiprotich', 'Members of the National Assembly', 'Turkana', 0),
                                ('Sharon Jepkorir', 'Members of County Assemblies', 'Turkana', 0),
                                ('Moses Koech', 'Members of County Assemblies', 'Turkana', 0),
                                ('Betty Chebet', 'Members of County Assemblies', 'Turkana', 0),
                                -- Tharaka-Nithi
                                ('George Kariuki', 'Governors', 'Tharaka-Nithi', 0),
                                ('Patrick Wachira', 'Governors', 'Tharaka-Nithi', 0),
                                ('Martin Kimani', 'Governors', 'Tharaka-Nithi', 0),
                                ('Grace Wanjiku', 'Senators', 'Tharaka-Nithi', 0),
                                ('Jane Wairimu', 'Senators', 'Tharaka-Nithi', 0),
                                ('John Kariuki', 'Senators', 'Tharaka-Nithi', 0),
                                ('Catherine Njeri', 'Members of the National Assembly', 'Tharaka-Nithi', 0),
                                ('Henry Gichuki', 'Members of the National Assembly', 'Tharaka-Nithi', 0),
                                ('Esther Wambugu', 'Members of the National Assembly', 'Tharaka-Nithi', 0),
                                ('Thomas Mwangi', 'Members of County Assemblies', 'Tharaka-Nithi', 0),
                                ('Lucy Wanjiru', 'Members of County Assemblies', 'Tharaka-Nithi', 0),
                                ('Peter Njeru', 'Members of County Assemblies', 'Tharaka-Nithi', 0),
                                -- Nairobi
                                ('Saida Omar', 'Governors', 'Nairobi', 0),
                                ('Leyla Abdi', 'Governors', 'Nairobi', 0),
                                ('Amina Mohammed', 'Governors', 'Nairobi', 0),
                                ('Hassan Juma', 'Senators', 'Nairobi', 0),
                                ('Yusuf Ahmed', 'Senators', 'Nairobi', 0),
                                ('Abdul Omar', 'Senators', 'Nairobi', 0),
                                ('Fatima Abdi', 'Members of the National Assembly', 'Nairobi', 0),
                                ('Salma Ibrahim', 'Members of the National Assembly', 'Nairobi', 0),
                                ('Aisha Dahir', 'Members of the National Assembly', 'Nairobi', 0),
                                ('Mohamed Yusuf', 'Members of County Assemblies', 'Nairobi', 0),
                                ('Zainab Omar', 'Members of County Assemblies', 'Nairobi', 0),
                                ('Hawa Ismail', 'Members of County Assemblies', 'Nairobi', 0);
                            `;
                            db.query(seedCandidates, (err) => {
                                if (err) {
                                    console.error('Error seeding candidates:', err);
                                } else {
                                    console.log('✅ Test candidates added with counties');
                                }
                            });
                        }
                    });
                });
            });
        });
    });
});

app.post('/login', (req, res) => {
    try {
        const { id_number } = req.body;
        const sql = 'SELECT * FROM users WHERE id_number = ?';
        db.query(sql, [id_number], (err, results) => {
            if (err) {
                console.error('Login error:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            if (results.length === 0 || id_number !== results[0].id_number) {
                return res.status(401).json({ message: 'Invalid ID number' });
            }
            res.json({ userId: results[0].id, county: results[0].county });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/candidates', (req, res) => {
    const voterId = req.query.voterId;
    if (!voterId) {
        return res.status(400).json({ message: 'Voter ID required' });
    }

    db.query('SELECT county FROM users WHERE id = ?', [voterId], (err, userResults) => {
        if (err) {
            console.error('Error fetching user county:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (userResults.length === 0) {
            return res.status(400).json({ message: 'Invalid voter ID' });
        }
        const county = userResults[0].county;

        const sql = `
            SELECT * FROM candidates 
            WHERE category = 'President' AND county IS NULL
            OR (category != 'President' AND county = ?)
        `;
        db.query(sql, [county], (err, results) => {
            if (err) {
                console.error('Error fetching candidates:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            res.json(results);
        });
    });
});

app.post('/vote', (req, res) => {
    try {
        const { voterId, candidateId } = req.body;
        const getCategorySql = 'SELECT category FROM candidates WHERE id = ?';
        db.query(getCategorySql, [candidateId], (err, candidateResults) => {
            if (err) {
                console.error('Error fetching candidate category:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            if (candidateResults.length === 0) {
                return res.status(400).json({ message: 'Invalid candidate ID' });
            }
            const category = candidateResults[0].category;
            const checkVoteSql = 'SELECT * FROM votes WHERE voter_id = ? AND category = ?';
            db.query(checkVoteSql, [voterId, category], (err, voteResults) => {
                if (err) {
                    console.error('Vote check error:', err);
                    return res.status(500).json({ message: 'Database error' });
                }
                if (voteResults.length > 0) {
                    return res.status(400).json({ message: `You have already voted in the ${category} category` });
                }
                const voteSql = 'INSERT INTO votes (voter_id, candidate_id, category) VALUES (?, ?, ?)';
                db.query(voteSql, [voterId, candidateId, category], (err) => {
                    if (err) {
                        console.error('Vote insert error:', err);
                        return res.status(500).json({ message: 'Database error' });
                    }
                    const updateCandidateSql = 'UPDATE candidates SET votes = votes + 1 WHERE id = ?';
                    db.query(updateCandidateSql, [candidateId], (err) => {
                        if (err) {
                            console.error('Vote update error:', err);
                            return res.status(500).json({ message: 'Database error' });
                        }
                        res.json({ success: true, message: 'Vote recorded successfully' });
                    });
                });
            });
        });
    } catch (error) {
        console.error('Vote error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});