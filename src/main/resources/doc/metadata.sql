--
-- PostgreSQL database dump
--

-- Dumped from database version 9.1.2
-- Dumped by pg_dump version 9.1.2
-- Started on 2016-11-28 15:24:05

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 370 (class 1259 OID 733687)
-- Dependencies: 6
-- Name: t_md_composition; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE t_md_composition (
    father_instance_id character varying(32) NOT NULL,
    father_classifier_id character varying(200) NOT NULL,
    child_instance_id character varying(32) NOT NULL,
    child_classifier_id character varying(200) NOT NULL,
    relationship character varying(100) NOT NULL,
    start_time numeric NOT NULL
);


ALTER TABLE public.t_md_composition OWNER TO postgres;

--
-- TOC entry 371 (class 1259 OID 733710)
-- Dependencies: 6
-- Name: t_md_dependency; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE t_md_dependency (
    from_instance_id character varying(32) NOT NULL,
    from_classifier_id character varying(200) NOT NULL,
    to_instance_id character varying(32) NOT NULL,
    to_classifier_id character varying(200) NOT NULL,
    relationship character varying(100) NOT NULL,
    start_time numeric NOT NULL,
    rel_type character(1) NOT NULL,
    rel_status character(1) NOT NULL
);


ALTER TABLE public.t_md_dependency OWNER TO postgres;

--
-- TOC entry 368 (class 1259 OID 733660)
-- Dependencies: 6
-- Name: t_md_instance; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE t_md_instance (
    instance_id character varying(32) NOT NULL,
    instance_code character varying(500) NOT NULL,
    instance_name character varying(500) NOT NULL,
    classifier_id character varying(200) NOT NULL,
    parent_id character varying(32) NOT NULL,
    namespace character varying(2000) NOT NULL,
    ver_id character varying(32),
    start_time numeric,
    isroot character(1),
    string_1 character varying(1500),
    string_2 character varying(1500),
    string_3 character varying(1500),
    string_4 character varying(1500),
    string_5 character varying(1500),
    string_6 character varying(1500),
    string_7 character varying(1500),
    string_8 character varying(1500),
    string_9 character varying(1500),
    string_10 character varying(1500),
    string_11 character varying(1500),
    string_12 character varying(1500),
    string_13 character varying(1500),
    string_14 character varying(1500),
    string_15 character varying(1500),
    string_16 character varying(1500),
    string_17 character varying(1500),
    string_18 character varying(1500),
    string_19 character varying(1500),
    string_20 character varying(1500),
    string_21 character varying(1500),
    string_22 character varying(1500),
    string_23 character varying(1500),
    string_24 character varying(1500),
    string_25 character varying(1500),
    string_26 character varying(1500),
    string_27 character varying(1500),
    string_28 character varying(1500),
    string_29 character varying(1500),
    string_30 character varying(1500),
    string_31 character varying(1500),
    string_32 character varying(1500),
    string_33 character varying(1500),
    string_34 character varying(1500),
    string_35 character varying(1500),
    string_36 character varying(1500),
    string_37 character varying(1500),
    string_38 character varying(1500),
    string_39 character varying(1500),
    string_40 character varying(1500),
    path character varying(2000) NOT NULL
);


ALTER TABLE public.t_md_instance OWNER TO postgres;

--
-- TOC entry 372 (class 1259 OID 733716)
-- Dependencies: 6
-- Name: t_mm_classifier; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE t_mm_classifier (
    classifier_id character varying(200) NOT NULL,
    classifier_name character varying(400),
    isabstract character(1),
    isdischild character(1),
    isappend character(1) NOT NULL,
    dis_icon character varying(500),
    owner_pid character varying(200),
    user_id character varying(500),
    description character varying(500)
);


ALTER TABLE public.t_mm_classifier OWNER TO postgres;

--
-- TOC entry 373 (class 1259 OID 733722)
-- Dependencies: 6
-- Name: t_mm_comp_navigate; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE t_mm_comp_navigate (
    upper_classifier_id character varying(200) NOT NULL,
    lower_classifier_id character varying(200) NOT NULL
);


ALTER TABLE public.t_mm_comp_navigate OWNER TO postgres;

--
-- TOC entry 2642 (class 0 OID 0)
-- Dependencies: 373
-- Name: TABLE t_mm_comp_navigate; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE t_mm_comp_navigate IS '组合关系导航';


--
-- TOC entry 2643 (class 0 OID 0)
-- Dependencies: 373
-- Name: COLUMN t_mm_comp_navigate.upper_classifier_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN t_mm_comp_navigate.upper_classifier_id IS '上级类元ID';


--
-- TOC entry 2644 (class 0 OID 0)
-- Dependencies: 373
-- Name: COLUMN t_mm_comp_navigate.lower_classifier_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN t_mm_comp_navigate.lower_classifier_id IS '下级类元ID';


--
-- TOC entry 374 (class 1259 OID 733725)
-- Dependencies: 6
-- Name: t_mm_datatype; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE t_mm_datatype (
    datatype_id character varying(200) NOT NULL,
    package_id character varying(200) NOT NULL,
    datatype_name character varying(500),
    isenum character(1),
    enum_id character varying(200),
    built_in character varying(1),
    description character varying(500)
);


ALTER TABLE public.t_mm_datatype OWNER TO postgres;

--
-- TOC entry 375 (class 1259 OID 733731)
-- Dependencies: 6
-- Name: t_mm_dtcombrela; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE t_mm_dtcombrela (
    datatype_id character varying(200) NOT NULL,
    comb_id character varying(100) NOT NULL
);


ALTER TABLE public.t_mm_dtcombrela OWNER TO postgres;

--
-- TOC entry 376 (class 1259 OID 733734)
-- Dependencies: 6
-- Name: t_mm_editcomb; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE t_mm_editcomb (
    comb_id character varying(100) NOT NULL,
    comb_name character varying(500),
    description character varying(500)
);


ALTER TABLE public.t_mm_editcomb OWNER TO postgres;

--
-- TOC entry 377 (class 1259 OID 733740)
-- Dependencies: 6
-- Name: t_mm_enumeration; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE t_mm_enumeration (
    enum_id character varying(200) NOT NULL,
    enum_name character varying(200),
    built_in character varying(1),
    description character varying(500)
);


ALTER TABLE public.t_mm_enumeration OWNER TO postgres;

--
-- TOC entry 378 (class 1259 OID 733746)
-- Dependencies: 6
-- Name: t_mm_enumerationitem; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE t_mm_enumerationitem (
    enumitem_id character varying(200) NOT NULL,
    enum_id character varying(200) NOT NULL,
    enumitem_name character varying(200),
    description character varying(500)
);


ALTER TABLE public.t_mm_enumerationitem OWNER TO postgres;

--
-- TOC entry 379 (class 1259 OID 733752)
-- Dependencies: 6
-- Name: t_mm_feature; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE t_mm_feature (
    att_id character varying(200) NOT NULL,
    att_code character varying(200) NOT NULL,
    classifier_id character varying(200) NOT NULL,
    att_name character varying(500) NOT NULL,
    inherit_flag character varying(20),
    isread character(1),
    is_null character(1),
    datatype_id character varying(200),
    att_length integer,
    att_max character varying(100),
    att_min character varying(100),
    precision_digit character varying(100),
    isshow character(1),
    iskey character(1),
    comb_id character varying(100),
    description character varying(500),
    featureid numeric(2,0),
    sortlevel character varying(4)
);


ALTER TABLE public.t_mm_feature OWNER TO postgres;

--
-- TOC entry 380 (class 1259 OID 733758)
-- Dependencies: 6
-- Name: t_mm_featurecol; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE t_mm_featurecol (
    att_id character varying(200) NOT NULL,
    classifier_id character varying(200) NOT NULL,
    att_store character varying(100) NOT NULL
);


ALTER TABLE public.t_mm_featurecol OWNER TO postgres;

--
-- TOC entry 381 (class 1259 OID 733764)
-- Dependencies: 6
-- Name: t_mm_inherit; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE t_mm_inherit (
    classifier_id character varying(200) NOT NULL,
    owner_classifierid character varying(200) NOT NULL,
    parent character(1) NOT NULL,
    pathnum numeric(8,0) NOT NULL
);


ALTER TABLE public.t_mm_inherit OWNER TO postgres;

--
-- TOC entry 382 (class 1259 OID 733767)
-- Dependencies: 6
-- Name: t_mm_package; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE t_mm_package (
    package_id character varying(200) NOT NULL,
    package_name character varying(500),
    owner_pid character varying(200),
    description character varying(500)
);


ALTER TABLE public.t_mm_package OWNER TO postgres;

--
-- TOC entry 369 (class 1259 OID 733679)
-- Dependencies: 6
-- Name: t_mm_relation_comp; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE t_mm_relation_comp (
    rel_id character varying(200) NOT NULL,
    rel_name character varying(500),
    from_classifier_id character varying(200) NOT NULL,
    owner_multiplicity character(2) NOT NULL,
    to_classifierid character varying(200) NOT NULL,
    to_multiplicity character(2) NOT NULL,
    description character varying(500)
);


ALTER TABLE public.t_mm_relation_comp OWNER TO postgres;

--
-- TOC entry 2645 (class 0 OID 0)
-- Dependencies: 369
-- Name: TABLE t_mm_relation_comp; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE t_mm_relation_comp IS '类元组合关系';


--
-- TOC entry 2646 (class 0 OID 0)
-- Dependencies: 369
-- Name: COLUMN t_mm_relation_comp.rel_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN t_mm_relation_comp.rel_id IS '关系ID';


--
-- TOC entry 2647 (class 0 OID 0)
-- Dependencies: 369
-- Name: COLUMN t_mm_relation_comp.rel_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN t_mm_relation_comp.rel_name IS '关系名称';


--
-- TOC entry 2648 (class 0 OID 0)
-- Dependencies: 369
-- Name: COLUMN t_mm_relation_comp.from_classifier_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN t_mm_relation_comp.from_classifier_id IS 'From类元';


--
-- TOC entry 2649 (class 0 OID 0)
-- Dependencies: 369
-- Name: COLUMN t_mm_relation_comp.owner_multiplicity; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN t_mm_relation_comp.owner_multiplicity IS 'From多样性';


--
-- TOC entry 2650 (class 0 OID 0)
-- Dependencies: 369
-- Name: COLUMN t_mm_relation_comp.to_classifierid; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN t_mm_relation_comp.to_classifierid IS 'To类元';


--
-- TOC entry 2651 (class 0 OID 0)
-- Dependencies: 369
-- Name: COLUMN t_mm_relation_comp.to_multiplicity; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN t_mm_relation_comp.to_multiplicity IS 'To多样性';


--
-- TOC entry 2652 (class 0 OID 0)
-- Dependencies: 369
-- Name: COLUMN t_mm_relation_comp.description; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN t_mm_relation_comp.description IS '描述';


--
-- TOC entry 383 (class 1259 OID 733773)
-- Dependencies: 6
-- Name: t_mm_relation_dep; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE t_mm_relation_dep (
    rel_id character varying(200) NOT NULL,
    rel_name character varying(500),
    from_classifier_id character varying(200) NOT NULL,
    frole_id character varying(200),
    to_classifierid character varying(200) NOT NULL,
    trole_id character varying(200),
    description character varying(500)
);


ALTER TABLE public.t_mm_relation_dep OWNER TO postgres;

--
-- TOC entry 2653 (class 0 OID 0)
-- Dependencies: 383
-- Name: COLUMN t_mm_relation_dep.rel_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN t_mm_relation_dep.rel_id IS '关系ID';


--
-- TOC entry 2654 (class 0 OID 0)
-- Dependencies: 383
-- Name: COLUMN t_mm_relation_dep.rel_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN t_mm_relation_dep.rel_name IS '关系名称';


--
-- TOC entry 2655 (class 0 OID 0)
-- Dependencies: 383
-- Name: COLUMN t_mm_relation_dep.from_classifier_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN t_mm_relation_dep.from_classifier_id IS 'From类元ID';


--
-- TOC entry 2656 (class 0 OID 0)
-- Dependencies: 383
-- Name: COLUMN t_mm_relation_dep.frole_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN t_mm_relation_dep.frole_id IS 'From角色ID';


--
-- TOC entry 2657 (class 0 OID 0)
-- Dependencies: 383
-- Name: COLUMN t_mm_relation_dep.to_classifierid; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN t_mm_relation_dep.to_classifierid IS 'To类元ID';


--
-- TOC entry 2658 (class 0 OID 0)
-- Dependencies: 383
-- Name: COLUMN t_mm_relation_dep.trole_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN t_mm_relation_dep.trole_id IS 'To角色ID';


--
-- TOC entry 2659 (class 0 OID 0)
-- Dependencies: 383
-- Name: COLUMN t_mm_relation_dep.description; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN t_mm_relation_dep.description IS '描述';


--
-- TOC entry 2626 (class 0 OID 733687)
-- Dependencies: 370
-- Data for Name: t_md_composition; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2627 (class 0 OID 733710)
-- Dependencies: 371
-- Data for Name: t_md_dependency; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2624 (class 0 OID 733660)
-- Dependencies: 368
-- Data for Name: t_md_instance; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2628 (class 0 OID 733716)
-- Dependencies: 372
-- Data for Name: t_mm_classifier; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('DataSource', '数据源', 'F', 'T', 'F', 'images/metamodel/Schema.gif', 'cwm_relational', 'admin', 'DataSource');
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('SpagoBI_DataItem', '数据项', 'F', 'T', 'F', 'images/metamodel/Cognos8_QueryItem.gif', 'mm_SpagoBI', 'admin', NULL);
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('Classifier', '表、文件', 'T', 'T', 'F', 'images/metamodel/Classifier.gif', 'cwm_core', 'admin', NULL);
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('Element', '基本元素', 'T', 'T', 'F', 'images/metamodel/Element.gif', 'cwm_core', 'admin', '最顶级模型');
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('Feature', '字段、属性', 'T', 'T', 'F', 'images/metamodel/Feature.gif', 'cwm_core', 'admin', NULL);
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('ModelElement', '模型元素', 'T', 'T', 'F', 'images/metamodel/ModelElement.gif', 'cwm_core', 'admin', NULL);
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('Catalog', '目录', 'F', 'F', 'T', 'images/metamodel/Catalog.gif', 'cwm_relational', 'admin', 'Catalog');
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('Column', '字段', 'F', 'F', 'F', 'images/metamodel/Column.gif', 'cwm_relational', 'admin', 'Column');
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('ForeignKey', '外键', 'F', 'T', 'F', 'images/metamodel/ForeignKey.gif', 'cwm_relational', 'admin', NULL);
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('Partition', '表分区', 'F', 'T', 'F', 'images/metamodel/Partition.gif', 'cwm_relational', 'admin', '表分区');
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('PrimaryKey', '主键', 'F', 'T', 'F', 'images/metamodel/PrimaryKey.gif', 'cwm_relational', 'admin', NULL);
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('Schema', '库', 'F', 'T', 'F', 'images/metamodel/Schema.gif', 'cwm_relational', 'admin', 'Schema');
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('Table', '表', 'F', 'F', 'F', 'images/metamodel/Table.gif', 'cwm_relational', 'admin', 'Table');
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('View', '视图', 'F', 'F', 'F', 'images/metamodel/View.gif', 'cwm_relational', 'admin', 'View');
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('SpagoBI_Model', '模型', 'F', 'F', 'F', 'images/metamodel/Cognos8_Model.gif', 'mm_SpagoBI', 'admin', 'SpagoBI_Model');
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('SpagoBI_QueryItem', '查询项', 'F', 'T', 'F', 'images/metamodel/Cognos8_QueryItem.gif', 'mm_SpagoBI', 'admin', NULL);
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('SpagoBI_Report', '报表', 'F', 'T', 'F', 'images/metamodel/Cognos8_Report.gif', 'mm_SpagoBI', 'admin', NULL);
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('SpagoBI_ReportField', '报表项', 'F', 'T', 'F', 'images/metamodel/Cognos8_ReportField.gif', 'mm_SpagoBI', 'admin', NULL);
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('SpagoBI_Dimension', '维度', 'F', 'T', 'F', 'images/metamodel/Cognos8_Dimension.gif', 'mm_SpagoBI', 'admin', NULL);
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('SpagoBI_Measure', '度量', 'F', 'T', 'F', 'images/metamodel/Cognos8_Measure.gif', 'mm_SpagoBI', 'admin', NULL);
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('ColumnMapping', '字段级映射', 'F', 'T', 'F', 'images/metamodel/ColumnMapping.gif', 'mm_mapping', 'admin', NULL);
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('TableMapping', '表级映射', 'F', 'T', 'F', 'images/metamodel/TableMapping.gif', 'mm_mapping', 'admin', NULL);
INSERT INTO t_mm_classifier (classifier_id, classifier_name, isabstract, isdischild, isappend, dis_icon, owner_pid, user_id, description) VALUES ('Transformation', '转换', 'F', 'T', 'T', 'images/metamodel/Transformer.gif', 'mm_mapping', 'admin', NULL);


--
-- TOC entry 2629 (class 0 OID 733722)
-- Dependencies: 373
-- Data for Name: t_mm_comp_navigate; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('Catalog', 'TdMacro');
INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('Catalog', 'Transformer');
INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('Schema', 'Column');
INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('Schema', 'ForeignKey');
INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('Schema', 'Partition');
INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('Schema', 'PrimaryKey');
INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('Schema', 'Procedure');
INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('Schema', 'ProcedureColumn');
INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('Schema', 'SQLIndex');
INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('Schema', 'Synonyms');
INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('Schema', 'SynonymsColumn');
INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('Schema', 'Table');
INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('Schema', 'TdMacro');
INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('Schema', 'View');
INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('Table', 'Column');
INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('Table', 'ForeignKey');
INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('Table', 'Partition');
INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('Table', 'PrimaryKey');
INSERT INTO t_mm_comp_navigate (upper_classifier_id, lower_classifier_id) VALUES ('View', 'Column');


--
-- TOC entry 2630 (class 0 OID 733725)
-- Dependencies: 374
-- Data for Name: t_mm_datatype; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO t_mm_datatype (datatype_id, package_id, datatype_name, isenum, enum_id, built_in, description) VALUES ('time', 'mm_datatype', '日期时间型', 'F', NULL, 'T', NULL);
INSERT INTO t_mm_datatype (datatype_id, package_id, datatype_name, isenum, enum_id, built_in, description) VALUES ('boolean', 'mm_datatype', '布尔型', 'T', 'T_F', 'T', NULL);
INSERT INTO t_mm_datatype (datatype_id, package_id, datatype_name, isenum, enum_id, built_in, description) VALUES ('string', 'mm_datatype', '字符型', 'F', NULL, 'T', NULL);
INSERT INTO t_mm_datatype (datatype_id, package_id, datatype_name, isenum, enum_id, built_in, description) VALUES ('YES_NO', 'mm_datatype', '是否类型', 'T', 'YES_NO', 'F', NULL);
INSERT INTO t_mm_datatype (datatype_id, package_id, datatype_name, isenum, enum_id, built_in, description) VALUES ('sql_datatype', 'mm_datatype', '数据类型', 'T', 'sql_datatype', 'F', NULL);
INSERT INTO t_mm_datatype (datatype_id, package_id, datatype_name, isenum, enum_id, built_in, description) VALUES ('float', 'mm_datatype', '浮点型', 'F', NULL, 'T', NULL);
INSERT INTO t_mm_datatype (datatype_id, package_id, datatype_name, isenum, enum_id, built_in, description) VALUES ('targettabtype', 'mm_datatype', '目标表说明', 'T', 'targettabtype', 'F', NULL);
INSERT INTO t_mm_datatype (datatype_id, package_id, datatype_name, isenum, enum_id, built_in, description) VALUES ('integer', 'mm_datatype', '整型', 'F', NULL, 'T', NULL);
INSERT INTO t_mm_datatype (datatype_id, package_id, datatype_name, isenum, enum_id, built_in, description) VALUES ('dbtype', 'mm_datatype', '数据库类型', 'T', 'dbtype', 'F', NULL);
INSERT INTO t_mm_datatype (datatype_id, package_id, datatype_name, isenum, enum_id, built_in, description) VALUES ('tabtype', 'mm_datatype', '表类型', 'T', 'tabtype', 'F', NULL);
INSERT INTO t_mm_datatype (datatype_id, package_id, datatype_name, isenum, enum_id, built_in, description) VALUES ('extractmanner', 'mm_datatype', '抽取方式', 'T', 'extractmanner', 'F', NULL);
INSERT INTO t_mm_datatype (datatype_id, package_id, datatype_name, isenum, enum_id, built_in, description) VALUES ('readytype', 'mm_datatype', '源系统就绪方式', 'T', 'readytype', 'F', NULL);
INSERT INTO t_mm_datatype (datatype_id, package_id, datatype_name, isenum, enum_id, built_in, description) VALUES ('codetype', 'mm_datatype', '字段代码类型', 'T', 'codetype', 'F', NULL);
INSERT INTO t_mm_datatype (datatype_id, package_id, datatype_name, isenum, enum_id, built_in, description) VALUES ('frequencyperiod', 'mm_datatype', '抽取周期', 'T', 'frequencyperiod', 'F', NULL);
INSERT INTO t_mm_datatype (datatype_id, package_id, datatype_name, isenum, enum_id, built_in, description) VALUES ('frequencytype', 'mm_datatype', '抽取频率类型', 'T', 'frequencytype', 'F', NULL);
INSERT INTO t_mm_datatype (datatype_id, package_id, datatype_name, isenum, enum_id, built_in, description) VALUES ('loadpolicy', 'mm_datatype', '加载策略', 'T', 'loadpolicy', 'F', NULL);
INSERT INTO t_mm_datatype (datatype_id, package_id, datatype_name, isenum, enum_id, built_in, description) VALUES ('Report_Filter_Type', 'mm_datatype', '报表过滤项数据类型', 'T', 'Report_Filter_Type', 'F', NULL);
INSERT INTO t_mm_datatype (datatype_id, package_id, datatype_name, isenum, enum_id, built_in, description) VALUES ('Report_Template_Type', 'mm_datatype', '报表模板类型', 'T', 'Report_Template_Type', NULL, NULL);


--
-- TOC entry 2631 (class 0 OID 733731)
-- Dependencies: 375
-- Data for Name: t_mm_dtcombrela; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('VersionArray', 'versioncombobox');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('YES_NO', 'combobox');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('boolean', 'combobox');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('codetype', 'combobox');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('dbtype', 'combobox');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('extractmanner', 'combobox');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('float', 'floatfield');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('frequencyperiod', 'combobox');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('frequencytype', 'combobox');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('integer', 'integerfield');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('loadpolicy', 'combobox');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('readytype', 'combobox');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('sql_datatype', 'combobox');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('string', 'textarea');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('string', 'textfield');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('tabtype', 'combobox');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('targettabtype', 'combobox');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('time', 'datatimefield');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('time', 'datefield');
INSERT INTO t_mm_dtcombrela (datatype_id, comb_id) VALUES ('time', 'timefield');


--
-- TOC entry 2632 (class 0 OID 733734)
-- Dependencies: 376
-- Data for Name: t_mm_editcomb; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO t_mm_editcomb (comb_id, comb_name, description) VALUES ('textfield', '文本框', NULL);
INSERT INTO t_mm_editcomb (comb_id, comb_name, description) VALUES ('floatfield', '浮点数输入框', NULL);
INSERT INTO t_mm_editcomb (comb_id, comb_name, description) VALUES ('datefield', '日期输入控件', NULL);
INSERT INTO t_mm_editcomb (comb_id, comb_name, description) VALUES ('timefield', '时间输入控件', NULL);
INSERT INTO t_mm_editcomb (comb_id, comb_name, description) VALUES ('datatimefield', '日期时间输入控件', NULL);
INSERT INTO t_mm_editcomb (comb_id, comb_name, description) VALUES ('textarea', '多行文本输入域', NULL);
INSERT INTO t_mm_editcomb (comb_id, comb_name, description) VALUES ('versioncombobox', '元数据版本下拉框', NULL);
INSERT INTO t_mm_editcomb (comb_id, comb_name, description) VALUES ('integerfield', '整数输入框', NULL);
INSERT INTO t_mm_editcomb (comb_id, comb_name, description) VALUES ('combobox', '下拉框', NULL);


--
-- TOC entry 2633 (class 0 OID 733740)
-- Dependencies: 377
-- Data for Name: t_mm_enumeration; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO t_mm_enumeration (enum_id, enum_name, built_in, description) VALUES ('T_F', '布尔型', 'F', '真假');
INSERT INTO t_mm_enumeration (enum_id, enum_name, built_in, description) VALUES ('YES_NO', '是否', 'F', '是否');
INSERT INTO t_mm_enumeration (enum_id, enum_name, built_in, description) VALUES ('sql_datatype', '数据类型', 'F', NULL);
INSERT INTO t_mm_enumeration (enum_id, enum_name, built_in, description) VALUES ('readytype', '源系统就绪方式', 'F', NULL);
INSERT INTO t_mm_enumeration (enum_id, enum_name, built_in, description) VALUES ('env_type', '环境类型', 'F', NULL);
INSERT INTO t_mm_enumeration (enum_id, enum_name, built_in, description) VALUES ('dbtype', '数据库类型', 'F', NULL);
INSERT INTO t_mm_enumeration (enum_id, enum_name, built_in, description) VALUES ('tabtype', '表类型', 'F', NULL);
INSERT INTO t_mm_enumeration (enum_id, enum_name, built_in, description) VALUES ('extractmanner', '抽取方式', 'F', NULL);
INSERT INTO t_mm_enumeration (enum_id, enum_name, built_in, description) VALUES ('targettabtype', '目标表说明', 'F', NULL);
INSERT INTO t_mm_enumeration (enum_id, enum_name, built_in, description) VALUES ('INHERIT', '可见性', 'T', NULL);
INSERT INTO t_mm_enumeration (enum_id, enum_name, built_in, description) VALUES ('loadpolicy', '加载策略', 'F', NULL);
INSERT INTO t_mm_enumeration (enum_id, enum_name, built_in, description) VALUES ('codetype', '字段代码类型', 'F', NULL);
INSERT INTO t_mm_enumeration (enum_id, enum_name, built_in, description) VALUES ('frequencyperiod', '抽取周期', 'F', NULL);
INSERT INTO t_mm_enumeration (enum_id, enum_name, built_in, description) VALUES ('frequencytype', '抽取频率类型', 'F', NULL);
INSERT INTO t_mm_enumeration (enum_id, enum_name, built_in, description) VALUES ('Multiplicity', '多重性', 'F', NULL);
INSERT INTO t_mm_enumeration (enum_id, enum_name, built_in, description) VALUES ('Report_Filter_Type', '报表过滤条件类型', 'F', NULL);
INSERT INTO t_mm_enumeration (enum_id, enum_name, built_in, description) VALUES ('Report_Template_Type', '报表模板类型', 'F', NULL);


--
-- TOC entry 2634 (class 0 OID 733746)
-- Dependencies: 378
-- Data for Name: t_mm_enumerationitem; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('private', 'INHERIT', 'private', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('YES', 'YES_NO', '是', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('NO', 'YES_NO', '否', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('BIGINT', 'sql_datatype', 'BIGINT', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('BLOB', 'sql_datatype', 'BLOB', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('CHAR', 'sql_datatype', 'CHAR', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('DATE', 'sql_datatype', 'DATE', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('DECIMAL', 'sql_datatype', 'DECIMAL', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('DOUBLE', 'sql_datatype', 'DOUBLE', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('FLOAT', 'sql_datatype', 'FLOAT', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('INT', 'sql_datatype', 'INT', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('INTEGER', 'sql_datatype', 'INTEGER', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('LONG VARCHAR', 'sql_datatype', 'LONG VARCHAR', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('NUMBER', 'sql_datatype', 'NUMBER', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('NUMERIC', 'sql_datatype', 'NUMERIC', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('REAL', 'sql_datatype', 'REAL', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('SMALLINT', 'sql_datatype', 'SMALLINT', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('TIME', 'sql_datatype', 'TIME', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('TIMESTAMP', 'sql_datatype', 'TIMESTAMP', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('VARCHAR', 'sql_datatype', 'VARCHAR', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('DB2', 'dbtype', 'DB2', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('Sybase', 'dbtype', 'Sybase', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('O: 对时间点不敏感表（参数表、非账户表）', 'tabtype', 'O: 对时间点不敏感表（参数表、非账户表）', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('B：对时间点敏感且不能从历史表获取数据的表（余额类表）', 'tabtype', 'B：对时间点敏感且不能从历史表获取数据的表（余额类表）', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('T：对时间点敏感但可以从历史表获取数据的表（流水类表）', 'tabtype', 'T：对时间点敏感但可以从历史表获取数据的表（流水类表）', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('全量', 'extractmanner', '全量', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('增量', 'extractmanner', '增量', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('01-普通单表映射', 'targettabtype', '01-普通单表映射', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('02-单表加工映射', 'targettabtype', '02-单表加工映射', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('03-多表关联映射', 'targettabtype', '03-多表关联映射', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('04-ODS新创建快照表', 'targettabtype', '04-ODS新创建快照表', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('05-ODS新创建拉练表', 'targettabtype', '05-ODS新创建拉练表', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('06-ODS新创建销户表', 'targettabtype', '06-ODS新创建销户表', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('07-ODS新创建其他表', 'targettabtype', '07-ODS新创建其他表', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('08-创建该表，但日常非本表数据加载', 'targettabtype', '08-创建该表，但日常非本表数据加载', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('09-不创建该表，仅做为初始化数据', 'targettabtype', '09-不创建该表，仅做为初始化数据', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('public', 'INHERIT', 'public', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('protected', 'INHERIT', 'protected', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('10-不创建该表，仅做为日常增量数据', 'targettabtype', '10-不创建该表，仅做为日常增量数据', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('单一代码类型', 'codetype', '单一代码类型', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('组合代码类型', 'codetype', '组合代码类型', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('非代码类型', 'codetype', '非代码类型', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('待定', 'codetype', '待定', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('日', 'frequencyperiod', '日', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('旬', 'frequencyperiod', '旬', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('周', 'frequencyperiod', '周', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('月', 'frequencyperiod', '月', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('年', 'frequencyperiod', '年', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('一次性', 'frequencyperiod', '一次性', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('9-日', 'frequencytype', '9-日', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('1-周', 'frequencytype', '1-周', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('2-旬', 'frequencytype', '2-旬', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('3-月', 'frequencytype', '3-月', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('4-季度', 'frequencytype', '4-季度', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('5-半年', 'frequencytype', '5-半年', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('6-年', 'frequencytype', '6-年', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('7-一次性执行', 'frequencytype', '7-一次性执行', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('II-抽取源系统数据', 'loadpolicy', 'II-抽取源系统数据', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('ODM-主键增量比对', 'loadpolicy', 'ODM-主键增量比对', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('ODM-全字段增量比对', 'loadpolicy', 'ODM-全字段增量比对', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('SDM-清洗转换', 'loadpolicy', 'SDM-清洗转换', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('FDM-全表覆盖加载', 'loadpolicy', 'FDM-全表覆盖加载', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('FDM-UpSert加载', 'loadpolicy', 'FDM-UpSert加载', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('FDM-按日期删除后追加', 'loadpolicy', 'FDM-按日期删除后追加', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('FDM-直接追加加载', 'loadpolicy', 'FDM-直接追加加载', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('FDM-历史拉链加载', 'loadpolicy', 'FDM-历史拉链加载', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('*', 'Multiplicity', '无限多', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('1', 'Multiplicity', '1', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('0', 'Multiplicity', '0', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('2', 'Multiplicity', '2', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('字符串', 'Report_Filter_Type', '字符串', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('日期', 'Report_Filter_Type', '日期', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('时间段', 'Report_Filter_Type', '时间段', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('工作表', 'Report_Template_Type', '工作表', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('线图', 'Report_Template_Type', '线图', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('柱状图', 'Report_Template_Type', '柱状图', NULL);
INSERT INTO t_mm_enumerationitem (enumitem_id, enum_id, enumitem_name, description) VALUES ('饼图', 'Report_Template_Type', '饼图', NULL);


--
-- TOC entry 2635 (class 0 OID 733752)
-- Dependencies: 379
-- Data for Name: t_mm_feature; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('DataSource_STRING_1', 'dbtype', 'DataSource', '数据库类型', 'public', 'F', 'T', 'dbtype', 500, NULL, NULL, NULL, 'F', 'F', 'combobox', '数据库类型', 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('catalog_1', 'defaultCharacterSetName', 'Catalog', '默认字符集名', 'public', 'F', 'T', 'string', 1000, NULL, NULL, NULL, 'T', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('catalog_2', 'defaultCollationName', 'Catalog', '默认校检名称', 'public', 'F', 'T', 'string', 1000, NULL, NULL, NULL, 'T', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('Column_STRING_10', 'isfk', 'Column', '是否外键', 'public', 'F', 'T', 'YES_NO', 200, NULL, NULL, NULL, 'F', 'F', 'combobox', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('Column_STRING_11', 'isUnique', 'Column', '是否业务唯一键', 'public', 'F', 'T', 'YES_NO', 200, NULL, NULL, NULL, 'F', 'F', 'combobox', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('Column_STRING_3', 'ispk', 'Column', '是否主键', 'public', 'F', 'T', 'YES_NO', 200, NULL, NULL, NULL, 'F', 'F', 'combobox', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('column_1', 'initialValue', 'Column', '初始值', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'T', 'F', 'textfield', '或默认值', 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('column_2', 'columnId', 'Column', '顺序', 'public', 'F', 'T', 'integer', NULL, NULL, NULL, NULL, 'T', 'F', 'textfield', '字段顺序', 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('column_5', 'collengths', 'Column', '长度', 'public', 'F', 'T', 'integer', NULL, NULL, NULL, NULL, 'T', 'F', 'textfield', '数值类型时长度=精度+小数位', 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('column_6', 'precision', 'Column', '精度', 'public', 'F', 'T', 'integer', 1000, NULL, NULL, NULL, 'T', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('column_7', 'scale', 'Column', '小数位', NULL, 'F', 'T', 'string', 500, NULL, NULL, NULL, 'T', 'F', 'textfield', '数值类型时用来指定小数位数', 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('column_8', 'sqlSimpleType', 'Column', '类型', 'public', 'F', 'T', 'sql_datatype', 200, NULL, NULL, NULL, 'T', 'F', 'combobox', '数据类型', 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('column_9', 'comment', 'Column', '注释', 'public', 'F', 'T', 'string', 1000, NULL, NULL, NULL, 'T', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('Partition-1', 'composite', 'Partition', '复合', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('Partition-2', 'partition_position', 'Partition', '位置', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('Partition-3', 'tablespace_name', 'Partition', '表空间', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('PrimaryKey-11', 'key_seq', 'PrimaryKey', '主键次序', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('DataSource_STRING_2', 'ip', 'DataSource', 'IP', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('DataSource_STRING_3', 'port', 'DataSource', '端口', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('DataSource_STRING_4', 'schema', 'DataSource', '库', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('SpagoBI_Report_STRING_1', 'template_type', 'SpagoBI_Report', '模板类型', 'public', 'F', 'T', 'Report_Template_Type', 500, NULL, NULL, NULL, 'F', 'F', 'combobox', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('SpagoBI_Report_STRING_2', 'create_username', 'SpagoBI_Report', '制表人', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('SpagoBI_Report_STRING_3', 'create_time', 'SpagoBI_Report', '制表时间', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('SpagoBI_Chart_STRING_1', 'template_type', 'SpagoBI_Chart', '模板类型', 'public', 'F', 'T', 'Report_Template_Type', 500, NULL, NULL, NULL, 'F', 'F', 'combobox', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('SpagoBI_Chart_STRING_2', 'dimension_x', 'SpagoBI_Chart', '维度X轴', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('SpagoBI_Chart_STRING_3', 'dimension_x_name', 'SpagoBI_Chart', '维度X轴中文名', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('SpagoBI_Chart_STRING_4', 'dimension_x2', 'SpagoBI_Chart', '子维度', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('SpagoBI_Chart_STRING_5', 'dimension_x2_name', 'SpagoBI_Chart', '子维度中文名', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('SpagoBI_Chart_STRING_6', 'measure_y', 'SpagoBI_Chart', '度量Y轴', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('SpagoBI_Chart_STRING_7', 'measure_y_name', 'SpagoBI_Chart', '度量Y轴中文名', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('SpagoBI_QueryItem_STRING_1', 'datatype', 'SpagoBI_QueryItem', '数据类型', 'public', 'F', 'T', 'Report_Filter_Type', 500, NULL, NULL, NULL, 'F', 'F', 'combobox', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('Table_STRING_18', 'desc', 'Table', '描述', NULL, 'F', 'T', 'string', 2000, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('table_5', 'tablespace_name', 'Table', '表空间', 'public', 'F', 'T', 'string', 1000, NULL, NULL, NULL, 'T', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('2c93e8a923307cde012330829a9d0001', 'sql', 'View', 'SQL', 'public', 'F', 'T', 'string', 4000, NULL, NULL, NULL, 'F', 'F', 'textarea', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('View_STRING_5', 'ddl', 'View', '视图定义', NULL, 'F', 'T', 'string', 2000, NULL, NULL, NULL, 'F', 'F', 'textarea', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('View_STRING_6', 'start_dt', 'View', '开始时间', NULL, 'F', 'T', 'string', 50, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('View_STRING_7', 'end_dt', 'View', '结束时间', NULL, 'F', 'T', 'string', 50, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('View_STRING_8', 'checkCalendar', 'View', '日历检查标志', NULL, 'F', 'T', 'string', 50, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('catalog_string_3', 'IP', 'Catalog', 'IP地址', 'public', 'F', 'F', 'string', 1000, NULL, NULL, NULL, 'T', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('SpagoBI_DataItem_STRING_1', 'datatype', 'SpagoBI_DataItem', '数据类型', 'public', 'F', 'T', 'Report_Filter_Type', 500, NULL, NULL, NULL, 'F', 'F', 'combobox', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('SpagoBI_DataItem_STRING_2', 'role', 'SpagoBI_DataItem', '角色', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('ColumnMapping_STRING_1', 'targetDB', 'ColumnMapping', '目标数据库', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('ColumnMapping_STRING_10', 'targetTableName', 'ColumnMapping', '目标表中文名', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('ColumnMapping_STRING_11', 'proCode', 'ColumnMapping', '程序名', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('ColumnMapping_STRING_12', 'proName', 'ColumnMapping', '程序中文名', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('ColumnMapping_STRING_13', 'mappingRule', 'ColumnMapping', '映射规则', 'public', 'F', 'T', 'string', 2000, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('ColumnMapping_STRING_14', 'condition', 'ColumnMapping', '关联条件', 'public', 'F', 'T', 'string', 2000, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('ColumnMapping_STRING_2', 'targetTable', 'ColumnMapping', '目标表名', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('ColumnMapping_STRING_3', 'targetColumn', 'ColumnMapping', '目标字段名', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('ColumnMapping_STRING_4', 'targetColumnDesc', 'ColumnMapping', '目标字段描述', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('ColumnMapping_STRING_5', 'sourceDB', 'ColumnMapping', '源数据库', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('ColumnMapping_STRING_6', 'sourceTable', 'ColumnMapping', '源表名', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('ColumnMapping_STRING_7', 'sourceTableName', 'ColumnMapping', '源表中文名', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('ColumnMapping_STRING_8', 'sourceColumn', 'ColumnMapping', '源字段名', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('ColumnMapping_STRING_9', 'sourceColumnDesc', 'ColumnMapping', '源字段描述', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('TableMapping_STRING_10', 'connCondition', 'TableMapping', '数据源连接条件', 'public', 'F', 'T', 'string', 2000, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('TableMapping_STRING_11', 'businessScope', 'TableMapping', '业务范围条件', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('TableMapping_STRING_12', 'filterCondition', 'TableMapping', '数据过滤条件', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('TableMapping_STRING_2', 'targetDB', 'TableMapping', '目标数据库', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('TableMapping_STRING_3', 'targetTable', 'TableMapping', '目标表名', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('TableMapping_STRING_4', 'targetTableName', 'TableMapping', '目标表中文名', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('TableMapping_STRING_5', 'sourceDB', 'TableMapping', '源数据库', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('TableMapping_STRING_6', 'sourceTable', 'TableMapping', '源表名', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('TableMapping_STRING_7', 'sourceTableName', 'TableMapping', '源表中文名', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('TableMapping_STRING_8', 'proName', 'TableMapping', '程序中文名', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('TableMapping_STRING_9', 'proCode', 'TableMapping', '程序名', 'public', 'F', 'T', 'string', 500, NULL, NULL, NULL, 'F', 'F', 'textfield', NULL, 1, NULL);
INSERT INTO t_mm_feature (att_id, att_code, classifier_id, att_name, inherit_flag, isread, is_null, datatype_id, att_length, att_max, att_min, precision_digit, isshow, iskey, comb_id, description, featureid, sortlevel) VALUES ('column_4', 'isNullable', 'Column', '是否可空', 'public', 'F', 'T', 'YES_NO', 200, NULL, NULL, NULL, 'T', 'F', 'combobox', NULL, 1, NULL);


--
-- TOC entry 2636 (class 0 OID 733758)
-- Dependencies: 380
-- Data for Name: t_mm_featurecol; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('DataSource_STRING_1', 'DataSource', 'STRING_1');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('catalog_1', 'Catalog', 'string_1');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('catalog_2', 'Catalog', 'string_2');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('Column_STRING_10', 'Column', 'STRING_10');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('Column_STRING_11', 'Column', 'STRING_11');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('Column_STRING_3', 'Column', 'STRING_3');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('column_1', 'Column', 'string_1');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('column_2', 'Column', 'string_2');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('column_4', 'Column', 'string_4');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('column_5', 'Column', 'string_5');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('column_6', 'Column', 'string_6');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('column_7', 'Column', 'string_7');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('column_8', 'Column', 'string_8');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('column_9', 'Column', 'string_9');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('Partition-1', 'Partition', 'STRING_1');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('Partition-2', 'Partition', 'STRING_2');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('Partition-3', 'Partition', 'STRING_3');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('PrimaryKey-11', 'PrimaryKey', 'STRING_11');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('DataSource_STRING_2', 'DataSource', 'STRING_2');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('DataSource_STRING_3', 'DataSource', 'STRING_3');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('DataSource_STRING_4', 'DataSource', 'STRING_4');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('SpagoBI_Report_STRING_1', 'SpagoBI_Report', 'STRING_1');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('SpagoBI_Report_STRING_2', 'SpagoBI_Report', 'STRING_2');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('SpagoBI_Report_STRING_3', 'SpagoBI_Report', 'STRING_3');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('SpagoBI_Chart_STRING_1', 'SpagoBI_Chart', 'STRING_1');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('SpagoBI_Chart_STRING_2', 'SpagoBI_Chart', 'STRING_2');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('SpagoBI_Chart_STRING_3', 'SpagoBI_Chart', 'STRING_3');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('SpagoBI_Chart_STRING_4', 'SpagoBI_Chart', 'STRING_4');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('SpagoBI_Chart_STRING_5', 'SpagoBI_Chart', 'STRING_5');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('SpagoBI_Chart_STRING_6', 'SpagoBI_Chart', 'STRING_6');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('SpagoBI_Chart_STRING_7', 'SpagoBI_Chart', 'STRING_7');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('SpagoBI_QueryItem_STRING_1', 'SpagoBI_QueryItem', 'STRING_1');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('SpagoBI_DataItem_STRING_2', 'SpagoBI_DataItem', 'STRING_2');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('SpagoBI_DataItem_STRING_1', 'SpagoBI_DataItem', 'STRING_1');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('Table_STRING_18', 'Table', 'STRING_18');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('table_5', 'Table', 'string_5');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('2c93e8a923307cde012330829a9d0001', 'View', 'STRING_1');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('View_STRING_5', 'View', 'STRING_5');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('View_STRING_6', 'View', 'STRING_6');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('View_STRING_7', 'View', 'STRING_7');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('View_STRING_8', 'View', 'STRING_8');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('catalog_string_3', 'Catalog', 'string_3');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('ColumnMapping_STRING_1', 'ColumnMapping', 'STRING_1');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('ColumnMapping_STRING_10', 'ColumnMapping', 'STRING_10');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('ColumnMapping_STRING_11', 'ColumnMapping', 'STRING_11');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('ColumnMapping_STRING_12', 'ColumnMapping', 'STRING_12');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('ColumnMapping_STRING_13', 'ColumnMapping', 'STRING_13');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('ColumnMapping_STRING_14', 'ColumnMapping', 'STRING_14');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('ColumnMapping_STRING_2', 'ColumnMapping', 'STRING_2');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('ColumnMapping_STRING_3', 'ColumnMapping', 'STRING_3');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('ColumnMapping_STRING_4', 'ColumnMapping', 'STRING_4');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('ColumnMapping_STRING_5', 'ColumnMapping', 'STRING_5');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('ColumnMapping_STRING_6', 'ColumnMapping', 'STRING_6');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('ColumnMapping_STRING_7', 'ColumnMapping', 'STRING_7');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('ColumnMapping_STRING_8', 'ColumnMapping', 'STRING_8');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('ColumnMapping_STRING_9', 'ColumnMapping', 'STRING_9');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('TableMapping_STRING_10', 'TableMapping', 'STRING_10');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('TableMapping_STRING_11', 'TableMapping', 'STRING_11');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('TableMapping_STRING_12', 'TableMapping', 'STRING_12');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('TableMapping_STRING_2', 'TableMapping', 'STRING_2');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('TableMapping_STRING_3', 'TableMapping', 'STRING_3');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('TableMapping_STRING_4', 'TableMapping', 'STRING_4');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('TableMapping_STRING_5', 'TableMapping', 'STRING_5');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('TableMapping_STRING_6', 'TableMapping', 'STRING_6');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('TableMapping_STRING_7', 'TableMapping', 'STRING_7');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('TableMapping_STRING_8', 'TableMapping', 'STRING_8');
INSERT INTO t_mm_featurecol (att_id, classifier_id, att_store) VALUES ('TableMapping_STRING_9', 'TableMapping', 'STRING_9');


--
-- TOC entry 2637 (class 0 OID 733764)
-- Dependencies: 381
-- Data for Name: t_mm_inherit; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO t_mm_inherit (classifier_id, owner_classifierid, parent, pathnum) VALUES ('Classifier', 'Element', 'F', 1);
INSERT INTO t_mm_inherit (classifier_id, owner_classifierid, parent, pathnum) VALUES ('Classifier', 'ModelElement', 'T', 1);
INSERT INTO t_mm_inherit (classifier_id, owner_classifierid, parent, pathnum) VALUES ('Column', 'Classifier', 'F', 1);
INSERT INTO t_mm_inherit (classifier_id, owner_classifierid, parent, pathnum) VALUES ('Table', 'Classifier', 'F', 1);
INSERT INTO t_mm_inherit (classifier_id, owner_classifierid, parent, pathnum) VALUES ('View', 'Classifier', 'F', 1);


--
-- TOC entry 2638 (class 0 OID 733767)
-- Dependencies: 382
-- Data for Name: t_mm_package; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO t_mm_package (package_id, package_name, owner_pid, description) VALUES ('cwm_core', '核心包', 'mm_core', NULL);
INSERT INTO t_mm_package (package_id, package_name, owner_pid, description) VALUES ('cwm_relational', '关系型包', 'mm_core', NULL);
INSERT INTO t_mm_package (package_id, package_name, owner_pid, description) VALUES ('mm_SpagoBI', 'SpagoBI包', 'mm_3part', NULL);
INSERT INTO t_mm_package (package_id, package_name, owner_pid, description) VALUES ('mm_mapping', 'Mapping包', 'mm_core', NULL);
INSERT INTO t_mm_package (package_id, package_name, owner_pid, description) VALUES ('mm_3part', '三方应用包', 'mm_3part', NULL);


--
-- TOC entry 2625 (class 0 OID 733679)
-- Dependencies: 369
-- Data for Name: t_mm_relation_comp; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO t_mm_relation_comp (rel_id, rel_name, from_classifier_id, owner_multiplicity, to_classifierid, to_multiplicity, description) VALUES ('Comp-SpagoBI_Model-SpagoBI_Measure', 'Comp-SpagoBI_Model-SpagoBI_Measure', 'SpagoBI_Model', '1 ', 'SpagoBI_Measure', '* ', NULL);
INSERT INTO t_mm_relation_comp (rel_id, rel_name, from_classifier_id, owner_multiplicity, to_classifierid, to_multiplicity, description) VALUES ('Comp-SpagoBI_Model-SpagoBI_Dimension', 'Comp-SpagoBI_Model-SpagoBI_Dimension', 'SpagoBI_Model', '1 ', 'SpagoBI_Dimension', '* ', NULL);
INSERT INTO t_mm_relation_comp (rel_id, rel_name, from_classifier_id, owner_multiplicity, to_classifierid, to_multiplicity, description) VALUES ('Comp-SpagoBI_Report-SpagoBI_DataItem', 'Comp-SpagoBI_Report-SpagoBI_DataItem', 'SpagoBI_Report', '1 ', 'SpagoBI_DataItem', '* ', NULL);
INSERT INTO t_mm_relation_comp (rel_id, rel_name, from_classifier_id, owner_multiplicity, to_classifierid, to_multiplicity, description) VALUES ('Comp-SpagoBI_Chart-SpagoBI_DataItem', 'Comp-SpagoBI_Chart-SpagoBI_DataItem', 'SpagoBI_Chart', '1 ', 'SpagoBI_DataItem', '* ', NULL);
INSERT INTO t_mm_relation_comp (rel_id, rel_name, from_classifier_id, owner_multiplicity, to_classifierid, to_multiplicity, description) VALUES ('Comp-DataSource-Table', 'Comp-DataSource-Table', 'DataSource', '1 ', 'Table', '* ', NULL);
INSERT INTO t_mm_relation_comp (rel_id, rel_name, from_classifier_id, owner_multiplicity, to_classifierid, to_multiplicity, description) VALUES ('Comp-DataSource-View', 'Comp-DataSource-View', 'DataSource', '1 ', 'View', '* ', NULL);
INSERT INTO t_mm_relation_comp (rel_id, rel_name, from_classifier_id, owner_multiplicity, to_classifierid, to_multiplicity, description) VALUES ('Comp-Table-ForeignKey', '表组合外键', 'Table', '1 ', 'ForeignKey', '* ', NULL);
INSERT INTO t_mm_relation_comp (rel_id, rel_name, from_classifier_id, owner_multiplicity, to_classifierid, to_multiplicity, description) VALUES ('Comp-Table-Partition', '表组合表分区', 'Table', '1 ', 'Partition', '* ', NULL);
INSERT INTO t_mm_relation_comp (rel_id, rel_name, from_classifier_id, owner_multiplicity, to_classifierid, to_multiplicity, description) VALUES ('Comp-Table-PrimaryKey', '表和主键', 'Table', '1 ', 'PrimaryKey', '* ', NULL);
INSERT INTO t_mm_relation_comp (rel_id, rel_name, from_classifier_id, owner_multiplicity, to_classifierid, to_multiplicity, description) VALUES ('Comp-Table-Column', 'Table和Column的组合关系', 'Table', '1 ', 'Column', '* ', NULL);
INSERT INTO t_mm_relation_comp (rel_id, rel_name, from_classifier_id, owner_multiplicity, to_classifierid, to_multiplicity, description) VALUES ('Comp-View-Column', '视图组合字段', 'View', '1 ', 'Column', '* ', NULL);
INSERT INTO t_mm_relation_comp (rel_id, rel_name, from_classifier_id, owner_multiplicity, to_classifierid, to_multiplicity, description) VALUES ('Comp-Transformation-TableMapping', 'Comp-Transformation-TableMapping', 'Transformation', '1 ', 'TableMapping', '* ', NULL);
INSERT INTO t_mm_relation_comp (rel_id, rel_name, from_classifier_id, owner_multiplicity, to_classifierid, to_multiplicity, description) VALUES ('Comp-TableMapping-ColumnMapping', 'Comp-TableMapping-ColumnMapping', 'TableMapping', '1 ', 'ColumnMapping', '* ', NULL);


--
-- TOC entry 2639 (class 0 OID 733773)
-- Dependencies: 383
-- Data for Name: t_mm_relation_dep; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Dep-SpagoBI_DataItem-SpagoBI_Measure', '报表数据项依赖的度量', 'SpagoBI_DataItem', NULL, 'SpagoBI_Measure', NULL, NULL);
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('UniqueKeyRelationship', '相关的唯一键', 'KeyRelationship', NULL, 'UniqueKey', NULL, NULL);
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Dep-Catalog-source-Catalog-target', '相关的目录', 'Catalog', 'source', 'Catalog', 'target', NULL);
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Column_Column', '相关的字段', 'Column', 'reportDep', 'Column', 'reportDeped', NULL);
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Dep-Column-CheckConstraint', '字段级约束', 'Column', NULL, 'CheckConstraint', NULL, NULL);
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Dep-Column-ForeignKey-target', '相关的外键', 'Column', NULL, 'ForeignKey', 'target', NULL);
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Dep-Column-InfoItem', '相关的信息项', 'Column', NULL, 'InfoItem', NULL, NULL);
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Dep-Column-Pc86Targetfield', 'Dep-Column-Pc86TargetInstance', 'Column', 'reportDep', 'Pc86Targetfield', 'reportDeped', NULL);
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Dep-Column-Relationship', '相关的ER关系', 'Column', NULL, 'Relationship', NULL, '字段指向父ER关系');
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Dep-Column-ValidationRule', '相关的校验规则', 'Column', NULL, 'ValidationRule', NULL, '字段指向校验规则');
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Dep-ForeignKey-Column-source', '相关的字段', 'ForeignKey', NULL, 'Column', 'source', NULL);
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Dep-NamedColumnSet-CheckConstraint', '表级约束', 'NamedColumnSet', NULL, 'CheckConstraint', NULL, NULL);
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Dep-PrimaryKey-Column', '相关的字段', 'PrimaryKey', NULL, 'Column', NULL, NULL);
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Dep-Table-Trigger', '表的触发器', 'Table', NULL, 'Trigger', NULL, NULL);
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Dep-View-View', '相关的视图', 'View', 'reportDep', 'View', 'reportDeped', NULL);
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Dep-SpagoBI_Report-SpagoBI_Model', '报表依赖的模型', 'SpagoBI_Report', NULL, 'SpagoBI_Model', NULL, NULL);
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Dep-SpagoBI_Model-Table', '模型依赖的数据表', 'SpagoBI_Model', NULL, 'Table', NULL, NULL);
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Dep-SpagoBI_Dimension-Column', '维度依赖的列', 'SpagoBI_Dimension', NULL, 'Column', NULL, NULL);
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Dep-SpagoBI_Measure-Column', '度量依赖的列', 'SpagoBI_Measure', NULL, 'Column', NULL, NULL);
INSERT INTO t_mm_relation_dep (rel_id, rel_name, from_classifier_id, frole_id, to_classifierid, trole_id, description) VALUES ('Dep-SpagoBI_DataItem-SpagoBI_Dimension', '报表数据项依赖的维度', 'SpagoBI_DataItem', NULL, 'SpagoBI_Dimension', NULL, NULL);


--
-- TOC entry 2610 (class 2606 OID 733676)
-- Dependencies: 368 368 368 368
-- Name: ins_md_unique; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY t_md_instance
    ADD CONSTRAINT ins_md_unique UNIQUE (instance_code, classifier_id, parent_id);


--
-- TOC entry 2612 (class 2606 OID 733678)
-- Dependencies: 368 368
-- Name: ins_md_unique_path; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY t_md_instance
    ADD CONSTRAINT ins_md_unique_path UNIQUE (path);


--
-- TOC entry 2614 (class 2606 OID 733674)
-- Dependencies: 368 368
-- Name: pk_minstance; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY t_md_instance
    ADD CONSTRAINT pk_minstance PRIMARY KEY (instance_id);


--
-- TOC entry 2618 (class 2606 OID 733694)
-- Dependencies: 370 370 370 370
-- Name: pk_t_md_composition; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY t_md_composition
    ADD CONSTRAINT pk_t_md_composition PRIMARY KEY (father_instance_id, child_instance_id, relationship);


--
-- TOC entry 2616 (class 2606 OID 733686)
-- Dependencies: 369 369
-- Name: pk_t_mm_comp; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY t_mm_relation_comp
    ADD CONSTRAINT pk_t_mm_comp PRIMARY KEY (rel_id);


--
-- TOC entry 2620 (class 2606 OID 733780)
-- Dependencies: 379 379 379
-- Name: t_mm_feature_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY t_mm_feature
    ADD CONSTRAINT t_mm_feature_pkey PRIMARY KEY (att_id, classifier_id);


--
-- TOC entry 2602 (class 1259 OID 733666)
-- Dependencies: 368
-- Name: idx_md_instance1; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX idx_md_instance1 ON t_md_instance USING btree (instance_code);


--
-- TOC entry 2603 (class 1259 OID 733667)
-- Dependencies: 368
-- Name: idx_md_instance2; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX idx_md_instance2 ON t_md_instance USING btree (instance_name);


--
-- TOC entry 2604 (class 1259 OID 733668)
-- Dependencies: 368
-- Name: idx_md_instance3; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE UNIQUE INDEX idx_md_instance3 ON t_md_instance USING btree (namespace);


--
-- TOC entry 2605 (class 1259 OID 733669)
-- Dependencies: 368
-- Name: idx_md_instance4; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX idx_md_instance4 ON t_md_instance USING btree (classifier_id);


--
-- TOC entry 2606 (class 1259 OID 733670)
-- Dependencies: 368
-- Name: idx_md_instance5; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX idx_md_instance5 ON t_md_instance USING btree (parent_id);


--
-- TOC entry 2607 (class 1259 OID 733671)
-- Dependencies: 368 368
-- Name: idx_md_instance6; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX idx_md_instance6 ON t_md_instance USING btree (upper((instance_code)::text));


--
-- TOC entry 2608 (class 1259 OID 733672)
-- Dependencies: 368 368
-- Name: idx_md_instance7; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX idx_md_instance7 ON t_md_instance USING btree (upper((instance_name)::text));


--
-- TOC entry 2621 (class 2606 OID 733695)
-- Dependencies: 370 2613 368
-- Name: fk_child_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY t_md_composition
    ADD CONSTRAINT fk_child_id FOREIGN KEY (child_instance_id) REFERENCES t_md_instance(instance_id);


--
-- TOC entry 2622 (class 2606 OID 733700)
-- Dependencies: 368 370 2613
-- Name: fk_father_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY t_md_composition
    ADD CONSTRAINT fk_father_id FOREIGN KEY (father_instance_id) REFERENCES t_md_instance(instance_id);


--
-- TOC entry 2623 (class 2606 OID 733705)
-- Dependencies: 369 2615 370
-- Name: fk_relationship; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY t_md_composition
    ADD CONSTRAINT fk_relationship FOREIGN KEY (relationship) REFERENCES t_mm_relation_comp(rel_id);


-- Completed on 2016-11-28 15:24:06

--
-- PostgreSQL database dump complete
--

