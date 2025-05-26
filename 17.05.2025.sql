show databases;
create database raycom;
show tables from raycom;
create database mancom;
drop database mancom;


create table wrok(
id int,
E_name varchar(10),
E_num int,
E_position varchar(10)
);


use raycom;
select * from  employees;
select * from wrok;


desc employees;
insert into employees values(10,'Paul',10000,'News');
insert into wrok values(10,'Paul',10000,'News');

UPDATE employees SET E_name="HAPPY" WHERE id=10;
UPDATE employees SET e_num=e_num+100;