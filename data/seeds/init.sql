
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.hello_world (
    id SERIAL PRIMARY KEY,
    uuid uuid DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    return_string varchar(15) NOT NULL
)