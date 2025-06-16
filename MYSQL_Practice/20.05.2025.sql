create database Tuesday;
drop database tuesday;
use tuesday;
drop table category;
create table category(
c_id int primary key,
c_name varchar(25),
c_details varchar(25)
);

insert into category values(101,"electronics","aaaaa");
insert into category values(102,"furniture","bbbbbbbbbb");

select *from category;
drop table products;
create table products(
p_id int primary key,
Po_name varchar(25),
p_details varchar(35),
c_id int,
foreign key products(c_id) references category(c_id) on delete cascade
);
delete from category where c_id=101;
desc products;

insert into products values(502,'iphone','8gb ram',101);



