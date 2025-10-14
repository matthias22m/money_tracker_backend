# Database Schemas

This file contains the database schemas for all the entities in the application.

## Users

-   `id`: uuid (Primary Key)
-   `name`: varchar(100)
-   `username`: varchar(50) (unique)
-   `email`: varchar(120) (unique)
-   `password`: varchar(255) (nullable)
-   `profile`: text (nullable)
-   `is_active`: boolean (default: true)
-   `is_email_verified`: boolean (default: false)
-   `provider`: varchar (default: 'local')
-   `provider_id`: varchar (nullable)
-   `created_at`: timestamp
-   `current_hashed_refresh_token`: varchar (nullable)
-   `updated_at`: timestamp
-   `verification_token`: varchar (nullable)
-   `password_reset_token`: varchar (nullable)
-   `password_reset_expires`: timestamp (nullable)
-   `new_email`: varchar (nullable)
-   `email_change_token`: varchar (nullable)

## Complaints

-   `id`: uuid (Primary Key)
-   `loan_id`: uuid (Foreign Key to `loans`)
-   `user_id`: uuid (Foreign Key to `users`)
-   `reason`: text
-   `status`: enum (ComplaintStatus)
-   `created_at`: timestamp

### ComplaintStatus Enum

-   `open`
-   `resolved`
-   `rejected`


## Categories

-   `id`: uuid (Primary Key)
-   `name`: varchar(100)
-   `color`: varchar(7)
-   `icon`: varchar(50)
-   `user_id`: uuid (Foreign Key to `users`)

## Expenses

-   `id`: uuid (Primary Key)
-   `amount`: decimal(10, 2)
-   `type`: enum (ExpenseType)
-   `note`: text (nullable)
-   `date`: date
-   `user_id`: uuid (Foreign Key to `users`)
-   `category_id`: uuid (Foreign Key to `categories`)
-   `created_at`: timestamp

### ExpenseType Enum

-   `income`
-   `expense`

## Budgets

-   `id`: uuid (Primary Key)
-   `amount`: decimal(10, 2)
-   `month`: int
-   `year`: int
-   `user_id`: uuid (Foreign Key to `users`)
-   `created_at`: timestamp

## Friend Requests

-   `id`: uuid (Primary Key)
-   `sender_id`: uuid (Foreign Key to `users`)
-   `receiver_id`: uuid (Foreign Key to `users`)
-   `status`: enum (FriendStatus)
-   `created_at`: timestamp
-   `updated_at`: timestamp

### FriendStatus Enum

-   `pending`
-   `accepted`
-   `rejected`

## Friends

-   `id`: uuid (Primary Key)
-   `user_id`: uuid (Foreign Key to `users`)
-   `friend_id`: uuid (Foreign Key to `users`)
-   `created_at`: timestamp

## Loans

-   `id`: uuid (Primary Key)
-   `lender_id`: uuid (Foreign Key to `users`)
-   `borrower_id`: uuid (Foreign Key to `users`)
-   `amount`: decimal(10, 2)
-   `description`: text (nullable)
-   `status`: enum (LoanStatus)
-   `created_at`: timestamp

### LoanStatus Enum

-   `active`
-   `settled`
-   `rejected`

## Notifications

-   `id`: uuid (Primary Key)
-   `user_id`: uuid (Foreign Key to `users`)
-   `type`: enum (NotificationType)
-   `message`: text
-   `is_read`: boolean (default: false)
-   `loan_id`: uuid (nullable)
-   `settlement_id`: uuid (nullable)
-   `friend_request_id`: uuid (nullable)
-   `created_at`: timestamp

### NotificationType Enum

-   `friend_request`
-   `loan_created`
-   `settlement_pending`
-   `settlement_confirmed`
-   `complaint_filed`
-   `complaint_resolved`

## Settlements

-   `id`: uuid (Primary Key)
-   `loan_id`: uuid (Foreign Key to `loans`)
-   `payer_id`: uuid (Foreign Key to `users`)
-   `receiver_id`: uuid (Foreign Key to `users`)
-   `amount`: decimal(10, 2)
-   `status`: enum (SettlementStatus)
-   `created_at`: timestamp

### SettlementStatus Enum

-   `pending`
-   `confirmed`
-   `rejected`
