CREATE TABLE account (
    id uuid PRIMARY KEY,
    first_name text,
    last_name text,
    cs_token text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE UNIQUE INDEX account_pkey ON account(id uuid_ops);

CREATE TABLE "user" (
    id uuid PRIMARY KEY,
    email text,
    password text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    account_id uuid REFERENCES account(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX user_pkey ON "user"(id uuid_ops);

CREATE TABLE coinbase_product (
    id uuid PRIMARY KEY,
    base_currency double precision,
    quote_currency double precision,
    quote_increment double precision,
    base_increment double precision,
    display_name text,
    min_market_funds double precision,
    margin_enabled boolean,
    post_only boolean,
    limit_only boolean,
    cancel_only boolean,
    status text,
    status_message text,
    auction_mode boolean,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE TABLE project (
    id uuid PRIMARY KEY,
    name text,
    goal double precision,
    strategy text,
    notes text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    account_id uuid REFERENCES account(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX project_pkey ON project(id uuid_ops);

CREATE TABLE deal (
    id uuid PRIMARY KEY,
    status text,
    open_date timestamp with time zone,
    close_date timestamp with time zone,
    exchange text,
    fee_type text,
    fee_open double precision,
    fee_close double precision,
    ticker text,
    asset_type text,
    units double precision,
    open_price double precision,
    invest double precision,
    open_fee_amount double precision,
    take_profit double precision,
    take_profit_amount double precision,
    take_profit_fee_amount double precision,
    take_profit_cost_basis double precision,
    take_profit_gross double precision,
    take_profit_price double precision,
    stop_loss double precision,
    stop_loss_amount double precision,
    stop_loss_fee_amount double precision,
    stop_loss_cost_basis double precision,
    stop_loss_gross double precision,
    stop_loss_price double precision,
    close_fee_amount double precision,
    close_cost_basis double precision,
    close_gross double precision,
    close_price double precision,
    profit_loss double precision,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    project_id uuid REFERENCES project(id) ON DELETE SET NULL ON UPDATE CASCADE,
    notes text,
    account_id uuid REFERENCES account(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX deal_pkey ON deal(id uuid_ops);
