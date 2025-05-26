show databases;

use raycom;
show tables from  raycom;
drop table work;

create database vit;
use vit;
create table cse(
id int,
e_name varchar(20) 
);
select * from cse;
start transaction;
insert into cse values(1001,"Rayyan");
savepoint a11;
insert into cse values(1001,"Rizwan");
savepoint a12;
update cse set id=1002 where e_name="Rizwan";
delete from cse where id=1002;
savepoint a13;
select * from cse;

rollback to a12;
rollback to a13;

select * from cse;
update cse set id=1002 where e_name="Rizwan";
commit;


select id as rollnum from cse;
desc cse;

select e_name from cse where id>=1000 ;
insert into cse values(1002,"Siddharth");
insert into cse values(1004,"Tanishk");
insert into cse values(1005,"Ritesh");
insert into cse values(1008,"Varshitha");
insert into cse values(1007,"Venkat");

select e_name from cse where id > 1005;
select e_name from cse where id <= 1005;
select e_name from cse where id<1003;

desc cse;
select * from cse;

alter table cse add(
salary int,
department varchar(20)
);

update cse set salary=1000000, department="ceo" where id=1001;
update cse set salary=780000, department="Director" where id=1003;
update cse set salary=600000, department="Medical" where id=1002;
update cse set salary=500000, department="Finance" where id=1004;
update cse set salary=400000, department="organizer" where id=1005;
update cse set salary=300000, department="HR" where id=1007;
update cse set salary=850000, department="Research" where id=1008;
select * from cse;
update cse set id=1003 where e_name="rizwan";

select e_name from cse where id>1005 and salary>90000;
select e_name from cse where id<1005 or salary>900000;
select e_name from cse where salary>0 and salary <500000;