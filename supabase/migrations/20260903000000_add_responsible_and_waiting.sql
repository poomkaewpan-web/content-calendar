-- Keep production contents compatible with the application status values.
alter table public.contents
  add column if not exists responsible text null;

-- Convert the legacy value before enforcing the current status contract.
update public.contents
set status = 'waiting'
where status = 'waiting_publish';

do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select con.conname
    from pg_constraint con
    where con.conrelid = 'public.contents'::regclass
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%status%'
  loop
    execute format('alter table public.contents drop constraint %I', constraint_name);
  end loop;

  alter table public.contents
    add constraint contents_status_check
    check (status in ('not_cut', 'editing', 'waiting', 'published', 'cannot_publish'));
exception
  when duplicate_object then
    null;
end
$$;

-- Make the new column and constraint visible to the REST API immediately.
notify pgrst, 'reload schema';
