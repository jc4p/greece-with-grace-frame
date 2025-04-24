-- We don't need to add these columns to the votes table
-- The username and profile_picture_url columns are only needed in the grace_applications table

-- For reference, here's the ALTER TABLE statement for the applications table:
-- ALTER TABLE grace_applications
-- ADD COLUMN username VARCHAR(255) NULL,
-- ADD COLUMN profile_picture_url VARCHAR(1024) NULL; 