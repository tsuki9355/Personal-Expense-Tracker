-- Runs every time the app starts. "IF NOT EXISTS" makes that safe.
CREATE TABLE IF NOT EXISTS expenses (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    description   VARCHAR(255)   NOT NULL,
    category      VARCHAR(50)    NOT NULL,
    amount        DECIMAL(10, 2) NOT NULL,
    expense_date  DATE           NOT NULL
);
