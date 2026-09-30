CREATE TABLE `users` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`dni` text NOT NULL UNIQUE,
	`telefono` text NOT NULL UNIQUE,
	`email` text NOT NULL UNIQUE,
	`password` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
