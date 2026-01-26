--
-- PostgreSQL database dump
--

\restrict bn8hLHzbhcRsGfp8jbFVNka58HjeYmPZaME8bMURgFdABWkht67ngP658ajvgDo

-- Dumped from database version 17.6 (Ubuntu 17.6-1.pgdg22.04+1)
-- Dumped by pg_dump version 17.6 (Ubuntu 17.6-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: exercises; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exercises (
    _id character varying(40) NOT NULL,
    description character varying(500) NOT NULL,
    duration character varying(20) NOT NULL,
    date date
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    _id character varying(40) NOT NULL,
    username character varying(40)
);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: exercises exercises_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_id_fkey FOREIGN KEY (_id) REFERENCES public.users(_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict bn8hLHzbhcRsGfp8jbFVNka58HjeYmPZaME8bMURgFdABWkht67ngP658ajvgDo

