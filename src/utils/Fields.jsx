// Users Table
export const user_table = '++id, client_id, client, first_name, middle_name, last_name, suffix, gender, birthday, civil_status, status, address_line_1, address_line_2, city, country, contact_no, email, role, remarks, username, created_by, created_at, is_verified';

export const client_table = '++id, name, code, contact_no, description, status, created_by, created_at';

export const parish_table = '++id, client_id, client, parent_id, parent, name, parish_rate, chapel_rate, contact_no, address, remarks, status, created_by, created_at';

export const priest_table = '++id, chapel_id, chapel, client_id, client, created_at, created_by, description,name, parish_id, parish, priest_rate, status';

export const baptism_table = '++id, client_id, client, parish_id, parish, parish_rate, control_id, ref_key, father_firstname, father_middlename, father_lastname, father_suffix, mother_firstname, mother_middlename, mother_lastname, mother_suffix, address, contact, no_of_guest, date_start, time_start, date_end, time_end, remarks, god_child, status, god_parent, created_by, created ';

export const files_table = '++id, uniq_key, module, filename, baseURL, created_by, created_at';

export const wfb_table = '++id, chapel, chapel_id, client, client_id, parish, parish_id, priest_id, age, cause_of_death, chapel_rate, chapel_schedule, civil_status, contact, date_of_birth, date_of_death, decease_fullname, email, end, family_fullname, gender, place_of_death, priest_rate, relation, religion, status, start,  created_by, updated_at';

export const manage_baptism_table = '++id, client_id, parent_id, priest_id, ref_key, uniq_key , total_amount, remarks, payment_status, status, created_by, created_at';

export const manage_wfb_table = '++id, client_id, priest_id, ref_key, chapel_id, parent_id, uniq_key, ref_key, total_amount, remarks, payment_status, status, created_by, created_at';

export const payment_table = '++id, client_id, parent_id, mng_baptism_key, rcvbl_key, uniq_key ,total_amount, remarks, status, created_by, created_at';

export const receivable_table = '++id, client_id, parent_id, uniq_key ,total_amount, remarks, status, created_by, created_at';

export const collection_table = '++id, client_id, parent_id, uniq_key ,total_amount, remarks, status, created_by, created_at';


