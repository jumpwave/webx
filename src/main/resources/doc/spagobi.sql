--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.0
-- Dumped by pg_dump version 9.5.0

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: hibernate_sequences; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE hibernate_sequences (
    sequence_name character varying(200) NOT NULL,
    next_val integer NOT NULL
);


ALTER TABLE hibernate_sequences OWNER TO spagobi;

--
-- Name: qrtz_blob_triggers; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE qrtz_blob_triggers (
    trigger_name character varying(80) NOT NULL,
    trigger_group character varying(80) NOT NULL,
    blob_data bytea
);


ALTER TABLE qrtz_blob_triggers OWNER TO spagobi;

--
-- Name: qrtz_calendars; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE qrtz_calendars (
    calendar_name character varying(80) NOT NULL,
    calendar bytea NOT NULL
);


ALTER TABLE qrtz_calendars OWNER TO spagobi;

--
-- Name: qrtz_cron_triggers; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE qrtz_cron_triggers (
    trigger_name character varying(80) NOT NULL,
    trigger_group character varying(80) NOT NULL,
    cron_expression character varying(80) NOT NULL,
    time_zone_id character varying(80)
);


ALTER TABLE qrtz_cron_triggers OWNER TO spagobi;

--
-- Name: qrtz_fired_triggers; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE qrtz_fired_triggers (
    entry_id character varying(95) NOT NULL,
    trigger_name character varying(80) NOT NULL,
    trigger_group character varying(80) NOT NULL,
    is_volatile boolean NOT NULL,
    instance_name character varying(80) NOT NULL,
    fired_time bigint NOT NULL,
    priority integer NOT NULL,
    state character varying(16) NOT NULL,
    job_name character varying(80),
    job_group character varying(80),
    is_stateful boolean,
    requests_recovery boolean
);


ALTER TABLE qrtz_fired_triggers OWNER TO spagobi;

--
-- Name: qrtz_job_details; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE qrtz_job_details (
    job_name character varying(80) NOT NULL,
    job_group character varying(80) NOT NULL,
    description character varying(120),
    job_class_name character varying(128) NOT NULL,
    is_durable boolean NOT NULL,
    is_volatile boolean NOT NULL,
    is_stateful boolean NOT NULL,
    requests_recovery boolean NOT NULL,
    job_data bytea
);


ALTER TABLE qrtz_job_details OWNER TO spagobi;

--
-- Name: qrtz_job_listeners; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE qrtz_job_listeners (
    job_name character varying(80) NOT NULL,
    job_group character varying(80) NOT NULL,
    job_listener character varying(80) NOT NULL
);


ALTER TABLE qrtz_job_listeners OWNER TO spagobi;

--
-- Name: qrtz_locks; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE qrtz_locks (
    lock_name character varying(40) NOT NULL
);


ALTER TABLE qrtz_locks OWNER TO spagobi;

--
-- Name: qrtz_paused_trigger_grps; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE qrtz_paused_trigger_grps (
    trigger_group character varying(80) NOT NULL
);


ALTER TABLE qrtz_paused_trigger_grps OWNER TO spagobi;

--
-- Name: qrtz_scheduler_state; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE qrtz_scheduler_state (
    instance_name character varying(80) NOT NULL,
    last_checkin_time bigint NOT NULL,
    checkin_interval bigint NOT NULL
);


ALTER TABLE qrtz_scheduler_state OWNER TO spagobi;

--
-- Name: qrtz_simple_triggers; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE qrtz_simple_triggers (
    trigger_name character varying(80) NOT NULL,
    trigger_group character varying(80) NOT NULL,
    repeat_count bigint NOT NULL,
    repeat_interval bigint NOT NULL,
    times_triggered bigint NOT NULL
);


ALTER TABLE qrtz_simple_triggers OWNER TO spagobi;

--
-- Name: qrtz_trigger_listeners; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE qrtz_trigger_listeners (
    trigger_name character varying(80) NOT NULL,
    trigger_group character varying(80) NOT NULL,
    trigger_listener character varying(80) NOT NULL
);


ALTER TABLE qrtz_trigger_listeners OWNER TO spagobi;

--
-- Name: qrtz_triggers; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE qrtz_triggers (
    trigger_name character varying(80) NOT NULL,
    trigger_group character varying(80) NOT NULL,
    job_name character varying(80) NOT NULL,
    job_group character varying(80) NOT NULL,
    is_volatile boolean NOT NULL,
    description character varying(120),
    next_fire_time bigint,
    prev_fire_time bigint,
    priority integer,
    trigger_state character varying(16) NOT NULL,
    trigger_type character varying(8) NOT NULL,
    start_time bigint NOT NULL,
    end_time bigint,
    calendar_name character varying(80),
    misfire_instr smallint,
    job_data bytea
);


ALTER TABLE qrtz_triggers OWNER TO spagobi;

--
-- Name: sbi_activity_monitoring; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_activity_monitoring (
    id integer NOT NULL,
    action_time timestamp without time zone,
    username character varying(40) NOT NULL,
    usergroup character varying(400),
    log_level character varying(10),
    action_code character varying(45) NOT NULL,
    info character varying(400)
);


ALTER TABLE sbi_activity_monitoring OWNER TO spagobi;

--
-- Name: sbi_alarm; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_alarm (
    alarm_id integer NOT NULL,
    id_kpi_instance integer,
    modality_id integer NOT NULL,
    document_id integer,
    label character varying(50) NOT NULL,
    name character varying(50),
    descr character varying(200),
    mail_subj character varying(256),
    text character varying(1000),
    url character varying(256),
    single_event character(1),
    auto_disabled character(1) DEFAULT NULL::bpchar,
    id_threshold_value integer,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_alarm OWNER TO spagobi;

--
-- Name: sbi_alarm_contact; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_alarm_contact (
    alarm_contact_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100),
    mobile character varying(50),
    resources character varying(200) DEFAULT NULL::character varying,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_alarm_contact OWNER TO spagobi;

--
-- Name: sbi_alarm_distribution; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_alarm_distribution (
    alarm_contact_id integer NOT NULL,
    alarm_id integer NOT NULL
);


ALTER TABLE sbi_alarm_distribution OWNER TO spagobi;

--
-- Name: sbi_alarm_event; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_alarm_event (
    alarm_event_id integer NOT NULL,
    alarm_id integer NOT NULL,
    event_ts date DEFAULT now() NOT NULL,
    active character(1),
    kpi_value character varying(50),
    threshold_value character varying(50),
    kpi_name character varying(100),
    resources character varying(200) DEFAULT NULL::character varying,
    kpi_description character varying(100),
    resource_id integer,
    kpi_instance_id integer,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_alarm_event OWNER TO spagobi;

--
-- Name: sbi_artifacts; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_artifacts (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    descr character varying(500),
    type character varying(50),
    model_locked boolean,
    model_locker character varying(100),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_artifacts OWNER TO spagobi;

--
-- Name: sbi_artifacts_versions; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_artifacts_versions (
    id integer NOT NULL,
    artifact_id integer NOT NULL,
    content bytea NOT NULL,
    name character varying(100),
    prog integer,
    creation_date timestamp without time zone,
    creation_user character varying(50) NOT NULL,
    active boolean,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_artifacts_versions OWNER TO spagobi;

--
-- Name: sbi_attribute; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_attribute (
    attribute_name character varying(255) NOT NULL,
    description character varying(500) NOT NULL,
    attribute_id integer NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_attribute OWNER TO spagobi;

--
-- Name: sbi_audit; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_audit (
    id integer NOT NULL,
    username character varying(40) NOT NULL,
    usergroup character varying(100),
    doc_ref integer,
    doc_id integer,
    doc_label character varying(200) NOT NULL,
    doc_name character varying(200) NOT NULL,
    doc_type character varying(20) NOT NULL,
    doc_state character varying(20) NOT NULL,
    doc_parameters text,
    subobj_ref integer,
    subobj_id integer,
    subobj_name character varying(50),
    subobj_owner character varying(50),
    subobj_ispublic smallint,
    engine_ref integer,
    engine_id integer,
    engine_label character varying(40) NOT NULL,
    engine_name character varying(40) NOT NULL,
    engine_type character varying(20) NOT NULL,
    engine_url character varying(400),
    engine_driver character varying(400),
    engine_class character varying(400),
    request_time timestamp without time zone NOT NULL,
    execution_start timestamp without time zone,
    execution_end timestamp without time zone,
    execution_time integer,
    execution_state character varying(20),
    error smallint,
    error_message character varying(400),
    error_code character varying(20),
    execution_modality character varying(40),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_audit OWNER TO spagobi;

--
-- Name: sbi_authorizations; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_authorizations (
    id integer NOT NULL,
    name character varying(200) DEFAULT NULL::character varying,
    user_in character varying(100) NOT NULL,
    user_up character varying(100) DEFAULT NULL::character varying,
    user_de character varying(100) DEFAULT NULL::character varying,
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10) DEFAULT NULL::character varying,
    sbi_version_up character varying(10) DEFAULT NULL::character varying,
    sbi_version_de character varying(10) DEFAULT NULL::character varying,
    meta_version character varying(100) DEFAULT NULL::character varying,
    organization character varying(20) DEFAULT NULL::character varying
);


ALTER TABLE sbi_authorizations OWNER TO spagobi;

--
-- Name: sbi_authorizations_roles; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_authorizations_roles (
    authorization_id integer NOT NULL,
    role_id integer NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100) DEFAULT NULL::character varying,
    user_de character varying(100) DEFAULT NULL::character varying,
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10) DEFAULT NULL::character varying,
    sbi_version_up character varying(10) DEFAULT NULL::character varying,
    sbi_version_de character varying(10) DEFAULT NULL::character varying,
    meta_version character varying(100) DEFAULT NULL::character varying,
    organization character varying(20) DEFAULT NULL::character varying
);


ALTER TABLE sbi_authorizations_roles OWNER TO spagobi;

--
-- Name: sbi_binary_contents; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_binary_contents (
    bin_id integer NOT NULL,
    bin_content bytea NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_binary_contents OWNER TO spagobi;

--
-- Name: sbi_cache_item; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_cache_item (
    signature character varying(100) NOT NULL,
    name character varying(100),
    table_name character varying(100) NOT NULL,
    dimension numeric,
    creation_date date,
    last_used_date date,
    properties text,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_cache_item OWNER TO spagobi;

--
-- Name: sbi_cache_joined_item; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_cache_joined_item (
    id integer NOT NULL,
    signature character varying(100) NOT NULL,
    joined_signature character varying(100) NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_cache_joined_item OWNER TO spagobi;

--
-- Name: sbi_checks; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_checks (
    check_id integer NOT NULL,
    descr character varying(160),
    label character varying(20) NOT NULL,
    value_type_cd character varying(20) NOT NULL,
    value_type_id integer NOT NULL,
    value_1 character varying(400),
    value_2 character varying(400),
    name character varying(40) NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_checks OWNER TO spagobi;

--
-- Name: sbi_community; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_community (
    community_id integer NOT NULL,
    name character varying(200) NOT NULL,
    description character varying(350) DEFAULT NULL::character varying,
    owner character varying(200) NOT NULL,
    funct_code character varying(40) DEFAULT NULL::character varying,
    creation_date timestamp without time zone DEFAULT now() NOT NULL,
    last_change_date timestamp without time zone DEFAULT now() NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100) DEFAULT NULL::character varying,
    user_de character varying(100) DEFAULT NULL::character varying,
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10) DEFAULT NULL::character varying,
    sbi_version_up character varying(10) DEFAULT NULL::character varying,
    sbi_version_de character varying(10) DEFAULT NULL::character varying,
    meta_version character varying(100) DEFAULT NULL::character varying,
    organization character varying(20) DEFAULT NULL::character varying
);


ALTER TABLE sbi_community OWNER TO spagobi;

--
-- Name: sbi_community_users; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_community_users (
    community_id integer NOT NULL,
    user_id character varying(100) NOT NULL,
    creation_date timestamp without time zone DEFAULT now() NOT NULL,
    last_change_date timestamp without time zone DEFAULT now() NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100) DEFAULT NULL::character varying,
    user_de character varying(100) DEFAULT NULL::character varying,
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10) DEFAULT NULL::character varying,
    sbi_version_up character varying(10) DEFAULT NULL::character varying,
    sbi_version_de character varying(10) DEFAULT NULL::character varying,
    meta_version character varying(100) DEFAULT NULL::character varying,
    organization character varying(20) DEFAULT NULL::character varying
);


ALTER TABLE sbi_community_users OWNER TO spagobi;

--
-- Name: sbi_config; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_config (
    id integer NOT NULL,
    label character varying(100) NOT NULL,
    name character varying(100),
    description character varying(500),
    is_active boolean DEFAULT true,
    value_check character varying(1000),
    value_type_id integer,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20),
    category character varying(50)
);


ALTER TABLE sbi_config OWNER TO spagobi;

--
-- Name: sbi_data_set; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_data_set (
    ds_id integer NOT NULL,
    version_num integer NOT NULL,
    active boolean NOT NULL,
    descr character varying(160),
    label character varying(51) NOT NULL,
    name character varying(52) NOT NULL,
    object_type character varying(53),
    ds_metadata text,
    params character varying(4000),
    category_id integer,
    transformer_id integer,
    pivot_column character varying(54),
    pivot_row character varying(55),
    pivot_value character varying(56),
    num_rows boolean DEFAULT false,
    is_persisted boolean DEFAULT false,
    persist_table_name character varying(50),
    configuration text,
    owner character varying(50),
    is_public boolean DEFAULT false,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20) NOT NULL,
    scope_id integer
);


ALTER TABLE sbi_data_set OWNER TO spagobi;

--
-- Name: sbi_data_source; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_data_source
(
  ds_id SERIAL NOT NULL,
  descr character varying(160),
  label character varying(50) NOT NULL,
  jndi character varying(50),
  url_connection character varying(500),
  username character varying(50),
  pwd character varying(50),
  driver character varying(160),
  dialect_id integer NOT NULL,
  multi_schema boolean NOT NULL DEFAULT false,
  attr_schema character varying(45) DEFAULT NULL::character varying,
  read_only boolean DEFAULT false,
  write_default boolean DEFAULT true,
  user_in character varying(100) NOT NULL DEFAULT 'biadmin',
  user_up character varying(100),
  user_de character varying(100),
  time_in timestamp without time zone NOT NULL,
  time_up timestamp without time zone,
  time_de timestamp without time zone,
  sbi_version_in character varying(10) DEFAULT '5.2.0',
  sbi_version_up character varying(10),
  sbi_version_de character varying(10),
  meta_version character varying(100),
  organization character varying(20) DEFAULT 'SPAGOBI'
);
ALTER TABLE sbi_data_source OWNER TO spagobi;

--
-- Name: sbi_dist_list; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_dist_list (
    dl_id integer NOT NULL,
    name character varying(40) NOT NULL,
    descr character varying(160),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_dist_list OWNER TO spagobi;

--
-- Name: sbi_dist_list_objects; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_dist_list_objects (
    rel_id integer NOT NULL,
    doc_id integer NOT NULL,
    dl_id integer NOT NULL,
    xml character varying(5000) NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_dist_list_objects OWNER TO spagobi;

--
-- Name: sbi_dist_list_user; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_dist_list_user (
    dlu_id integer NOT NULL,
    list_id integer NOT NULL,
    user_id character varying(40) NOT NULL,
    e_mail character varying(70) NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_dist_list_user OWNER TO spagobi;

--
-- Name: sbi_domains; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_domains (
    value_id integer NOT NULL,
    value_cd character varying(100),
    value_nm character varying(40),
    domain_cd character varying(20),
    domain_nm character varying(40),
    value_ds character varying(160),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_domains OWNER TO spagobi;

--
-- Name: sbi_dossier_bin_temp; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_dossier_bin_temp (
    bin_id integer NOT NULL,
    part_id integer NOT NULL,
    name character varying(20),
    bin_content bytea NOT NULL,
    type character varying(20) NOT NULL,
    creation_date timestamp without time zone,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_dossier_bin_temp OWNER TO spagobi;

--
-- Name: sbi_dossier_pres; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_dossier_pres (
    presentation_id integer NOT NULL,
    workflow_process_id bigint NOT NULL,
    biobj_id integer NOT NULL,
    bin_id integer NOT NULL,
    name character varying(40) NOT NULL,
    prog integer,
    creation_date timestamp without time zone,
    approved smallint,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_dossier_pres OWNER TO spagobi;

--
-- Name: sbi_dossier_temp; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_dossier_temp (
    part_id integer NOT NULL,
    workflow_process_id bigint NOT NULL,
    biobj_id integer NOT NULL,
    page_id integer NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_dossier_temp OWNER TO spagobi;

--
-- Name: sbi_engines; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_engines (
    engine_id integer NOT NULL,
    encrypt smallint,
    name character varying(40) NOT NULL,
    descr character varying(160),
    main_url character varying(400),
    secn_url character varying(400),
    obj_upl_dir character varying(400),
    obj_use_dir character varying(400),
    driver_nm character varying(400),
    label character varying(40) NOT NULL,
    engine_type integer NOT NULL,
    class_nm character varying(400),
    biobj_type integer NOT NULL,
    use_dataset boolean DEFAULT false,
    use_datasource boolean DEFAULT false,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_engines OWNER TO spagobi;

--
-- Name: sbi_events; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_events (
    id integer NOT NULL,
    user_event character varying(40) NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_events OWNER TO spagobi;

--
-- Name: sbi_events_log; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_events_log (
    id integer NOT NULL,
    user_event character varying(40) NOT NULL,
    event_date timestamp without time zone DEFAULT now() NOT NULL,
    descr text NOT NULL,
    params character varying(1000),
    handler character varying(400) DEFAULT 'it.eng.spagobi.events.handlers.DefaultEventPresentationHandler'::character varying NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_events_log OWNER TO spagobi;

--
-- Name: sbi_events_roles; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_events_roles (
    event_id integer NOT NULL,
    role_id integer NOT NULL
);


ALTER TABLE sbi_events_roles OWNER TO spagobi;

--
-- Name: sbi_exporters; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_exporters (
    engine_id integer NOT NULL,
    domain_id integer NOT NULL,
    default_value boolean
);


ALTER TABLE sbi_exporters OWNER TO spagobi;

--
-- Name: sbi_ext_roles; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_ext_roles (
    ext_role_id integer NOT NULL,
    name character varying(100) NOT NULL,
    descr character varying(160),
    code character varying(20),
    role_type_cd character varying(20) NOT NULL,
    role_type_id integer NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_ext_roles OWNER TO spagobi;

--
-- Name: sbi_ext_roles_category; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_ext_roles_category (
    ext_role_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE sbi_ext_roles_category OWNER TO spagobi;

--
-- Name: sbi_ext_user_roles; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_ext_user_roles (
    id integer NOT NULL,
    ext_role_id integer NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_ext_user_roles OWNER TO spagobi;

--
-- Name: sbi_func_role; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_func_role (
    role_id integer NOT NULL,
    funct_id integer NOT NULL,
    state_cd character varying(20),
    state_id integer NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_func_role OWNER TO spagobi;

--
-- Name: sbi_functions; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_functions (
    funct_id integer NOT NULL,
    funct_type_cd character varying(20) NOT NULL,
    parent_funct_id integer,
    name character varying(40),
    descr character varying(160),
    path character varying(400),
    code character varying(40) NOT NULL,
    prog integer NOT NULL,
    funct_type_id integer NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_functions OWNER TO spagobi;

--
-- Name: sbi_geo_features; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_geo_features (
    feature_id integer NOT NULL,
    name character varying(40) NOT NULL,
    descr character varying(160),
    type character varying(40),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_geo_features OWNER TO spagobi;

--
-- Name: sbi_geo_layers; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_geo_layers (
    layer_id integer NOT NULL,
    label character varying(100) NOT NULL,
    name character varying(100),
    descr character varying(100),
    layer_definition bytea NOT NULL,
    type character varying(40),
    is_base_layer boolean DEFAULT false,
    user_in character varying(100) NOT NULL,
    user_up character varying(100) DEFAULT NULL::character varying,
    user_de character varying(100) DEFAULT NULL::character varying,
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10) DEFAULT NULL::character varying,
    sbi_version_up character varying(10) DEFAULT NULL::character varying,
    sbi_version_de character varying(10) DEFAULT NULL::character varying,
    meta_version character varying(100) DEFAULT NULL::character varying,
    organization character varying(20) DEFAULT NULL::character varying
);


ALTER TABLE sbi_geo_layers OWNER TO spagobi;

--
-- Name: sbi_geo_map_features; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_geo_map_features (
    map_id integer NOT NULL,
    feature_id integer NOT NULL,
    svg_group character varying(40),
    visible_flag character varying(1),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_geo_map_features OWNER TO spagobi;

--
-- Name: sbi_geo_maps; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_geo_maps (
    map_id integer NOT NULL,
    name character varying(40) NOT NULL,
    descr character varying(160),
    url character varying(400),
    format character varying(40),
    bin_id integer NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_geo_maps OWNER TO spagobi;

--
-- Name: sbi_goal; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_goal (
    goal_id integer NOT NULL,
    grant_id integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    name character varying(20) NOT NULL,
    label character varying(20) NOT NULL,
    description character varying(1000),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_goal OWNER TO spagobi;

--
-- Name: sbi_goal_hierarchy; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_goal_hierarchy (
    goal_hierarchy_id integer NOT NULL,
    org_unit_id integer NOT NULL,
    goal_id integer NOT NULL,
    parent_id integer,
    name character varying(50) NOT NULL,
    label character varying(50),
    goal character varying(1000),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_goal_hierarchy OWNER TO spagobi;

--
-- Name: sbi_goal_kpi; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_goal_kpi (
    goal_kpi_id integer NOT NULL,
    kpi_instance_id integer NOT NULL,
    goal_hierarchy_id integer NOT NULL,
    weight1 numeric,
    weight2 numeric,
    threshold1 numeric,
    threshold2 numeric,
    threshold1sign integer,
    threshold2sign integer,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_goal_kpi OWNER TO spagobi;

--
-- Name: sbi_i18n_messages; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_i18n_messages (
    language_cd integer NOT NULL,
    label character varying(200) NOT NULL,
    message text,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20) NOT NULL
);


ALTER TABLE sbi_i18n_messages OWNER TO spagobi;

--
-- Name: sbi_kpi; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_kpi (
    kpi_id integer NOT NULL,
    id_measure_unit integer,
    ds_id integer,
    threshold_id integer,
    id_kpi_parent integer,
    name character varying(400) NOT NULL,
    code character varying(40),
    metric character varying(1000),
    description character varying(1000),
    weight numeric,
    is_additive character(1),
    flg_is_father character(1),
    kpi_type integer,
    metric_scale_type integer,
    measure_type integer,
    interpretation character varying(1000),
    input_attributes character varying(1000),
    model_reference character varying(255),
    target_audience character varying(1000),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_kpi OWNER TO spagobi;

--
-- Name: sbi_kpi_comments; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_kpi_comments (
    kpi_comment_id integer NOT NULL,
    kpi_inst_id integer,
    bin_id integer,
    exec_req character varying(500),
    owner character varying(50),
    ispublic boolean,
    creation_date timestamp without time zone NOT NULL,
    last_change_date timestamp without time zone NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_kpi_comments OWNER TO spagobi;

--
-- Name: sbi_kpi_documents; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_kpi_documents (
    id_kpi_doc integer NOT NULL,
    biobj_id integer NOT NULL,
    kpi_id integer NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_kpi_documents OWNER TO spagobi;

--
-- Name: sbi_kpi_error; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_kpi_error (
    kpi_error_id integer NOT NULL,
    kpi_model_inst_id integer NOT NULL,
    user_msg character varying(1000),
    full_msg text,
    ts_date timestamp without time zone,
    label_mod_inst character varying(100),
    parameters character varying(1000),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_kpi_error OWNER TO spagobi;

--
-- Name: sbi_kpi_inst_period; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_kpi_inst_period (
    kpi_inst_period_id integer NOT NULL,
    kpi_instance_id integer NOT NULL,
    periodicity_id integer NOT NULL,
    default_value boolean,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_kpi_inst_period OWNER TO spagobi;

--
-- Name: sbi_kpi_instance; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_kpi_instance (
    id_kpi_instance integer NOT NULL,
    kpi_id integer NOT NULL,
    threshold_id integer,
    chart_type_id integer,
    id_measure_unit integer,
    weight numeric,
    target numeric,
    begin_dt date DEFAULT now() NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_kpi_instance OWNER TO spagobi;

--
-- Name: sbi_kpi_instance_history; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_kpi_instance_history (
    id_kpi_instance_history integer NOT NULL,
    id_kpi_instance integer NOT NULL,
    threshold_id integer,
    chart_type_id integer,
    id_measure_unit integer,
    weight numeric,
    target numeric,
    begin_dt date DEFAULT now() NOT NULL,
    end_dt date DEFAULT now() NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_kpi_instance_history OWNER TO spagobi;

--
-- Name: sbi_kpi_model; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_kpi_model (
    kpi_model_id integer NOT NULL,
    kpi_id integer,
    kpi_model_type_id integer NOT NULL,
    kpi_parent_model_id integer,
    kpi_model_cd character varying(40) NOT NULL,
    kpi_model_nm character varying(400),
    kpi_model_desc character varying(1000),
    kpi_model_lbl character varying(100) NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_kpi_model OWNER TO spagobi;

--
-- Name: sbi_kpi_model_inst; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_kpi_model_inst (
    kpi_model_inst integer NOT NULL,
    kpi_model_inst_parent integer,
    kpi_model_id integer,
    id_kpi_instance integer,
    name character varying(400),
    label character varying(100) NOT NULL,
    description character varying(1000),
    start_date date DEFAULT now() NOT NULL,
    end_date date DEFAULT now() NOT NULL,
    modeluuid character varying(400),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_kpi_model_inst OWNER TO spagobi;

--
-- Name: sbi_kpi_model_resources; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_kpi_model_resources (
    kpi_model_resources_id integer NOT NULL,
    resource_id integer NOT NULL,
    kpi_model_inst integer NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_kpi_model_resources OWNER TO spagobi;

--
-- Name: sbi_kpi_periodicity; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_kpi_periodicity (
    id_kpi_periodicity integer NOT NULL,
    name character varying(200) NOT NULL,
    months integer,
    days integer,
    hours integer,
    minutes integer,
    chron_string character varying(20),
    start_date timestamp without time zone,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_kpi_periodicity OWNER TO spagobi;

--
-- Name: sbi_kpi_rel; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_kpi_rel (
    kpi_rel_id integer NOT NULL,
    kpi_father_id integer NOT NULL,
    kpi_child_id integer NOT NULL,
    parameter character varying(100),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_kpi_rel OWNER TO spagobi;

--
-- Name: sbi_kpi_role; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_kpi_role (
    id_kpi_role integer NOT NULL,
    kpi_id integer NOT NULL,
    ext_role_id integer NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_kpi_role OWNER TO spagobi;

--
-- Name: sbi_kpi_value; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_kpi_value (
    id_kpi_instance_value integer NOT NULL,
    id_kpi_instance integer NOT NULL,
    resource_id integer,
    value character varying(40),
    begin_dt date DEFAULT now() NOT NULL,
    end_dt date DEFAULT now() NOT NULL,
    description character varying(100),
    xml_data text,
    org_unit_id integer,
    hierarchy_id integer,
    company character varying(200),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_kpi_value OWNER TO spagobi;

--
-- Name: sbi_lov; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_lov (
    lov_id integer NOT NULL,
    descr character varying(160),
    label character varying(20) NOT NULL,
    input_type_cd character varying(20) NOT NULL,
    default_val character varying(40),
    lov_provider text,
    input_type_id integer NOT NULL,
    profile_attr character varying(20),
    name character varying(40) NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20),
    dataset_id integer
);


ALTER TABLE sbi_lov OWNER TO spagobi;

--
-- Name: sbi_measure_unit; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_measure_unit (
    id_measure_unit integer NOT NULL,
    name character varying(400),
    scale_type_id integer NOT NULL,
    scale_cd character varying(40),
    scale_nm character varying(400),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_measure_unit OWNER TO spagobi;

--
-- Name: sbi_menu; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_menu (
    menu_id integer NOT NULL,
    name character varying(50),
    descr character varying(2000),
    parent_id integer DEFAULT 0,
    biobj_id integer,
    view_icons boolean,
    hide_toolbar boolean,
    hide_sliders boolean,
    static_page character varying(45),
    biobj_parameters text,
    subobj_name character varying(50),
    snapshot_name character varying(100),
    snapshot_history integer,
    functionality character varying(50),
    initial_path character varying(400),
    ext_app_url character varying(1000),
    prog integer DEFAULT 1 NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_menu OWNER TO spagobi;

--
-- Name: sbi_menu_role; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_menu_role (
    menu_id integer NOT NULL,
    ext_role_id integer NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_menu_role OWNER TO spagobi;

--
-- Name: sbi_meta_models; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_meta_models (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    descr character varying(500),
    model_locked boolean,
    model_locker character varying(100),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20),
    category_id integer,
    data_source_id integer
);


ALTER TABLE sbi_meta_models OWNER TO spagobi;

--
-- Name: sbi_meta_models_versions; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_meta_models_versions (
    id integer NOT NULL,
    model_id integer NOT NULL,
    content bytea NOT NULL,
    name character varying(100),
    prog integer,
    creation_date timestamp without time zone,
    creation_user character varying(50) NOT NULL,
    active boolean,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_meta_models_versions OWNER TO spagobi;

--
-- Name: sbi_obj_func; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_obj_func (
    biobj_id integer NOT NULL,
    funct_id integer NOT NULL,
    prog integer,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_obj_func OWNER TO spagobi;

--
-- Name: sbi_obj_metacontents; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_obj_metacontents (
    obj_metacontent_id integer NOT NULL,
    objmeta_id integer NOT NULL,
    biobj_id integer NOT NULL,
    subobj_id integer,
    bin_id integer,
    creation_date timestamp without time zone NOT NULL,
    last_change_date timestamp without time zone NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_obj_metacontents OWNER TO spagobi;

--
-- Name: sbi_obj_metadata; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_obj_metadata (
    obj_meta_id integer NOT NULL,
    label character varying(20) NOT NULL,
    name character varying(40) NOT NULL,
    descr character varying(100),
    data_type_id integer NOT NULL,
    creation_date timestamp without time zone NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_obj_metadata OWNER TO spagobi;

--
-- Name: sbi_obj_par; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_obj_par (
    obj_par_id integer NOT NULL,
    par_id integer NOT NULL,
    biobj_id integer NOT NULL,
    label character varying(40) NOT NULL,
    req_fl smallint,
    mod_fl smallint,
    view_fl smallint,
    mult_fl smallint,
    prog integer NOT NULL,
    parurl_nm character varying(20),
    priority integer,
    col_span integer,
    thick_perc integer,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_obj_par OWNER TO spagobi;

--
-- Name: sbi_obj_paruse; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_obj_paruse (
    obj_par_id integer NOT NULL,
    use_id integer NOT NULL,
    obj_par_father_id integer NOT NULL,
    filter_operation character varying(20) NOT NULL,
    prog integer NOT NULL,
    filter_column character varying(30) NOT NULL,
    pre_condition character varying(10),
    post_condition character varying(10),
    logic_operator character varying(10),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_obj_paruse OWNER TO spagobi;

--
-- Name: sbi_obj_parview; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_obj_parview (
    obj_par_id integer NOT NULL,
    obj_par_father_id integer NOT NULL,
    operation character varying(20) NOT NULL,
    compare_value character varying(200) NOT NULL,
    view_label character varying(50),
    prog integer,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_obj_parview OWNER TO spagobi;

--
-- Name: sbi_obj_state; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_obj_state (
    biobj_id integer NOT NULL,
    state_id integer NOT NULL,
    end_dt date,
    start_dt date NOT NULL,
    note character varying(300),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_obj_state OWNER TO spagobi;

--
-- Name: sbi_object_notes; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_object_notes (
    obj_note_id integer NOT NULL,
    biobj_id integer,
    bin_id integer,
    exec_req character varying(500),
    owner character varying(50),
    ispublic boolean,
    creation_date timestamp without time zone NOT NULL,
    last_change_date timestamp without time zone NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_object_notes OWNER TO spagobi;

--
-- Name: sbi_object_templates; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_object_templates (
    obj_temp_id integer NOT NULL,
    biobj_id integer,
    bin_id integer,
    name character varying(50),
    prog integer,
    dimension character varying(20),
    creation_date date DEFAULT now() NOT NULL,
    creation_user character varying(45) NOT NULL,
    active boolean,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_object_templates OWNER TO spagobi;

--
-- Name: sbi_objects; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_objects (
    biobj_id integer NOT NULL,
    engine_id integer NOT NULL,
    descr character varying(400),
    label character varying(100) NOT NULL,
    encrypt smallint,
    path character varying(400),
    rel_name character varying(400),
    state_id integer NOT NULL,
    state_cd character varying(20) NOT NULL,
    biobj_type_cd character varying(20) NOT NULL,
    biobj_type_id integer NOT NULL,
    sched_fl smallint,
    exec_mode_id integer,
    state_cons_id integer,
    exec_mode_cd character varying(20),
    state_cons_cd character varying(20),
    name character varying(200) NOT NULL,
    visible smallint NOT NULL,
    uuid character varying(40) NOT NULL,
    data_source_id integer,
    data_set_id integer,
    descr_ext text,
    objective text,
    language character varying(45),
    creation_date timestamp without time zone NOT NULL,
    creation_user character varying(45) NOT NULL,
    keywords character varying(250),
    refresh_seconds integer,
    prof_visibility character varying(400),
    preview_file text,
    parameters_region character varying(20),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_objects OWNER TO spagobi;

--
-- Name: sbi_objects_rating; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_objects_rating (
    user_id character varying(127) NOT NULL,
    obj_id integer NOT NULL,
    rating integer NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_objects_rating OWNER TO spagobi;

--
-- Name: sbi_org_unit; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_org_unit (
    id integer NOT NULL,
    label character varying(100) NOT NULL,
    name character varying(200) NOT NULL,
    description character varying(1000),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_org_unit OWNER TO spagobi;

--
-- Name: sbi_org_unit_grant; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_org_unit_grant (
    id integer NOT NULL,
    hierarchy_id integer NOT NULL,
    kpi_model_inst_node_id integer NOT NULL,
    start_date date,
    end_date date,
    label character varying(200) NOT NULL,
    name character varying(400) NOT NULL,
    description character varying(1000),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20),
    is_available boolean DEFAULT true
);


ALTER TABLE sbi_org_unit_grant OWNER TO spagobi;

--
-- Name: sbi_org_unit_grant_nodes; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_org_unit_grant_nodes (
    node_id integer NOT NULL,
    kpi_model_inst_node_id integer NOT NULL,
    grant_id integer NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_org_unit_grant_nodes OWNER TO spagobi;

--
-- Name: sbi_org_unit_hierarchies; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_org_unit_hierarchies (
    id integer NOT NULL,
    label character varying(100) NOT NULL,
    name character varying(200) NOT NULL,
    description character varying(1000),
    target character varying(1000),
    company character varying(100) NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_org_unit_hierarchies OWNER TO spagobi;

--
-- Name: sbi_org_unit_nodes; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_org_unit_nodes (
    node_id integer NOT NULL,
    ou_id integer NOT NULL,
    hierarchy_id integer NOT NULL,
    parent_node_id integer,
    path character varying(4000) NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_org_unit_nodes OWNER TO spagobi;

--
-- Name: sbi_organization_datasource; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_organization_datasource (
    datasource_id integer NOT NULL,
    organization_id integer NOT NULL,
    creation_date timestamp without time zone DEFAULT now() NOT NULL,
    last_change_date timestamp without time zone,
    user_in character varying(100) NOT NULL,
    user_up character varying(100) DEFAULT NULL::character varying,
    user_de character varying(100) DEFAULT NULL::character varying,
    time_in timestamp without time zone,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10) DEFAULT NULL::character varying,
    sbi_version_up character varying(10) DEFAULT NULL::character varying,
    sbi_version_de character varying(10) DEFAULT NULL::character varying,
    meta_version character varying(100) DEFAULT NULL::character varying,
    organization character varying(20) DEFAULT NULL::character varying
);


ALTER TABLE sbi_organization_datasource OWNER TO spagobi;

--
-- Name: sbi_organization_engine; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_organization_engine (
    engine_id integer NOT NULL,
    organization_id integer NOT NULL,
    creation_date timestamp without time zone DEFAULT now() NOT NULL,
    last_change_date timestamp without time zone,
    user_in character varying(100) NOT NULL,
    user_up character varying(100) DEFAULT NULL::character varying,
    user_de character varying(100) DEFAULT NULL::character varying,
    time_in timestamp without time zone,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10) DEFAULT NULL::character varying,
    sbi_version_up character varying(10) DEFAULT NULL::character varying,
    sbi_version_de character varying(10) DEFAULT NULL::character varying,
    meta_version character varying(100) DEFAULT NULL::character varying,
    organization character varying(20) DEFAULT NULL::character varying
);


ALTER TABLE sbi_organization_engine OWNER TO spagobi;

--
-- Name: sbi_organizations; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_organizations (
    id integer NOT NULL,
    name character varying(20),
    theme character varying(100) DEFAULT 'SPAGOBI.THEMES.THEME.default'::character varying
);


ALTER TABLE sbi_organizations OWNER TO spagobi;

--
-- Name: sbi_parameters; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_parameters (
    par_id integer NOT NULL,
    descr character varying(160),
    length smallint NOT NULL,
    label character varying(20) NOT NULL,
    par_type_cd character varying(20) NOT NULL,
    mask character varying(20),
    par_type_id integer NOT NULL,
    name character varying(40) NOT NULL,
    functional_flag smallint DEFAULT 1 NOT NULL,
    temporal_flag smallint DEFAULT 0 NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_parameters OWNER TO spagobi;

--
-- Name: sbi_paruse; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_paruse (
    use_id integer NOT NULL,
    lov_id integer,
    default_lov_id integer,
    default_formula character varying(4000),
    label character varying(20) NOT NULL,
    descr character varying(160),
    par_id integer NOT NULL,
    name character varying(40) NOT NULL,
    man_in integer NOT NULL,
    maximizer_enabled boolean DEFAULT false,
    selection_type character varying(20) DEFAULT 'LIST'::character varying,
    multivalue_flag integer DEFAULT 0,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20),
    options character varying(4000) DEFAULT NULL::character varying
);


ALTER TABLE sbi_paruse OWNER TO spagobi;

--
-- Name: sbi_paruse_ck; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_paruse_ck (
    check_id integer NOT NULL,
    use_id integer NOT NULL,
    prog integer,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_paruse_ck OWNER TO spagobi;

--
-- Name: sbi_paruse_det; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_paruse_det (
    ext_role_id integer NOT NULL,
    prog integer,
    use_id integer NOT NULL,
    hidden_fl smallint,
    default_val character varying(40),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_paruse_det OWNER TO spagobi;

--
-- Name: sbi_progress_thread; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_progress_thread (
    progress_thread_id integer NOT NULL,
    user_id character varying(100) NOT NULL,
    partial integer,
    total integer,
    function_cd character varying(200),
    status character varying(4000),
    random_key character varying(4000),
    type character varying(200)
);


ALTER TABLE sbi_progress_thread OWNER TO spagobi;

--
-- Name: sbi_remember_me; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_remember_me (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    username character varying(40) NOT NULL,
    biobj_id integer NOT NULL,
    subobj_id integer,
    parameters text,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_remember_me OWNER TO spagobi;

--
-- Name: sbi_resources; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_resources (
    resource_id integer NOT NULL,
    resource_type_id integer NOT NULL,
    table_name character varying(40),
    column_name character varying(40),
    resource_name character varying(200) NOT NULL,
    resource_descr character varying(400),
    resource_code character varying(45) NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_resources OWNER TO spagobi;

--
-- Name: sbi_role_type_user_func; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_role_type_user_func (
    role_type_id integer NOT NULL,
    user_funct_id integer NOT NULL
);


ALTER TABLE sbi_role_type_user_func OWNER TO spagobi;

--
-- Name: sbi_snapshots; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_snapshots (
    snap_id integer NOT NULL,
    biobj_id integer,
    bin_id integer,
    name character varying(100),
    description character varying(1000),
    creation_date timestamp without time zone NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20),
    content_type character varying(300) DEFAULT NULL::character varying
);


ALTER TABLE sbi_snapshots OWNER TO spagobi;

--
-- Name: sbi_subobjects; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_subobjects (
    subobj_id integer NOT NULL,
    biobj_id integer,
    bin_id integer,
    name character varying(50) NOT NULL,
    description character varying(100),
    owner character varying(50),
    ispublic boolean,
    creation_date timestamp without time zone NOT NULL,
    last_change_date timestamp without time zone NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_subobjects OWNER TO spagobi;

--
-- Name: sbi_subreports; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_subreports (
    master_rpt_id integer NOT NULL,
    sub_rpt_id integer NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_subreports OWNER TO spagobi;

--
-- Name: sbi_threshold; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_threshold (
    threshold_id integer NOT NULL,
    threshold_type_id integer NOT NULL,
    name character varying(400),
    description character varying(1000),
    code character varying(45) NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_threshold OWNER TO spagobi;

--
-- Name: sbi_threshold_value; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_threshold_value (
    id_threshold_value integer NOT NULL,
    threshold_id integer NOT NULL,
    severity_id integer,
    kpi_position integer,
    min_value numeric,
    max_value numeric,
    label character varying(20) NOT NULL,
    colour character varying(20),
    min_closed boolean,
    max_closed boolean,
    th_value numeric,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_threshold_value OWNER TO spagobi;

--
-- Name: sbi_trigger_paused; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_trigger_paused (
    id integer NOT NULL,
    trigger_name character varying(80) NOT NULL,
    trigger_group character varying(80) NOT NULL,
    job_name character varying(80) NOT NULL,
    job_group character varying(80) NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_trigger_paused OWNER TO spagobi;

--
-- Name: sbi_udp; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_udp (
    udp_id integer NOT NULL,
    type_id integer NOT NULL,
    family_id integer NOT NULL,
    label character varying(20) NOT NULL,
    name character varying(40) NOT NULL,
    description character varying(1000),
    is_multivalue boolean DEFAULT false,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_udp OWNER TO spagobi;

--
-- Name: sbi_udp_value; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_udp_value (
    udp_value_id integer NOT NULL,
    udp_id integer NOT NULL,
    value character varying(1000),
    prog integer,
    label character varying(20),
    name character varying(40),
    family character varying(40),
    begin_ts timestamp without time zone NOT NULL,
    end_ts timestamp without time zone,
    reference_id integer,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_udp_value OWNER TO spagobi;

--
-- Name: sbi_user; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_user (
    user_id character varying(100) NOT NULL,
    password character varying(150),
    full_name character varying(255),
    id integer NOT NULL,
    dt_pwd_begin timestamp without time zone,
    dt_pwd_end timestamp without time zone,
    flg_pwd_blocked boolean,
    dt_last_access timestamp without time zone,
    is_superadmin boolean DEFAULT false,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_user OWNER TO spagobi;

--
-- Name: sbi_user_attributes; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_user_attributes (
    id integer NOT NULL,
    attribute_id integer NOT NULL,
    attribute_value character varying(500),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_user_attributes OWNER TO spagobi;

--
-- Name: sbi_user_func; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_user_func (
    user_funct_id integer NOT NULL,
    name character varying(50),
    description character varying(100),
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_user_func OWNER TO spagobi;

--
-- Name: sbi_viewpoints; Type: TABLE; Schema: public; Owner: spagobi
--

CREATE TABLE sbi_viewpoints (
    vp_id integer NOT NULL,
    biobj_id integer NOT NULL,
    vp_name character varying(40) NOT NULL,
    vp_owner character varying(40),
    vp_desc character varying(160),
    vp_scope character varying(20) NOT NULL,
    vp_value_params text,
    vp_creation_date timestamp without time zone NOT NULL,
    user_in character varying(100) NOT NULL,
    user_up character varying(100),
    user_de character varying(100),
    time_in timestamp without time zone NOT NULL,
    time_up timestamp without time zone,
    time_de timestamp without time zone,
    sbi_version_in character varying(10),
    sbi_version_up character varying(10),
    sbi_version_de character varying(10),
    meta_version character varying(100),
    organization character varying(20)
);


ALTER TABLE sbi_viewpoints OWNER TO spagobi;

--
-- Data for Name: hibernate_sequences; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO hibernate_sequences VALUES ('SBI_ORGANIZATIONS', 2);
INSERT INTO hibernate_sequences VALUES ('SBI_DOMAINS', 191);
INSERT INTO hibernate_sequences VALUES ('SBI_ENGINES', 27);
INSERT INTO hibernate_sequences VALUES ('SBI_CHECKS', 7);
INSERT INTO hibernate_sequences VALUES ('SBI_USER_FUNC', 56);
INSERT INTO hibernate_sequences VALUES ('SBI_CONFIG', 141);
INSERT INTO hibernate_sequences VALUES ('SBI_KPI_PERIODICITY', 9);
INSERT INTO hibernate_sequences VALUES ('SBI_FUNCTIONS', 2);
INSERT INTO hibernate_sequences VALUES ('SBI_ATTRIBUTE', 6);
INSERT INTO hibernate_sequences VALUES ('SBI_EXT_ROLES', 11);
INSERT INTO hibernate_sequences VALUES ('SBI_USER', 7);
INSERT INTO hibernate_sequences VALUES ('SBI_AUTHORIZATIONS', 25);


--
-- Data for Name: qrtz_blob_triggers; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: qrtz_calendars; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: qrtz_cron_triggers; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: qrtz_fired_triggers; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: qrtz_job_details; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO qrtz_job_details VALUES ('AlarmInspectorJob', 'SPAGOBI/AlarmInspectorJob', 'AlarmInspectorJob', 'it.eng.spagobi.kpi.alarm.service.AlarmInspectorJob', true, false, false, true, '\xaced0005737200156f72672e71756172747a2e4a6f62446174614d61709fb083e8bfa9b0cb020000787200266f72672e71756172747a2e7574696c732e537472696e674b65794469727479466c61674d61708208e8c3fbc55d280200015a0013616c6c6f77735472616e7369656e74446174617872001d6f72672e71756172747a2e7574696c732e4469727479466c61674d617013e62ead28760ace0200025a000564697274794c00036d617074000f4c6a6176612f7574696c2f4d61703b787000737200116a6176612e7574696c2e486173684d61700507dac1c31660d103000246000a6c6f6164466163746f724900097468726573686f6c6478703f40000000000010770800000010000000007800');
INSERT INTO qrtz_job_details VALUES ('CleanCacheJob', 'SPAGOBI/CleanCacheJob', 'CleanCacheJob', 'it.eng.spagobi.tools.scheduler.jobs.CleanCacheJob', true, false, false, true, '\xaced0005737200156f72672e71756172747a2e4a6f62446174614d61709fb083e8bfa9b0cb020000787200266f72672e71756172747a2e7574696c732e537472696e674b65794469727479466c61674d61708208e8c3fbc55d280200015a0013616c6c6f77735472616e7369656e74446174617872001d6f72672e71756172747a2e7574696c732e4469727479466c61674d617013e62ead28760ace0200025a000564697274794c00036d617074000f4c6a6176612f7574696c2f4d61703b787000737200116a6176612e7574696c2e486173684d61700507dac1c31660d103000246000a6c6f6164466163746f724900097468726573686f6c6478703f40000000000010770800000010000000007800');


--
-- Data for Name: qrtz_job_listeners; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: qrtz_locks; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO qrtz_locks VALUES ('TRIGGER_ACCESS');
INSERT INTO qrtz_locks VALUES ('JOB_ACCESS');
INSERT INTO qrtz_locks VALUES ('CALENDAR_ACCESS');
INSERT INTO qrtz_locks VALUES ('STATE_ACCESS');
INSERT INTO qrtz_locks VALUES ('MISFIRE_ACCESS');


--
-- Data for Name: qrtz_paused_trigger_grps; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: qrtz_scheduler_state; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: qrtz_simple_triggers; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: qrtz_trigger_listeners; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: qrtz_triggers; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_activity_monitoring; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_alarm; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_alarm_contact; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_alarm_distribution; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_alarm_event; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_artifacts; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_artifacts_versions; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_attribute; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO sbi_attribute VALUES ('name', 'name', 1, 'server_init', NULL, NULL, '2016-10-19 13:51:13.037', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_attribute VALUES ('surname', 'surname', 2, 'server_init', NULL, NULL, '2016-10-19 13:51:13.046', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_attribute VALUES ('address', 'address', 3, 'server_init', NULL, NULL, '2016-10-19 13:51:13.051', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_attribute VALUES ('birth_date', 'birth date', 4, 'server_init', NULL, NULL, '2016-10-19 13:51:13.056', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_attribute VALUES ('email', 'email', 5, 'server_init', NULL, NULL, '2016-10-19 13:51:13.061', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');


--
-- Data for Name: sbi_audit; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_authorizations; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO sbi_authorizations VALUES (1, 'SAVE_SUBOBJECTS', 'server', NULL, NULL, '2016-10-19 13:51:13.542', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (2, 'SEE_SUBOBJECTS', 'server', NULL, NULL, '2016-10-19 13:51:13.557', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (3, 'SEE_VIEWPOINTS', 'server', NULL, NULL, '2016-10-19 13:51:13.561', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (4, 'SEE_SNAPSHOTS', 'server', NULL, NULL, '2016-10-19 13:51:13.566', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (5, 'SEE_NOTES', 'server', NULL, NULL, '2016-10-19 13:51:13.57', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (6, 'SEND_MAIL', 'server', NULL, NULL, '2016-10-19 13:51:13.574', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (7, 'SAVE_INTO_FOLDER', 'server', NULL, NULL, '2016-10-19 13:51:13.578', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (8, 'SAVE_REMEMBER_ME', 'server', NULL, NULL, '2016-10-19 13:51:13.594', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (9, 'SEE_METADATA', 'server', NULL, NULL, '2016-10-19 13:51:13.599', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (10, 'SAVE_METADATA', 'server', NULL, NULL, '2016-10-19 13:51:13.603', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (11, 'BUILD_QBE_QUERY', 'server', NULL, NULL, '2016-10-19 13:51:13.606', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (12, 'DO_MASSIVE_EXPORT', 'server', NULL, NULL, '2016-10-19 13:51:13.61', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (13, 'EDIT_WORKSHEET', 'server', NULL, NULL, '2016-10-19 13:51:13.613', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (14, 'MANAGE_USERS', 'server', NULL, NULL, '2016-10-19 13:51:13.616', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (15, 'SEE_DOCUMENT_BROWSER', 'server', NULL, NULL, '2016-10-19 13:51:13.619', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (16, 'SEE_FAVOURITES', 'server', NULL, NULL, '2016-10-19 13:51:13.622', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (17, 'SEE_SUBSCRIPTIONS', 'server', NULL, NULL, '2016-10-19 13:51:13.626', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (18, 'SEE_MY_DATA', 'server', NULL, NULL, '2016-10-19 13:51:13.629', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (19, 'SEE_TODO_LIST', 'server', NULL, NULL, '2016-10-19 13:51:13.633', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (20, 'CREATE_DOCUMENTS', 'server', NULL, NULL, '2016-10-19 13:51:13.636', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (21, 'CREATE_SOCIAL_ANALYSIS', 'server', NULL, NULL, '2016-10-19 13:51:13.639', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (22, 'VIEW_SOCIAL_ANALYSIS', 'server', NULL, NULL, '2016-10-19 13:51:13.642', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (23, 'HIERARCHIES_MANAGEMENT', 'server', NULL, NULL, '2016-10-19 13:51:13.645', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_authorizations VALUES (24, 'ENABLE_DATASET_PERSISTENCE', 'server', NULL, NULL, '2016-10-19 13:51:13.648', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');


--
-- Data for Name: sbi_authorizations_roles; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_binary_contents; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_cache_item; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_cache_joined_item; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_checks; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO sbi_checks VALUES (1, 'Control if parameter is an Internet Address', 'CK-FIX-01', 'INTERNET ADDRESS', 50, '', '', 'Internet Address', 'server', NULL, NULL, '2016-10-19 13:51:10.961', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_checks VALUES (2, 'Control if  a parameter is Numeric', 'CK-FIX-02', 'NUMERIC', 51, '', '', 'Numeric', 'server', NULL, NULL, '2016-10-19 13:51:10.966', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_checks VALUES (3, 'Control if  a parameter is Alfanumeric', 'CK-FIX-03', 'ALFANUMERIC', 52, '', '', 'Alfanumeric', 'server', NULL, NULL, '2016-10-19 13:51:10.971', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_checks VALUES (4, 'Control if a parameter is a letter string', 'CK-FIX-04', 'LETTERSTRING', 53, '', '', 'Letter String', 'server', NULL, NULL, '2016-10-19 13:51:10.99', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_checks VALUES (5, 'Control if parameter is a Fiscal Code', 'CK-FIX-06', 'FISCALCODE', 54, '', '', 'Fiscal Code', 'server', NULL, NULL, '2016-10-19 13:51:10.994', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_checks VALUES (6, 'Control if parameter is a E-Mail', 'CK-FIX-07', 'EMAIL', 55, '', '', 'E-Mail', 'server', NULL, NULL, '2016-10-19 13:51:10.999', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');


--
-- Data for Name: sbi_community; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_community_users; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_config; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO sbi_config VALUES (1, 'internal.security.encript.password', 'encript password', 'Enable the password encription', false, 'true', 29, 'server', NULL, NULL, '2016-10-19 13:51:12.019', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (2, 'changepwdmodule.len_min', 'Password Len Min', 'Minimum length', false, '8', 29, 'server', NULL, NULL, '2016-10-19 13:51:12.021', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (3, 'changepwdmodule.special_char', 'Special char', 'Special chars', false, '_|-#$', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.022', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (4, 'changepwdmodule.upper_char', 'Upper char', 'Minimum a char must be in upper case', false, 'ABCDEFGJKLMNOPQRSTUVWXYZ', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.023', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (5, 'changepwdmodule.lower_char', 'Lower char', 'Minimum a char must be in lower case', false, 'abcdefghjklmnopqrstuwxyz', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.025', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (6, 'changepwdmodule.number', 'Number', 'Minimum a char must be a number', false, '0123456789', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.026', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (7, 'changepwdmodule.alphabetical', 'Alaphabetical', 'Minimum a char must be a letter', false, 'abcdefghjklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.027', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (8, 'changepwdmodule.change', 'Change from last', 'The new pwd must be different from the lastest', false, '', NULL, 'server', NULL, NULL, '2016-10-19 13:51:12.027', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (9, 'changepwd.change_first', 'Change at first login ', 'The pwd must be changed at first login', false, '', NULL, 'server', NULL, NULL, '2016-10-19 13:51:12.027', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (10, 'changepwd.disactivation_time', 'Disactivation time', 'Number of months before disactivation', false, '6', 29, 'server', NULL, NULL, '2016-10-19 13:51:12.028', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (11, 'changepwd.expired_time', 'Expired time', 'Number of days fo the expiration', false, '90', 29, 'server', NULL, NULL, '2016-10-19 13:51:12.03', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (12, 'SPAGOBI.SPAGOBI-MODE.mode', 'SpagoBI mode', 'Enable the WebApplication or Portal mode', false, 'WEB', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.032', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (13, 'SPAGOBI.HOME.BANNER.view', 'show the banner', 'banner', false, 'true', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.034', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (14, 'SPAGOBI.HOME.FOOTER.view', 'show the footer', 'footer', false, 'true', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.035', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (15, 'SPAGOBI.MENU.pathTracked', 'pathTracked', 'pathTracked', false, 'true', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.036', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (16, 'SPAGOBI.LOOKUP.numberRows', 'SPAGOBI LOOKUP numberRows', 'The numnber of rows showed in each list', true, '20', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.038', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (17, 'SPAGOBI.RESOURCE_PATH_JNDI_NAME', 'RESOURCE PATH JNDI NAME', 'The name of the JNDI variable that contains the RESOURCE PATH', true, 'java://comp/env/spagobi_resource_path', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.04', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (18, 'SPAGOBI.SPAGOBI_HOST_JNDI', 'SPAGOBI HOST JNDI', 'HOST JNDI', true, 'java://comp/env/spagobi_host_url', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.043', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (19, 'SPAGOBI.SPAGO_ADAPTERHTTP_URL', 'ADAPTERHTTP URL', 'ADAPTERHTTP URL', true, '/servlet/AdapterHTTP', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.045', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (20, 'SPAGOBI.TEMPLATE_MAX_SIZE', 'TEMPLATE MAX SIZE', 'TEMPLATE MAX SIZE', true, '5242880', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.047', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (21, 'SPAGOBI.SPAGOBI_CONTEXT', 'SPAGOBI CONTEXT', 'SPAGOBI CONTEXT', true, '/SpagoBI', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.049', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (22, 'SPAGOBI.SESSION_EXPIRED_URL', 'SESSION EXPIRED URL', 'SESSION EXPIRED URL', true, '/WEB-INF/pages/login.jsp', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.052', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (23, 'SPAGOBI.DATASET.maxResult', 'DATASET maxResult', 'maxResult', true, '500000', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.053', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (24, 'SPAGOBI.SESSION_PARAMETERS_MANAGER.enabled', 'SESSION PARAMETERS MANAGER', 'enabled', true, 'false', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.055', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (25, 'SPAGOBI.DATASET_FILE_MAX_SIZE', 'DATASET FILE MAX SIZE', 'Max size for a file used as a dataset', true, '10485760', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.057', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (26, 'SPAGOBI.EXECUTION.PARAMETERS.statePersistenceEnabled', 'Parameter state persistence enabled', 'if true the default value for each parameter will be set automatically equal to the last value selected by the user', true, 'false', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.058', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (27, 'SPAGOBI.EXECUTION.PARAMETERS.statePersistenceScope', 'Parameter state persistence scope', 'if equals SESSION the parameter state will be saved in session (i.e. reseted after each logout). If equals to BROWSER the parameter state will be saved in a cookie and preserver over different login sessions', true, 'SESSION', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.06', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (28, 'SPAGOBI.EXECUTION.PARAMETERS.mementoPersistenceEnabled', 'Parameter memento persistence enabled', 'if true the last N values selected from a parameter by the user will be stored and used as selection shortcut for future executions', true, 'true', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.062', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (29, 'SPAGOBI.EXECUTION.PARAMETERS.mementoPersistenceScope', 'Parameter memento persistence scope', 'if equals SESSION the parameter memento will be saved in session (i.e. reseted after each logout). If equals to BROWSER the parameter memento will be saved in a cookie and preserver over different login sessions', true, 'BROWSER', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.063', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (30, 'SPAGOBI.EXECUTION.PARAMETERS.mementoPersistenceDepth', 'Parameter memento persistence depth', 'The number of values to save into the memento object associated to each parameter', true, '5', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.065', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (31, 'SPAGOBI.DATE-FORMAT-SERVER.format', 'SERVE DATE FORMAT', 'Date format for communications with the server (both on sending and receiving) format attribute is for server side services, see java.text.SimpleDateFormat for details, while extJsFormat is for ExtJs client, that use another standard, see http://extjs.com/deploy/dev/docs/. IF YOU CHANGE ONE FORMAT YOU MUST CHANGE THE OTHER ONE ACCORDINGLY.', true, 'dd/MM/yyyy', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.068', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'DATE-FORMAT');
INSERT INTO sbi_config VALUES (32, 'SPAGOBI.DATE-FORMAT-SERVER.extJsFormat', 'EXTJS SERVER DATE FORMAT', 'extJsFormat', true, 'd/m/Y', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.07', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'DATE-FORMAT');
INSERT INTO sbi_config VALUES (33, 'SPAGOBI.DATE-FORMAT.format', 'DATE FORMAT', 'Date visual format if language is not found', true, 'dd/MM/yyyy', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.072', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'DATE-FORMAT');
INSERT INTO sbi_config VALUES (34, 'SPAGOBI.DATE-FORMAT.extJsFormat', 'EXTJS DATE FORMAT', 'Date visual format if language is not found', true, 'd/m/Y', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.073', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'DATE-FORMAT');
INSERT INTO sbi_config VALUES (35, 'SPAGOBI.DATE-FORMAT-IT_IT.format', 'IT DATE FORMAT', 'Date format used while displaying dates according to user current locale.Format attribute is for old presentation mechanism, see java.text.SimpleDateFormat for details, while extJsFormat is for ExtJs client, that use another standard, see http://extjs.com/deploy/dev/docs/. IF YOU CHANGE ONE FORMAT YOU MUST CHANGE THE OTHER ONE ACCORDINGLY.', true, 'dd/MM/yyyy', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.075', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'DATE-FORMAT');
INSERT INTO sbi_config VALUES (36, 'SPAGOBI.DATE-FORMAT-IT_IT.extJsFormat', 'EXTJS IT DATE FORMAT', 'extJsFormat', true, 'd/m/Y', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.076', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'DATE-FORMAT');
INSERT INTO sbi_config VALUES (74, 'SPAGOBI.THEMES.THEME.sbi_default.name', 'default THEME name', 'THEME.default', true, 'sbi_default', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.164', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'THEMES');
INSERT INTO sbi_config VALUES (75, 'SPAGOBI.LANGUAGE_SUPPORTED.LANGUAGES', 'LANGUAGES', 'All languages supported', true, '[it,IT],[en,US],[fr,FR],[es,ES]', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.166', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'LANGUAGE_SUPPORTED');
INSERT INTO sbi_config VALUES (37, 'SPAGOBI.DATE-FORMAT-EN_US.format', 'US DATE FORMAT', 'Date format used while displaying dates according to user current locale.Format attribute is for old presentation mechanism, see java.text.SimpleDateFormat for details, while extJsFormat is for ExtJs client, that use another standard, see http://extjs.com/deploy/dev/docs/. IF YOU CHANGE ONE FORMAT YOU MUST CHANGE THE OTHER ONE ACCORDINGLY.', true, 'MM/dd/yyyy', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.078', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'DATE-FORMAT');
INSERT INTO sbi_config VALUES (38, 'SPAGOBI.DATE-FORMAT-EN_US.extJsFormat', 'EXTJS US DATE FORMAT', 'extJsFormat', true, 'm/d/Y', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.079', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'DATE-FORMAT');
INSERT INTO sbi_config VALUES (39, 'SPAGOBI.DATE-FORMAT-FR_FR.format', 'FR DATE FORMAT', 'Date format used while displaying dates according to user current locale.Format attribute is for old presentation mechanism, see java.text.SimpleDateFormat for details, while extJsFormat is for ExtJs client, that use another standard, see http://extjs.com/deploy/dev/docs/. IF YOU CHANGE ONE FORMAT YOU MUST CHANGE THE OTHER ONE ACCORDINGLY.', true, 'dd/MM/yyyy', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.081', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'DATE-FORMAT');
INSERT INTO sbi_config VALUES (40, 'SPAGOBI.DATE-FORMAT-FR_FR.extJsFormat', 'EXTJS RF DATE FORMAT', 'extJsFormat', true, 'd/m/Y', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.082', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'DATE-FORMAT');
INSERT INTO sbi_config VALUES (41, 'SPAGOBI.DATE-FORMAT-ES_ES.format', 'ES DATE FORMAT', 'Date format used while displaying dates according to user current locale.Format attribute is for old presentation mechanism, see java.text.SimpleDateFormat for details, while extJsFormat is for ExtJs client, that use another standard, see http://extjs.com/deploy/dev/docs/. IF YOU CHANGE ONE FORMAT YOU MUST CHANGE THE OTHER ONE ACCORDINGLY.', true, 'dd/MM/yyyy', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.085', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'DATE-FORMAT');
INSERT INTO sbi_config VALUES (42, 'SPAGOBI.DATE-FORMAT-ES_ES.extJsFormat', 'EXTJS ES DATE FORMAT', 'extJsFormat', true, 'd/m/Y', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.088', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'DATE-FORMAT');
INSERT INTO sbi_config VALUES (43, 'SPAGOBI.TIMESTAMP-FORMAT.format', 'TIMESTAMP FORMAT', 'TimeStamp Format of SpagoBI DB', true, 'dd/MM/yyyy HH:mm:ss', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.09', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'DATE-FORMAT');
INSERT INTO sbi_config VALUES (44, 'SPAGOBI.TIMESTAMP-FORMAT.extJsFormat', 'EXTJS TIMESTAMP FORMAT', 'TimeStamp Format of SpagoBI DB', true, 'd/m/Y H:i:s', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.093', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'DATE-FORMAT');
INSERT INTO sbi_config VALUES (45, 'SPAGOBI.ORGANIZATIONAL-UNIT.jndiDatasource', 'jndiDatasource', 'jndiDatasource', true, 'java:comp/env/jdbc/foodmart', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.094', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'ORGANIZATIONAL-UNIT');
INSERT INTO sbi_config VALUES (46, 'SPAGOBI.ORGANIZATIONAL-UNIT.getHierarchiesQuery', 'getHierarchiesQuery', 'getHierarchiesQuery', true, 'SELECT distinct store_country as HIERARCHY, '' '' as COMPANY FROM store', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.096', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'ORGANIZATIONAL-UNIT');
INSERT INTO sbi_config VALUES (47, 'SPAGOBI.ORGANIZATIONAL-UNIT.getOUsQuery', 'getOUsQuery', 'getOUsQuery', true, 'SELECT distinct a.store_state as name, a.store_state as code FROM store a union select b.store_city as name, b.store_city as code from store b union select c.store_name as name , c.store_name as code from store c', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.099', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'ORGANIZATIONAL-UNIT');
INSERT INTO sbi_config VALUES (48, 'SPAGOBI.ORGANIZATIONAL-UNIT.getRootByHierarchy', 'getRootByHierarchy', 'getRootByHierarchy', true, 'SELECT distinct store_country as code, store_country as name FROM store where store_country = ?', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.101', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'ORGANIZATIONAL-UNIT');
INSERT INTO sbi_config VALUES (49, 'SPAGOBI.ORGANIZATIONAL-UNIT.getChildrenByLevel', 'getChildrenByLevel', 'getChildrenByLevel', true, 'select distinct ! as code, ! as name from store where store_country = ? ', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.103', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'ORGANIZATIONAL-UNIT');
INSERT INTO sbi_config VALUES (50, 'SPAGOBI.ORGANIZATIONAL-UNIT.getRootLeaves', 'getRootLeaves', 'getRootLeaves', true, '', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.106', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'ORGANIZATIONAL-UNIT');
INSERT INTO sbi_config VALUES (51, 'SPAGOBI.ORGANIZATIONAL-UNIT.provider', 'provider', 'provider', true, 'it.eng.spagobi.kpi.ou.provider.OrganizationalUnitListProviderFoodmart', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.108', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'ORGANIZATIONAL-UNIT');
INSERT INTO sbi_config VALUES (52, 'SPAGOBI.SECURITY.DEFAULT_USER', 'DEFAULT_USER', 'DEFAULT_USER used by portal environment', true, 'biadmin', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.111', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (53, 'SPAGOBI.SECURITY.PORTAL-SECURITY-CLASS.className', 'Security Info provider', 'Security Info provider', true, 'it.eng.spagobi.security.InternalSecurityInfoProviderImpl', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.113', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (54, 'SPAGOBI.SECURITY.USER-PROFILE-FACTORY-CLASS.className', 'Security Service Supplier', 'Security Service Supplier', true, 'it.eng.spagobi.security.InternalSecurityServiceSupplierImpl', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.116', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (55, 'SPAGOBI.SECURITY.PORTAL-SECURITY-INIT-CLASS.className', 'Security Initializer', 'Security Initializer', true, 'it.eng.spagobi.security.init.InternalSecurityInitializer', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.118', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (56, 'SPAGOBI.SECURITY.ROLE-NAME-PATTERN-FILTER', 'ROLE NAME PATTERN FILTER', 'ROLE-NAME-PATTERN-FILTER', true, '.*', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.12', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (57, 'SPAGOBI.SECURITY.ROLE-TYPE-PATTERNS.DEV_ROLE-PATTERN', 'DEV ROLE PATTERN', 'DEV ROLE PATTERN', true, '/spagobi/dev', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.123', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (58, 'SPAGOBI.SECURITY.ROLE-TYPE-PATTERNS.TEST_ROLE-PATTERN', 'TEST ROLE PATTERN', 'TEST ROLE PATTERN', true, '/spagobi/test', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.125', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (59, 'SPAGOBI.SECURITY.ROLE-TYPE-PATTERNS.MODEL_ADMIN-PATTERN', 'MODEL ADMIN PATTERN', 'MODEL ADMIN PATTERN', true, '/spagobi/modeladmin', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.128', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (60, 'SPAGOBI.SECURITY.ROLE-TYPE-PATTERNS.ADMIN-PATTERN', 'ADMIN -PATTERN', 'ADMIN -PATTERN', true, '/spagobi/admin', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.13', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (61, 'CAS_SSO.VALIDATE-USER.URL', 'CAS VALIDATE USER URL', 'CAS VALIDATE USER URL', true, 'https://athos.engilab.ewebpd.eng.it:1447/cas', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.132', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (62, 'CAS_SSO.VALIDATE-USER.SERVICE', 'CAS VALIDATE USER SERVICE', 'CAS VALIDATE USER SERVICE', true, 'http://localhost:58080/SpagoBI/proxyCallback', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.135', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (63, 'SPAGOBI.PORTLET_EDIT_MODE_ROLES.ROLE.name', 'PORTLET EDIT MODE ROLES', 'PORTLET EDIT MODE ROLES', true, '/spagobi/admin', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.137', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (64, 'SPAGOBI_SSO.ACTIVE', 'ACTIVE SSO FLAG', 'ACTIVE SSO FLAG', true, 'false', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.14', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (65, 'SPAGOBI_SSO.PASS', 'PASS String', 'Some proxy element use this string to do some security check', true, 'PASS', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.142', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (66, 'SPAGOBI_SSO.SECURITY_LOGOUT_URL', 'SECURITY LOGOUT URL', '', true, 'https://athos.engilab.ewebpd.eng.it:1447/cas/logout', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.144', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (67, 'SPAGOBI_SSO.INTEGRATION_CLASS_JNDI', 'SSO INTEGRATION CLASS JNDI', 'SSO INTEGRATION CLASS JNDI', true, 'java://comp/env/spagobi_sso_class', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.147', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (68, 'SPAGOBI.DB-TIMESTAMP-FORMAT.format', 'DB TIMESTAMP FORMAT', 'DB TIMESTAMP FORMAT', true, 'yyyy-MM-dd HH:mm:ss', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.149', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'DATE-FORMAT');
INSERT INTO sbi_config VALUES (69, 'SPAGOBI.DB_LOG.value', 'DB LOG', 'DB LOG', true, 'false', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.152', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'DATE-FORMAT');
INSERT INTO sbi_config VALUES (70, 'SPAGOBI.THEMES.THEMES', 'THEMEs', 'All themes', true, 'sbi_default', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.154', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'THEMES');
INSERT INTO sbi_config VALUES (71, 'SPAGOBI.THEMES.THEME.default', 'THEME default', 'THEME.default', true, 'sbi_default', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.157', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'THEMES');
INSERT INTO sbi_config VALUES (72, 'SPAGOBI.THEMES.THEME.sbi_default.view_name', 'THEME view_name', 'THEME.view_name', true, 'default', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.159', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'THEMES');
INSERT INTO sbi_config VALUES (73, 'SPAGOBI.THEMES.THEME.sbi_default.ext_theme', 'THEME ext_theme', 'THEME.ext_theme', true, 'xtheme-blue.css', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.161', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'THEMES');
INSERT INTO sbi_config VALUES (76, 'SPAGOBI.LANGUAGE_SUPPORTED.LANGUAGE.default', 'default', 'default', true, 'en,US', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.169', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'LANGUAGE_SUPPORTED');
INSERT INTO sbi_config VALUES (77, 'INDEX_INITIALIZATION.jndiResourcePath', 'INDEX_INITIALIZATION.jndiResourcePath', '', true, 'java://comp/env/spagobi_resource_path', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.171', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SEARCH_ENGINE');
INSERT INTO sbi_config VALUES (78, 'INDEX_INITIALIZATION.name', 'INDEX_INITIALIZATION.jndiResourcePath', '', true, '//idx', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.174', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SEARCH_ENGINE');
INSERT INTO sbi_config VALUES (79, 'SCRIPT_LANGUAGE_DEFAULT', 'SCRIPT LANGUAGE DEFAULT', '', true, 'groovy', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.176', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SCRIPT_LANGUAGE');
INSERT INTO sbi_config VALUES (80, 'SCRIPT_LANGUAGE.groovy.name', 'SCRIPT LANGUAGE.groovy.name', '', true, 'groovy', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.177', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SCRIPT_LANGUAGE');
INSERT INTO sbi_config VALUES (81, 'SCRIPT_LANGUAGE.groovy.engineclass', 'SCRIPT LANGUAGE.groovy.engineclass', '', true, 'org.codehaus.groovy.bsf.GroovyEngine', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.179', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SCRIPT_LANGUAGE');
INSERT INTO sbi_config VALUES (82, 'SCRIPT_LANGUAGE.groovy.shortidentifier', 'SCRIPT LANGUAGE.groovy.shortidentifier', '', true, 'gy', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.181', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SCRIPT_LANGUAGE');
INSERT INTO sbi_config VALUES (83, 'SCRIPT_LANGUAGE.groovy.predefinedScriptFile', 'SCRIPT LANGUAGE.groovy.predefinedScriptFile', '', true, 'predefinedGroovyScript.groovy', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.183', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SCRIPT_LANGUAGE');
INSERT INTO sbi_config VALUES (84, 'SCRIPT_LANGUAGE.groovy.identifier', 'SCRIPT LANGUAGE.groovy.identifier', '', true, 'groovy', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.185', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SCRIPT_LANGUAGE');
INSERT INTO sbi_config VALUES (85, 'SCRIPT_LANGUAGE.javascript.name', 'SCRIPT LANGUAGE.groovy.name', '', true, 'javascript', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.187', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SCRIPT_LANGUAGE');
INSERT INTO sbi_config VALUES (86, 'SCRIPT_LANGUAGE.javascript.shortidentifier', 'SCRIPT LANGUAGE.groovy.shortidentifier', '', true, 'js', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.189', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SCRIPT_LANGUAGE');
INSERT INTO sbi_config VALUES (87, 'SCRIPT_LANGUAGE.javascript.predefinedScriptFile', 'SCRIPT LANGUAGE.groovy.predefinedScriptFile', '', true, 'predefinedJavascriptScript.js', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.192', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SCRIPT_LANGUAGE');
INSERT INTO sbi_config VALUES (88, 'SCRIPT_LANGUAGE.javascript.identifier', 'SCRIPT LANGUAGE.groovy.identifier', '', true, 'javascript', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.194', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SCRIPT_LANGUAGE');
INSERT INTO sbi_config VALUES (89, 'MAIL.PROFILES.trustedStore.file', 'Trusted Store File Path', '', true, '', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.197', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (90, 'MAIL.PROFILES.trustedStore.password', 'Trusted Store Password', '', true, '', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.199', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (91, 'MAIL.PROFILES.keyStore.file', 'Key Store File Path', '', true, '', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.201', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (92, 'MAIL.PROFILES.keyStore.password', 'Key Store Password', '', true, '', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.203', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (93, 'MAIL.PROFILES.scheduler.smtphost', 'Scheduler Smtp Host', '', true, 'mail.eng.it', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.206', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (94, 'MAIL.PROFILES.scheduler.smtpport', 'Scheduler Smtp Port', '', true, '465', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.208', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (95, 'MAIL.PROFILES.scheduler.from', 'Scheduler From', '', true, 'spagobi@spagobidomain.com', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.21', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (96, 'MAIL.PROFILES.scheduler.user', 'Scheduler User', '', true, '', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.212', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (97, 'MAIL.PROFILES.scheduler.password', 'Scheduler Password', '', true, '', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.214', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (98, 'MAIL.PROFILES.scheduler.useSSL', 'Use SSL Connection', '', true, 'false', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.216', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (99, 'MAIL.PROFILES.user.smtphost', 'Scheduler Smtp Host', '', true, 'mail.eng.it', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.218', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (100, 'MAIL.PROFILES.user.smtpport', 'Scheduler Smtp Port', '', true, '465', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.22', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (101, 'MAIL.PROFILES.user.from', 'Scheduler From', '', true, 'spagobi@spagobidomain.com', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.222', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (102, 'MAIL.PROFILES.user.user', 'Scheduler User', '', true, '', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.224', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (103, 'MAIL.PROFILES.user.password', 'Scheduler Password', '', true, '', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.226', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (104, 'MAIL.PROFILES.user.useSSL', 'Use SSL Connection', '', true, 'false', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.228', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (105, 'MAIL.PROFILES.kpi_alarm.smtphost', 'Scheduler Smtp Host', '', true, 'mail.eng.it', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.23', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (106, 'MAIL.PROFILES.kpi_alarm.smtpport', 'Scheduler Smtp Port', '', true, '465', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.232', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (107, 'MAIL.PROFILES.kpi_alarm.from', 'Scheduler From', '', true, 'spagobi@spagobidomain.com', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.234', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (108, 'MAIL.PROFILES.kpi_alarm.user', 'Scheduler User', '', true, '', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.235', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (109, 'MAIL.PROFILES.kpi_alarm.password', 'Scheduler Password', '', true, '', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.238', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (110, 'MAIL.PROFILES.kpi_alarm.useSSL', 'Use SSL Connection', '', true, 'false', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.24', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (111, 'DATA_SET_NULL_VALUE', 'DATA_SET_NULL_VALUE', 'Default value to replace null dataset values', true, '%', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.242', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'MAIL');
INSERT INTO sbi_config VALUES (112, 'JNDI_THREAD_MANAGER', 'JNDI_THREAD_MANAGER', 'Jndi to build work manager', true, 'java:/comp/env/wm/SpagoWorkManager', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.244', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (113, 'SPAGOBI.SECURITY.CHECK_ROLE_LOGIN', 'SPAGOBI.SECURITY.CHECK_ROLE_LOGIN', 'Check the correct role in login action', false, 'false', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.246', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (114, 'SPAGOBI.SECURITY.ROLE_LOGIN', 'SPAGOBI.SECURITY.ROLE_LOGIN', 'The value of the role to check at login module', false, '', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.247', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (115, 'SPAGOBI.SECURITY.USE_PUBLIC_USER', 'SPAGOBI.SECURITY.USE_PUBLIC_USER', 'Enables the use of the public user. Usable only without SSO!', false, 'false', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.248', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (116, 'SPAGOBI.DOCUMENTBROWSER.HOME', 'SPAGOBI DOCUMENT BROWSER HOME', 'Default folder (by label) to visualize when opening document browser.', false, '', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.249', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (117, 'SPAGOBI.DOCUMENTBROWSER.FLAT', 'SPAGOBI DOCUMENT BROWSER FLAT VIEW', 'Use a flat view to visualize only documents inside a folder', false, 'false', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.25', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (118, 'SPAGOBI.DOCUMENTBROWSER.RECURSIVE', 'SPAGOBI DOCUMENT BROWSER RECURSIVE VIEW', 'Use a recursive view to visualize documents inside a folder and all his subfolders', false, 'false', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.251', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (119, 'SPAGOBI.CUBE.MODEL.NAME', 'Model Name', 'The name of the model used to extract valid dimension definitions', false, 'validation', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.252', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (120, 'MAIL.SIGNUP.expired_time', 'Signup expired time', 'Signup expired time', false, '1', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.253', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (121, 'MAIL.SIGNUP.body', 'Signup mail body', 'Signup mail body', false, 'Per confermare l''attivazione dell''account utilizza il link riportato', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.254', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (122, 'MAIL.SIGNUP.subject', 'Signup mail subject', 'Signup mail subject', false, 'Creazione account SpagoBI', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.255', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (123, 'SPAGOBI.SECURITY.DEFAULT_ROLE_ON_SIGNUP', 'Default user role name', 'Default user role on signup', true, '/spagobi/user', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.256', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (124, 'SPAGOBI.SECURITY.ACTIVE_SIGNUP_FUNCTIONALITY', 'SPAGOBI.SECURITY.ACTIVE_SIGNUP_FUNCTIONALITY', 'Enables the signup functionality for the final user', false, 'false', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.257', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SECURITY');
INSERT INTO sbi_config VALUES (125, 'SPAGOBI.CACHE.NAMEPREFIX', 'SPAGOBI.CACHE.NAMEPREFIX', 'Prefix for cache tables name', true, 'sbicache', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.258', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (126, 'SPAGOBI.CACHE.SPACE_AVAILABLE', 'SPAGOBI.CACHE.SPACE_AVAILABLE', 'Bytes of dimension available for cache management', true, '1073741824', 29, 'server', NULL, NULL, '2016-10-19 13:51:12.26', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (127, 'SPAGOBI.CACHE.LIMIT_FOR_CLEAN', 'SPAGOBI.CACHE.LIMIT_FOR_CLEAN', '% of dimension of space cleaned when the cache is full', true, '50', 29, 'server', NULL, NULL, '2016-10-19 13:51:12.261', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (128, 'SPAGOBI.CACHE.SCHEDULING_FULL_CLEAN', 'SPAGOBI.CACHE.SCHEDULING_FULL_CLEAN', 'Scheduling configuration to perform a full cleaning action on the cache (this deletes any dataset into the cache!)', true, 'DAILY', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.262', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (129, 'SPAGOBI.CACHE.DS_LAST_ACCESS_TTL', 'SPAGOBI.CACHE.DS_LAST_ACCESS_TTL', 'Time To Live (from the last access) for a cached datasets', true, '3600', 29, 'server', NULL, NULL, '2016-10-19 13:51:12.263', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (130, 'SPAGOBI.CACHE.DATABASE_SCHEMA', 'SPAGOBI.CACHE.DATABASE_SCHEMA', 'name of the schema where the cache tables are created', true, '', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.264', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (131, 'SPAGOBI.DOCUMENTS.MAX_PREVIEW_IMAGE_SIZE', 'Max preview image size', 'Max dimension for a document''s preview image', true, '1048576', 29, 'server', NULL, NULL, '2016-10-19 13:51:12.266', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (132, 'SPAGOBI.DOCUMENTS.MAX_PREVIEW_IMAGES_NUM', 'Max preview images', 'Max number for documents'' preview images', true, '200', 29, 'server', NULL, NULL, '2016-10-19 13:51:12.267', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (133, 'SPAGOBI.DOCUMENTS.PARAMETERS_REGION_DEFAULT', 'Parameters Region Default', 'Where parameters form is shown (north or east) by default', true, 'east', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.269', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (134, 'SPAGOBI.HOME.SHOW_LOGOUT_ON_SILENT_LOGIN', 'SPAGOBI.HOME.SHOW_LOGOUT_ON_SILENT_LOGIN', 'Show the logout button in case of silent login', true, 'true', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.27', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (135, 'SPAGOBI.SOCIAL_ANALYSIS_URL', 'SPAGOBI SOCIAL ANALYSIS URL', 'SPAGOBI SOCIAL ANALYSIS URL', true, '/SpagoBISocialAnalysis/restful-services/start', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.272', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SOCIAL_CONFIGURATION');
INSERT INTO sbi_config VALUES (136, 'SPAGOBI.SOCIAL_ANALYSIS_IS_ACTIVE', 'SPAGOBI SOCIAL ANALYSIS STATUS', 'SPAGOBI SOCIAL ANALYSIS STATUS', true, 'true', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.273', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'SOCIAL_CONFIGURATION');
INSERT INTO sbi_config VALUES (137, 'SPAGOBI.DATASET.PREVIEW_ROWS', 'Number of rows to show for dataset preview', 'Number of rows to show for dataset preview', true, '1000', 29, 'server', NULL, NULL, '2016-10-19 13:51:12.275', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (138, 'SPAGOBI.DATASET.PERSIST.TABLE_PREFIX', 'Table name prefix for dataset persistence', 'Table name prefix for dataset persistence', true, 'D_', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.277', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (139, 'SPAGOBI.ON_SESSION_EXPIRED.SHOW_MESSAGE', 'SPAGOBI.ON_SESSION_EXPIRED.SHOW_MESSAGE', 'Flag to specify if an error message should be displayed in case the session expires, otherwise user will be redirected to login page', true, 'FALSE', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.278', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');
INSERT INTO sbi_config VALUES (140, 'SPAGOBI.SPAGOBI_VERSION_NUMBER', 'SPAGOBI.SPAGOBI_VERSION_NUMBER', 'SpagoBI version number', true, 'FALSE', 30, 'server', NULL, NULL, '2016-10-19 13:51:12.28', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL, 'GENERIC_CONFIGURATION');


--
-- Data for Name: sbi_data_set; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_data_source; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_dist_list; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_dist_list_objects; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_dist_list_user; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_domains; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO sbi_domains VALUES (1, 'QUERY', 'sbidomains.nm.query', 'INPUT_TYPE', 'Input mode and values', 'sbidomains.ds.query', 'server', NULL, NULL, '2016-10-19 13:51:09.851', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (2, 'SCRIPT', 'sbidomains.nm.script', 'INPUT_TYPE', 'Input mode and values', 'sbidomains.ds.script', 'server', NULL, NULL, '2016-10-19 13:51:09.856', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (3, 'FIX_LOV', 'sbidomains.nm.fix_lov', 'INPUT_TYPE', 'Input mode and values', 'sbidomains.ds.fix_lov', 'server', NULL, NULL, '2016-10-19 13:51:09.859', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (4, 'JAVA_CLASS', 'sbidomains.nm.java_class', 'INPUT_TYPE', 'Input mode and values', 'sbidomains.ds.java_class', 'server', NULL, NULL, '2016-10-19 13:51:09.861', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (5, 'DATASET', 'sbidomains.nm.dataset', 'INPUT_TYPE', 'Input mode and values', 'sbidomains.ds.dataset', 'server', NULL, NULL, '2016-10-19 13:51:09.882', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (6, 'REPORT', 'sbidomains.nm.report', 'BIOBJ_TYPE', 'BI Object types', 'sbidomains.ds.report', 'server', NULL, NULL, '2016-10-19 13:51:09.885', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (7, 'OLAP', 'sbidomains.nm.olap', 'BIOBJ_TYPE', 'BI Object types', 'sbidomains.ds.olap', 'server', NULL, NULL, '2016-10-19 13:51:09.888', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (8, 'DATA_MINING', 'sbidomains.nm.data_mining', 'BIOBJ_TYPE', 'BI Object types', 'sbidomains.ds.data_mining', 'server', NULL, NULL, '2016-10-19 13:51:09.89', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (9, 'DASH', 'sbidomains.nm.dash', 'BIOBJ_TYPE', 'BI Object types', 'sbidomains.ds.dash', 'server', NULL, NULL, '2016-10-19 13:51:09.895', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (10, 'DATAMART', 'sbidomains.nm.datamart', 'BIOBJ_TYPE', 'BI Object types', 'sbidomains.ds.datamart', 'server', NULL, NULL, '2016-10-19 13:51:09.898', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (11, 'MAP', 'sbidomains.nm.map', 'BIOBJ_TYPE', 'BI Object types', 'sbidomains.ds.map', 'server', NULL, NULL, '2016-10-19 13:51:09.9', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (12, 'DOSSIER', 'sbidomains.nm.dossier', 'BIOBJ_TYPE', 'BI Object types', 'sbidomains.ds.dossier', 'server', NULL, NULL, '2016-10-19 13:51:09.902', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (13, 'OFFICE_DOC', 'sbidomains.nm.office_doc', 'BIOBJ_TYPE', 'BI Object types', 'sbidomains.ds.office_doc', 'server', NULL, NULL, '2016-10-19 13:51:09.905', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (14, 'ETL', 'sbidomains.nm.etl', 'BIOBJ_TYPE', 'BI Object types', 'sbidomains.ds.etl', 'server', NULL, NULL, '2016-10-19 13:51:09.907', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (15, 'DOCUMENT_COMPOSITE', 'sbidomains.nm.document_composite', 'BIOBJ_TYPE', 'BI Object types', 'sbidomains.ds.document_composite', 'server', NULL, NULL, '2016-10-19 13:51:09.909', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (16, 'KPI', 'Kpi', 'BIOBJ_TYPE', 'BI Object types', 'Kpi business indicator', 'server', NULL, NULL, '2016-10-19 13:51:09.911', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (17, 'SMART_FILTER', 'sbidomains.nm.smart_filter', 'BIOBJ_TYPE', 'BI Object types', 'sbidomains.ds.smart_filter', 'server', NULL, NULL, '2016-10-19 13:51:09.918', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (18, 'CONSOLE', 'Console', 'BIOBJ_TYPE', 'BI Object types', 'sbidomains.ds.console', 'server', NULL, NULL, '2016-10-19 13:51:09.931', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (19, 'WORKSHEET', 'sbidomains.nm.worksheet', 'BIOBJ_TYPE', 'BI Object types', 'sbidomains.ds.worksheet', 'server', NULL, NULL, '2016-10-19 13:51:09.934', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (20, 'CHART', 'sbidomains.nm.chart', 'BIOBJ_TYPE', 'BI Object types', 'sbidomains.ds.chart', 'server', NULL, NULL, '2016-10-19 13:51:09.936', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (21, 'MOBILE_REPORT', 'sbidomains.nm.mobile.report', 'BIOBJ_TYPE', 'BI Object types', 'sbidomains.ds.mobile.report', 'server', NULL, NULL, '2016-10-19 13:51:09.938', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (22, 'MOBILE_CHART', 'sbidomains.nm.mobile.chart', 'BIOBJ_TYPE', 'BI Object types', 'sbidomains.ds.mobile.chart', 'server', NULL, NULL, '2016-10-19 13:51:09.94', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (23, 'MOBILE_COCKPIT', 'sbidomains.nm.mobile.cockpit', 'BIOBJ_TYPE', 'BI Object types', 'sbidomains.ds.mobile.cockpit', 'server', NULL, NULL, '2016-10-19 13:51:09.942', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (24, 'NETWORK', 'sbidomains.nm.network', 'BIOBJ_TYPE', 'BI Object types', 'sbidomains.ds.network', 'server', NULL, NULL, '2016-10-19 13:51:09.944', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (25, 'BOOL', 'sbidomains.nm.bool', 'VALUE_TYPE', 'Input value types to check', 'sbidomains.ds.bool', 'server', NULL, NULL, '2016-10-19 13:51:09.946', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (26, 'SINGLE', 'sbidomains.nm.single', 'VALUE_TYPE', 'Input value types to check', 'sbidomains.ds.single', 'server', NULL, NULL, '2016-10-19 13:51:09.948', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (27, 'MULTI', 'sbidomains.nm.multi', 'VALUE_TYPE', 'Input value types to check', 'sbidomains.ds.multi', 'server', NULL, NULL, '2016-10-19 13:51:09.95', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (28, 'DATE', 'sbidomains.nm.date', 'PAR_TYPE', 'Parameter type', 'sbidomains.ds.date', 'server', NULL, NULL, '2016-10-19 13:51:09.952', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (29, 'NUM', 'sbidomains.nm.num', 'PAR_TYPE', 'Parameter type', 'sbidomains.ds.num', 'server', NULL, NULL, '2016-10-19 13:51:09.953', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (30, 'STRING', 'sbidomains.nm.string', 'PAR_TYPE', 'Parameter type', 'sbidomains.ds.string', 'server', NULL, NULL, '2016-10-19 13:51:09.956', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (31, 'DATE_RANGE', 'sbidomains.nm.dateRange', 'PAR_TYPE', 'Parameter type', 'sbidomains.ds.dateRange', 'server', NULL, NULL, '2016-10-19 13:51:09.958', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (32, 'USER', 'sbidomains.nm.user', 'ROLE_TYPE', 'Role type', 'sbidomains.ds.user', 'server', NULL, NULL, '2016-10-19 13:51:09.959', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (33, 'ADMIN', 'sbidomains.nm.admin', 'ROLE_TYPE', 'Role type', 'sbidomains.ds.admin', 'server', NULL, NULL, '2016-10-19 13:51:09.962', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (34, 'DEV_ROLE', 'sbidomains.nm.dev_role', 'ROLE_TYPE', 'Role type', 'sbidomains.ds.dev_role', 'server', NULL, NULL, '2016-10-19 13:51:09.964', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (35, 'TEST_ROLE', 'sbidomains.nm.test_role', 'ROLE_TYPE', 'Role type', 'sbidomains.ds.test_role', 'server', NULL, NULL, '2016-10-19 13:51:09.968', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (36, 'MODEL_ADMIN', 'sbidomains.nm.model_admin', 'ROLE_TYPE', 'Role type', 'sbidomains.ds.model_admin', 'server', NULL, NULL, '2016-10-19 13:51:09.969', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (37, 'SUSP', 'sbidomains.nm.susp', 'STATE', 'Object state', 'sbidomains.ds.susp', 'server', NULL, NULL, '2016-10-19 13:51:09.971', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (38, 'LOW_FUNCT', 'sbidomains.nm.low_funct', 'FUNCT_TYPE', 'Functionality', 'sbidomains.ds.low_funct', 'server', NULL, NULL, '2016-10-19 13:51:09.972', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (39, 'USER_FUNCT', 'sbidomains.nm.user_funct', 'FUNCT_TYPE', 'Functionality', 'sbidomains.ds.user_funct', 'server', NULL, NULL, '2016-10-19 13:51:09.974', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (40, 'COMMUNITY_FUNCT', 'sbidomains.nm.community_funct', 'FUNCT_TYPE', 'Functionality', 'sbidomains.ds.community_funct', 'server', NULL, NULL, '2016-10-19 13:51:09.975', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (41, 'DEV', 'sbidomains.nm.dev', 'STATE', 'Object state', 'sbidomains.ds.dev', 'server', NULL, NULL, '2016-10-19 13:51:09.977', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (42, 'TEST', 'sbidomains.nm.test', 'STATE', 'Object state', 'sbidomains.ds.test', 'server', NULL, NULL, '2016-10-19 13:51:09.979', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (43, 'REL', 'sbidomains.nm.rel', 'STATE', 'Object state', 'sbidomains.ds.rel', 'server', NULL, NULL, '2016-10-19 13:51:09.981', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (44, 'DATE', 'sbidomains.nm.date', 'CHECK', 'Check', 'sbidomains.ds.date', 'server', NULL, NULL, '2016-10-19 13:51:09.983', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (45, 'REGEXP', 'sbidomains.nm.regexp', 'CHECK', 'Check', 'sbidomains.ds.regexp', 'server', NULL, NULL, '2016-10-19 13:51:09.984', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (46, 'MAXLENGTH', 'sbidomains.nm.maxlength', 'CHECK', 'Check', 'sbidomains.ds.maxlength', 'server', NULL, NULL, '2016-10-19 13:51:09.986', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (47, 'RANGE', 'sbidomains.nm.range', 'CHECK', 'Check', 'sbidomains.ds.range', 'server', NULL, NULL, '2016-10-19 13:51:09.987', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (48, 'DECIMALS', 'sbidomains.nm.decimals', 'CHECK', 'Check', 'sbidomains.ds.decimals', 'server', NULL, NULL, '2016-10-19 13:51:09.989', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (49, 'MINLENGTH', 'sbidomains.nm.minlength', 'CHECK', 'Check', 'sbidomains.ds.minlength', 'server', NULL, NULL, '2016-10-19 13:51:09.99', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (50, 'INTERNET ADDRESS', 'sbidomains.nm.internet_address', 'PRED_CHECK', 'Pred Check', 'sbidomains.ds.internet_address', 'server', NULL, NULL, '2016-10-19 13:51:09.992', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (51, 'NUMERIC', 'sbidomains.nm.numeric', 'PRED_CHECK', 'Pred Check', 'sbidomains.ds.numeric', 'server', NULL, NULL, '2016-10-19 13:51:09.993', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (52, 'ALFANUMERIC', 'sbidomains.nm.alfanumeric', 'PRED_CHECK', 'Pred Check', 'sbidomains.ds.alfanumeric', 'server', NULL, NULL, '2016-10-19 13:51:09.994', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (53, 'LETTERSTRING', 'sbidomains.nm.letterstring', 'PRED_CHECK', 'Pred Check', 'sbidomains.ds.letterstring', 'server', NULL, NULL, '2016-10-19 13:51:09.996', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (54, 'FISCALCODE', 'sbidomains.nm.fiscalcode', 'PRED_CHECK', 'Pred Check', 'sbidomains.ds.fiscalcode', 'server', NULL, NULL, '2016-10-19 13:51:09.998', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (55, 'EMAIL', 'sbidomains.nm.email', 'PRED_CHECK', 'Pred Check', 'sbidomains.ds.email', 'server', NULL, NULL, '2016-10-19 13:51:10', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (56, 'EXT', 'sbidomains.nm.ext', 'ENGINE_TYPE', 'Engine types', 'sbidomains.ds.ext', 'server', NULL, NULL, '2016-10-19 13:51:10.001', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (57, 'INT', 'sbidomains.nm.int', 'ENGINE_TYPE', 'Engine types', 'sbidomains.ds.int', 'server', NULL, NULL, '2016-10-19 13:51:10.003', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (58, 'LIST', 'sbidomains.nm.list', 'SELECTION_TYPE', 'Selection modality of parameter values', 'sbidomains.ds.list', 'server', NULL, NULL, '2016-10-19 13:51:10.005', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (59, 'LOOKUP', 'sbidomains.nm.lookup', 'SELECTION_TYPE', 'Selection modality of parameter values', 'sbidomains.ds.lookup', 'server', NULL, NULL, '2016-10-19 13:51:10.006', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (60, 'SLIDER', 'sbidomains.nm.slider', 'SELECTION_TYPE', 'Selection modality of parameter values', 'sbidomains.ds.slider', 'server', NULL, NULL, '2016-10-19 13:51:10.008', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (61, 'TREE', 'sbidomains.nm.tree', 'SELECTION_TYPE', 'Selection modality of parameter values', 'sbidomains.ds.tree', 'server', NULL, NULL, '2016-10-19 13:51:10.009', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (62, 'COMBOBOX', 'sbidomains.nm.combobox', 'SELECTION_TYPE', 'Selection modality of parameter values', 'sbidomains.ds.combobox', 'server', NULL, NULL, '2016-10-19 13:51:10.01', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (63, '-1', 'sbidomains.nm.default', 'DIALECT_HIB', 'Predefined hibernate dialect', 'sbidomains.ds.default', 'server', NULL, NULL, '2016-10-19 13:51:10.012', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (64, 'org.hibernate.dialect.OracleDialect', 'sbidomains.nm.oracle', 'DIALECT_HIB', 'Predefined hibernate dialect', 'sbidomains.ds.oracle', 'server', NULL, NULL, '2016-10-19 13:51:10.014', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (65, 'org.hibernate.dialect.Oracle9Dialect', 'sbidomains.nm.oracle_9i10g', 'DIALECT_HIB', 'Predefined hibernate dialect', 'sbidomains.ds.oracle_9i10g', 'server', NULL, NULL, '2016-10-19 13:51:10.016', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (66, 'org.hibernate.dialect.SQLServerDialect', 'sbidomains.nm.sqlserver', 'DIALECT_HIB', 'Predefined hibernate dialect', 'sbidomains.ds.sqlserver', 'server', NULL, NULL, '2016-10-19 13:51:10.017', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (67, 'org.hibernate.dialect.HSQLDialect', 'sbidomains.nm.hsql', 'DIALECT_HIB', 'Predefined hibernate dialect', 'sbidomains.ds.hsql', 'server', NULL, NULL, '2016-10-19 13:51:10.019', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (68, 'org.hibernate.dialect.MySQLInnoDBDialect', 'sbidomains.nm.mysql', 'DIALECT_HIB', 'Predefined hibernate dialect', 'sbidomains.ds.mysql', 'server', NULL, NULL, '2016-10-19 13:51:10.02', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (69, 'org.hibernate.dialect.PostgreSQLDialect', 'sbidomains.nm.postgresql', 'DIALECT_HIB', 'Predefined hibernate dialect', 'sbidomains.ds.postgresql', 'server', NULL, NULL, '2016-10-19 13:51:10.022', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (70, 'org.hibernate.dialect.IngresDialect', 'sbidomains.nm.ingres', 'DIALECT_HIB', 'Predefined hibernate dialect', 'sbidomains.ds.ingres', 'server', NULL, NULL, '2016-10-19 13:51:10.024', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (71, 'VoltDBDialect', 'sbidomains.nm.voltdb', 'DIALECT_HIB', 'VoltDB dialect', 'sbidomains.ds.voltdb', 'server', NULL, NULL, '2016-10-19 13:51:10.025', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (72, 'MongoDialect', 'sbidomains.nm.mongo', 'DIALECT_HIB', 'MongoDB dialect', 'sbidomains.ds.mongo', 'server', NULL, NULL, '2016-10-19 13:51:10.027', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (73, 'hbase', 'sbidomains.nm.hbase', 'DIALECT_HIB', 'HBQL HBase dialect', 'sbidomains.ds.hbase', 'server', NULL, NULL, '2016-10-19 13:51:10.029', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (74, 'hive', 'sbidomains.nm.hive', 'DIALECT_HIB', 'HQL Hive dialect', 'sbidomains.ds.hive', 'server', NULL, NULL, '2016-10-19 13:51:10.031', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (75, 'orient', 'sbidomains.nm.orient', 'DIALECT_HIB', 'OrientDB dialect', 'sbidomains.ds.orient', 'server', NULL, NULL, '2016-10-19 13:51:10.033', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (76, 'RANGE', 'sbidomains.nm.range', 'THRESHOLD_TYPE', 'Threshold Type', 'sbidomains.ds.range', 'server', NULL, NULL, '2016-10-19 13:51:10.034', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (77, 'MINIMUM', 'sbidomains.nm.minimum', 'THRESHOLD_TYPE', 'Threshold Type', 'sbidomains.ds.minimum', 'server', NULL, NULL, '2016-10-19 13:51:10.036', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (78, 'MAXIMUM', 'sbidomains.nm.maximum', 'THRESHOLD_TYPE', 'Threshold Type', 'sbidomains.ds.maximum', 'server', NULL, NULL, '2016-10-19 13:51:10.038', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (79, 'URGENT', 'sbidomains.nm.Urgent', 'SEVERITY', 'Severity Level', 'sbidomains.ds.Urgent', 'server', NULL, NULL, '2016-10-19 13:51:10.04', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (80, 'HIGH', 'sbidomains.nm.High', 'SEVERITY', 'Severity Level', 'sbidomains.ds.High', 'server', NULL, NULL, '2016-10-19 13:51:10.042', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (81, 'MEDIUM', 'sbidomains.nm.Medium', 'SEVERITY', 'Severity Level', 'sbidomains.ds.Medium', 'server', NULL, NULL, '2016-10-19 13:51:10.043', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (82, 'LOW', 'sbidomains.nm.Low', 'SEVERITY', 'Severity Level', 'sbidomains.ds.Low', 'server', NULL, NULL, '2016-10-19 13:51:10.045', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (83, 'CSP', 'sbidomains.nm.CSP', 'RESOURCE', 'Resource type', 'sbidomains.ds.CSP', 'server', NULL, NULL, '2016-10-19 13:51:10.047', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (84, 'PROCESS', 'sbidomains.nm.Process', 'RESOURCE', 'Resource type', 'sbidomains.ds.Process', 'server', NULL, NULL, '2016-10-19 13:51:10.049', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (85, 'PROJECT', 'sbidomains.nm.Project', 'RESOURCE', 'Resource type', 'sbidomains.ds.Project', 'server', NULL, NULL, '2016-10-19 13:51:10.05', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (86, 'SERVICE', 'sbidomains.nm.Service', 'RESOURCE', 'Resource type', 'sbidomains.ds.Service', 'server', NULL, NULL, '2016-10-19 13:51:10.052', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (87, 'Meter', 'sbidomains.nm.Meter', 'KPI_CHART', 'Kpi Chart type', 'sbidomains.ds.Meter', 'server', NULL, NULL, '2016-10-19 13:51:10.053', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (88, 'SimpleDial', 'sbidomains.nm.SimpleDial', 'KPI_CHART', 'Kpi Chart type', 'sbidomains.ds.SimpleDial', 'server', NULL, NULL, '2016-10-19 13:51:10.055', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (89, 'Speedometer', 'sbidomains.nm.Speedometer', 'KPI_CHART', 'Kpi Chart type', 'sbidomains.ds.Speedometer', 'server', NULL, NULL, '2016-10-19 13:51:10.056', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (90, 'Thermometer', 'sbidomains.nm.Thermometer', 'KPI_CHART', 'Kpi Chart type', 'sbidomains.ds.Thermometer', 'server', NULL, NULL, '2016-10-19 13:51:10.058', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (91, 'BulletGraph', 'sbidomains.nm.BulletGraph', 'KPI_CHART', 'Kpi Chart type', 'sbidomains.ds.BulletGraph', 'server', NULL, NULL, '2016-10-19 13:51:10.059', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (92, 'MAIL', 'sbidomains.nm.Mail', 'ALARM_MODALITY', 'Alarm Modality', 'sbidomains.ds.Mail', 'server', NULL, NULL, '2016-10-19 13:51:10.061', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (93, 'SMS', 'sbidomains.nm.SMS', 'ALARM_MODALITY', 'Alarm Modality', 'sbidomains.ds.SMS', 'server', NULL, NULL, '2016-10-19 13:51:10.063', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (94, 'GENERIC_ROOT', 'sbidomains.nm.Generic_root', 'MODEL_ROOT', 'Model root type', 'sbidomains.ds.Generic_root', 'server', NULL, NULL, '2016-10-19 13:51:10.064', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (95, 'GENERIC_NODE', 'sbidomains.nm.Generic_Node', 'MODEL_NODE', 'Model node type', 'sbidomains.ds.Generic_Node', 'server', NULL, NULL, '2016-10-19 13:51:10.066', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (96, 'PIVOT_TRANSFOMER', 'sbidomains.nm.pivot_transformer', 'TRANSFORMER_TYPE', 'Transformer types', 'sbidomains.ds.pivot_transformer', 'server', NULL, NULL, '2016-10-19 13:51:10.067', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (97, 'PDF', 'PDF', 'EXPORT_TYPE', 'Exporters type', 'Export type', 'server', NULL, NULL, '2016-10-19 13:51:10.068', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (98, 'XLS', 'XLS', 'EXPORT_TYPE', 'Exporters type', 'Export type', 'server', NULL, NULL, '2016-10-19 13:51:10.069', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (99, 'CSV', 'CSV', 'EXPORT_TYPE', 'Exporters type', 'Export type', 'server', NULL, NULL, '2016-10-19 13:51:10.07', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (100, 'XML', 'XML', 'EXPORT_TYPE', 'Exporters type', 'Export type', 'server', NULL, NULL, '2016-10-19 13:51:10.071', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (101, 'TXT', 'TXT', 'EXPORT_TYPE', 'Exporters type', 'Export type', 'server', NULL, NULL, '2016-10-19 13:51:10.072', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (102, 'JPG', 'JPG', 'EXPORT_TYPE', 'Exporters type', 'Export type', 'server', NULL, NULL, '2016-10-19 13:51:10.082', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (103, 'PPT', 'PPT', 'EXPORT_TYPE', 'Exporters type', 'Export type', 'server', NULL, NULL, '2016-10-19 13:51:10.083', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (104, 'RTF', 'RTF', 'EXPORT_TYPE', 'Exporters type', 'Export type', 'server', NULL, NULL, '2016-10-19 13:51:10.084', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (105, 'GRAPHML', 'GRAPHML', 'EXPORT_TYPE', 'Exporters type', 'Export type', 'server', NULL, NULL, '2016-10-19 13:51:10.088', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (106, 'PNG', 'PNG', 'EXPORT_TYPE', 'Exporters type', 'Export type', 'server', NULL, NULL, '2016-10-19 13:51:10.089', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (107, 'JRXML', 'JRXML', 'EXPORT_TYPE', 'Exporters type', 'Export type', 'server', NULL, NULL, '2016-10-19 13:51:10.09', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (108, 'XLSX', 'XLSX', 'EXPORT_TYPE', 'Exporters type', 'Export type', 'server', NULL, NULL, '2016-10-19 13:51:10.091', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (109, 'Basic', 'Basic', 'KPI_TYPE', 'Kpi Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.092', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (110, 'Derived', 'Derived', 'KPI_TYPE', 'Kpi Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.093', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (111, 'Nominal scale', 'Nominal scale', 'METRIC_SCALE_TYPE', 'Metric Scale Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.094', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (112, 'Ordinal scale', 'Ordinal scale', 'METRIC_SCALE_TYPE', 'Metric Scale Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.097', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (113, 'Intervals scale', 'Intervals scale', 'METRIC_SCALE_TYPE', 'Metric Scale Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.1', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (114, 'Ratio scale', 'Ratio scale', 'METRIC_SCALE_TYPE', 'Metric Scale Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.102', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (115, 'Absolute scale', 'Absolute scale', 'METRIC_SCALE_TYPE', 'Metric Scale Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.103', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (116, 'Day scale', 'Day scale', 'METRIC_SCALE_TYPE', 'Metric Scale Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.105', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (117, 'Bytes/s', 'Bytes/sec', 'METRIC_SCALE_TYPE', 'Metric Scale Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.106', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (118, 'Mega Bytes', 'Mega Bytes', 'METRIC_SCALE_TYPE', 'Metric Scale Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.107', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (119, 'Bytes', 'Bytes', 'METRIC_SCALE_TYPE', 'Metric Scale Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.109', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (120, 'Kilo Bytes', 'Kilo Bytes', 'METRIC_SCALE_TYPE', 'Metric Scale Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.114', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (121, 'Giga Bytes', 'Giga Bytes', 'METRIC_SCALE_TYPE', 'Metric Scale Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.115', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (122, 'Tera Bytes', 'Tera Bytes', 'METRIC_SCALE_TYPE', 'Metric Scale Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.117', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (123, 'Milliseconds', 'Milliseconds', 'METRIC_SCALE_TYPE', 'Metric Scale Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.118', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (124, 'Seconds', 'Seconds', 'METRIC_SCALE_TYPE', 'Metric Scale Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.12', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (125, 'Minutes', 'Minutes', 'METRIC_SCALE_TYPE', 'Metric Scale Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.124', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (126, 'Hours', 'Hours', 'METRIC_SCALE_TYPE', 'Metric Scale Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.158', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (127, 'KBit/s', 'KBit/sec', 'METRIC_SCALE_TYPE', 'Metric Scale Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.181', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (128, 'COUNT', 'Count', 'MEASURE_TYPE', 'Measure Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.183', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (129, 'TIME', 'Time', 'MEASURE_TYPE', 'Measure Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.184', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (130, 'SIZE', 'Size', 'MEASURE_TYPE', 'Measure Type', '', 'server', NULL, NULL, '2016-10-19 13:51:10.186', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (131, 'org.hibernate.dialect.DB2400Dialect', 'sbidomains.nm.db2', 'DIALECT_HIB', 'Predefined hibernate dialect', 'sbidomains.ds.db2', 'server', NULL, NULL, '2016-10-19 13:51:10.195', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (132, 'LONG_TEXT', 'LONG_TEXT', 'OBJMETA_DATA_TYPE', 'Predefined data type for metadata', 'Predefined data type LONG TEXT for metadata', 'server', NULL, NULL, '2016-10-19 13:51:10.197', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (133, 'SHORT_TEXT', 'SHORT_TEXT', 'OBJMETA_DATA_TYPE', 'Predefined data type for metadata', 'Predefined data type SHORT TEXT for metadata', 'server', NULL, NULL, '2016-10-19 13:51:10.198', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (134, 'ACCESSIBLE_HTML', 'Accessible Html', 'BIOBJ_TYPE', 'BI Object types', 'Accessible HTML', 'server', NULL, NULL, '2016-10-19 13:51:10.199', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (135, 'Boolean', 'Udp Boolean Type', 'UDP_TYPE', 'Udp type', 'Predefined udp type', 'server', NULL, NULL, '2016-10-19 13:51:10.231', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (136, 'Text', 'Udp Text Type', 'UDP_TYPE', 'Udp type', 'Predefined udp type', 'server', NULL, NULL, '2016-10-19 13:51:10.233', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (137, 'Integer', 'Udp Integer Type', 'UDP_TYPE', 'Udp type', 'Predefined udp type', 'server', NULL, NULL, '2016-10-19 13:51:10.235', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (138, 'Model', 'Model Family', 'UDP_FAMILY', 'Udp family', 'Predefined udp family', 'server', NULL, NULL, '2016-10-19 13:51:10.237', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (139, 'Kpi', 'Kpi_Family', 'UDP_FAMILY', 'Udp famil', 'Predefined udp family', 'server', NULL, NULL, '2016-10-19 13:51:10.238', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (140, 'groovy', 'Groovy', 'SCRIPT_TYPE', 'Script Type', 'Script Type', 'server', NULL, NULL, '2016-10-19 13:51:10.239', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (141, 'ECMAScript', 'Javascript', 'SCRIPT_TYPE', 'Script Type', 'Script Type', 'server', NULL, NULL, '2016-10-19 13:51:10.241', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (142, 'File', 'SbiFileDataSet', 'DATA_SET_TYPE', 'Data Set Type', 'SbiFileDataSet', 'server', NULL, NULL, '2016-10-19 13:51:10.242', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (143, 'Ckan', 'SbiCkanDataSet', 'DATA_SET_TYPE', 'Data Set Type', 'SbiCkanDataSet', 'server', NULL, NULL, '2016-10-19 13:51:10.243', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (144, 'REST', 'SbiRESTDataSet', 'DATA_SET_TYPE', 'Data Set Type', 'SbiRESTDataSet', 'server', NULL, NULL, '2016-10-19 13:51:10.244', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (145, 'Query', 'SbiQueryDataSet', 'DATA_SET_TYPE', 'Data Set Type', 'SbiQueryDataSet', 'server', NULL, NULL, '2016-10-19 13:51:10.247', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (146, 'Java Class', 'SbiJClassDataSet', 'DATA_SET_TYPE', 'Data Set Type', 'SbiJClassDataSet', 'server', NULL, NULL, '2016-10-19 13:51:10.248', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (147, 'Web Service', 'SbiWSDataSet', 'DATA_SET_TYPE', 'Data Set Type', 'SbiWSDataSet', 'server', NULL, NULL, '2016-10-19 13:51:10.25', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (148, 'Script', 'SbiScriptDataSet', 'DATA_SET_TYPE', 'Data Set Type', 'SbiScriptDataSet', 'server', NULL, NULL, '2016-10-19 13:51:10.251', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (149, 'Qbe', 'SbiQbeDataSet', 'DATA_SET_TYPE', 'Data Set Type', 'SbiQbeDataSet', 'server', NULL, NULL, '2016-10-19 13:51:10.253', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (150, 'Custom', 'SbiCustomDataSet', 'DATA_SET_TYPE', 'Data Set Type', 'SbiCustomDataSet', 'server', NULL, NULL, '2016-10-19 13:51:10.254', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (151, 'Flat', 'SbiFlatDataSet', 'DATA_SET_TYPE', 'Data Set Type', 'SbiFlatDataSet', 'server', NULL, NULL, '2016-10-19 13:51:10.256', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (152, 'Cat1', 'Cat1', 'CATEGORY_TYPE', 'Category Type', 'Cat1', 'server', NULL, NULL, '2016-10-19 13:51:10.257', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (153, 'Cat2', 'Cat2', 'CATEGORY_TYPE', 'Category Type', 'Cat2', 'server', NULL, NULL, '2016-10-19 13:51:10.259', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (154, 'DEVELOPMENT', 'sbidomains.permissiononfolder.nm.dev', 'PERMISSION_ON_FOLDER', 'Permission on folder', 'sbidomains.permissiononfolder.ds.dev', 'server', NULL, NULL, '2016-10-19 13:51:10.26', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (155, 'TEST', 'sbidomains.permissiononfolder.nm.test', 'PERMISSION_ON_FOLDER', 'Permission on folder', 'sbidomains.permissiononfolder.ds.test', 'server', NULL, NULL, '2016-10-19 13:51:10.262', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (156, 'EXECUTION', 'sbidomains.permissiononfolder.nm.execute', 'PERMISSION_ON_FOLDER', 'Permission on folder', 'sbidomains.permissiononfolder.ds.execute', 'server', NULL, NULL, '2016-10-19 13:51:10.264', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (157, 'CREATION', 'sbidomains.permissiononfolder.nm.create', 'PERMISSION_ON_FOLDER', 'Permission on folder', 'sbidomains.permissiononfolder.ds.create', 'server', NULL, NULL, '2016-10-19 13:51:10.265', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (158, 'ITA', 'Italian', 'LANG', 'Language ISO code', 'Italian', 'server', NULL, NULL, '2016-10-19 13:51:10.266', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (159, 'SPA', 'Spanish', 'LANG', 'Language ISO code', 'Spanish', 'server', NULL, NULL, '2016-10-19 13:51:10.267', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (160, 'ENG', 'English', 'LANG', 'Language ISO code', 'English', 'server', NULL, NULL, '2016-10-19 13:51:10.269', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (161, 'FRA', 'French', 'LANG', 'Language ISO code', 'French', 'server', NULL, NULL, '2016-10-19 13:51:10.271', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (162, 'fieldType', 'fieldType', 'DS_META_PROPERTY', 'Data Set Metadata Property', 'Data Set Metadata Property', 'server', NULL, NULL, '2016-10-19 13:51:10.273', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (163, 'type', 'type', 'DS_META_PROPERTY', 'Data Set Metadata Property', 'Data Set Metadata Property', 'server', NULL, NULL, '2016-10-19 13:51:10.275', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (164, 'MEASURE', 'MEASURE', 'DS_META_VALUE', 'Data Set Metadata Value', 'Data Set Metadata Value', 'server', NULL, NULL, '2016-10-19 13:51:10.277', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (165, 'ATTRIBUTE', 'ATTRIBUTE', 'DS_META_VALUE', 'Data Set Metadata Value', 'Data Set Metadata Value', 'server', NULL, NULL, '2016-10-19 13:51:10.279', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (166, 'String', 'String', 'DS_META_VALUE', 'Data Set Metadata Value', 'Data Set Metadata Value', 'server', NULL, NULL, '2016-10-19 13:51:10.28', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (167, 'Integer', 'Integer', 'DS_META_VALUE', 'Data Set Metadata Value', 'Data Set Metadata Value', 'server', NULL, NULL, '2016-10-19 13:51:10.282', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (168, 'Double', 'Double', 'DS_META_VALUE', 'Data Set Metadata Value', 'Data Set Metadata Value', 'server', NULL, NULL, '2016-10-19 13:51:10.283', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (169, 'SBI Model Category 1', 'SBI Model Category 1', 'BM_CATEGORY', 'Category Meta Model', 'Category Meta Model', 'server', NULL, NULL, '2016-10-19 13:51:10.284', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (170, 'SBI Model Category 2', 'SBI Model Category 2', 'BM_CATEGORY', 'Category Meta Model', 'Category Meta Model', 'server', NULL, NULL, '2016-10-19 13:51:10.286', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (171, 'GEOBI', 'GEOBI', 'CATEGORY_TYPE', 'Category Type', 'GEOBI', 'server', NULL, NULL, '2016-10-19 13:51:10.287', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (172, 'hierarchy', 'hierarchy', 'DS_META_PROPERTY', 'Data Set Metadata Property', 'Data Set Metadata Property', 'server', NULL, NULL, '2016-10-19 13:51:10.288', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (173, 'hierarchy_level', 'hierarchy_level', 'DS_META_PROPERTY', 'Data Set Metadata Property', 'Data Set Metadata Property', 'server', NULL, NULL, '2016-10-19 13:51:10.29', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (174, 'geo', 'geo', 'DS_META_VALUE', 'Data Set Metadata Value', 'Data Set Metadata Value', 'server', NULL, NULL, '2016-10-19 13:51:10.291', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (175, 'time', 'time', 'DS_META_VALUE', 'Data Set Metadata Value', 'Data Set Metadata Value', 'server', NULL, NULL, '2016-10-19 13:51:10.292', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (176, 'State', 'State', 'DS_META_VALUE', 'Data Set Metadata Value', 'Data Set Metadata Value', 'server', NULL, NULL, '2016-10-19 13:51:10.294', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (177, 'Comune ita', 'Comune ita', 'DS_META_VALUE', 'Data Set Metadata Value', 'Data Set Metadata Value', 'server', NULL, NULL, '2016-10-19 13:51:10.295', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (178, 'Year num', 'Year num', 'DS_META_VALUE', 'Data Set Metadata Value', 'Data Set Metadata Value', 'server', NULL, NULL, '2016-10-19 13:51:10.296', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (179, 'Month name', 'Month name', 'DS_META_VALUE', 'Data Set Metadata Value', 'Data Set Metadata Value', 'server', NULL, NULL, '2016-10-19 13:51:10.298', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (180, 'Day num', 'Day num', 'DS_META_VALUE', 'Data Set Metadata Value', 'Data Set Metadata Value', 'server', NULL, NULL, '2016-10-19 13:51:10.299', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (181, 'FILE', 'FILE', 'LAYER_TYPE', 'Layer Type', 'Layer Type', 'server', NULL, NULL, '2016-10-19 13:51:10.3', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (182, 'WFS', 'WFS', 'LAYER_TYPE', 'Layer Type', 'Layer Type', 'server', NULL, NULL, '2016-10-19 13:51:10.303', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (183, 'WMS', 'WMS', 'LAYER_TYPE', 'Layer Type', 'Layer Type', 'server', NULL, NULL, '2016-10-19 13:51:10.305', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (184, 'TMS', 'TMS', 'LAYER_TYPE', 'Layer Type', 'Layer Type', 'server', NULL, NULL, '2016-10-19 13:51:10.307', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (185, 'Google', 'Google', 'LAYER_TYPE', 'Layer Type', 'Layer Type', 'server', NULL, NULL, '2016-10-19 13:51:10.31', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (186, 'OSM', 'OSM', 'LAYER_TYPE', 'Layer Type', 'Layer Type', 'server', NULL, NULL, '2016-10-19 13:51:10.313', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (187, 'USER', 'User', 'DS_SCOPE', 'Dataset scope', 'Dataset scope', 'server', NULL, NULL, '2016-10-19 13:51:10.315', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (188, 'ENTERPRISE', 'Enterprise', 'DS_SCOPE', 'Dataset scope', 'Dataset scope', 'server', NULL, NULL, '2016-10-19 13:51:10.317', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (189, 'TECHNICAL', 'Technical', 'DS_SCOPE', 'Dataset scope', 'Dataset scope', 'server', NULL, NULL, '2016-10-19 13:51:10.318', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_domains VALUES (190, 'licence', 'licence', 'DS_GEN_META_PROPERTY', 'Data Set General Metadata Property', 'Data Set General Metadata Property', 'server', NULL, NULL, '2016-10-19 13:51:10.32', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);


--
-- Data for Name: sbi_dossier_bin_temp; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_dossier_pres; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_dossier_temp; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_engines; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO sbi_engines VALUES (1, 0, 'Dashboard Engine', 'Dashboard Engine', '', NULL, NULL, NULL, '', 'SpagoBIDashboardEng', 57, 'it.eng.spagobi.engines.dashboard.SpagoBIDashboardInternalEngine', 9, true, false, 'server', NULL, NULL, '2016-10-19 13:51:10.36', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (2, 0, 'JFreeChart Engine', 'JFree Chart Engine', '', NULL, NULL, NULL, '', 'SpagoBIJFreeChartEng', 57, 'it.eng.spagobi.engines.chart.SpagoBIChartInternalEngine', 9, true, false, 'server', NULL, NULL, '2016-10-19 13:51:10.564', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (3, 0, 'Dossier Engine', 'Dossier Engine', '', NULL, NULL, NULL, '', 'SpagoBIDossierEngine', 57, 'it.eng.spagobi.engines.dossier.SpagoBIDossierInternalEngine', 12, false, false, 'server', NULL, NULL, '2016-10-19 13:51:10.581', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (4, 0, 'Office Document Engine', 'Office Document Engine', '', NULL, NULL, NULL, '', 'SpagoBIOfficeEngine', 57, 'it.eng.spagobi.engines.officedocument.SpagoBIOfficeDocumentInternalEngine', 13, false, false, 'server', NULL, NULL, '2016-10-19 13:51:10.602', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (5, 0, 'Document Composition Engine', 'Document Composition Engine', '', NULL, NULL, NULL, '', 'SpagoBICompositeDocE', 57, 'it.eng.spagobi.engines.documentcomposition.SpagoBIDocumentCompositionInternalEngine', 15, false, false, 'server', NULL, NULL, '2016-10-19 13:51:10.621', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (6, 0, 'Kpi Engine', 'Kpi Engine', '', NULL, NULL, NULL, '', 'SpagoBIKpiEngine', 57, 'it.eng.spagobi.engines.kpi.SpagoBIKpiInternalEngine', 16, false, false, 'server', NULL, NULL, '2016-10-19 13:51:10.637', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (7, 0, 'Birt Report Engine', 'Birt Report Engine', '/SpagoBIBirtReportEngine/BirtReportServlet', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.birt.BirtReportDriver', 'SpagoBIBirtReportEng', 56, '', 6, false, true, 'server', NULL, NULL, '2016-10-19 13:51:10.648', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (8, 0, 'Geo Engine', 'Geo Engine', '/SpagoBIGeoEngine/servlet/AdapterHTTP', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.geo.GeoDriver', 'SpagoBIGeoEngine', 56, '', 11, true, true, 'server', NULL, NULL, '2016-10-19 13:51:10.66', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (9, 0, 'JPivot Engine', 'JPivot Mondrian Engine', '/SpagoBIJPivotEngine/JPivotServlet', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.jpivot.JPivotDriver', 'SpagoBIJPivotEngine', 56, '', 7, false, true, 'server', NULL, NULL, '2016-10-19 13:51:10.672', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (10, 0, 'Jasper Report Engine', 'Jasper Report Engine', '/SpagoBIJasperReportEngine/JasperReportServlet', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.jasperreport.JasperReportDriver', 'SpagoBIJasperReportE', 56, '', 6, false, true, 'server', NULL, NULL, '2016-10-19 13:51:10.686', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (11, 0, 'Qbe Engine', 'Qbe Engine', '/SpagoBIQbeEngine/servlet/AdapterHTTP', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.qbe.QbeDriver', 'SpagoBIQbeEngine', 56, '', 10, false, true, 'server', NULL, NULL, '2016-10-19 13:51:10.702', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (12, 0, 'Talend Engine', 'Talend Engine', '/SpagoBITalendEngine/JobRunService', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.talend.TalendDriver', 'SpagoBITalendEngine', 56, '', 14, false, true, 'server', NULL, NULL, '2016-10-19 13:51:10.719', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (13, 0, 'Data-mining Engine', 'Data-mining Engine', '/SpagoBIDataMiningEngine/restful-services/start', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.datamining.DataMiningDriver', 'SpagoBIDataMiningEngine', 56, '', 8, false, true, 'server', NULL, NULL, '2016-10-19 13:51:10.733', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (14, 0, 'Accessible Report Engine', 'Accessible Report Engine', '/SpagoBIAccessibilityEngine/servlet/AccessibilityServlet', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.accessibility.AccessibilityDriver', 'SpagoBIAccessibleEng', 56, '', 134, true, true, 'server', NULL, NULL, '2016-10-19 13:51:10.747', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (15, 0, 'Process Engine', 'Process Engine', '/SpagoBICommonJEngine/servlet/AdapterHTTP', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.commonj.CommonjDriver', 'SpagoBIProcessEngine', 56, '', 14, false, false, 'server', NULL, NULL, '2016-10-19 13:51:10.761', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (16, 0, 'Smart Filter Engine', ' Smart Filter Engine', '/SpagoBIQbeEngine/servlet/AdapterHTTP', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.smartfilter.SmartFilterDriver', 'SpagoBISmartFilterEn', 56, '', 17, false, true, 'server', NULL, NULL, '2016-10-19 13:51:10.778', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (17, 0, 'Gis Engine', 'Gis Engine', '/SpagoBIGeoReportEngine/GeoReportEngineStartAction', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.gis.GisDriver', 'SpagoBIGisEngine', 56, '', 11, true, true, 'server', NULL, NULL, '2016-10-19 13:51:10.794', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (18, 0, 'Console Engine', 'Console Engine', '/SpagoBIConsoleEngine/servlet/AdapterHTTP', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.console.ConsoleDriver', 'SpagoBIConsoleEngine', 56, '', 18, true, true, 'server', NULL, NULL, '2016-10-19 13:51:10.805', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (19, 0, 'Worksheet Engine', 'Worksheet Engine', '/SpagoBIQbeEngine/servlet/AdapterHTTP', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.worksheet.WorksheetDriver', 'SpagoBIWorksheetEng', 56, '', 19, true, true, 'server', NULL, NULL, '2016-10-19 13:51:10.817', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (20, 0, 'JSChart Engine', 'JSChart Engine', '/SpagoBIChartEngine/servlet/AdapterHTTP', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.chart.ChartDriver', 'SpagoBIJSChartEngine', 56, '', 20, true, false, 'server', NULL, NULL, '2016-10-19 13:51:10.827', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (21, 0, 'Mobile Report Engine', 'Report engine for mobile devices', '/SpagoBIMobileEngine/servlet/AdapterHTTP?ACTION_NAME=MOBILE_ENGINE_START_ACTION', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.mobile.report.MobileReportDriver', 'SpagoBITableMobileEn', 56, '', 21, true, true, 'server', NULL, NULL, '2016-10-19 13:51:10.844', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (22, 0, 'Mobile Chart Engine', 'Chart engine for mobile devices', '/SpagoBIMobileEngine/servlet/AdapterHTTP?ACTION_NAME=MOBILE_ENGINE_START_ACTION', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.mobile.chart.MobileChartDriver', 'SpagoBIChartMobileEn', 56, '', 22, true, true, 'server', NULL, NULL, '2016-10-19 13:51:10.856', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (23, 0, 'Mobile Cockpit Engine', 'Cockpit engine for mobile devices', '/SpagoBIMobileEngine/servlet/AdapterHTTP?ACTION_NAME=MOBILE_ENGINE_START_ACTION', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.mobile.cockpit.MobileCockpitDriver', 'SpagoBICockpitMobile', 56, '', 23, false, false, 'server', NULL, NULL, '2016-10-19 13:51:10.867', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (24, 0, 'Network Analysis Engine', 'Network Analysis Engine', '/SpagoBINetworkEngine/servlet/AdapterHTTP', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.network.NetworkDriver', 'SpagoBINetworkEngine', 56, '', 24, true, false, 'server', NULL, NULL, '2016-10-19 13:51:10.879', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (25, 0, 'Cockpit Engine', 'Cockpit Engine', '/SpagoBICockpitEngine/api/1.0/pages/execute', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.cockpit.CockpitDriver', 'SpagoBICockpitEngine', 56, '', 15, false, false, 'server', NULL, NULL, '2016-10-19 13:51:10.893', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_engines VALUES (26, 0, 'What-If Engine', 'What-If Engine', '/SpagoBIWhatIfEngine/restful-services/start', NULL, NULL, NULL, 'it.eng.spagobi.engines.drivers.whatif.WhatIfDriver', 'SpagoBIWhatIfEngine', 56, '', 7, false, true, 'server', NULL, NULL, '2016-10-19 13:51:10.904', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);


--
-- Data for Name: sbi_events; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_events_log; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_events_roles; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_exporters; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO sbi_exporters VALUES (6, 97, true);
INSERT INTO sbi_exporters VALUES (10, 97, true);
INSERT INTO sbi_exporters VALUES (10, 98, false);
INSERT INTO sbi_exporters VALUES (10, 108, false);
INSERT INTO sbi_exporters VALUES (10, 104, false);
INSERT INTO sbi_exporters VALUES (10, 102, false);
INSERT INTO sbi_exporters VALUES (7, 97, true);
INSERT INTO sbi_exporters VALUES (7, 98, false);
INSERT INTO sbi_exporters VALUES (7, 104, false);
INSERT INTO sbi_exporters VALUES (7, 102, false);
INSERT INTO sbi_exporters VALUES (7, 99, false);
INSERT INTO sbi_exporters VALUES (7, 108, false);
INSERT INTO sbi_exporters VALUES (9, 97, false);
INSERT INTO sbi_exporters VALUES (9, 98, true);
INSERT INTO sbi_exporters VALUES (2, 97, true);
INSERT INTO sbi_exporters VALUES (11, 97, true);
INSERT INTO sbi_exporters VALUES (11, 98, false);
INSERT INTO sbi_exporters VALUES (11, 108, false);
INSERT INTO sbi_exporters VALUES (11, 99, false);
INSERT INTO sbi_exporters VALUES (11, 104, false);
INSERT INTO sbi_exporters VALUES (11, 107, false);
INSERT INTO sbi_exporters VALUES (8, 97, true);
INSERT INTO sbi_exporters VALUES (8, 102, true);
INSERT INTO sbi_exporters VALUES (16, 97, true);
INSERT INTO sbi_exporters VALUES (16, 98, false);
INSERT INTO sbi_exporters VALUES (16, 99, false);
INSERT INTO sbi_exporters VALUES (16, 104, false);
INSERT INTO sbi_exporters VALUES (19, 98, true);
INSERT INTO sbi_exporters VALUES (19, 108, false);
INSERT INTO sbi_exporters VALUES (19, 97, false);
INSERT INTO sbi_exporters VALUES (1, 97, true);
INSERT INTO sbi_exporters VALUES (18, 97, true);
INSERT INTO sbi_exporters VALUES (20, 102, true);
INSERT INTO sbi_exporters VALUES (20, 97, false);
INSERT INTO sbi_exporters VALUES (24, 105, true);
INSERT INTO sbi_exporters VALUES (24, 106, true);
INSERT INTO sbi_exporters VALUES (24, 97, false);
INSERT INTO sbi_exporters VALUES (5, 97, true);


--
-- Data for Name: sbi_ext_roles; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO sbi_ext_roles VALUES (1, '/spagobi/dev', '/spagobi/dev', NULL, 'DEV_ROLE', 34, 'server_init', NULL, NULL, '2016-10-19 13:51:13.127', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_ext_roles VALUES (2, '/spagobi/test', '/spagobi/test', NULL, 'TEST_ROLE', 35, 'server_init', NULL, NULL, '2016-10-19 13:51:13.158', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_ext_roles VALUES (3, '/spagobi/user', '/spagobi/user', NULL, 'USER', 32, 'server_init', NULL, NULL, '2016-10-19 13:51:13.169', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_ext_roles VALUES (4, '/spagobi/userb', '/spagobi/userb', NULL, 'USER', 32, 'server_init', NULL, NULL, '2016-10-19 13:51:13.183', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_ext_roles VALUES (5, '/spagobi/admin', '/spagobi/admin', NULL, 'ADMIN', 33, 'server_init', NULL, NULL, '2016-10-19 13:51:13.193', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_ext_roles VALUES (6, '/spagobi/modeladmin', '/spagobi/modeladmin', NULL, 'MODEL_ADMIN', 36, 'server_init', NULL, NULL, '2016-10-19 13:51:13.205', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_ext_roles VALUES (7, '/spagobi/op_reva', '/spagobi/op_reva', NULL, 'USER', 32, 'server_init', NULL, NULL, '2016-10-19 13:51:13.217', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_ext_roles VALUES (8, '/spagobi/an_reva', '/spagobi/an_reva', NULL, 'USER', 32, 'server_init', NULL, NULL, '2016-10-19 13:51:13.227', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_ext_roles VALUES (9, '/spagobi/bam', '/spagobi/bam', NULL, 'USER', 32, 'server_init', NULL, NULL, '2016-10-19 13:51:13.254', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_ext_roles VALUES (10, '/spagobi/user/demo', '/spagobi/user/demo', NULL, 'USER', 32, 'server_init', NULL, NULL, '2016-10-19 13:51:13.263', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');


--
-- Data for Name: sbi_ext_roles_category; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_ext_user_roles; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO sbi_ext_user_roles VALUES (1, 5, 'server', NULL, NULL, '2016-10-19 13:51:13.67', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_ext_user_roles VALUES (2, 3, 'server', NULL, NULL, '2016-10-19 13:51:13.687', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_ext_user_roles VALUES (3, 10, 'server', NULL, NULL, '2016-10-19 13:51:13.697', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_ext_user_roles VALUES (4, 2, 'server', NULL, NULL, '2016-10-19 13:51:13.705', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_ext_user_roles VALUES (5, 1, 'server', NULL, NULL, '2016-10-19 13:51:13.713', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_ext_user_roles VALUES (6, 9, 'server', NULL, NULL, '2016-10-19 13:51:13.719', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);


--
-- Data for Name: sbi_func_role; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO sbi_func_role VALUES (5, 1, 'DEVELOPMENT', 154, 'server', 'server', NULL, '2016-08-03 11:47:23.153', '2016-08-03 11:47:23.153', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (8, 1, 'DEVELOPMENT', 154, 'server', 'server', NULL, '2016-08-03 11:47:23.158', '2016-08-03 11:47:23.158', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (9, 1, 'DEVELOPMENT', 154, 'server', 'server', NULL, '2016-08-03 11:47:23.16', '2016-08-03 11:47:23.16', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (1, 1, 'DEVELOPMENT', 154, 'server', 'server', NULL, '2016-08-03 11:47:23.163', '2016-08-03 11:47:23.163', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (6, 1, 'DEVELOPMENT', 154, 'server', 'server', NULL, '2016-08-03 11:47:23.165', '2016-08-03 11:47:23.165', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (7, 1, 'DEVELOPMENT', 154, 'server', 'server', NULL, '2016-08-03 11:47:23.168', '2016-08-03 11:47:23.168', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (2, 1, 'DEVELOPMENT', 154, 'server', 'server', NULL, '2016-08-03 11:47:23.172', '2016-08-03 11:47:23.172', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (3, 1, 'DEVELOPMENT', 154, 'server', 'server', NULL, '2016-08-03 11:47:23.175', '2016-08-03 11:47:23.175', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (10, 1, 'DEVELOPMENT', 154, 'server', 'server', NULL, '2016-08-03 11:47:23.177', '2016-08-03 11:47:23.177', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (4, 1, 'DEVELOPMENT', 154, 'server', 'server', NULL, '2016-08-03 11:47:23.18', '2016-08-03 11:47:23.18', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (5, 1, 'TEST', 155, 'server', 'server', NULL, '2016-08-03 11:47:23.185', '2016-08-03 11:47:23.185', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (8, 1, 'TEST', 155, 'server', 'server', NULL, '2016-08-03 11:47:23.186', '2016-08-03 11:47:23.186', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (9, 1, 'TEST', 155, 'server', 'server', NULL, '2016-08-03 11:47:23.189', '2016-08-03 11:47:23.189', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (1, 1, 'TEST', 155, 'server', 'server', NULL, '2016-08-03 11:47:23.191', '2016-08-03 11:47:23.191', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (6, 1, 'TEST', 155, 'server', 'server', NULL, '2016-08-03 11:47:23.192', '2016-08-03 11:47:23.192', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (7, 1, 'TEST', 155, 'server', 'server', NULL, '2016-08-03 11:47:23.194', '2016-08-03 11:47:23.194', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (2, 1, 'TEST', 155, 'server', 'server', NULL, '2016-08-03 11:47:23.196', '2016-08-03 11:47:23.196', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (3, 1, 'TEST', 155, 'server', 'server', NULL, '2016-08-03 11:47:23.198', '2016-08-03 11:47:23.198', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (10, 1, 'TEST', 155, 'server', 'server', NULL, '2016-08-03 11:47:23.2', '2016-08-03 11:47:23.2', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (4, 1, 'TEST', 155, 'server', 'server', NULL, '2016-08-03 11:47:23.201', '2016-08-03 11:47:23.201', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (5, 1, 'EXECUTION', 156, 'server', 'server', NULL, '2016-08-03 11:47:23.205', '2016-08-03 11:47:23.205', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (8, 1, 'EXECUTION', 156, 'server', 'server', NULL, '2016-08-03 11:47:23.209', '2016-08-03 11:47:23.209', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (9, 1, 'EXECUTION', 156, 'server', 'server', NULL, '2016-08-03 11:47:23.212', '2016-08-03 11:47:23.212', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (1, 1, 'EXECUTION', 156, 'server', 'server', NULL, '2016-08-03 11:47:23.216', '2016-08-03 11:47:23.216', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (6, 1, 'EXECUTION', 156, 'server', 'server', NULL, '2016-08-03 11:47:23.221', '2016-08-03 11:47:23.221', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (7, 1, 'EXECUTION', 156, 'server', 'server', NULL, '2016-08-03 11:47:23.224', '2016-08-03 11:47:23.224', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (2, 1, 'EXECUTION', 156, 'server', 'server', NULL, '2016-08-03 11:47:23.228', '2016-08-03 11:47:23.228', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (3, 1, 'EXECUTION', 156, 'server', 'server', NULL, '2016-08-03 11:47:23.232', '2016-08-03 11:47:23.232', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (10, 1, 'EXECUTION', 156, 'server', 'server', NULL, '2016-08-03 11:47:23.234', '2016-08-03 11:47:23.234', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (4, 1, 'EXECUTION', 156, 'server', 'server', NULL, '2016-08-03 11:47:23.236', '2016-08-03 11:47:23.236', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (5, 1, 'CREATION', 157, 'server', 'server', NULL, '2016-08-03 11:47:23.241', '2016-08-03 11:47:23.241', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (8, 1, 'CREATION', 157, 'server', 'server', NULL, '2016-08-03 11:47:23.242', '2016-08-03 11:47:23.242', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (9, 1, 'CREATION', 157, 'server', 'server', NULL, '2016-08-03 11:47:23.244', '2016-08-03 11:47:23.244', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (1, 1, 'CREATION', 157, 'server', 'server', NULL, '2016-08-03 11:47:23.246', '2016-08-03 11:47:23.246', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (6, 1, 'CREATION', 157, 'server', 'server', NULL, '2016-08-03 11:47:23.248', '2016-08-03 11:47:23.248', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (7, 1, 'CREATION', 157, 'server', 'server', NULL, '2016-08-03 11:47:23.25', '2016-08-03 11:47:23.25', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (2, 1, 'CREATION', 157, 'server', 'server', NULL, '2016-08-03 11:47:23.251', '2016-08-03 11:47:23.251', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (3, 1, 'CREATION', 157, 'server', 'server', NULL, '2016-08-03 11:47:23.253', '2016-08-03 11:47:23.253', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (10, 1, 'CREATION', 157, 'server', 'server', NULL, '2016-08-03 11:47:23.255', '2016-08-03 11:47:23.255', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_func_role VALUES (4, 1, 'CREATION', 157, 'server', 'server', NULL, '2016-08-03 11:47:23.257', '2016-08-03 11:47:23.257', NULL, '5.2.0', '5.2.0', NULL, NULL, 'SPAGOBI');


--
-- Data for Name: sbi_functions; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO sbi_functions VALUES (1, 'LOW_FUNCT', NULL, 'Functionalities', 'Functionalities', '/Functionalities', 'Functionalities', 1, 38, 'server', NULL, NULL, '2016-10-19 13:51:13.003', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');


--
-- Data for Name: sbi_geo_features; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_geo_layers; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_geo_map_features; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_geo_maps; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_goal; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_goal_hierarchy; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_goal_kpi; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_i18n_messages; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_kpi; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_kpi_comments; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_kpi_documents; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_kpi_error; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_kpi_inst_period; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_kpi_instance; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_kpi_instance_history; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_kpi_model; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_kpi_model_inst; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_kpi_model_resources; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_kpi_periodicity; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO sbi_kpi_periodicity VALUES (1, 'month', 1, 0, 0, 0, NULL, NULL, 'server', NULL, NULL, '2016-10-19 13:51:12.478', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_kpi_periodicity VALUES (2, 'day', 0, 1, 0, 0, NULL, NULL, 'server', NULL, NULL, '2016-10-19 13:51:12.48', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_kpi_periodicity VALUES (3, 'week', 0, 7, 0, 0, NULL, NULL, 'server', NULL, NULL, '2016-10-19 13:51:12.481', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_kpi_periodicity VALUES (4, 'hour', 0, 0, 1, 0, NULL, NULL, 'server', NULL, NULL, '2016-10-19 13:51:12.482', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_kpi_periodicity VALUES (5, '1minute', 0, 0, 0, 1, NULL, NULL, 'server', NULL, NULL, '2016-10-19 13:51:12.483', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_kpi_periodicity VALUES (6, '5minutes', 0, 0, 0, 5, NULL, NULL, 'server', NULL, NULL, '2016-10-19 13:51:12.484', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_kpi_periodicity VALUES (7, '10minutes', 0, 0, 0, 10, NULL, NULL, 'server', NULL, NULL, '2016-10-19 13:51:12.486', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_kpi_periodicity VALUES (8, '15minutes', 0, 0, 0, 15, NULL, NULL, 'server', NULL, NULL, '2016-10-19 13:51:12.487', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');


--
-- Data for Name: sbi_kpi_rel; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_kpi_role; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_kpi_value; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_lov; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_measure_unit; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_menu; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_menu_role; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_meta_models; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_meta_models_versions; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_obj_func; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_obj_metacontents; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_obj_metadata; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_obj_par; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_obj_paruse; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_obj_parview; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_obj_state; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_object_notes; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_object_templates; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_objects; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_objects_rating; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_org_unit; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_org_unit_grant; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_org_unit_grant_nodes; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_org_unit_hierarchies; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_org_unit_nodes; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_organization_datasource; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_organization_engine; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO sbi_organization_engine VALUES (1, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.563', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (2, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.581', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (3, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.602', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (4, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.621', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (5, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.637', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (6, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.648', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (7, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.66', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (8, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.672', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (9, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.686', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (10, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.702', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (11, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.719', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (12, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.733', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (13, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.747', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (14, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.761', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (15, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.778', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (16, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.793', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (17, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.805', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (18, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.817', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (19, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.827', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (20, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.843', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (21, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.856', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (22, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.867', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (23, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.879', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (24, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.893', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (25, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.904', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_organization_engine VALUES (26, 1, '2016-10-19 13:51:09.695651', NULL, 'server', NULL, NULL, '2016-10-19 13:51:10.918', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);


--
-- Data for Name: sbi_organizations; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO sbi_organizations VALUES (1, 'SPAGOBI', NULL);


--
-- Data for Name: sbi_parameters; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_paruse; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_paruse_ck; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_paruse_det; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_progress_thread; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_remember_me; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_resources; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_role_type_user_func; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO sbi_role_type_user_func VALUES (33, 1);
INSERT INTO sbi_role_type_user_func VALUES (33, 2);
INSERT INTO sbi_role_type_user_func VALUES (33, 3);
INSERT INTO sbi_role_type_user_func VALUES (33, 4);
INSERT INTO sbi_role_type_user_func VALUES (36, 4);
INSERT INTO sbi_role_type_user_func VALUES (33, 5);
INSERT INTO sbi_role_type_user_func VALUES (36, 5);
INSERT INTO sbi_role_type_user_func VALUES (33, 6);
INSERT INTO sbi_role_type_user_func VALUES (36, 6);
INSERT INTO sbi_role_type_user_func VALUES (33, 7);
INSERT INTO sbi_role_type_user_func VALUES (33, 8);
INSERT INTO sbi_role_type_user_func VALUES (34, 8);
INSERT INTO sbi_role_type_user_func VALUES (33, 9);
INSERT INTO sbi_role_type_user_func VALUES (35, 9);
INSERT INTO sbi_role_type_user_func VALUES (33, 10);
INSERT INTO sbi_role_type_user_func VALUES (33, 11);
INSERT INTO sbi_role_type_user_func VALUES (33, 12);
INSERT INTO sbi_role_type_user_func VALUES (33, 13);
INSERT INTO sbi_role_type_user_func VALUES (32, 13);
INSERT INTO sbi_role_type_user_func VALUES (34, 13);
INSERT INTO sbi_role_type_user_func VALUES (35, 13);
INSERT INTO sbi_role_type_user_func VALUES (33, 14);
INSERT INTO sbi_role_type_user_func VALUES (34, 14);
INSERT INTO sbi_role_type_user_func VALUES (33, 15);
INSERT INTO sbi_role_type_user_func VALUES (32, 15);
INSERT INTO sbi_role_type_user_func VALUES (34, 15);
INSERT INTO sbi_role_type_user_func VALUES (35, 15);
INSERT INTO sbi_role_type_user_func VALUES (33, 16);
INSERT INTO sbi_role_type_user_func VALUES (34, 16);
INSERT INTO sbi_role_type_user_func VALUES (33, 17);
INSERT INTO sbi_role_type_user_func VALUES (34, 17);
INSERT INTO sbi_role_type_user_func VALUES (33, 18);
INSERT INTO sbi_role_type_user_func VALUES (34, 18);
INSERT INTO sbi_role_type_user_func VALUES (33, 19);
INSERT INTO sbi_role_type_user_func VALUES (33, 20);
INSERT INTO sbi_role_type_user_func VALUES (34, 20);
INSERT INTO sbi_role_type_user_func VALUES (33, 21);
INSERT INTO sbi_role_type_user_func VALUES (33, 22);
INSERT INTO sbi_role_type_user_func VALUES (32, 22);
INSERT INTO sbi_role_type_user_func VALUES (34, 22);
INSERT INTO sbi_role_type_user_func VALUES (35, 22);
INSERT INTO sbi_role_type_user_func VALUES (33, 23);
INSERT INTO sbi_role_type_user_func VALUES (34, 23);
INSERT INTO sbi_role_type_user_func VALUES (33, 24);
INSERT INTO sbi_role_type_user_func VALUES (33, 25);
INSERT INTO sbi_role_type_user_func VALUES (34, 25);
INSERT INTO sbi_role_type_user_func VALUES (33, 26);
INSERT INTO sbi_role_type_user_func VALUES (33, 27);
INSERT INTO sbi_role_type_user_func VALUES (32, 27);
INSERT INTO sbi_role_type_user_func VALUES (34, 27);
INSERT INTO sbi_role_type_user_func VALUES (35, 27);
INSERT INTO sbi_role_type_user_func VALUES (33, 28);
INSERT INTO sbi_role_type_user_func VALUES (34, 28);
INSERT INTO sbi_role_type_user_func VALUES (33, 29);
INSERT INTO sbi_role_type_user_func VALUES (32, 29);
INSERT INTO sbi_role_type_user_func VALUES (34, 29);
INSERT INTO sbi_role_type_user_func VALUES (35, 29);
INSERT INTO sbi_role_type_user_func VALUES (33, 30);
INSERT INTO sbi_role_type_user_func VALUES (34, 30);
INSERT INTO sbi_role_type_user_func VALUES (36, 30);
INSERT INTO sbi_role_type_user_func VALUES (33, 31);
INSERT INTO sbi_role_type_user_func VALUES (34, 31);
INSERT INTO sbi_role_type_user_func VALUES (36, 31);
INSERT INTO sbi_role_type_user_func VALUES (33, 32);
INSERT INTO sbi_role_type_user_func VALUES (34, 32);
INSERT INTO sbi_role_type_user_func VALUES (36, 32);
INSERT INTO sbi_role_type_user_func VALUES (33, 33);
INSERT INTO sbi_role_type_user_func VALUES (34, 33);
INSERT INTO sbi_role_type_user_func VALUES (33, 34);
INSERT INTO sbi_role_type_user_func VALUES (35, 34);
INSERT INTO sbi_role_type_user_func VALUES (33, 35);
INSERT INTO sbi_role_type_user_func VALUES (34, 35);
INSERT INTO sbi_role_type_user_func VALUES (35, 35);
INSERT INTO sbi_role_type_user_func VALUES (33, 36);
INSERT INTO sbi_role_type_user_func VALUES (33, 37);
INSERT INTO sbi_role_type_user_func VALUES (33, 38);
INSERT INTO sbi_role_type_user_func VALUES (32, 38);
INSERT INTO sbi_role_type_user_func VALUES (34, 38);
INSERT INTO sbi_role_type_user_func VALUES (35, 38);
INSERT INTO sbi_role_type_user_func VALUES (36, 38);
INSERT INTO sbi_role_type_user_func VALUES (33, 39);
INSERT INTO sbi_role_type_user_func VALUES (36, 39);
INSERT INTO sbi_role_type_user_func VALUES (33, 40);
INSERT INTO sbi_role_type_user_func VALUES (33, 41);
INSERT INTO sbi_role_type_user_func VALUES (33, 42);
INSERT INTO sbi_role_type_user_func VALUES (33, 43);
INSERT INTO sbi_role_type_user_func VALUES (33, 44);
INSERT INTO sbi_role_type_user_func VALUES (33, 45);
INSERT INTO sbi_role_type_user_func VALUES (32, 45);
INSERT INTO sbi_role_type_user_func VALUES (34, 45);
INSERT INTO sbi_role_type_user_func VALUES (35, 45);
INSERT INTO sbi_role_type_user_func VALUES (33, 46);
INSERT INTO sbi_role_type_user_func VALUES (33, 47);
INSERT INTO sbi_role_type_user_func VALUES (33, 48);
INSERT INTO sbi_role_type_user_func VALUES (32, 48);
INSERT INTO sbi_role_type_user_func VALUES (34, 48);
INSERT INTO sbi_role_type_user_func VALUES (35, 48);
INSERT INTO sbi_role_type_user_func VALUES (36, 48);
INSERT INTO sbi_role_type_user_func VALUES (33, 49);
INSERT INTO sbi_role_type_user_func VALUES (32, 49);
INSERT INTO sbi_role_type_user_func VALUES (34, 49);
INSERT INTO sbi_role_type_user_func VALUES (35, 49);
INSERT INTO sbi_role_type_user_func VALUES (36, 49);
INSERT INTO sbi_role_type_user_func VALUES (33, 50);
INSERT INTO sbi_role_type_user_func VALUES (32, 50);
INSERT INTO sbi_role_type_user_func VALUES (34, 50);
INSERT INTO sbi_role_type_user_func VALUES (35, 50);
INSERT INTO sbi_role_type_user_func VALUES (36, 50);
INSERT INTO sbi_role_type_user_func VALUES (33, 51);
INSERT INTO sbi_role_type_user_func VALUES (32, 51);
INSERT INTO sbi_role_type_user_func VALUES (34, 51);
INSERT INTO sbi_role_type_user_func VALUES (35, 51);
INSERT INTO sbi_role_type_user_func VALUES (36, 51);
INSERT INTO sbi_role_type_user_func VALUES (33, 52);
INSERT INTO sbi_role_type_user_func VALUES (33, 53);
INSERT INTO sbi_role_type_user_func VALUES (32, 53);
INSERT INTO sbi_role_type_user_func VALUES (34, 53);
INSERT INTO sbi_role_type_user_func VALUES (35, 53);
INSERT INTO sbi_role_type_user_func VALUES (36, 53);
INSERT INTO sbi_role_type_user_func VALUES (33, 54);
INSERT INTO sbi_role_type_user_func VALUES (33, 55);


--
-- Data for Name: sbi_snapshots; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_subobjects; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_subreports; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_threshold; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_threshold_value; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_trigger_paused; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_udp; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_udp_value; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Data for Name: sbi_user; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO sbi_user VALUES ('biadmin', '#SHA#nHPmUA7oguQ9LN2lkku6Q0U+0Qg=', 'SpagoBI Administrator', 1, NULL, NULL, NULL, NULL, true, 'server', NULL, NULL, '2016-10-19 13:51:13.278', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_user VALUES ('biuser', '#SHA#/rsNSUksRt1BHKBiX+weiI9zJHA=', 'SpagoBI User', 2, NULL, NULL, NULL, NULL, false, 'server', NULL, NULL, '2016-10-19 13:51:13.46', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_user VALUES ('bidemo', '#SHA#fopnXBEkTx/VJ6kWZgnFsUALE/E=', 'SpagoBI Demo User', 3, NULL, NULL, NULL, NULL, false, 'server', NULL, NULL, '2016-10-19 13:51:13.46', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_user VALUES ('bitest', '#SHA#W71FxoesBeLFG/wcKMIPGTtjmac=', 'SpagoBI Test User', 4, NULL, NULL, NULL, NULL, false, 'server', NULL, NULL, '2016-10-19 13:51:13.46', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_user VALUES ('bidev', '#SHA#SxqRhZU9B2tcldDajuQhgdyohHM=', 'SpagoBI Developer', 5, NULL, NULL, NULL, NULL, false, 'server', NULL, NULL, '2016-10-19 13:51:13.461', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');
INSERT INTO sbi_user VALUES ('bam', '#SHA#Q95YLu19fRaqMNQgwVizRTDfXzM=', 'Bam User', 6, NULL, NULL, NULL, NULL, false, 'server', NULL, NULL, '2016-10-19 13:51:13.461', NULL, NULL, '5.2.0', NULL, NULL, NULL, 'SPAGOBI');


--
-- Data for Name: sbi_user_attributes; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO sbi_user_attributes VALUES (1, 5, 'admin@eng.it', 'server', NULL, NULL, '2016-10-19 13:51:13.651', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_attributes VALUES (1, 1, 'SpagoBI Administrator', 'server', NULL, NULL, '2016-10-19 13:51:13.666', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_attributes VALUES (2, 1, 'SpagoBI User', 'server', NULL, NULL, '2016-10-19 13:51:13.683', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_attributes VALUES (3, 1, 'SpagoBI Demo User', 'server', NULL, NULL, '2016-10-19 13:51:13.691', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_attributes VALUES (4, 1, 'SpagoBI TestUser', 'server', NULL, NULL, '2016-10-19 13:51:13.701', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_attributes VALUES (5, 1, 'SpagoBI Developer', 'server', NULL, NULL, '2016-10-19 13:51:13.709', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_attributes VALUES (6, 1, 'Bam User', 'server', NULL, NULL, '2016-10-19 13:51:13.716', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);


--
-- Data for Name: sbi_user_func; Type: TABLE DATA; Schema: public; Owner: spagobi
--

INSERT INTO sbi_user_func VALUES (1, 'EnginesManagement', 'EnginesManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.075', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (2, 'ReadEnginesManagement', 'ReadEnginesManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.188', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (3, 'FunctionalitiesManagement', 'FunctionalitiesManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.198', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (4, 'LovsManagement', 'LovsManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.208', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (5, 'ConstraintManagement', 'ConstraintManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.222', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (6, 'ParameterManagement', 'ParameterManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.237', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (7, 'DocumentAdministration', 'DocumentAdministration', 'server', NULL, NULL, '2016-10-19 13:51:11.25', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (8, 'DocumentDevManagement', 'DocumentDevManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.259', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (9, 'DocumentTestManagement', 'DocumentTestManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.271', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (10, 'DocumentAdminManagement', 'DocumentAdminManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.284', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (11, 'ImportExportManagement', 'ImportExportManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.294', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (12, 'SchedulerManagement', 'SchedulerManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.301', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (13, 'EventsManagement', 'EventsManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.309', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (14, 'WorkspaceManagement', 'WorkspaceManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.326', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (15, 'WorklistManagement', 'WorklistManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.34', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (16, 'MapCatalogueManagement', 'MapCatalogueManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.36', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (17, 'MapFeaturesManagement', 'MapFeaturesManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.372', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (18, 'DocumentManagement', 'DocumentManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.385', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (19, 'SyncronizeRolesManagement', 'SyncronizeRolesManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.396', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (20, 'ProfileAttributeManagement', 'ProfileAttributeManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.41', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (21, 'DataSourceManagement', 'DataSourceManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.454', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (22, 'DocumentUserManagement', 'DocumentUserManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.463', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (23, 'DocumentDeleteManagement', 'DocumentDeleteManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.481', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (24, 'DocumentStateManagement', 'DocumentStateManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.496', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (25, 'DocumentDetailManagement', 'DocumentDetailManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.515', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (26, 'ViewMyFolderAdmin', 'ViewMyFolderAdmin', 'server', NULL, NULL, '2016-10-19 13:51:11.531', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (27, 'DistributionListUser', 'DistributionListUser', 'server', NULL, NULL, '2016-10-19 13:51:11.544', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (28, 'DistributionListManagement', 'DistributionListManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.56', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (29, 'DocumentMetadataManagement', 'DocumentMetadataManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.569', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (30, 'LovsView', 'LovsView', 'server', NULL, NULL, '2016-10-19 13:51:11.584', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (31, 'ConstraintView', 'ConstraintView', 'server', NULL, NULL, '2016-10-19 13:51:11.596', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (32, 'ParameterView', 'ParameterView', 'server', NULL, NULL, '2016-10-19 13:51:11.611', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (33, 'DatasetManagement', 'DatasetManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.622', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (34, 'DocumentMoveDownState', 'DocumentMoveDownState', 'server', NULL, NULL, '2016-10-19 13:51:11.636', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (35, 'DocumentMoveUpState', 'DocumentMoveUpState', 'server', NULL, NULL, '2016-10-19 13:51:11.643', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (36, 'ModifyRefresh', 'ModifyRefresh', 'server', NULL, NULL, '2016-10-19 13:51:11.652', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (37, 'MenuManagement', 'MenuManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.661', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (38, 'HotLinkManagement', 'HotLinkManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.669', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (39, 'KpiManagement', 'KpiManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.686', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (40, 'ObjMetadataManagement', 'ObjMetadataManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.693', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (41, 'ProfileManagement', 'ProfileManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.701', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (42, 'UserDefinedPropertyManagement', 'UserDefinedPropertyManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.708', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (43, 'DomainManagement', 'DomainManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.714', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (44, 'ConfigManagement', 'ConfigManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.72', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (45, 'UserSaveDocumentFunctionality', 'UserSaveDocumentFunctionality', 'server', NULL, NULL, '2016-10-19 13:51:11.724', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (46, 'MetaModelsCatalogueManagement', 'MetaModelsCatalogueManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.735', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (47, 'ArtifactCatalogueManagement', 'ArtifactCatalogueManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.744', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (48, 'CreateWorksheetFromDatasetUserFunctionality', 'CreateWorksheetFromDatasetUserFunctionality', 'server', NULL, NULL, '2016-10-19 13:51:11.752', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (49, 'SelfServiceDatasetManagement', 'SelfServiceDatasetManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.766', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (50, 'SelfServiceMetaModelManagement', 'SelfServiceMetaModelManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.779', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (51, 'MeasuresCatalogueManagement', 'MeasuresCatalogueManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.795', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (52, 'GeoLayersManagement', 'GeoLayersManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.812', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (53, 'CreateCockpitFunctionality', 'CreateCockpitFunctionality', 'server', NULL, NULL, '2016-10-19 13:51:11.819', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (54, 'HierarchiesManagement', 'HierarchiesManagement', 'server', NULL, NULL, '2016-10-19 13:51:11.829', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);
INSERT INTO sbi_user_func VALUES (55, 'CreateSocialAnalysis', 'CreateSocialAnalysis', 'server', NULL, NULL, '2016-10-19 13:51:11.835', NULL, NULL, '5.2.0', NULL, NULL, NULL, NULL);


--
-- Data for Name: sbi_viewpoints; Type: TABLE DATA; Schema: public; Owner: spagobi
--



--
-- Name: hibernate_sequences_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY hibernate_sequences
    ADD CONSTRAINT hibernate_sequences_pkey PRIMARY KEY (sequence_name);


--
-- Name: qrtz_blob_triggers_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY qrtz_blob_triggers
    ADD CONSTRAINT qrtz_blob_triggers_pkey PRIMARY KEY (trigger_name, trigger_group);


--
-- Name: qrtz_calendars_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY qrtz_calendars
    ADD CONSTRAINT qrtz_calendars_pkey PRIMARY KEY (calendar_name);


--
-- Name: qrtz_cron_triggers_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY qrtz_cron_triggers
    ADD CONSTRAINT qrtz_cron_triggers_pkey PRIMARY KEY (trigger_name, trigger_group);


--
-- Name: qrtz_fired_triggers_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY qrtz_fired_triggers
    ADD CONSTRAINT qrtz_fired_triggers_pkey PRIMARY KEY (entry_id);


--
-- Name: qrtz_job_details_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY qrtz_job_details
    ADD CONSTRAINT qrtz_job_details_pkey PRIMARY KEY (job_name, job_group);


--
-- Name: qrtz_job_listeners_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY qrtz_job_listeners
    ADD CONSTRAINT qrtz_job_listeners_pkey PRIMARY KEY (job_name, job_group, job_listener);


--
-- Name: qrtz_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY qrtz_locks
    ADD CONSTRAINT qrtz_locks_pkey PRIMARY KEY (lock_name);


--
-- Name: qrtz_paused_trigger_grps_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY qrtz_paused_trigger_grps
    ADD CONSTRAINT qrtz_paused_trigger_grps_pkey PRIMARY KEY (trigger_group);


--
-- Name: qrtz_scheduler_state_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY qrtz_scheduler_state
    ADD CONSTRAINT qrtz_scheduler_state_pkey PRIMARY KEY (instance_name);


--
-- Name: qrtz_simple_triggers_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY qrtz_simple_triggers
    ADD CONSTRAINT qrtz_simple_triggers_pkey PRIMARY KEY (trigger_name, trigger_group);


--
-- Name: qrtz_trigger_listeners_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY qrtz_trigger_listeners
    ADD CONSTRAINT qrtz_trigger_listeners_pkey PRIMARY KEY (trigger_name, trigger_group, trigger_listener);


--
-- Name: qrtz_triggers_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY qrtz_triggers
    ADD CONSTRAINT qrtz_triggers_pkey PRIMARY KEY (trigger_name, trigger_group);


--
-- Name: sbi_activity_monitoring_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_activity_monitoring
    ADD CONSTRAINT sbi_activity_monitoring_pkey PRIMARY KEY (id);


--
-- Name: sbi_alarm_contact_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_alarm_contact
    ADD CONSTRAINT sbi_alarm_contact_pkey PRIMARY KEY (alarm_contact_id);


--
-- Name: sbi_alarm_distribution_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_alarm_distribution
    ADD CONSTRAINT sbi_alarm_distribution_pkey PRIMARY KEY (alarm_contact_id, alarm_id);


--
-- Name: sbi_alarm_event_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_alarm_event
    ADD CONSTRAINT sbi_alarm_event_pkey PRIMARY KEY (alarm_event_id);


--
-- Name: sbi_alarm_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_alarm
    ADD CONSTRAINT sbi_alarm_pkey PRIMARY KEY (alarm_id);


--
-- Name: sbi_artifacts_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_artifacts
    ADD CONSTRAINT sbi_artifacts_pkey PRIMARY KEY (id);


--
-- Name: sbi_artifacts_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_artifacts_versions
    ADD CONSTRAINT sbi_artifacts_versions_pkey PRIMARY KEY (id);


--
-- Name: sbi_attribute_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_attribute
    ADD CONSTRAINT sbi_attribute_pkey PRIMARY KEY (attribute_id);


--
-- Name: sbi_audit_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_audit
    ADD CONSTRAINT sbi_audit_pkey PRIMARY KEY (id);


--
-- Name: sbi_authorizations_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_authorizations
    ADD CONSTRAINT sbi_authorizations_pkey PRIMARY KEY (id);


--
-- Name: sbi_authorizations_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_authorizations_roles
    ADD CONSTRAINT sbi_authorizations_roles_pkey PRIMARY KEY (authorization_id, role_id);


--
-- Name: sbi_binary_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_binary_contents
    ADD CONSTRAINT sbi_binary_contents_pkey PRIMARY KEY (bin_id);


--
-- Name: sbi_cache_item_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_cache_item
    ADD CONSTRAINT sbi_cache_item_pkey PRIMARY KEY (signature);


--
-- Name: sbi_cache_joined_item_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_cache_joined_item
    ADD CONSTRAINT sbi_cache_joined_item_pkey PRIMARY KEY (id);


--
-- Name: sbi_checks_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_checks
    ADD CONSTRAINT sbi_checks_pkey PRIMARY KEY (check_id);


--
-- Name: sbi_community_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_community
    ADD CONSTRAINT sbi_community_pkey PRIMARY KEY (community_id);


--
-- Name: sbi_community_users_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_community_users
    ADD CONSTRAINT sbi_community_users_pkey PRIMARY KEY (community_id, user_id);


--
-- Name: sbi_config_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_config
    ADD CONSTRAINT sbi_config_pkey PRIMARY KEY (id);


--
-- Name: sbi_data_set_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_data_set
    ADD CONSTRAINT sbi_data_set_pkey PRIMARY KEY (ds_id, version_num, organization);


--
-- Name: sbi_data_source_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_data_source
    ADD CONSTRAINT sbi_data_source_pkey PRIMARY KEY (ds_id);


--
-- Name: sbi_dist_list_objects_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_dist_list_objects
    ADD CONSTRAINT sbi_dist_list_objects_pkey PRIMARY KEY (rel_id);


--
-- Name: sbi_dist_list_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_dist_list
    ADD CONSTRAINT sbi_dist_list_pkey PRIMARY KEY (dl_id);


--
-- Name: sbi_dist_list_user_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_dist_list_user
    ADD CONSTRAINT sbi_dist_list_user_pkey PRIMARY KEY (dlu_id);


--
-- Name: sbi_domains_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_domains
    ADD CONSTRAINT sbi_domains_pkey PRIMARY KEY (value_id);


--
-- Name: sbi_dossier_bin_temp_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_dossier_bin_temp
    ADD CONSTRAINT sbi_dossier_bin_temp_pkey PRIMARY KEY (bin_id);


--
-- Name: sbi_dossier_pres_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_dossier_pres
    ADD CONSTRAINT sbi_dossier_pres_pkey PRIMARY KEY (presentation_id);


--
-- Name: sbi_dossier_temp_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_dossier_temp
    ADD CONSTRAINT sbi_dossier_temp_pkey PRIMARY KEY (part_id);


--
-- Name: sbi_engines_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_engines
    ADD CONSTRAINT sbi_engines_pkey PRIMARY KEY (engine_id);


--
-- Name: sbi_events_log_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_events_log
    ADD CONSTRAINT sbi_events_log_pkey PRIMARY KEY (id);


--
-- Name: sbi_events_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_events
    ADD CONSTRAINT sbi_events_pkey PRIMARY KEY (id);


--
-- Name: sbi_events_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_events_roles
    ADD CONSTRAINT sbi_events_roles_pkey PRIMARY KEY (event_id, role_id);


--
-- Name: sbi_ext_roles_category_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_ext_roles_category
    ADD CONSTRAINT sbi_ext_roles_category_pkey PRIMARY KEY (ext_role_id, category_id);


--
-- Name: sbi_ext_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_ext_roles
    ADD CONSTRAINT sbi_ext_roles_pkey PRIMARY KEY (ext_role_id);


--
-- Name: sbi_ext_user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_ext_user_roles
    ADD CONSTRAINT sbi_ext_user_roles_pkey PRIMARY KEY (id, ext_role_id);


--
-- Name: sbi_func_role_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_func_role
    ADD CONSTRAINT sbi_func_role_pkey PRIMARY KEY (funct_id, state_id, role_id);


--
-- Name: sbi_functions_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_functions
    ADD CONSTRAINT sbi_functions_pkey PRIMARY KEY (funct_id);


--
-- Name: sbi_geo_features_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_geo_features
    ADD CONSTRAINT sbi_geo_features_pkey PRIMARY KEY (feature_id);


--
-- Name: sbi_geo_layers_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_geo_layers
    ADD CONSTRAINT sbi_geo_layers_pkey PRIMARY KEY (layer_id);


--
-- Name: sbi_geo_map_features_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_geo_map_features
    ADD CONSTRAINT sbi_geo_map_features_pkey PRIMARY KEY (map_id, feature_id);


--
-- Name: sbi_geo_maps_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_geo_maps
    ADD CONSTRAINT sbi_geo_maps_pkey PRIMARY KEY (map_id);


--
-- Name: sbi_goal_hierarchy_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_goal_hierarchy
    ADD CONSTRAINT sbi_goal_hierarchy_pkey PRIMARY KEY (goal_hierarchy_id);


--
-- Name: sbi_goal_kpi_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_goal_kpi
    ADD CONSTRAINT sbi_goal_kpi_pkey PRIMARY KEY (goal_kpi_id);


--
-- Name: sbi_goal_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_goal
    ADD CONSTRAINT sbi_goal_pkey PRIMARY KEY (goal_id);


--
-- Name: sbi_i18n_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_i18n_messages
    ADD CONSTRAINT sbi_i18n_messages_pkey PRIMARY KEY (language_cd, label, organization);


--
-- Name: sbi_kpi_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_documents
    ADD CONSTRAINT sbi_kpi_documents_pkey PRIMARY KEY (id_kpi_doc);


--
-- Name: sbi_kpi_error_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_error
    ADD CONSTRAINT sbi_kpi_error_pkey PRIMARY KEY (kpi_error_id);


--
-- Name: sbi_kpi_inst_period_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_inst_period
    ADD CONSTRAINT sbi_kpi_inst_period_pkey PRIMARY KEY (kpi_inst_period_id);


--
-- Name: sbi_kpi_instance_history_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_instance_history
    ADD CONSTRAINT sbi_kpi_instance_history_pkey PRIMARY KEY (id_kpi_instance_history);


--
-- Name: sbi_kpi_instance_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_instance
    ADD CONSTRAINT sbi_kpi_instance_pkey PRIMARY KEY (id_kpi_instance);


--
-- Name: sbi_kpi_model_inst_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_model_inst
    ADD CONSTRAINT sbi_kpi_model_inst_pkey PRIMARY KEY (kpi_model_inst);


--
-- Name: sbi_kpi_model_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_model
    ADD CONSTRAINT sbi_kpi_model_pkey PRIMARY KEY (kpi_model_id);


--
-- Name: sbi_kpi_model_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_model_resources
    ADD CONSTRAINT sbi_kpi_model_resources_pkey PRIMARY KEY (kpi_model_resources_id);


--
-- Name: sbi_kpi_periodicity_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_periodicity
    ADD CONSTRAINT sbi_kpi_periodicity_pkey PRIMARY KEY (id_kpi_periodicity);


--
-- Name: sbi_kpi_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi
    ADD CONSTRAINT sbi_kpi_pkey PRIMARY KEY (kpi_id);


--
-- Name: sbi_kpi_rel_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_rel
    ADD CONSTRAINT sbi_kpi_rel_pkey PRIMARY KEY (kpi_rel_id);


--
-- Name: sbi_kpi_role_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_role
    ADD CONSTRAINT sbi_kpi_role_pkey PRIMARY KEY (id_kpi_role);


--
-- Name: sbi_kpi_value_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_value
    ADD CONSTRAINT sbi_kpi_value_pkey PRIMARY KEY (id_kpi_instance_value);


--
-- Name: sbi_lov_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_lov
    ADD CONSTRAINT sbi_lov_pkey PRIMARY KEY (lov_id);


--
-- Name: sbi_measure_unit_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_measure_unit
    ADD CONSTRAINT sbi_measure_unit_pkey PRIMARY KEY (id_measure_unit);


--
-- Name: sbi_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_menu
    ADD CONSTRAINT sbi_menu_pkey PRIMARY KEY (menu_id);


--
-- Name: sbi_menu_role_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_menu_role
    ADD CONSTRAINT sbi_menu_role_pkey PRIMARY KEY (menu_id, ext_role_id);


--
-- Name: sbi_meta_models_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_meta_models
    ADD CONSTRAINT sbi_meta_models_pkey PRIMARY KEY (id);


--
-- Name: sbi_meta_models_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_meta_models_versions
    ADD CONSTRAINT sbi_meta_models_versions_pkey PRIMARY KEY (id);


--
-- Name: sbi_obj_func_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_func
    ADD CONSTRAINT sbi_obj_func_pkey PRIMARY KEY (biobj_id, funct_id);


--
-- Name: sbi_obj_metacontents_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_metacontents
    ADD CONSTRAINT sbi_obj_metacontents_pkey PRIMARY KEY (obj_metacontent_id);


--
-- Name: sbi_obj_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_metadata
    ADD CONSTRAINT sbi_obj_metadata_pkey PRIMARY KEY (obj_meta_id);


--
-- Name: sbi_obj_par_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_par
    ADD CONSTRAINT sbi_obj_par_pkey PRIMARY KEY (obj_par_id);


--
-- Name: sbi_obj_paruse_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_paruse
    ADD CONSTRAINT sbi_obj_paruse_pkey PRIMARY KEY (obj_par_id, use_id, obj_par_father_id, filter_operation);


--
-- Name: sbi_obj_parview_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_parview
    ADD CONSTRAINT sbi_obj_parview_pkey PRIMARY KEY (obj_par_id, obj_par_father_id, operation, compare_value);


--
-- Name: sbi_obj_state_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_state
    ADD CONSTRAINT sbi_obj_state_pkey PRIMARY KEY (biobj_id, state_id, start_dt);


--
-- Name: sbi_object_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_object_notes
    ADD CONSTRAINT sbi_object_notes_pkey PRIMARY KEY (obj_note_id);


--
-- Name: sbi_object_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_object_templates
    ADD CONSTRAINT sbi_object_templates_pkey PRIMARY KEY (obj_temp_id);


--
-- Name: sbi_objects_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_objects
    ADD CONSTRAINT sbi_objects_pkey PRIMARY KEY (biobj_id);


--
-- Name: sbi_objects_rating_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_objects_rating
    ADD CONSTRAINT sbi_objects_rating_pkey PRIMARY KEY (user_id, obj_id);


--
-- Name: sbi_org_unit_grant_nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_org_unit_grant_nodes
    ADD CONSTRAINT sbi_org_unit_grant_nodes_pkey PRIMARY KEY (node_id, kpi_model_inst_node_id, grant_id);


--
-- Name: sbi_org_unit_grant_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_org_unit_grant
    ADD CONSTRAINT sbi_org_unit_grant_pkey PRIMARY KEY (id);


--
-- Name: sbi_org_unit_hierarchies_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_org_unit_hierarchies
    ADD CONSTRAINT sbi_org_unit_hierarchies_pkey PRIMARY KEY (id);


--
-- Name: sbi_org_unit_nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_org_unit_nodes
    ADD CONSTRAINT sbi_org_unit_nodes_pkey PRIMARY KEY (node_id);


--
-- Name: sbi_org_unit_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_org_unit
    ADD CONSTRAINT sbi_org_unit_pkey PRIMARY KEY (id);


--
-- Name: sbi_organization_datasource_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_organization_datasource
    ADD CONSTRAINT sbi_organization_datasource_pkey PRIMARY KEY (datasource_id, organization_id);


--
-- Name: sbi_organization_engine_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_organization_engine
    ADD CONSTRAINT sbi_organization_engine_pkey PRIMARY KEY (engine_id, organization_id);


--
-- Name: sbi_organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_organizations
    ADD CONSTRAINT sbi_organizations_pkey PRIMARY KEY (id);


--
-- Name: sbi_parameters_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_parameters
    ADD CONSTRAINT sbi_parameters_pkey PRIMARY KEY (par_id);


--
-- Name: sbi_paruse_ck_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_paruse_ck
    ADD CONSTRAINT sbi_paruse_ck_pkey PRIMARY KEY (use_id, check_id);


--
-- Name: sbi_paruse_det_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_paruse_det
    ADD CONSTRAINT sbi_paruse_det_pkey PRIMARY KEY (use_id, ext_role_id);


--
-- Name: sbi_paruse_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_paruse
    ADD CONSTRAINT sbi_paruse_pkey PRIMARY KEY (use_id);


--
-- Name: sbi_progress_thread_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_progress_thread
    ADD CONSTRAINT sbi_progress_thread_pkey PRIMARY KEY (progress_thread_id);


--
-- Name: sbi_remember_me_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_remember_me
    ADD CONSTRAINT sbi_remember_me_pkey PRIMARY KEY (id);


--
-- Name: sbi_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_resources
    ADD CONSTRAINT sbi_resources_pkey PRIMARY KEY (resource_id);


--
-- Name: sbi_role_type_user_func_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_role_type_user_func
    ADD CONSTRAINT sbi_role_type_user_func_pkey PRIMARY KEY (role_type_id, user_funct_id);


--
-- Name: sbi_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_snapshots
    ADD CONSTRAINT sbi_snapshots_pkey PRIMARY KEY (snap_id);


--
-- Name: sbi_subobjects_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_subobjects
    ADD CONSTRAINT sbi_subobjects_pkey PRIMARY KEY (subobj_id);


--
-- Name: sbi_subreports_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_subreports
    ADD CONSTRAINT sbi_subreports_pkey PRIMARY KEY (master_rpt_id, sub_rpt_id);


--
-- Name: sbi_threshold_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_threshold
    ADD CONSTRAINT sbi_threshold_pkey PRIMARY KEY (threshold_id);


--
-- Name: sbi_threshold_value_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_threshold_value
    ADD CONSTRAINT sbi_threshold_value_pkey PRIMARY KEY (id_threshold_value);


--
-- Name: sbi_trigger_paused_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_trigger_paused
    ADD CONSTRAINT sbi_trigger_paused_pkey PRIMARY KEY (id);


--
-- Name: sbi_udp_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_udp
    ADD CONSTRAINT sbi_udp_pkey PRIMARY KEY (udp_id);


--
-- Name: sbi_udp_value_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_udp_value
    ADD CONSTRAINT sbi_udp_value_pkey PRIMARY KEY (udp_value_id);


--
-- Name: sbi_user_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_user_attributes
    ADD CONSTRAINT sbi_user_attributes_pkey PRIMARY KEY (id, attribute_id);


--
-- Name: sbi_user_func_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_user_func
    ADD CONSTRAINT sbi_user_func_pkey PRIMARY KEY (user_funct_id);


--
-- Name: sbi_user_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_user
    ADD CONSTRAINT sbi_user_pkey PRIMARY KEY (id);


--
-- Name: sbi_viewpoints_pkey; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_viewpoints
    ADD CONSTRAINT sbi_viewpoints_pkey PRIMARY KEY (vp_id);


--
-- Name: unique_par_id_cd; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_model
    ADD CONSTRAINT unique_par_id_cd UNIQUE (kpi_parent_model_id, kpi_model_cd);


--
-- Name: xak1sbi_artifacts; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_artifacts
    ADD CONSTRAINT xak1sbi_artifacts UNIQUE (name, type, organization);


--
-- Name: xak1sbi_attribute; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_attribute
    ADD CONSTRAINT xak1sbi_attribute UNIQUE (attribute_name, organization);


--
-- Name: xak1sbi_cache_item; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_cache_item
    ADD CONSTRAINT xak1sbi_cache_item UNIQUE (table_name);


--
-- Name: xak1sbi_cache_joined_item; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_cache_joined_item
    ADD CONSTRAINT xak1sbi_cache_joined_item UNIQUE (signature, joined_signature);


--
-- Name: xak1sbi_checks; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_checks
    ADD CONSTRAINT xak1sbi_checks UNIQUE (label, organization);


--
-- Name: xak1sbi_config; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_config
    ADD CONSTRAINT xak1sbi_config UNIQUE (label);


--
-- Name: xak1sbi_data_source; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_data_source
    ADD CONSTRAINT xak1sbi_data_source UNIQUE (label, organization);


--
-- Name: xak1sbi_dl_user; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_dist_list_user
    ADD CONSTRAINT xak1sbi_dl_user UNIQUE (list_id, user_id);


--
-- Name: xak1sbi_domains; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_domains
    ADD CONSTRAINT xak1sbi_domains UNIQUE (value_cd, domain_cd);


--
-- Name: xak1sbi_engines; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_engines
    ADD CONSTRAINT xak1sbi_engines UNIQUE (label, organization);


--
-- Name: xak1sbi_exporters; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_exporters
    ADD CONSTRAINT xak1sbi_exporters PRIMARY KEY (engine_id, domain_id);


--
-- Name: xak1sbi_ext_roles; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_ext_roles
    ADD CONSTRAINT xak1sbi_ext_roles UNIQUE (name, organization);


--
-- Name: xak1sbi_functions; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_functions
    ADD CONSTRAINT xak1sbi_functions UNIQUE (code, organization);


--
-- Name: xak1sbi_geo_features; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_geo_features
    ADD CONSTRAINT xak1sbi_geo_features UNIQUE (name, organization);


--
-- Name: xak1sbi_geo_layers; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_geo_layers
    ADD CONSTRAINT xak1sbi_geo_layers UNIQUE (name, type, organization);


--
-- Name: xak1sbi_geo_maps; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_geo_maps
    ADD CONSTRAINT xak1sbi_geo_maps UNIQUE (name, organization);


--
-- Name: xak1sbi_kpi; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi
    ADD CONSTRAINT xak1sbi_kpi UNIQUE (code, organization);


--
-- Name: xak1sbi_kpi_comment; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_comments
    ADD CONSTRAINT xak1sbi_kpi_comment PRIMARY KEY (kpi_comment_id);


--
-- Name: xak1sbi_lov; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_lov
    ADD CONSTRAINT xak1sbi_lov UNIQUE (label, organization);


--
-- Name: xak1sbi_meta_models; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_meta_models
    ADD CONSTRAINT xak1sbi_meta_models UNIQUE (name, organization);


--
-- Name: xak1sbi_obj_metacontents; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_metacontents
    ADD CONSTRAINT xak1sbi_obj_metacontents UNIQUE (objmeta_id, biobj_id, subobj_id);


--
-- Name: xak1sbi_obj_metadata; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_metadata
    ADD CONSTRAINT xak1sbi_obj_metadata UNIQUE (label, organization);


--
-- Name: xak1sbi_objects; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_objects
    ADD CONSTRAINT xak1sbi_objects UNIQUE (label, organization);


--
-- Name: xak1sbi_organizations; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_organizations
    ADD CONSTRAINT xak1sbi_organizations UNIQUE (name);


--
-- Name: xak1sbi_parameters; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_parameters
    ADD CONSTRAINT xak1sbi_parameters UNIQUE (label, organization);


--
-- Name: xak1sbi_paruse; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_paruse
    ADD CONSTRAINT xak1sbi_paruse UNIQUE (par_id, label);


--
-- Name: xak1sbi_sbi_dist_list; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_dist_list
    ADD CONSTRAINT xak1sbi_sbi_dist_list UNIQUE (name, organization);


--
-- Name: xak1sbi_trigger_paused; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_trigger_paused
    ADD CONSTRAINT xak1sbi_trigger_paused UNIQUE (trigger_name, trigger_group, job_name, job_group);


--
-- Name: xak1sbi_udp; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_udp
    ADD CONSTRAINT xak1sbi_udp UNIQUE (label, organization);


--
-- Name: xak1sbi_user; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_user
    ADD CONSTRAINT xak1sbi_user UNIQUE (user_id);


--
-- Name: xak2sbi_data_set; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_data_set
    ADD CONSTRAINT xak2sbi_data_set UNIQUE (label, version_num, organization);


--
-- Name: xak2sbi_kpi_model_inst; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_model_inst
    ADD CONSTRAINT xak2sbi_kpi_model_inst UNIQUE (label, organization);


--
-- Name: xif1sbi_alarm; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_alarm
    ADD CONSTRAINT xif1sbi_alarm UNIQUE (label, organization);


--
-- Name: xif1sbi_alarm_contact; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_alarm_contact
    ADD CONSTRAINT xif1sbi_alarm_contact UNIQUE (name, organization);


--
-- Name: xif1sbi_kpi_model; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_model
    ADD CONSTRAINT xif1sbi_kpi_model UNIQUE (kpi_model_lbl, organization);


--
-- Name: xif1sbi_kpi_periodicity; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_periodicity
    ADD CONSTRAINT xif1sbi_kpi_periodicity UNIQUE (name, organization);


--
-- Name: xif1sbi_org_unit; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_org_unit
    ADD CONSTRAINT xif1sbi_org_unit UNIQUE (label, name, organization);


--
-- Name: xif1sbi_org_unit_grant; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_org_unit_grant
    ADD CONSTRAINT xif1sbi_org_unit_grant UNIQUE (label, organization);


--
-- Name: xif1sbi_org_unit_hierarchies; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_org_unit_hierarchies
    ADD CONSTRAINT xif1sbi_org_unit_hierarchies UNIQUE (label, company, organization);


--
-- Name: xif1sbi_resources; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_resources
    ADD CONSTRAINT xif1sbi_resources UNIQUE (resource_code, organization);


--
-- Name: xif1sbi_sbi_goal; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_goal
    ADD CONSTRAINT xif1sbi_sbi_goal UNIQUE (name, organization);


--
-- Name: xif1sbi_threshold; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_threshold
    ADD CONSTRAINT xif1sbi_threshold UNIQUE (code, organization);


--
-- Name: xif1sbi_threshold_value; Type: CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_threshold_value
    ADD CONSTRAINT xif1sbi_threshold_value UNIQUE (label, threshold_id);


--
-- Name: fk_authorization_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_authorizations_roles
    ADD CONSTRAINT fk_authorization_1 FOREIGN KEY (authorization_id) REFERENCES sbi_authorizations(id);


--
-- Name: fk_community; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_community_users
    ADD CONSTRAINT fk_community FOREIGN KEY (community_id) REFERENCES sbi_community(community_id);


--
-- Name: fk_data_set_category; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_data_set
    ADD CONSTRAINT fk_data_set_category FOREIGN KEY (category_id) REFERENCES sbi_domains(value_id);


--
-- Name: fk_datasource_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_organization_datasource
    ADD CONSTRAINT fk_datasource_2 FOREIGN KEY (datasource_id) REFERENCES sbi_data_source(ds_id) ON DELETE CASCADE;


--
-- Name: fk_engine_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_organization_engine
    ADD CONSTRAINT fk_engine_1 FOREIGN KEY (engine_id) REFERENCES sbi_engines(engine_id);


--
-- Name: fk_geo_map_features1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_geo_map_features
    ADD CONSTRAINT fk_geo_map_features1 FOREIGN KEY (map_id) REFERENCES sbi_geo_maps(map_id);


--
-- Name: fk_geo_map_features2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_geo_map_features
    ADD CONSTRAINT fk_geo_map_features2 FOREIGN KEY (feature_id) REFERENCES sbi_geo_features(feature_id);


--
-- Name: fk_grant_id_grant; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_goal
    ADD CONSTRAINT fk_grant_id_grant FOREIGN KEY (grant_id) REFERENCES sbi_org_unit_grant(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: fk_kpi_model_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_model
    ADD CONSTRAINT fk_kpi_model_2 FOREIGN KEY (kpi_model_type_id) REFERENCES sbi_domains(value_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_meta_models_category; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_meta_models
    ADD CONSTRAINT fk_meta_models_category FOREIGN KEY (category_id) REFERENCES sbi_domains(value_id);


--
-- Name: fk_organization_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_organization_engine
    ADD CONSTRAINT fk_organization_1 FOREIGN KEY (organization_id) REFERENCES sbi_organizations(id);


--
-- Name: fk_organization_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_organization_datasource
    ADD CONSTRAINT fk_organization_2 FOREIGN KEY (organization_id) REFERENCES sbi_organizations(id);


--
-- Name: fk_role1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_authorizations_roles
    ADD CONSTRAINT fk_role1 FOREIGN KEY (role_id) REFERENCES sbi_ext_roles(ext_role_id);


--
-- Name: fk_sb_ext_roles_meta_model_category_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_ext_roles_category
    ADD CONSTRAINT fk_sb_ext_roles_meta_model_category_1 FOREIGN KEY (ext_role_id) REFERENCES sbi_ext_roles(ext_role_id);


--
-- Name: fk_sb_ext_roles_meta_model_category_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_ext_roles_category
    ADD CONSTRAINT fk_sb_ext_roles_meta_model_category_2 FOREIGN KEY (category_id) REFERENCES sbi_domains(value_id);


--
-- Name: fk_sbi_alarm_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_alarm
    ADD CONSTRAINT fk_sbi_alarm_1 FOREIGN KEY (modality_id) REFERENCES sbi_domains(value_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_alarm_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_alarm
    ADD CONSTRAINT fk_sbi_alarm_2 FOREIGN KEY (document_id) REFERENCES sbi_objects(biobj_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_alarm_3; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_alarm
    ADD CONSTRAINT fk_sbi_alarm_3 FOREIGN KEY (id_kpi_instance) REFERENCES sbi_kpi_instance(id_kpi_instance) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_alarm_4; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_alarm
    ADD CONSTRAINT fk_sbi_alarm_4 FOREIGN KEY (id_threshold_value) REFERENCES sbi_threshold_value(id_threshold_value) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_alarm_distribution_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_alarm_distribution
    ADD CONSTRAINT fk_sbi_alarm_distribution_1 FOREIGN KEY (alarm_id) REFERENCES sbi_alarm(alarm_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_alarm_distribution_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_alarm_distribution
    ADD CONSTRAINT fk_sbi_alarm_distribution_2 FOREIGN KEY (alarm_contact_id) REFERENCES sbi_alarm_contact(alarm_contact_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_alarm_event_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_alarm_event
    ADD CONSTRAINT fk_sbi_alarm_event_1 FOREIGN KEY (alarm_id) REFERENCES sbi_alarm(alarm_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_sbi_artifacts_versions_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_artifacts_versions
    ADD CONSTRAINT fk_sbi_artifacts_versions_1 FOREIGN KEY (artifact_id) REFERENCES sbi_artifacts(id) ON DELETE CASCADE;


--
-- Name: fk_sbi_audit_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_audit
    ADD CONSTRAINT fk_sbi_audit_1 FOREIGN KEY (doc_ref) REFERENCES sbi_objects(biobj_id) ON DELETE SET NULL;


--
-- Name: fk_sbi_audit_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_audit
    ADD CONSTRAINT fk_sbi_audit_2 FOREIGN KEY (engine_ref) REFERENCES sbi_engines(engine_id) ON DELETE SET NULL;


--
-- Name: fk_sbi_audit_3; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_audit
    ADD CONSTRAINT fk_sbi_audit_3 FOREIGN KEY (subobj_ref) REFERENCES sbi_subobjects(subobj_id) ON DELETE SET NULL;


--
-- Name: fk_sbi_cache_joined_item_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_cache_joined_item
    ADD CONSTRAINT fk_sbi_cache_joined_item_1 FOREIGN KEY (signature) REFERENCES sbi_cache_item(signature) ON UPDATE CASCADE;


--
-- Name: fk_sbi_cache_joined_item_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_cache_joined_item
    ADD CONSTRAINT fk_sbi_cache_joined_item_2 FOREIGN KEY (joined_signature) REFERENCES sbi_cache_item(signature) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_sbi_checks_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_checks
    ADD CONSTRAINT fk_sbi_checks_1 FOREIGN KEY (value_type_id) REFERENCES sbi_domains(value_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_config_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_config
    ADD CONSTRAINT fk_sbi_config_1 FOREIGN KEY (value_type_id) REFERENCES sbi_domains(value_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_data_source_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_data_source
    ADD CONSTRAINT fk_sbi_data_source_1 FOREIGN KEY (dialect_id) REFERENCES sbi_domains(value_id);


--
-- Name: fk_sbi_dist_list_objects_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_dist_list_objects
    ADD CONSTRAINT fk_sbi_dist_list_objects_1 FOREIGN KEY (doc_id) REFERENCES sbi_objects(biobj_id) ON DELETE CASCADE;


--
-- Name: fk_sbi_dist_list_objects_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_dist_list_objects
    ADD CONSTRAINT fk_sbi_dist_list_objects_2 FOREIGN KEY (dl_id) REFERENCES sbi_dist_list(dl_id) ON DELETE CASCADE;


--
-- Name: fk_sbi_dist_list_user_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_dist_list_user
    ADD CONSTRAINT fk_sbi_dist_list_user_1 FOREIGN KEY (list_id) REFERENCES sbi_dist_list(dl_id) ON DELETE CASCADE;


--
-- Name: fk_sbi_domains_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_data_set
    ADD CONSTRAINT fk_sbi_domains_2 FOREIGN KEY (scope_id) REFERENCES sbi_domains(value_id);


--
-- Name: fk_sbi_dossier_bin_temp_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_dossier_bin_temp
    ADD CONSTRAINT fk_sbi_dossier_bin_temp_1 FOREIGN KEY (part_id) REFERENCES sbi_dossier_temp(part_id) ON DELETE CASCADE;


--
-- Name: fk_sbi_dossier_pres_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_dossier_pres
    ADD CONSTRAINT fk_sbi_dossier_pres_1 FOREIGN KEY (bin_id) REFERENCES sbi_binary_contents(bin_id);


--
-- Name: fk_sbi_dossier_pres_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_dossier_pres
    ADD CONSTRAINT fk_sbi_dossier_pres_2 FOREIGN KEY (biobj_id) REFERENCES sbi_objects(biobj_id);


--
-- Name: fk_sbi_dossier_temp_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_dossier_temp
    ADD CONSTRAINT fk_sbi_dossier_temp_1 FOREIGN KEY (biobj_id) REFERENCES sbi_objects(biobj_id);


--
-- Name: fk_sbi_engines_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_engines
    ADD CONSTRAINT fk_sbi_engines_1 FOREIGN KEY (biobj_type) REFERENCES sbi_domains(value_id);


--
-- Name: fk_sbi_engines_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_engines
    ADD CONSTRAINT fk_sbi_engines_2 FOREIGN KEY (engine_type) REFERENCES sbi_domains(value_id);


--
-- Name: fk_sbi_events_roles_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_events_roles
    ADD CONSTRAINT fk_sbi_events_roles_1 FOREIGN KEY (role_id) REFERENCES sbi_ext_roles(ext_role_id);


--
-- Name: fk_sbi_events_roles_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_events_roles
    ADD CONSTRAINT fk_sbi_events_roles_2 FOREIGN KEY (event_id) REFERENCES sbi_events_log(id);


--
-- Name: fk_sbi_exporters_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_exporters
    ADD CONSTRAINT fk_sbi_exporters_1 FOREIGN KEY (engine_id) REFERENCES sbi_engines(engine_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_exporters_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_exporters
    ADD CONSTRAINT fk_sbi_exporters_2 FOREIGN KEY (domain_id) REFERENCES sbi_domains(value_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_ext_roles_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_ext_roles
    ADD CONSTRAINT fk_sbi_ext_roles_1 FOREIGN KEY (role_type_id) REFERENCES sbi_domains(value_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_ext_user_roles_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_ext_user_roles
    ADD CONSTRAINT fk_sbi_ext_user_roles_1 FOREIGN KEY (id) REFERENCES sbi_user(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: fk_sbi_ext_user_roles_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_ext_user_roles
    ADD CONSTRAINT fk_sbi_ext_user_roles_2 FOREIGN KEY (ext_role_id) REFERENCES sbi_ext_roles(ext_role_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_func_role_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_func_role
    ADD CONSTRAINT fk_sbi_func_role_1 FOREIGN KEY (role_id) REFERENCES sbi_ext_roles(ext_role_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_func_role_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_func_role
    ADD CONSTRAINT fk_sbi_func_role_2 FOREIGN KEY (state_id) REFERENCES sbi_domains(value_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_func_role_3; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_func_role
    ADD CONSTRAINT fk_sbi_func_role_3 FOREIGN KEY (funct_id) REFERENCES sbi_functions(funct_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_functions_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_functions
    ADD CONSTRAINT fk_sbi_functions_1 FOREIGN KEY (funct_type_id) REFERENCES sbi_domains(value_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_functions_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_functions
    ADD CONSTRAINT fk_sbi_functions_2 FOREIGN KEY (parent_funct_id) REFERENCES sbi_functions(funct_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_geo_maps_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_geo_maps
    ADD CONSTRAINT fk_sbi_geo_maps_1 FOREIGN KEY (bin_id) REFERENCES sbi_binary_contents(bin_id);


--
-- Name: fk_sbi_goal_hierarchy_goal; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_goal_hierarchy
    ADD CONSTRAINT fk_sbi_goal_hierarchy_goal FOREIGN KEY (goal_id) REFERENCES sbi_goal(goal_id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: fk_sbi_goal_hierarchy_parent; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_goal_hierarchy
    ADD CONSTRAINT fk_sbi_goal_hierarchy_parent FOREIGN KEY (parent_id) REFERENCES sbi_goal_hierarchy(goal_hierarchy_id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: fk_sbi_goal_kpi_goal; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_goal_kpi
    ADD CONSTRAINT fk_sbi_goal_kpi_goal FOREIGN KEY (goal_hierarchy_id) REFERENCES sbi_goal_hierarchy(goal_hierarchy_id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: fk_sbi_goal_kpi_kpi; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_goal_kpi
    ADD CONSTRAINT fk_sbi_goal_kpi_kpi FOREIGN KEY (kpi_instance_id) REFERENCES sbi_kpi_model_inst(kpi_model_inst) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: fk_sbi_i18n_messages; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_i18n_messages
    ADD CONSTRAINT fk_sbi_i18n_messages FOREIGN KEY (language_cd) REFERENCES sbi_domains(value_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi
    ADD CONSTRAINT fk_sbi_kpi_1 FOREIGN KEY (id_measure_unit) REFERENCES sbi_measure_unit(id_measure_unit) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi
    ADD CONSTRAINT fk_sbi_kpi_2 FOREIGN KEY (threshold_id) REFERENCES sbi_threshold(threshold_id);


--
-- Name: fk_sbi_kpi_3; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi
    ADD CONSTRAINT fk_sbi_kpi_3 FOREIGN KEY (id_kpi_parent) REFERENCES sbi_kpi(kpi_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_4; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi
    ADD CONSTRAINT fk_sbi_kpi_4 FOREIGN KEY (kpi_type) REFERENCES sbi_domains(value_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_5; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi
    ADD CONSTRAINT fk_sbi_kpi_5 FOREIGN KEY (metric_scale_type) REFERENCES sbi_domains(value_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_6; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi
    ADD CONSTRAINT fk_sbi_kpi_6 FOREIGN KEY (measure_type) REFERENCES sbi_domains(value_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_comment_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_comments
    ADD CONSTRAINT fk_sbi_kpi_comment_1 FOREIGN KEY (bin_id) REFERENCES sbi_binary_contents(bin_id);


--
-- Name: fk_sbi_kpi_comment_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_comments
    ADD CONSTRAINT fk_sbi_kpi_comment_2 FOREIGN KEY (kpi_inst_id) REFERENCES sbi_kpi_instance(id_kpi_instance);


--
-- Name: fk_sbi_kpi_documents_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_documents
    ADD CONSTRAINT fk_sbi_kpi_documents_1 FOREIGN KEY (biobj_id) REFERENCES sbi_objects(biobj_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_sbi_kpi_documents_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_documents
    ADD CONSTRAINT fk_sbi_kpi_documents_2 FOREIGN KEY (kpi_id) REFERENCES sbi_kpi(kpi_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_error_model_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_error
    ADD CONSTRAINT fk_sbi_kpi_error_model_1 FOREIGN KEY (kpi_model_inst_id) REFERENCES sbi_kpi_model_inst(kpi_model_inst) ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_inst_period_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_inst_period
    ADD CONSTRAINT fk_sbi_kpi_inst_period_1 FOREIGN KEY (periodicity_id) REFERENCES sbi_kpi_periodicity(id_kpi_periodicity) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_inst_period_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_inst_period
    ADD CONSTRAINT fk_sbi_kpi_inst_period_2 FOREIGN KEY (kpi_instance_id) REFERENCES sbi_kpi_instance(id_kpi_instance) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_instance_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_instance
    ADD CONSTRAINT fk_sbi_kpi_instance_1 FOREIGN KEY (kpi_id) REFERENCES sbi_kpi(kpi_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_instance_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_instance
    ADD CONSTRAINT fk_sbi_kpi_instance_2 FOREIGN KEY (chart_type_id) REFERENCES sbi_domains(value_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_instance_3; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_instance
    ADD CONSTRAINT fk_sbi_kpi_instance_3 FOREIGN KEY (id_measure_unit) REFERENCES sbi_measure_unit(id_measure_unit) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_instance_4; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_instance
    ADD CONSTRAINT fk_sbi_kpi_instance_4 FOREIGN KEY (threshold_id) REFERENCES sbi_threshold(threshold_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_instance_history_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_instance_history
    ADD CONSTRAINT fk_sbi_kpi_instance_history_1 FOREIGN KEY (id_measure_unit) REFERENCES sbi_measure_unit(id_measure_unit) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_instance_history_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_instance_history
    ADD CONSTRAINT fk_sbi_kpi_instance_history_2 FOREIGN KEY (threshold_id) REFERENCES sbi_threshold(threshold_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_instance_history_3; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_instance_history
    ADD CONSTRAINT fk_sbi_kpi_instance_history_3 FOREIGN KEY (chart_type_id) REFERENCES sbi_domains(value_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_instance_history_4; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_instance_history
    ADD CONSTRAINT fk_sbi_kpi_instance_history_4 FOREIGN KEY (id_kpi_instance) REFERENCES sbi_kpi_instance(id_kpi_instance) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_model_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_model
    ADD CONSTRAINT fk_sbi_kpi_model_1 FOREIGN KEY (kpi_parent_model_id) REFERENCES sbi_kpi_model(kpi_model_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_model_3; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_model
    ADD CONSTRAINT fk_sbi_kpi_model_3 FOREIGN KEY (kpi_id) REFERENCES sbi_kpi(kpi_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_model_inst_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_model_inst
    ADD CONSTRAINT fk_sbi_kpi_model_inst_1 FOREIGN KEY (kpi_model_inst_parent) REFERENCES sbi_kpi_model_inst(kpi_model_inst) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_model_inst_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_model_inst
    ADD CONSTRAINT fk_sbi_kpi_model_inst_2 FOREIGN KEY (kpi_model_id) REFERENCES sbi_kpi_model(kpi_model_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_model_inst_3; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_model_inst
    ADD CONSTRAINT fk_sbi_kpi_model_inst_3 FOREIGN KEY (id_kpi_instance) REFERENCES sbi_kpi_instance(id_kpi_instance) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_model_resources_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_model_resources
    ADD CONSTRAINT fk_sbi_kpi_model_resources_1 FOREIGN KEY (kpi_model_inst) REFERENCES sbi_kpi_model_inst(kpi_model_inst) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_model_resources_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_model_resources
    ADD CONSTRAINT fk_sbi_kpi_model_resources_2 FOREIGN KEY (resource_id) REFERENCES sbi_resources(resource_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_rel_3; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_rel
    ADD CONSTRAINT fk_sbi_kpi_rel_3 FOREIGN KEY (kpi_father_id) REFERENCES sbi_kpi(kpi_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_rel_4; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_rel
    ADD CONSTRAINT fk_sbi_kpi_rel_4 FOREIGN KEY (kpi_child_id) REFERENCES sbi_kpi(kpi_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_role_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_role
    ADD CONSTRAINT fk_sbi_kpi_role_1 FOREIGN KEY (ext_role_id) REFERENCES sbi_ext_roles(ext_role_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_role_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_role
    ADD CONSTRAINT fk_sbi_kpi_role_2 FOREIGN KEY (kpi_id) REFERENCES sbi_kpi(kpi_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_value_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_value
    ADD CONSTRAINT fk_sbi_kpi_value_1 FOREIGN KEY (resource_id) REFERENCES sbi_resources(resource_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_value_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_value
    ADD CONSTRAINT fk_sbi_kpi_value_2 FOREIGN KEY (id_kpi_instance) REFERENCES sbi_kpi_instance(id_kpi_instance) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_kpi_value_4; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_kpi_value
    ADD CONSTRAINT fk_sbi_kpi_value_4 FOREIGN KEY (hierarchy_id) REFERENCES sbi_org_unit_hierarchies(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_lov_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_lov
    ADD CONSTRAINT fk_sbi_lov_1 FOREIGN KEY (input_type_id) REFERENCES sbi_domains(value_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_measure_unit_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_measure_unit
    ADD CONSTRAINT fk_sbi_measure_unit_1 FOREIGN KEY (scale_type_id) REFERENCES sbi_domains(value_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_menu_role1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_menu_role
    ADD CONSTRAINT fk_sbi_menu_role1 FOREIGN KEY (menu_id) REFERENCES sbi_menu(menu_id) ON DELETE CASCADE;


--
-- Name: fk_sbi_menu_role2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_menu_role
    ADD CONSTRAINT fk_sbi_menu_role2 FOREIGN KEY (ext_role_id) REFERENCES sbi_ext_roles(ext_role_id) ON DELETE CASCADE;


--
-- Name: fk_sbi_meta_models_versions_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_meta_models_versions
    ADD CONSTRAINT fk_sbi_meta_models_versions_1 FOREIGN KEY (model_id) REFERENCES sbi_meta_models(id) ON DELETE CASCADE;


--
-- Name: fk_sbi_obj_func_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_func
    ADD CONSTRAINT fk_sbi_obj_func_1 FOREIGN KEY (funct_id) REFERENCES sbi_functions(funct_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_obj_func_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_func
    ADD CONSTRAINT fk_sbi_obj_func_2 FOREIGN KEY (biobj_id) REFERENCES sbi_objects(biobj_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_obj_metacontents_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_metacontents
    ADD CONSTRAINT fk_sbi_obj_metacontents_1 FOREIGN KEY (objmeta_id) REFERENCES sbi_obj_metadata(obj_meta_id);


--
-- Name: fk_sbi_obj_metacontents_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_metacontents
    ADD CONSTRAINT fk_sbi_obj_metacontents_2 FOREIGN KEY (biobj_id) REFERENCES sbi_objects(biobj_id);


--
-- Name: fk_sbi_obj_metacontents_3; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_metacontents
    ADD CONSTRAINT fk_sbi_obj_metacontents_3 FOREIGN KEY (subobj_id) REFERENCES sbi_subobjects(subobj_id);


--
-- Name: fk_sbi_obj_metacontents_4; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_metacontents
    ADD CONSTRAINT fk_sbi_obj_metacontents_4 FOREIGN KEY (bin_id) REFERENCES sbi_binary_contents(bin_id);


--
-- Name: fk_sbi_obj_metadata_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_metadata
    ADD CONSTRAINT fk_sbi_obj_metadata_1 FOREIGN KEY (data_type_id) REFERENCES sbi_domains(value_id);


--
-- Name: fk_sbi_obj_par_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_par
    ADD CONSTRAINT fk_sbi_obj_par_1 FOREIGN KEY (biobj_id) REFERENCES sbi_objects(biobj_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_obj_par_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_par
    ADD CONSTRAINT fk_sbi_obj_par_2 FOREIGN KEY (par_id) REFERENCES sbi_parameters(par_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_obj_paruse_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_paruse
    ADD CONSTRAINT fk_sbi_obj_paruse_1 FOREIGN KEY (obj_par_id) REFERENCES sbi_obj_par(obj_par_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_obj_paruse_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_paruse
    ADD CONSTRAINT fk_sbi_obj_paruse_2 FOREIGN KEY (use_id) REFERENCES sbi_paruse(use_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_obj_paruse_3; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_paruse
    ADD CONSTRAINT fk_sbi_obj_paruse_3 FOREIGN KEY (obj_par_father_id) REFERENCES sbi_obj_par(obj_par_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_obj_parview_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_parview
    ADD CONSTRAINT fk_sbi_obj_parview_1 FOREIGN KEY (obj_par_id) REFERENCES sbi_obj_par(obj_par_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_obj_parview_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_parview
    ADD CONSTRAINT fk_sbi_obj_parview_2 FOREIGN KEY (obj_par_father_id) REFERENCES sbi_obj_par(obj_par_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_obj_state_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_state
    ADD CONSTRAINT fk_sbi_obj_state_1 FOREIGN KEY (biobj_id) REFERENCES sbi_objects(biobj_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_obj_state_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_obj_state
    ADD CONSTRAINT fk_sbi_obj_state_2 FOREIGN KEY (state_id) REFERENCES sbi_domains(value_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_object_notes_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_object_notes
    ADD CONSTRAINT fk_sbi_object_notes_1 FOREIGN KEY (bin_id) REFERENCES sbi_binary_contents(bin_id);


--
-- Name: fk_sbi_object_notes_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_object_notes
    ADD CONSTRAINT fk_sbi_object_notes_2 FOREIGN KEY (biobj_id) REFERENCES sbi_objects(biobj_id);


--
-- Name: fk_sbi_object_templates_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_object_templates
    ADD CONSTRAINT fk_sbi_object_templates_1 FOREIGN KEY (bin_id) REFERENCES sbi_binary_contents(bin_id);


--
-- Name: fk_sbi_object_templates_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_object_templates
    ADD CONSTRAINT fk_sbi_object_templates_2 FOREIGN KEY (biobj_id) REFERENCES sbi_objects(biobj_id);


--
-- Name: fk_sbi_objects_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_objects
    ADD CONSTRAINT fk_sbi_objects_1 FOREIGN KEY (state_cons_id) REFERENCES sbi_domains(value_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_objects_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_objects
    ADD CONSTRAINT fk_sbi_objects_2 FOREIGN KEY (state_id) REFERENCES sbi_domains(value_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_objects_3; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_objects
    ADD CONSTRAINT fk_sbi_objects_3 FOREIGN KEY (biobj_type_id) REFERENCES sbi_domains(value_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_objects_4; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_objects
    ADD CONSTRAINT fk_sbi_objects_4 FOREIGN KEY (exec_mode_id) REFERENCES sbi_domains(value_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_objects_rating_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_objects_rating
    ADD CONSTRAINT fk_sbi_objects_rating_1 FOREIGN KEY (obj_id) REFERENCES sbi_objects(biobj_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_sbi_org_unit_grant_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_org_unit_grant
    ADD CONSTRAINT fk_sbi_org_unit_grant_2 FOREIGN KEY (hierarchy_id) REFERENCES sbi_org_unit_hierarchies(id) ON DELETE CASCADE;


--
-- Name: fk_sbi_org_unit_grant_3; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_org_unit_grant
    ADD CONSTRAINT fk_sbi_org_unit_grant_3 FOREIGN KEY (kpi_model_inst_node_id) REFERENCES sbi_kpi_model_inst(kpi_model_inst) ON DELETE CASCADE;


--
-- Name: fk_sbi_org_unit_grant_nodes_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_org_unit_grant_nodes
    ADD CONSTRAINT fk_sbi_org_unit_grant_nodes_1 FOREIGN KEY (node_id) REFERENCES sbi_org_unit_nodes(node_id) ON DELETE CASCADE;


--
-- Name: fk_sbi_org_unit_grant_nodes_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_org_unit_grant_nodes
    ADD CONSTRAINT fk_sbi_org_unit_grant_nodes_2 FOREIGN KEY (kpi_model_inst_node_id) REFERENCES sbi_kpi_model_inst(kpi_model_inst) ON DELETE CASCADE;


--
-- Name: fk_sbi_org_unit_grant_nodes_3; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_org_unit_grant_nodes
    ADD CONSTRAINT fk_sbi_org_unit_grant_nodes_3 FOREIGN KEY (grant_id) REFERENCES sbi_org_unit_grant(id) ON DELETE CASCADE;


--
-- Name: fk_sbi_org_unit_nodes_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_org_unit_nodes
    ADD CONSTRAINT fk_sbi_org_unit_nodes_1 FOREIGN KEY (ou_id) REFERENCES sbi_org_unit(id) ON DELETE CASCADE;


--
-- Name: fk_sbi_org_unit_nodes_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_org_unit_nodes
    ADD CONSTRAINT fk_sbi_org_unit_nodes_2 FOREIGN KEY (hierarchy_id) REFERENCES sbi_org_unit_hierarchies(id) ON DELETE CASCADE;


--
-- Name: fk_sbi_org_unit_nodes_3; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_org_unit_nodes
    ADD CONSTRAINT fk_sbi_org_unit_nodes_3 FOREIGN KEY (parent_node_id) REFERENCES sbi_org_unit_nodes(node_id) ON DELETE CASCADE;


--
-- Name: fk_sbi_parameters_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_parameters
    ADD CONSTRAINT fk_sbi_parameters_1 FOREIGN KEY (par_type_id) REFERENCES sbi_domains(value_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_paruse_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_paruse
    ADD CONSTRAINT fk_sbi_paruse_1 FOREIGN KEY (par_id) REFERENCES sbi_parameters(par_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_paruse_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_paruse
    ADD CONSTRAINT fk_sbi_paruse_2 FOREIGN KEY (lov_id) REFERENCES sbi_lov(lov_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_paruse_3; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_paruse
    ADD CONSTRAINT fk_sbi_paruse_3 FOREIGN KEY (default_lov_id) REFERENCES sbi_lov(lov_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_paruse_ck_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_paruse_ck
    ADD CONSTRAINT fk_sbi_paruse_ck_1 FOREIGN KEY (use_id) REFERENCES sbi_paruse(use_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_paruse_ck_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_paruse_ck
    ADD CONSTRAINT fk_sbi_paruse_ck_2 FOREIGN KEY (check_id) REFERENCES sbi_checks(check_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_paruse_det_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_paruse_det
    ADD CONSTRAINT fk_sbi_paruse_det_1 FOREIGN KEY (use_id) REFERENCES sbi_paruse(use_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_paruse_det_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_paruse_det
    ADD CONSTRAINT fk_sbi_paruse_det_2 FOREIGN KEY (ext_role_id) REFERENCES sbi_ext_roles(ext_role_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_remember_me_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_remember_me
    ADD CONSTRAINT fk_sbi_remember_me_1 FOREIGN KEY (biobj_id) REFERENCES sbi_objects(biobj_id) ON DELETE CASCADE;


--
-- Name: fk_sbi_remember_me_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_remember_me
    ADD CONSTRAINT fk_sbi_remember_me_2 FOREIGN KEY (subobj_id) REFERENCES sbi_subobjects(subobj_id) ON DELETE CASCADE;


--
-- Name: fk_sbi_resources_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_resources
    ADD CONSTRAINT fk_sbi_resources_1 FOREIGN KEY (resource_type_id) REFERENCES sbi_domains(value_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_role_type_user_func_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_role_type_user_func
    ADD CONSTRAINT fk_sbi_role_type_user_func_1 FOREIGN KEY (role_type_id) REFERENCES sbi_domains(value_id);


--
-- Name: fk_sbi_role_type_user_func_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_role_type_user_func
    ADD CONSTRAINT fk_sbi_role_type_user_func_2 FOREIGN KEY (user_funct_id) REFERENCES sbi_user_func(user_funct_id);


--
-- Name: fk_sbi_sbi_udp_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_udp
    ADD CONSTRAINT fk_sbi_sbi_udp_1 FOREIGN KEY (type_id) REFERENCES sbi_domains(value_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_sbi_udp_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_udp
    ADD CONSTRAINT fk_sbi_sbi_udp_2 FOREIGN KEY (family_id) REFERENCES sbi_domains(value_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_snapshots_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_snapshots
    ADD CONSTRAINT fk_sbi_snapshots_1 FOREIGN KEY (bin_id) REFERENCES sbi_binary_contents(bin_id);


--
-- Name: fk_sbi_snapshots_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_snapshots
    ADD CONSTRAINT fk_sbi_snapshots_2 FOREIGN KEY (biobj_id) REFERENCES sbi_objects(biobj_id);


--
-- Name: fk_sbi_subobjects_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_subobjects
    ADD CONSTRAINT fk_sbi_subobjects_1 FOREIGN KEY (bin_id) REFERENCES sbi_binary_contents(bin_id);


--
-- Name: fk_sbi_subobjects_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_subobjects
    ADD CONSTRAINT fk_sbi_subobjects_2 FOREIGN KEY (biobj_id) REFERENCES sbi_objects(biobj_id);


--
-- Name: fk_sbi_subreports_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_subreports
    ADD CONSTRAINT fk_sbi_subreports_1 FOREIGN KEY (master_rpt_id) REFERENCES sbi_objects(biobj_id);


--
-- Name: fk_sbi_subreports_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_subreports
    ADD CONSTRAINT fk_sbi_subreports_2 FOREIGN KEY (sub_rpt_id) REFERENCES sbi_objects(biobj_id);


--
-- Name: fk_sbi_threshold_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_threshold
    ADD CONSTRAINT fk_sbi_threshold_1 FOREIGN KEY (threshold_type_id) REFERENCES sbi_domains(value_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_threshold_value_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_threshold_value
    ADD CONSTRAINT fk_sbi_threshold_value_1 FOREIGN KEY (severity_id) REFERENCES sbi_domains(value_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_udp_value_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_udp_value
    ADD CONSTRAINT fk_sbi_udp_value_2 FOREIGN KEY (udp_id) REFERENCES sbi_udp(udp_id) ON DELETE RESTRICT;


--
-- Name: fk_sbi_user_attributes_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_user_attributes
    ADD CONSTRAINT fk_sbi_user_attributes_1 FOREIGN KEY (id) REFERENCES sbi_user(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: fk_sbi_user_attributes_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_user_attributes
    ADD CONSTRAINT fk_sbi_user_attributes_2 FOREIGN KEY (attribute_id) REFERENCES sbi_attribute(attribute_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: fk_sbi_viewpoints_1; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_viewpoints
    ADD CONSTRAINT fk_sbi_viewpoints_1 FOREIGN KEY (biobj_id) REFERENCES sbi_objects(biobj_id);


--
-- Name: fk_threshold_value_2; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_threshold_value
    ADD CONSTRAINT fk_threshold_value_2 FOREIGN KEY (threshold_id) REFERENCES sbi_threshold(threshold_id) ON DELETE CASCADE;


--
-- Name: fk_user; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY sbi_community_users
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES sbi_user(user_id);


--
-- Name: qrtz_blob_triggers_trigger_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY qrtz_blob_triggers
    ADD CONSTRAINT qrtz_blob_triggers_trigger_name_fkey FOREIGN KEY (trigger_name, trigger_group) REFERENCES qrtz_triggers(trigger_name, trigger_group);


--
-- Name: qrtz_cron_triggers_trigger_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY qrtz_cron_triggers
    ADD CONSTRAINT qrtz_cron_triggers_trigger_name_fkey FOREIGN KEY (trigger_name, trigger_group) REFERENCES qrtz_triggers(trigger_name, trigger_group);


--
-- Name: qrtz_job_listeners_job_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY qrtz_job_listeners
    ADD CONSTRAINT qrtz_job_listeners_job_name_fkey FOREIGN KEY (job_name, job_group) REFERENCES qrtz_job_details(job_name, job_group);


--
-- Name: qrtz_simple_triggers_trigger_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY qrtz_simple_triggers
    ADD CONSTRAINT qrtz_simple_triggers_trigger_name_fkey FOREIGN KEY (trigger_name, trigger_group) REFERENCES qrtz_triggers(trigger_name, trigger_group);


--
-- Name: qrtz_trigger_listeners_trigger_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY qrtz_trigger_listeners
    ADD CONSTRAINT qrtz_trigger_listeners_trigger_name_fkey FOREIGN KEY (trigger_name, trigger_group) REFERENCES qrtz_triggers(trigger_name, trigger_group);


--
-- Name: qrtz_triggers_job_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: spagobi
--

ALTER TABLE ONLY qrtz_triggers
    ADD CONSTRAINT qrtz_triggers_job_name_fkey FOREIGN KEY (job_name, job_group) REFERENCES qrtz_job_details(job_name, job_group);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

