-- Seed wedding data (adjust as needed)
INSERT INTO weddings (couple_name_1, couple_name_2, wedding_date, location, address, description, theme_color, accent_color)
VALUES (
  'John',
  'Sabanu',
  '2024-12-19 13:30:00',
  'Lakpazee Community Church',
  'Airfield, Sinkor',
  'A celebration of love and unity',
  '#1e40af',
  '#d4af37'
) ON CONFLICT DO NOTHING;

-- Seed admin user (change this password to something secure!)
-- Password: wedding123 (hash)
INSERT INTO admin_users (wedding_id, password_hash, email)
VALUES (
  1,
  '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  'admin@wedding.local'
) ON CONFLICT DO NOTHING;

-- Seed sample events
INSERT INTO events (wedding_id, event_name, start_time, end_time, location, description, order_position) 
VALUES
  (1, 'Guests Arrival', '2024-12-19 12:30:00', '2024-12-19 13:15:00', 'Church Entrance', 'Welcome refreshments', 1),
  (1, 'Ceremony', '2024-12-19 13:30:00', '2024-12-19 14:30:00', 'Lakpazee Community Church', 'Wedding ceremony', 2),
  (1, 'Reception', '2024-12-19 15:00:00', '2024-12-19 22:00:00', 'Event Center', 'Dinner and dancing', 3)
ON CONFLICT DO NOTHING;

-- Seed sample vow
INSERT INTO vows (wedding_id, person_name, vow_text) 
VALUES
  (1, 'John & Sabanu', 'With this ring, I promise to love you forever.')
ON CONFLICT DO NOTHING;
