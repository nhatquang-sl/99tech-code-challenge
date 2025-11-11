# Overview
 - The Leaderboard Service is responsible for maintaining a live-updating top 10 user scores on our website.
 - This module ensures that user scores are updated securely upon completion of actions, while preventing unauthorized score manipulation.

## Assumptions
- The leaderboard calculates data from 00:00 yesterday until the current time.
- The `/action` API allows a user to perform an action that increases their score.
    - Authentication is required.
    - A user can call this API 60 per minute.
- **[NOTE]** Arbitrary time windows are not currently supported and may be considered as a future improvement.

# Flow of Execution

## Calculate Top 10
![Calculate Leaderboard](https://img.plantuml.biz/plantuml/svg/RPB1JiCm38RlUGg_01fSUq2Ru8Aue26qivk64JLBGk9euksnqxHh4JtvZtz_yHzrdmaJbOjJg2aacBwFREOICnHMAhBDQXlH4nmqsU0FRo_IvJcCLdqNKqoRUSNF4M_peqYbWwSKN3ry__7w5DBORc7FjIer866FkOAULpKxvjO6z8HE5uTajZIDxX_WqGmsDqUIMYc91dUFBGHqCkbWXpKWI4BLMcogETWJI-zi_eABoHdF1YYqY3UhS3k-9CVWUULfcJNZR0WGUYIzSFBAjgpTGL_S29OfYTIIwuz7Q29b5Jq_2Oi83_VRePgxQxpcaAdfFJRMAKCsVW1lhZDjprf-bry0 "Calculate Leaderboard")
1. The user calls the `/action` API to perform an action. This API should include **authentication** and **rate limiting**.
2. After the user completes the action, the API method should **publish a message to Kafka**.
    - We can **scale horizontally** by using multiple Kafka topic partitions. As far as I know, a single Kafka partition can handle around **100,000 messages per second**.
3. The **SyncWorker** retrieves batches of messages from Kafka and synchronizes them with the **MSSQL database**.
    - It calculates the user’s **total score per minute** and performs an **upsert** operation to the database.
    - The database should be partitioned by **day of year (day_year)** to improve read and write performance.
    - We can **scale SyncWorker horizontally** by running multiple instances.
4. The **CalculateWorker** runs at one-minute intervals to retrieve data from the previous minute and compute the **top 10 users**. After calculation, it stores the top 10 results in Redis and sends them to users via **WebSocket** or **Server-Sent Events (SSE)**.

## Get Top 10
![Get Top 10 User's Score](https://img.plantuml.biz/plantuml/svg/HO-n2W8n38RtFaKs9r7N6-GS1GSHV82q3LAervAaxszpFRbCIVylN-WiYgpjcnq6BGoZtaB_5WLQdrpjM0gfugBm88p4lY37s_DkIFPOaukew578zbuKasm2jjuvyy3nEc2O863ESCgx3CpcHjovTQrp7rBGKk5otZDpJPtGniiMhcy70Gc5gP-RQOdsiHy0 "Get Top 10 User's Score")
1. User call `/leaderboard` API to get top 10 User's Score
2. The `/leaderboard` API get top Users' Score from Redis then return to User

# Database
- **UserScore**: with primary key is `userId`. This table store user's score only for today.

|  Column | DataType | Note |
|---|---|---|
| UserId | guid |  |
| Score | smallint | total score in a minute |

- **UserScoreByDate**: with primary key is `userId-timestamp`

|  Column | DataType | Note |
|---|---|---|
| UserId | guid |  |
| Timestamp | uint | date-level timestamp  |
| Score | smallint | total score in a minute |

# API Endpoints

|  Endpoint | Method | Auth Type | Response
|---|---|---|---|
| /action | POST | JWT Token |  |
| /leaderboard | GET | JWT Token  | ```[{username: string, score: number}]``` |

# Tasks
## Implement /action API
- Implement the /action API. After completing the business logic, publish a message to the user-score Kafka topic in the following format:
    ```typescript
    {
        userId: string,
        score: number
    }
    ```
- The API requires authentication.
- Apply a rate limit of 60 requests per minute.

## Implement SyncWorker
- The worker retrieves a batch of 100 messages from the `user-score` Kafka topic.
- It aggregates (sums) user scores by minute, then performs an upsert into the **UserScore** table.
- **NOTE:** We may need to record the last successful sync in **Redis**. In case the worker crashes, it can use this information to know where to resume.

## Implement CalculateWorker
- The worker runs at **one-minute intervals**.
- It sums user scores from the beginning of the current day using data in the **UserScore** table, adds each user’s score from the **previous day**, and writes the top **10 user scores** to **Redis**.
- At the end of the day, it aggregates the total user scores and writes them to the UserScoreByDate table, then cleans up the **UserScore** table.

## Implement /leaderboard API
- Implement the `/leaderboard` API to retrieve the top **10 user scores** from **Redis**.


