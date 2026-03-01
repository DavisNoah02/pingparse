CREATE TABLE `checks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`service_id` integer NOT NULL,
	`status_code` integer,
	`latency` integer NOT NULL,
	`is_up` integer NOT NULL,
	`error_msg` text,
	`checked_at` integer NOT NULL,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`interval` integer DEFAULT 60 NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`last_checked` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `services_url_unique` ON `services` (`url`);