-- drop table if exists users

create table users (
  id serial primary key,
  email varchar(255) not null unique,
  username varchar(128) not null unique,
  full_name varchar(255) not null,
  password varchar(255) not null,
  api_key varchar(255) not null unique,
  reset_password_hash varchar(255),
  reset_password_date timestamp,
  ip varchar(140),
  created_at timestamp not null default current_timestamp
);
