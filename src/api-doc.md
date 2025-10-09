# API Documentation

This document provides a summary of the API endpoints, their functionalities, and the data they return.

## Users

### `POST /users`
- **Description**: Create a new user.
- **Returns**: `UserResponseDto`
  ```json
  {
    "id": "string",
    "name": "string",
    "username": "string",
    "email": "string",
    "profile": "string",
    "isEmailVerified": "boolean",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
  ```

### `GET /users`
- **Description**: Get all users.
- **Returns**: `UserResponseDto[]`

### `GET /users/profile/me`
- **Description**: Get current user profile.
- **Returns**: `UserResponseDto`

### `GET /users/:id`
- **Description**: Get a user by ID.
- **Returns**: `UserResponseDto`

### `PATCH /users/:id`
- **Description**: Update a user.
- **Returns**: `UserResponseDto`

### `DELETE /users/:id`
- **Description**: Delete a user.
- **Returns**: `204 No Content`

## Analytics

### `GET /analytics/summary`
- **Description**: Get a summary of income, expenses, and loans.
- **Returns**:
  ```json
  {
    "totalIncome": "number",
    "totalExpense": "number",
    "balance": "number",
    "totalLoansLent": "number",
    "totalLoansBorrowed": "number",
    "outstandingLoans": "number"
  }
  ```

### `GET /analytics/category-breakdown`
- **Description**: Get a breakdown of expenses by category for a given month.
- **Returns**:
  ```json
  [
    {
      "categoryId": "string",
      "categoryName": "string",
      "total": "number"
    }
  ]
  ```

### `GET /analytics/expenses/trend`
- **Description**: Get the trend of income and expenses over a number of months.
- **Returns**:
  ```json
  [
    {
      "month": "string",
      "income": "number",
      "expense": "number"
    }
  ]
  ```

### `GET /analytics/loans/summary`
- **Description**: Get a summary of loans for a user.
- **Returns**:
  ```json
  [
    {
      "total_lent": "number",
      "total_borrowed": "number",
      "outstanding_as_borrower": "number"
    }
  ]
  ```

### `GET /analytics/settlements/history`
- **Description**: Get the settlement history for a loan.
- **Returns**: `Settlement[]`

## Analytics (Admin)

### `GET /admin/analytics/revenue`
- **Description**: Get system revenue over a period.
- **Returns**:
  ```json
  {
    "totalIncome": "number",
    "totalExpense": "number"
  }
  ```

### `GET /admin/analytics/top-debtors`
- **Description**: Get top debtors with outstanding loans.
- **Returns**:
  ```json
  [
    {
      "user_id": "string",
      "outstanding": "number"
    }
  ]
  ```

## Auth

### `POST /auth/register`
- **Description**: Register a new user.
- **Returns**:
  ```json
  {
    "message": "Registration successful. Please check your email to verify your account."
  }
  ```

### `GET /auth/verify-email`
- **Description**: Verify a new user's email address.
- **Returns**:
  ```json
  {
    "message": "Email verified successfully."
  }
  ```

### `POST /auth/login`
- **Description**: Log in a user.
- **Returns**:
  ```json
  {
    "accessToken": "string",
    "refreshToken": "string"
  }
  ```

### `POST /auth/request-email-change`
- **Description**: Request to change the user's email address. Requires authentication.
- **Returns**:
  ```json
  {
    "message": "Verification email sent to your new email address."
  }
  ```

### `GET /auth/verify-email-change`
- **Description**: Verify the new email address.
- **Returns**:
  ```json
  {
    "message": "Email address changed successfully."
  }
  ```

### `POST /auth/forgot-password`
- **Description**: Request a password reset.
- **Returns**:
  ```json
  {
    "message": "If a user with that email exists, a password reset link has been sent."
  }
  ```

### `POST /auth/reset-password`
- **Description**: Reset the user's password.
- **Returns**:
  ```json
  {
    "message": "Password has been reset successfully."
  }
  ```

### `POST /auth/refresh`
- **Description**: Refresh authentication tokens.
- **Returns**:
  ```json
  {
    "accessToken": "string",
    "refreshToken": "string"
  }
  ```

## Complaints

### `POST /complaints`
- **Description**: Create a new complaint.
- **Returns**: `Complaint`

### `GET /complaints`
- **Description**: Find complaints.
- **Returns**: `Complaint[]`

### `PATCH /complaints/:id`
- **Description**: Update a complaint.
- **Returns**: `Complaint`

## Expenses

### `POST /expense/categories`
- **Description**: Create a new category.
- **Returns**: `Category`

### `GET /expense/categories`
- **Description**: Find all categories for the current user.
- **Returns**: `Category[]`

### `PATCH /expense/categories/:id`
- **Description**: Update a category.
- **Returns**: `Category`

### `DELETE /expense/categories/:id`
- **Description**: Remove a category.
- **Returns**: `204 No Content`

### `POST /expense`
- **Description**: Create a new expense.
- **Returns**: `Expense`

### `GET /expense`
- **Description**: Find all expenses for the current user.
- **Returns**: `Expense[]`

### `GET /expense/summary`
- **Description**: Get an expense summary for the current user.
- **Returns**: Raw summary data.

### `PATCH /expense/:id`
- **Description**: Update an expense.
- **Returns**: `Expense`

### `DELETE /expense/:id`
- **Description**: Remove an expense.
- **Returns**: `204 No Content`

## Friends

### `POST /friends/request/:receiverId`
- **Description**: Send a friend request.
- **Returns**: `FriendRequest`

### `POST /friends/accept/:requestId`
- **Description**: Accept a friend request.
- **Returns**:
  ```json
  {
    "message": "Friend request accepted"
  }
  ```

### `POST /friends/reject/:requestId`
- **Description**: Reject a friend request.
- **Returns**:
  ```json
  {
    "message": "Friend request rejected"
  }
  ```

### `GET /friends`
- **Description**: List all friends for the authenticated user.
- **Returns**: `Friend[]`

### `DELETE /friends/:friendId`
- **Description**: Remove a friend.
- **Returns**: `204 No Content`

## Loans

### `POST /loans`
- **Description**: Create a new loan.
- **Returns**: `Loan`

### `GET /loans`
- **Description**: Find loans for the current user.
- **Returns**: `Loan[]`

## Notifications

### `SSE /notifications/stream`
- **Description**: Stream notifications using Server-Sent Events.
- **Returns**: A stream of `MessageEvent` objects.

### `GET /notifications`
- **Description**: Find all notifications for the current user.
- **Returns**: `Notification[]`

### `PATCH /notifications/:id/read`
- **Description**: Mark a notification as read.
- **Returns**: `Notification`

### `PATCH /notifications/:id/unread`
- **Description**: Mark a notification as unread.
- **Returns**: `Notification`

## Settlements

### `POST /settlements`
- **Description**: Create a new settlement.
- **Returns**: `Settlement`

### `PATCH /settlements/:id/confirm`
- **Description**: Confirm a settlement.
- **Returns**: `Settlement`

### `PATCH /settlements/:id/reject`
- **Description**: Reject a settlement.
- **Returns**: `Settlement`

### `GET /settlements`
- **Description**: Find settlements for a loan.
- **Returns**: `Settlement[]`
