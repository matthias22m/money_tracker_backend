# API Documentation

This document provides a summary of the API endpoints, their functionalities, and the data they return.

## Users

### `GET /users/search`
- **Description**: Search for users by name, username, or email.
- **Query Parameters**:
  - `query` (required): Search term
  - `excludeFriends` (optional, default: false): Exclude existing friends from results
- **Authentication**: Required (JWT)
- **Returns**: `UserSearchResponse[]`
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "username": "string",
      "email": "string",
      "profile": "string",
      "isFriend": false,
      "hasPendingRequest": false
    }
  ]
  ```

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

### `POST /expense/budget`
- **Description**: Create a new budget.
- **Returns**: `Budget`

### `GET /expense/budget`
- **Description**: Find all budgets for the current user.
- **Returns**: `Budget[]`

### `GET /expense/budget/:id`
- **Description**: Get a budget by ID.
- **Returns**: `Budget`

### `PATCH /expense/budget/:id`
- **Description**: Update a budget.
- **Returns**: `Budget`

### `DELETE /expense/budget/:id`
- **Description**: Remove a budget.
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

### `GET /friends/requests`
- **Description**: List all friend requests for the authenticated user. Pass `type=sent` to get sent requests.
- **Returns**: `FriendRequest[]`

### `DELETE /friends/:friendId`
- **Description**: Remove a friend.
- **Returns**: `204 No Content`

## Loans

### `POST /loans`
- **Description**: Create a new loan.
- **Returns**: `Loan`

### `POST /loans/multiple`
- **Description**: Create multiple loans with the same amount for different borrowers.
- **Request Body**:
  ```json
  {
    "borrowerIds": ["uuid1", "uuid2", "uuid3"],
    "amount": 50.00,
    "description": "Shared expense"
  }
  ```
- **Returns**: `Loan[]`

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

## Groups

### `POST /groups`
- **Description**: Create a new private group.
- **Authentication**: Required (JWT)
- **Request Body**:
  ```json
  {
    "name": "Weekend Squad",
    "description": "Friends I hang out with on weekends",
    "members": ["uuid1", "uuid2"]
  }
  ```
- **Returns**: `GroupResponseDto`

### `GET /groups`
- **Description**: List all groups owned by the current user.
- **Authentication**: Required (JWT)
- **Returns**: `GroupResponseDto[]`

### `GET /groups/:id`
- **Description**: Get details of a specific group (owner only).
- **Authentication**: Required (JWT)
- **Returns**: `GroupResponseDto`

### `POST /groups/:id/members`
- **Description**: Add members to a group.
- **Authentication**: Required (JWT)
- **Request Body**:
  ```json
  {
    "members": ["uuid3", "uuid4"]
  }
  ```
- **Returns**: `GroupResponseDto`

### `DELETE /groups/:id/members/:memberId`
- **Description**: Remove a member from a group.
- **Authentication**: Required (JWT)
- **Returns**: `GroupResponseDto`

### `POST /groups/:id/expense`
- **Description**: Add an expense to a group and split equally among all participants. Creates individual loan records for each member.
- **Authentication**: Required (JWT)
- **Request Body**:
  ```json
  {
    "amount": 100.50,
    "description": "Dinner at restaurant",
    "date": "2025-10-16T23:00:00Z"
  }
  ```
- **Returns**:
  ```json
  {
    "groupExpenseId": "string",
    "loanIds": ["string"],
    "totalAmount": 100.50,
    "participantsCount": 4,
    "message": "Expense of 100.5 split among 4 participants. 3 loans created."
  }
  ```

### `DELETE /groups/:id`
- **Description**: Delete a group and all its members.
- **Authentication**: Required (JWT)
- **Returns**: `204 No Content`
