-- Fix image column sizes to support longer URLs
-- Run this in TiDB Cloud console

USE Jinka_cms;

-- Increase image column size in hero_sliders
ALTER TABLE hero_sliders MODIFY COLUMN image TEXT;

-- Also fix other tables that might have image columns
ALTER TABLE news MODIFY COLUMN featured_image TEXT;

-- Verify changes
SHOW CREATE TABLE hero_sliders;
SHOW CREATE TABLE news;

SELECT 'Image columns updated successfully!' AS status;
