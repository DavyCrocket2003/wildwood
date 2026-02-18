-- Add has_detail_page column to services table
-- This migration adds a boolean column to control whether a service should link to a detail page

ALTER TABLE services ADD COLUMN has_detail_page BOOLEAN DEFAULT TRUE;

-- Update existing services to have detail pages by default
UPDATE services SET has_detail_page = TRUE WHERE has_detail_page IS NULL;
