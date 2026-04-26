# Entity-Relationship Diagram

```mermaid
erDiagram
    users {
        int user_id PK
        varchar email UK
        varchar password_hash
        varchar full_name
        enum role "admin/staff"
        timestamp created_at
    }

    passengers {
        int passenger_id PK
        varchar passenger_name
        int age
        enum gender
        varchar contact
        varchar email
        timestamp created_at
    }

    trains {
        int train_id PK
        varchar train_number UK
        varchar train_name
        varchar source
        varchar destination
        int total_seats
        int available_seats
        time departure_time
        time arrival_time
        decimal fare
        timestamp created_at
    }

    reservations {
        int reservation_id PK
        int passenger_id FK
        int train_id FK
        date booking_date
        date travel_date
        int seat_number
        enum status "confirmed/cancelled/waitlisted"
        timestamp created_at
    }

    passengers ||--o{ reservations : "makes"
    trains ||--o{ reservations : "has"
```

### Relationships Explained:
- **Passenger to Reservation (1:N)**: A passenger can make zero or multiple reservations. If a passenger is deleted, their reservations are deleted (`ON DELETE CASCADE`).
- **Train to Reservation (1:N)**: A train can have zero or multiple reservations. A train cannot be deleted if it has active reservations (`ON DELETE RESTRICT`).
