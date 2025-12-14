CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "public";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'staff',
    'user',
    'marketeer'
);


--
-- Name: get_player_name_by_email(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_player_name_by_email(_email text) RETURNS text
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT name 
  FROM players 
  WHERE email = _email
  LIMIT 1;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;


--
-- Name: notify_new_concept(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_new_concept() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Simply return NEW without making HTTP calls
  -- Notifications will be handled by the application layer
  RETURN NEW;
END;
$$;


--
-- Name: notify_new_player_analysis(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_new_player_analysis() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Simply return NEW without making HTTP calls
  -- Notifications will be handled by the application layer
  RETURN NEW;
END;
$$;


--
-- Name: notify_new_program(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_new_program() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Simply return NEW without making HTTP calls
  -- Notifications will be handled by the application layer
  RETURN NEW;
END;
$$;


--
-- Name: notify_new_update(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_new_update() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Simply return NEW without making HTTP calls
  -- Notifications will be handled by the application layer
  RETURN NEW;
END;
$$;


--
-- Name: setup_app_settings(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.setup_app_settings() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Placeholder function for future use if needed
  NULL;
END;
$$;


--
-- Name: update_performance_statistics_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_performance_statistics_updated_at() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: action_r90_category_mappings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.action_r90_category_mappings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    action_type text NOT NULL,
    r90_category text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    r90_subcategory text,
    selected_rating_ids uuid[]
);


--
-- Name: analyses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analyses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    analysis_type text NOT NULL,
    title text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    home_team text,
    away_team text,
    key_details text,
    opposition_strengths text,
    opposition_weaknesses text,
    matchups jsonb DEFAULT '[]'::jsonb,
    scheme_title text,
    scheme_paragraph_1 text,
    scheme_paragraph_2 text,
    scheme_image_url text,
    player_image_url text,
    strengths_improvements text,
    concept text,
    explanation text,
    points jsonb DEFAULT '[]'::jsonb,
    home_score integer,
    away_score integer,
    fixture_id uuid,
    match_date date,
    home_team_logo text,
    away_team_logo text,
    selected_scheme text,
    starting_xi jsonb DEFAULT '[]'::jsonb,
    kit_primary_color text DEFAULT '#FFD700'::text,
    kit_secondary_color text DEFAULT '#000000'::text,
    match_image_url text,
    home_team_bg_color text DEFAULT '#1a1a1a'::text,
    away_team_bg_color text DEFAULT '#8B0000'::text,
    video_url text,
    CONSTRAINT analyses_analysis_type_check CHECK ((analysis_type = ANY (ARRAY['pre-match'::text, 'post-match'::text, 'concept'::text])))
);


--
-- Name: analysis_point_examples; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analysis_point_examples (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category text NOT NULL,
    title text,
    paragraph_1 text,
    paragraph_2 text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    example_type text DEFAULT 'point'::text NOT NULL,
    content text,
    CONSTRAINT analysis_point_examples_category_check CHECK ((category = ANY (ARRAY['pre-match'::text, 'post-match'::text, 'concept'::text, 'other'::text, 'scheme'::text]))),
    CONSTRAINT analysis_point_examples_example_type_check CHECK ((example_type = ANY (ARRAY['point'::text, 'overview'::text])))
);


--
-- Name: bank_details; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bank_details (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    bank_name text,
    account_name text,
    account_number text,
    sort_code text,
    iban text,
    swift_bic text,
    paypal_email text,
    payment_type text NOT NULL,
    notes text,
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT bank_details_payment_type_check CHECK ((payment_type = ANY (ARRAY['bank_transfer'::text, 'paypal'::text, 'card'::text, 'other'::text])))
);


--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    excerpt text,
    author_id uuid NOT NULL,
    published boolean DEFAULT false,
    image_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    category text
);


--
-- Name: club_map_positions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.club_map_positions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    club_name text NOT NULL,
    country text,
    x_position numeric,
    y_position numeric,
    image_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: club_network_contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.club_network_contacts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    club_name text,
    "position" text,
    email text,
    phone text,
    country text,
    city text,
    latitude numeric,
    longitude numeric,
    image_url text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    x_position numeric,
    y_position numeric
);


--
-- Name: club_outreach; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.club_outreach (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_id uuid NOT NULL,
    club_name text NOT NULL,
    contact_name text,
    contact_role text,
    status text DEFAULT 'contacted'::text NOT NULL,
    latest_update text,
    latest_update_date timestamp with time zone,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: club_outreach_updates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.club_outreach_updates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    outreach_id uuid NOT NULL,
    update_text text NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: coaching_analysis; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coaching_analysis (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    content text,
    analysis_type text,
    category text,
    tags text[],
    attachments jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: coaching_aphorisms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coaching_aphorisms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    featured_text text DEFAULT ''::text NOT NULL,
    body_text text DEFAULT ''::text,
    author text
);


--
-- Name: coaching_chat_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coaching_chat_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text DEFAULT 'New Chat'::text NOT NULL,
    messages jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: coaching_drills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coaching_drills (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    content text,
    setup text,
    equipment text,
    players_required text,
    category text,
    tags text[],
    attachments jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: coaching_exercises; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coaching_exercises (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    content text,
    sets integer,
    reps text,
    rest_time integer,
    category text,
    tags text[],
    attachments jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    load text,
    video_url text,
    is_own_video boolean DEFAULT false
);


--
-- Name: coaching_programmes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coaching_programmes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    content text,
    weeks integer,
    category text,
    tags text[],
    attachments jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: coaching_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coaching_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    duration integer,
    category text,
    tags text[],
    attachments jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    exercises jsonb DEFAULT '[]'::jsonb
);


--
-- Name: component_locks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.component_locks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    component_name text NOT NULL,
    component_path text,
    is_locked boolean DEFAULT false NOT NULL,
    locked_by uuid,
    locked_at timestamp with time zone,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: email_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: fixtures; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fixtures (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    home_team text NOT NULL,
    away_team text NOT NULL,
    home_score integer,
    away_score integer,
    match_date date NOT NULL,
    competition text,
    venue text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: form_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.form_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    form_type text NOT NULL,
    data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: formation_positions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.formation_positions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    formation text NOT NULL,
    positions jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: highlight_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.highlight_projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    player_id uuid,
    playlist_id uuid,
    clips jsonb DEFAULT '[]'::jsonb,
    settings jsonb DEFAULT '{}'::jsonb,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: homepage_videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.homepage_videos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    playlist_name text DEFAULT '3D Portfolio'::text NOT NULL,
    video_url text NOT NULL,
    video_title text NOT NULL,
    order_position integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_id uuid NOT NULL,
    invoice_number text NOT NULL,
    invoice_date date NOT NULL,
    due_date date NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'EUR'::text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    description text,
    pdf_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    billing_month text,
    amount_paid numeric DEFAULT 0,
    converted_amount numeric,
    converted_currency text,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['pending'::text, 'paid'::text, 'overdue'::text, 'cancelled'::text])))
);


--
-- Name: legal_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legal_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    content text,
    category text NOT NULL,
    file_url text,
    effective_date date,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT legal_documents_category_check CHECK ((category = ANY (ARRAY['contract'::text, 'regulation'::text])))
);


--
-- Name: marketing_campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marketing_campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    start_date date NOT NULL,
    end_date date,
    status text DEFAULT 'draft'::text NOT NULL,
    platform text[] DEFAULT ARRAY[]::text[] NOT NULL,
    target_audience text,
    goals text,
    budget numeric(10,2),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT marketing_campaigns_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'active'::text, 'completed'::text, 'cancelled'::text])))
);


--
-- Name: marketing_gallery; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marketing_gallery (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    file_url text NOT NULL,
    file_type text NOT NULL,
    thumbnail_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    category text DEFAULT 'other'::text NOT NULL,
    player_id uuid,
    CONSTRAINT marketing_gallery_category_check CHECK ((category = ANY (ARRAY['brand'::text, 'players'::text, 'other'::text]))),
    CONSTRAINT marketing_gallery_file_type_check CHECK ((file_type = ANY (ARRAY['image'::text, 'video'::text])))
);


--
-- Name: marketing_ideas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marketing_ideas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    status text DEFAULT 'pending'::text NOT NULL,
    category text,
    canva_link text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: marketing_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marketing_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    recipient_type text NOT NULL,
    message_title text NOT NULL,
    message_content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: notification_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_id uuid NOT NULL,
    performance_reports boolean DEFAULT true NOT NULL,
    analyses boolean DEFAULT true NOT NULL,
    programmes boolean DEFAULT true NOT NULL,
    highlights boolean DEFAULT true NOT NULL,
    clips boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: open_access_issues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.open_access_issues (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    month date NOT NULL,
    canva_draft_link text,
    published boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: open_access_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.open_access_pages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    issue_id uuid NOT NULL,
    page_number integer NOT NULL,
    image_url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    display_order integer DEFAULT 0 NOT NULL
);


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type text NOT NULL,
    amount numeric NOT NULL,
    currency text DEFAULT 'GBP'::text NOT NULL,
    description text,
    payment_method text,
    reference text,
    invoice_id uuid,
    player_id uuid,
    payment_date date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT payments_type_check CHECK ((type = ANY (ARRAY['in'::text, 'out'::text])))
);


--
-- Name: performance_report_actions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.performance_report_actions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    analysis_id uuid NOT NULL,
    action_number integer NOT NULL,
    minute numeric,
    action_score numeric,
    action_type text,
    action_description text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    zone integer,
    is_successful boolean DEFAULT true,
    CONSTRAINT performance_report_actions_zone_check CHECK (((zone >= 1) AND (zone <= 18)))
);


--
-- Name: performance_statistics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.performance_statistics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    stat_name text NOT NULL,
    stat_key text NOT NULL,
    positions text[] DEFAULT '{}'::text[] NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: player_analysis; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player_analysis (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_id uuid NOT NULL,
    analysis_date date NOT NULL,
    r90_score numeric(4,2),
    pdf_url text,
    video_url text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    opponent text,
    result text,
    minutes_played integer,
    striker_stats jsonb,
    analysis_writer_id uuid,
    fixture_id uuid,
    performance_overview text
);


--
-- Name: player_club_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player_club_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_id uuid NOT NULL,
    club_name text NOT NULL,
    contact_name text,
    contact_role text,
    notes text,
    status text DEFAULT 'contacted'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: player_fixtures; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player_fixtures (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_id uuid NOT NULL,
    fixture_id uuid NOT NULL,
    minutes_played integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: player_hidden_stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player_hidden_stats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_id uuid NOT NULL,
    stat_key text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: player_other_analysis; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player_other_analysis (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_id uuid NOT NULL,
    analysis_id uuid NOT NULL,
    assigned_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: player_outreach_pro; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player_outreach_pro (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_name text NOT NULL,
    ig_handle text,
    messaged boolean DEFAULT false,
    response_received boolean DEFAULT false,
    initial_message text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    age integer,
    date_of_birth date,
    "position" text,
    current_club text,
    nationality text
);


--
-- Name: player_outreach_youth; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player_outreach_youth (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_name text NOT NULL,
    ig_handle text,
    messaged boolean DEFAULT false,
    response_received boolean DEFAULT false,
    parents_name text,
    parent_contact text,
    parent_approval boolean DEFAULT false,
    initial_message text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    age integer,
    date_of_birth date,
    "position" text,
    current_club text,
    nationality text
);


--
-- Name: player_programs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player_programs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_id uuid NOT NULL,
    program_name text NOT NULL,
    is_current boolean DEFAULT false NOT NULL,
    phase_name text,
    phase_dates text,
    phase_image_url text,
    player_image_url text,
    overview_text text,
    sessions jsonb DEFAULT '{}'::jsonb,
    weekly_schedules jsonb DEFAULT '[]'::jsonb,
    schedule_notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    display_order integer DEFAULT 0,
    end_date date
);


--
-- Name: player_stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player_stats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_id uuid NOT NULL,
    goals integer DEFAULT 0,
    assists integer DEFAULT 0,
    matches integer DEFAULT 0,
    minutes integer DEFAULT 0,
    clean_sheets integer,
    saves integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: player_test_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player_test_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_id uuid NOT NULL,
    test_name text NOT NULL,
    test_category text NOT NULL,
    score text NOT NULL,
    notes text,
    test_date date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'submitted'::text NOT NULL
);


--
-- Name: players; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.players (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    "position" text NOT NULL,
    age integer NOT NULL,
    nationality text NOT NULL,
    bio text,
    image_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    email text,
    visible_on_stars_page boolean DEFAULT false,
    highlights jsonb DEFAULT '[]'::jsonb,
    category text DEFAULT 'Other'::text,
    representation_status text DEFAULT 'other'::text,
    club text,
    club_logo text,
    links jsonb DEFAULT '[]'::jsonb,
    hover_image_url text,
    league text,
    highlighted_match jsonb,
    preferred_currency text DEFAULT 'GBP'::text,
    contracts_password text DEFAULT '12345'::text,
    transfer_status text DEFAULT 'actively_marketed'::text,
    transfer_priority text DEFAULT 'standard'::text,
    agent_notes text,
    next_program_notes text,
    CONSTRAINT players_category_check CHECK ((category = ANY (ARRAY['Signed'::text, 'Mandate'::text, 'Fuel For Football'::text, 'Previously Mandated'::text, 'Scouted'::text, 'Other'::text]))),
    CONSTRAINT players_representation_status_check CHECK ((representation_status = ANY (ARRAY['represented'::text, 'mandated'::text, 'other'::text])))
);


--
-- Name: players_public; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.players_public AS
 SELECT id,
    name,
    "position",
    age,
    nationality,
    bio,
    image_url,
    category,
    representation_status,
    visible_on_stars_page,
    highlights,
    created_at,
    updated_at
   FROM public.players;


--
-- Name: playlists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.playlists (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_id uuid NOT NULL,
    name text NOT NULL,
    clips jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: positional_guide_media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.positional_guide_media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    guide_id uuid,
    "position" character varying(10) NOT NULL,
    phase character varying(100) NOT NULL,
    subcategory character varying(100) NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    layout character varying(20) DEFAULT '1x1'::character varying NOT NULL,
    images jsonb DEFAULT '[]'::jsonb,
    video_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: positional_guide_points; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.positional_guide_points (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "position" text NOT NULL,
    phase text NOT NULL,
    subcategory text NOT NULL,
    title text NOT NULL,
    paragraphs text[] DEFAULT '{}'::text[],
    image_layout text DEFAULT '1-1'::text,
    images jsonb DEFAULT '[]'::jsonb,
    video_url text,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: positional_guides; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.positional_guides (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "position" text NOT NULL,
    phase text NOT NULL,
    subcategory text NOT NULL,
    content text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text,
    full_name text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: prospects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.prospects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    age integer,
    "position" text,
    nationality text,
    current_club text,
    age_group text NOT NULL,
    stage text DEFAULT 'scouted'::text NOT NULL,
    profile_image_url text,
    contact_email text,
    contact_phone text,
    notes text,
    last_contact_date date,
    priority text,
    CONSTRAINT prospects_age_group_check CHECK ((age_group = ANY (ARRAY['A'::text, 'B'::text, 'C'::text, 'D'::text]))),
    CONSTRAINT prospects_priority_check CHECK ((priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]))),
    CONSTRAINT prospects_stage_check CHECK ((stage = ANY (ARRAY['scouted'::text, 'connected'::text, 'rapport_building'::text, 'rising'::text, 'rise'::text])))
);


--
-- Name: psychological_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.psychological_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    content text,
    duration integer,
    category text,
    tags text[],
    attachments jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: push_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.push_config (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    public_key text NOT NULL,
    private_key text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: push_notification_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.push_notification_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_id uuid NOT NULL,
    token text NOT NULL,
    device_type text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: r90_ratings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.r90_ratings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    content text,
    category text,
    tags text[],
    attachments jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    subcategory text,
    score text
);


--
-- Name: scout_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scout_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    priority text DEFAULT 'normal'::text NOT NULL,
    visible_to_scouts boolean DEFAULT true NOT NULL
);


--
-- Name: scouting_report_drafts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scouting_report_drafts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    scout_id uuid,
    player_name text NOT NULL,
    "position" text,
    age integer,
    current_club text,
    nationality text,
    competition text,
    skill_evaluations jsonb DEFAULT '[]'::jsonb,
    strengths text,
    weaknesses text,
    summary text,
    recommendation text,
    video_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: scouting_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scouting_reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_name text NOT NULL,
    age integer,
    "position" text,
    current_club text,
    nationality text,
    date_of_birth date,
    height_cm integer,
    preferred_foot text,
    scout_name text,
    scouting_date date DEFAULT CURRENT_DATE NOT NULL,
    location text,
    competition text,
    match_context text,
    overall_rating numeric,
    technical_rating numeric,
    physical_rating numeric,
    tactical_rating numeric,
    mental_rating numeric,
    strengths text,
    weaknesses text,
    summary text,
    potential_assessment text,
    recommendation text,
    video_url text,
    profile_image_url text,
    contact_email text,
    contact_phone text,
    agent_name text,
    agent_contact text,
    status text DEFAULT 'pending'::text NOT NULL,
    priority text,
    added_to_prospects boolean DEFAULT false,
    prospect_id uuid,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    skill_evaluations jsonb DEFAULT '[]'::jsonb,
    auto_generated_review text,
    linked_player_id uuid,
    scout_id uuid,
    CONSTRAINT scouting_reports_mental_rating_check CHECK (((mental_rating >= (0)::numeric) AND (mental_rating <= (10)::numeric))),
    CONSTRAINT scouting_reports_overall_rating_check CHECK (((overall_rating >= (0)::numeric) AND (overall_rating <= (10)::numeric))),
    CONSTRAINT scouting_reports_physical_rating_check CHECK (((physical_rating >= (0)::numeric) AND (physical_rating <= (10)::numeric))),
    CONSTRAINT scouting_reports_priority_check CHECK ((priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text]))),
    CONSTRAINT scouting_reports_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'recommended'::text, 'rejected'::text, 'monitoring'::text]))),
    CONSTRAINT scouting_reports_tactical_rating_check CHECK (((tactical_rating >= (0)::numeric) AND (tactical_rating <= (10)::numeric))),
    CONSTRAINT scouting_reports_technical_rating_check CHECK (((technical_rating >= (0)::numeric) AND (technical_rating <= (10)::numeric)))
);


--
-- Name: scouts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scouts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    country text,
    regions text[],
    commission_rate numeric,
    status text DEFAULT 'pending'::text NOT NULL,
    total_submissions integer DEFAULT 0 NOT NULL,
    successful_signings integer DEFAULT 0 NOT NULL,
    profile_image_url text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: site_visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_visits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    visitor_id text NOT NULL,
    page_path text NOT NULL,
    duration integer DEFAULT 0,
    location jsonb DEFAULT '{}'::jsonb,
    user_agent text,
    referrer text,
    visited_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    hidden boolean DEFAULT false
);


--
-- Name: staff_availability; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.staff_availability (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    staff_id uuid NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    availability_date date DEFAULT CURRENT_DATE NOT NULL
);


--
-- Name: staff_calendar_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.staff_calendar_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    staff_id uuid NOT NULL,
    event_date date NOT NULL,
    title text NOT NULL,
    description text,
    start_time time without time zone,
    end_time time without time zone,
    event_type text DEFAULT 'general'::text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    is_ongoing boolean DEFAULT false,
    category text DEFAULT 'work'::text,
    day_of_week integer,
    end_date date
);


--
-- Name: staff_goals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.staff_goals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    target_value numeric NOT NULL,
    current_value numeric DEFAULT 0 NOT NULL,
    unit text NOT NULL,
    color text DEFAULT 'primary'::text NOT NULL,
    quarter text NOT NULL,
    year integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    assigned_to uuid[] DEFAULT '{}'::uuid[]
);


--
-- Name: staff_notification_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.staff_notification_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_type text NOT NULL,
    event_data jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: staff_tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.staff_tasks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    priority text DEFAULT 'medium'::text NOT NULL,
    category text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    assigned_to uuid[] DEFAULT '{}'::uuid[]
);


--
-- Name: staff_web_push_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.staff_web_push_subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    subscription jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: tactical_schemes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tactical_schemes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "position" text NOT NULL,
    team_scheme text NOT NULL,
    opposition_scheme text NOT NULL,
    defensive_transition text,
    defence text,
    offensive_transition text,
    offence text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: translations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.translations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    page_name text NOT NULL,
    text_key text NOT NULL,
    english text NOT NULL,
    spanish text,
    portuguese text,
    czech text,
    russian text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    french text,
    german text,
    italian text,
    polish text,
    turkish text,
    croatian text,
    norwegian text
);


--
-- Name: updates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.updates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    visible boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    visible_to_player_ids uuid[]
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: web_push_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.web_push_subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_id uuid NOT NULL,
    subscription jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: whatsapp_quick_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.whatsapp_quick_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    message_content text NOT NULL,
    category text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: action_r90_category_mappings action_r90_category_mappings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.action_r90_category_mappings
    ADD CONSTRAINT action_r90_category_mappings_pkey PRIMARY KEY (id);


--
-- Name: action_r90_category_mappings action_r90_category_mappings_unique_combination; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.action_r90_category_mappings
    ADD CONSTRAINT action_r90_category_mappings_unique_combination UNIQUE (action_type, r90_category, r90_subcategory);


--
-- Name: analyses analyses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT analyses_pkey PRIMARY KEY (id);


--
-- Name: analysis_point_examples analysis_point_examples_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_point_examples
    ADD CONSTRAINT analysis_point_examples_pkey PRIMARY KEY (id);


--
-- Name: bank_details bank_details_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_details
    ADD CONSTRAINT bank_details_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: club_map_positions club_map_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.club_map_positions
    ADD CONSTRAINT club_map_positions_pkey PRIMARY KEY (id);


--
-- Name: club_network_contacts club_network_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.club_network_contacts
    ADD CONSTRAINT club_network_contacts_pkey PRIMARY KEY (id);


--
-- Name: club_outreach club_outreach_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.club_outreach
    ADD CONSTRAINT club_outreach_pkey PRIMARY KEY (id);


--
-- Name: club_outreach_updates club_outreach_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.club_outreach_updates
    ADD CONSTRAINT club_outreach_updates_pkey PRIMARY KEY (id);


--
-- Name: coaching_analysis coaching_analysis_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_analysis
    ADD CONSTRAINT coaching_analysis_pkey PRIMARY KEY (id);


--
-- Name: coaching_aphorisms coaching_aphorisms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_aphorisms
    ADD CONSTRAINT coaching_aphorisms_pkey PRIMARY KEY (id);


--
-- Name: coaching_chat_sessions coaching_chat_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_chat_sessions
    ADD CONSTRAINT coaching_chat_sessions_pkey PRIMARY KEY (id);


--
-- Name: coaching_drills coaching_drills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_drills
    ADD CONSTRAINT coaching_drills_pkey PRIMARY KEY (id);


--
-- Name: coaching_exercises coaching_exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_exercises
    ADD CONSTRAINT coaching_exercises_pkey PRIMARY KEY (id);


--
-- Name: coaching_programmes coaching_programmes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_programmes
    ADD CONSTRAINT coaching_programmes_pkey PRIMARY KEY (id);


--
-- Name: coaching_sessions coaching_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_sessions
    ADD CONSTRAINT coaching_sessions_pkey PRIMARY KEY (id);


--
-- Name: component_locks component_locks_component_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.component_locks
    ADD CONSTRAINT component_locks_component_name_key UNIQUE (component_name);


--
-- Name: component_locks component_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.component_locks
    ADD CONSTRAINT component_locks_pkey PRIMARY KEY (id);


--
-- Name: email_templates email_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_pkey PRIMARY KEY (id);


--
-- Name: fixtures fixtures_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fixtures
    ADD CONSTRAINT fixtures_pkey PRIMARY KEY (id);


--
-- Name: form_submissions form_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_submissions
    ADD CONSTRAINT form_submissions_pkey PRIMARY KEY (id);


--
-- Name: formation_positions formation_positions_formation_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.formation_positions
    ADD CONSTRAINT formation_positions_formation_key UNIQUE (formation);


--
-- Name: formation_positions formation_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.formation_positions
    ADD CONSTRAINT formation_positions_pkey PRIMARY KEY (id);


--
-- Name: highlight_projects highlight_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.highlight_projects
    ADD CONSTRAINT highlight_projects_pkey PRIMARY KEY (id);


--
-- Name: homepage_videos homepage_videos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage_videos
    ADD CONSTRAINT homepage_videos_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_invoice_number_key UNIQUE (invoice_number);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: legal_documents legal_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legal_documents
    ADD CONSTRAINT legal_documents_pkey PRIMARY KEY (id);


--
-- Name: marketing_campaigns marketing_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_campaigns
    ADD CONSTRAINT marketing_campaigns_pkey PRIMARY KEY (id);


--
-- Name: marketing_gallery marketing_gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_gallery
    ADD CONSTRAINT marketing_gallery_pkey PRIMARY KEY (id);


--
-- Name: marketing_ideas marketing_ideas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_ideas
    ADD CONSTRAINT marketing_ideas_pkey PRIMARY KEY (id);


--
-- Name: marketing_templates marketing_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_templates
    ADD CONSTRAINT marketing_templates_pkey PRIMARY KEY (id);


--
-- Name: notification_preferences notification_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_pkey PRIMARY KEY (id);


--
-- Name: notification_preferences notification_preferences_player_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_player_id_key UNIQUE (player_id);


--
-- Name: open_access_issues open_access_issues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.open_access_issues
    ADD CONSTRAINT open_access_issues_pkey PRIMARY KEY (id);


--
-- Name: open_access_pages open_access_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.open_access_pages
    ADD CONSTRAINT open_access_pages_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: performance_report_actions performance_report_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_report_actions
    ADD CONSTRAINT performance_report_actions_pkey PRIMARY KEY (id);


--
-- Name: performance_statistics performance_statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_statistics
    ADD CONSTRAINT performance_statistics_pkey PRIMARY KEY (id);


--
-- Name: performance_statistics performance_statistics_stat_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_statistics
    ADD CONSTRAINT performance_statistics_stat_key_key UNIQUE (stat_key);


--
-- Name: player_analysis player_analysis_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_analysis
    ADD CONSTRAINT player_analysis_pkey PRIMARY KEY (id);


--
-- Name: player_club_submissions player_club_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_club_submissions
    ADD CONSTRAINT player_club_submissions_pkey PRIMARY KEY (id);


--
-- Name: player_fixtures player_fixtures_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_fixtures
    ADD CONSTRAINT player_fixtures_pkey PRIMARY KEY (id);


--
-- Name: player_fixtures player_fixtures_player_id_fixture_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_fixtures
    ADD CONSTRAINT player_fixtures_player_id_fixture_id_key UNIQUE (player_id, fixture_id);


--
-- Name: player_hidden_stats player_hidden_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_hidden_stats
    ADD CONSTRAINT player_hidden_stats_pkey PRIMARY KEY (id);


--
-- Name: player_hidden_stats player_hidden_stats_player_id_stat_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_hidden_stats
    ADD CONSTRAINT player_hidden_stats_player_id_stat_key_key UNIQUE (player_id, stat_key);


--
-- Name: player_other_analysis player_other_analysis_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_other_analysis
    ADD CONSTRAINT player_other_analysis_pkey PRIMARY KEY (id);


--
-- Name: player_other_analysis player_other_analysis_player_id_analysis_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_other_analysis
    ADD CONSTRAINT player_other_analysis_player_id_analysis_id_key UNIQUE (player_id, analysis_id);


--
-- Name: player_outreach_pro player_outreach_pro_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_outreach_pro
    ADD CONSTRAINT player_outreach_pro_pkey PRIMARY KEY (id);


--
-- Name: player_outreach_youth player_outreach_youth_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_outreach_youth
    ADD CONSTRAINT player_outreach_youth_pkey PRIMARY KEY (id);


--
-- Name: player_programs player_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_programs
    ADD CONSTRAINT player_programs_pkey PRIMARY KEY (id);


--
-- Name: player_stats player_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_stats
    ADD CONSTRAINT player_stats_pkey PRIMARY KEY (id);


--
-- Name: player_stats player_stats_player_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_stats
    ADD CONSTRAINT player_stats_player_id_key UNIQUE (player_id);


--
-- Name: player_test_results player_test_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_test_results
    ADD CONSTRAINT player_test_results_pkey PRIMARY KEY (id);


--
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);


--
-- Name: playlists playlists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.playlists
    ADD CONSTRAINT playlists_pkey PRIMARY KEY (id);


--
-- Name: positional_guide_media positional_guide_media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.positional_guide_media
    ADD CONSTRAINT positional_guide_media_pkey PRIMARY KEY (id);


--
-- Name: positional_guide_points positional_guide_points_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.positional_guide_points
    ADD CONSTRAINT positional_guide_points_pkey PRIMARY KEY (id);


--
-- Name: positional_guides positional_guides_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.positional_guides
    ADD CONSTRAINT positional_guides_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: prospects prospects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prospects
    ADD CONSTRAINT prospects_pkey PRIMARY KEY (id);


--
-- Name: psychological_sessions psychological_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psychological_sessions
    ADD CONSTRAINT psychological_sessions_pkey PRIMARY KEY (id);


--
-- Name: push_config push_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_config
    ADD CONSTRAINT push_config_pkey PRIMARY KEY (id);


--
-- Name: push_notification_tokens push_notification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_notification_tokens
    ADD CONSTRAINT push_notification_tokens_pkey PRIMARY KEY (id);


--
-- Name: push_notification_tokens push_notification_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_notification_tokens
    ADD CONSTRAINT push_notification_tokens_token_key UNIQUE (token);


--
-- Name: r90_ratings r90_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.r90_ratings
    ADD CONSTRAINT r90_ratings_pkey PRIMARY KEY (id);


--
-- Name: scout_messages scout_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scout_messages
    ADD CONSTRAINT scout_messages_pkey PRIMARY KEY (id);


--
-- Name: scouting_report_drafts scouting_report_drafts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scouting_report_drafts
    ADD CONSTRAINT scouting_report_drafts_pkey PRIMARY KEY (id);


--
-- Name: scouting_reports scouting_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scouting_reports
    ADD CONSTRAINT scouting_reports_pkey PRIMARY KEY (id);


--
-- Name: scouts scouts_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scouts
    ADD CONSTRAINT scouts_email_key UNIQUE (email);


--
-- Name: scouts scouts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scouts
    ADD CONSTRAINT scouts_pkey PRIMARY KEY (id);


--
-- Name: site_visits site_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_visits
    ADD CONSTRAINT site_visits_pkey PRIMARY KEY (id);


--
-- Name: staff_availability staff_availability_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff_availability
    ADD CONSTRAINT staff_availability_pkey PRIMARY KEY (id);


--
-- Name: staff_calendar_events staff_calendar_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff_calendar_events
    ADD CONSTRAINT staff_calendar_events_pkey PRIMARY KEY (id);


--
-- Name: staff_goals staff_goals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff_goals
    ADD CONSTRAINT staff_goals_pkey PRIMARY KEY (id);


--
-- Name: staff_notification_events staff_notification_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff_notification_events
    ADD CONSTRAINT staff_notification_events_pkey PRIMARY KEY (id);


--
-- Name: staff_tasks staff_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff_tasks
    ADD CONSTRAINT staff_tasks_pkey PRIMARY KEY (id);


--
-- Name: staff_web_push_subscriptions staff_web_push_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff_web_push_subscriptions
    ADD CONSTRAINT staff_web_push_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: staff_web_push_subscriptions staff_web_push_subscriptions_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff_web_push_subscriptions
    ADD CONSTRAINT staff_web_push_subscriptions_user_id_key UNIQUE (user_id);


--
-- Name: tactical_schemes tactical_schemes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tactical_schemes
    ADD CONSTRAINT tactical_schemes_pkey PRIMARY KEY (id);


--
-- Name: translations translations_page_name_text_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_page_name_text_key_key UNIQUE (page_name, text_key);


--
-- Name: translations translations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_pkey PRIMARY KEY (id);


--
-- Name: updates updates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.updates
    ADD CONSTRAINT updates_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: web_push_subscriptions web_push_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.web_push_subscriptions
    ADD CONSTRAINT web_push_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: web_push_subscriptions web_push_subscriptions_player_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.web_push_subscriptions
    ADD CONSTRAINT web_push_subscriptions_player_id_key UNIQUE (player_id);


--
-- Name: whatsapp_quick_messages whatsapp_quick_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whatsapp_quick_messages
    ADD CONSTRAINT whatsapp_quick_messages_pkey PRIMARY KEY (id);


--
-- Name: idx_blog_posts_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_category ON public.blog_posts USING btree (category);


--
-- Name: idx_blog_posts_published_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_published_category ON public.blog_posts USING btree (published, category);


--
-- Name: idx_form_submissions_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_form_submissions_created_at ON public.form_submissions USING btree (created_at DESC);


--
-- Name: idx_form_submissions_form_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_form_submissions_form_type ON public.form_submissions USING btree (form_type);


--
-- Name: idx_homepage_videos_active_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_homepage_videos_active_order ON public.homepage_videos USING btree (is_active, order_position);


--
-- Name: idx_marketing_templates_recipient_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_marketing_templates_recipient_type ON public.marketing_templates USING btree (recipient_type);


--
-- Name: idx_notif_prefs_player_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notif_prefs_player_id ON public.notification_preferences USING btree (player_id);


--
-- Name: idx_player_analysis_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_player_analysis_date ON public.player_analysis USING btree (analysis_date DESC);


--
-- Name: idx_player_analysis_player_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_player_analysis_player_id ON public.player_analysis USING btree (player_id);


--
-- Name: idx_player_programs_end_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_player_programs_end_date ON public.player_programs USING btree (end_date);


--
-- Name: idx_player_programs_is_current; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_player_programs_is_current ON public.player_programs USING btree (player_id, is_current) WHERE (is_current = true);


--
-- Name: idx_player_programs_player_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_player_programs_player_id ON public.player_programs USING btree (player_id);


--
-- Name: idx_player_test_results_player_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_player_test_results_player_date ON public.player_test_results USING btree (player_id, test_date);


--
-- Name: idx_player_test_results_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_player_test_results_status ON public.player_test_results USING btree (status);


--
-- Name: idx_players_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_players_email ON public.players USING btree (email);


--
-- Name: idx_positional_guide_media_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_positional_guide_media_lookup ON public.positional_guide_media USING btree ("position", phase, subcategory);


--
-- Name: idx_positional_guide_points_position_phase; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_positional_guide_points_position_phase ON public.positional_guide_points USING btree ("position", phase, subcategory);


--
-- Name: idx_positional_guides_phase; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_positional_guides_phase ON public.positional_guides USING btree ("position", phase);


--
-- Name: idx_positional_guides_position; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_positional_guides_position ON public.positional_guides USING btree ("position");


--
-- Name: idx_prospects_age_group; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_prospects_age_group ON public.prospects USING btree (age_group);


--
-- Name: idx_prospects_age_group_stage; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_prospects_age_group_stage ON public.prospects USING btree (age_group, stage);


--
-- Name: idx_prospects_stage; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_prospects_stage ON public.prospects USING btree (stage);


--
-- Name: idx_push_tokens_player_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_push_tokens_player_id ON public.push_notification_tokens USING btree (player_id);


--
-- Name: idx_scouting_reports_linked_player_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scouting_reports_linked_player_id ON public.scouting_reports USING btree (linked_player_id);


--
-- Name: idx_scouting_reports_priority; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scouting_reports_priority ON public.scouting_reports USING btree (priority);


--
-- Name: idx_scouting_reports_prospect_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scouting_reports_prospect_id ON public.scouting_reports USING btree (prospect_id);


--
-- Name: idx_scouting_reports_scouting_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scouting_reports_scouting_date ON public.scouting_reports USING btree (scouting_date DESC);


--
-- Name: idx_scouting_reports_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scouting_reports_status ON public.scouting_reports USING btree (status);


--
-- Name: idx_site_visits_hidden; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_site_visits_hidden ON public.site_visits USING btree (hidden);


--
-- Name: idx_site_visits_page_path; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_site_visits_page_path ON public.site_visits USING btree (page_path);


--
-- Name: idx_site_visits_visited_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_site_visits_visited_at ON public.site_visits USING btree (visited_at DESC);


--
-- Name: idx_site_visits_visitor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_site_visits_visitor_id ON public.site_visits USING btree (visitor_id);


--
-- Name: idx_staff_availability_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_staff_availability_date ON public.staff_availability USING btree (availability_date);


--
-- Name: idx_staff_availability_staff_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_staff_availability_staff_date ON public.staff_availability USING btree (staff_id, availability_date);


--
-- Name: idx_staff_availability_staff_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_staff_availability_staff_id ON public.staff_availability USING btree (staff_id);


--
-- Name: unique_player_analysis; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_player_analysis ON public.player_analysis USING btree (player_id, analysis_date, opponent) WHERE (opponent IS NOT NULL);


--
-- Name: formation_positions set_formation_positions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_formation_positions_updated_at BEFORE UPDATE ON public.formation_positions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: analyses trigger_notify_new_concept; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_notify_new_concept AFTER INSERT ON public.analyses FOR EACH ROW EXECUTE FUNCTION public.notify_new_concept();


--
-- Name: player_analysis trigger_notify_new_player_analysis; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_notify_new_player_analysis AFTER INSERT ON public.player_analysis FOR EACH ROW EXECUTE FUNCTION public.notify_new_player_analysis();


--
-- Name: player_programs trigger_notify_new_program; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_notify_new_program AFTER INSERT ON public.player_programs FOR EACH ROW EXECUTE FUNCTION public.notify_new_program();


--
-- Name: updates trigger_notify_new_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_notify_new_update AFTER INSERT ON public.updates FOR EACH ROW EXECUTE FUNCTION public.notify_new_update();


--
-- Name: action_r90_category_mappings update_action_r90_category_mappings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_action_r90_category_mappings_updated_at BEFORE UPDATE ON public.action_r90_category_mappings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: analyses update_analyses_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_analyses_updated_at BEFORE UPDATE ON public.analyses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: analysis_point_examples update_analysis_point_examples_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_analysis_point_examples_updated_at BEFORE UPDATE ON public.analysis_point_examples FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bank_details update_bank_details_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_bank_details_updated_at BEFORE UPDATE ON public.bank_details FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: blog_posts update_blog_posts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: club_map_positions update_club_map_positions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_club_map_positions_updated_at BEFORE UPDATE ON public.club_map_positions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: club_network_contacts update_club_network_contacts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_club_network_contacts_updated_at BEFORE UPDATE ON public.club_network_contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: club_outreach update_club_outreach_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_club_outreach_updated_at BEFORE UPDATE ON public.club_outreach FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: coaching_analysis update_coaching_analysis_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_coaching_analysis_updated_at BEFORE UPDATE ON public.coaching_analysis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: coaching_aphorisms update_coaching_aphorisms_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_coaching_aphorisms_updated_at BEFORE UPDATE ON public.coaching_aphorisms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: coaching_chat_sessions update_coaching_chat_sessions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_coaching_chat_sessions_updated_at BEFORE UPDATE ON public.coaching_chat_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: coaching_drills update_coaching_drills_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_coaching_drills_updated_at BEFORE UPDATE ON public.coaching_drills FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: coaching_exercises update_coaching_exercises_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_coaching_exercises_updated_at BEFORE UPDATE ON public.coaching_exercises FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: coaching_programmes update_coaching_programmes_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_coaching_programmes_updated_at BEFORE UPDATE ON public.coaching_programmes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: coaching_sessions update_coaching_sessions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_coaching_sessions_updated_at BEFORE UPDATE ON public.coaching_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: component_locks update_component_locks_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_component_locks_updated_at BEFORE UPDATE ON public.component_locks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: email_templates update_email_templates_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: fixtures update_fixtures_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_fixtures_updated_at BEFORE UPDATE ON public.fixtures FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: homepage_videos update_homepage_videos_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_homepage_videos_updated_at BEFORE UPDATE ON public.homepage_videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: invoices update_invoices_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: legal_documents update_legal_documents_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_legal_documents_updated_at BEFORE UPDATE ON public.legal_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: marketing_campaigns update_marketing_campaigns_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_marketing_campaigns_updated_at BEFORE UPDATE ON public.marketing_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: marketing_gallery update_marketing_gallery_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_marketing_gallery_updated_at BEFORE UPDATE ON public.marketing_gallery FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: marketing_ideas update_marketing_ideas_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_marketing_ideas_updated_at BEFORE UPDATE ON public.marketing_ideas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: marketing_templates update_marketing_templates_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_marketing_templates_updated_at BEFORE UPDATE ON public.marketing_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: notification_preferences update_notif_prefs_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_notif_prefs_updated_at BEFORE UPDATE ON public.notification_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: open_access_issues update_open_access_issues_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_open_access_issues_updated_at BEFORE UPDATE ON public.open_access_issues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: payments update_payments_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: performance_report_actions update_performance_report_actions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_performance_report_actions_updated_at BEFORE UPDATE ON public.performance_report_actions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: performance_statistics update_performance_statistics_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_performance_statistics_updated_at BEFORE UPDATE ON public.performance_statistics FOR EACH ROW EXECUTE FUNCTION public.update_performance_statistics_updated_at();


--
-- Name: player_analysis update_player_analysis_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_player_analysis_updated_at BEFORE UPDATE ON public.player_analysis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: player_club_submissions update_player_club_submissions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_player_club_submissions_updated_at BEFORE UPDATE ON public.player_club_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: player_outreach_pro update_player_outreach_pro_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_player_outreach_pro_updated_at BEFORE UPDATE ON public.player_outreach_pro FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: player_outreach_youth update_player_outreach_youth_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_player_outreach_youth_updated_at BEFORE UPDATE ON public.player_outreach_youth FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: player_programs update_player_programs_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_player_programs_updated_at BEFORE UPDATE ON public.player_programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: player_stats update_player_stats_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_player_stats_updated_at BEFORE UPDATE ON public.player_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: player_test_results update_player_test_results_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_player_test_results_updated_at BEFORE UPDATE ON public.player_test_results FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: players update_players_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON public.players FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: playlists update_playlists_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON public.playlists FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: positional_guide_points update_positional_guide_points_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_positional_guide_points_updated_at BEFORE UPDATE ON public.positional_guide_points FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: prospects update_prospects_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_prospects_updated_at BEFORE UPDATE ON public.prospects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: psychological_sessions update_psychological_sessions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_psychological_sessions_updated_at BEFORE UPDATE ON public.psychological_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: push_notification_tokens update_push_tokens_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_push_tokens_updated_at BEFORE UPDATE ON public.push_notification_tokens FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: r90_ratings update_r90_ratings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_r90_ratings_updated_at BEFORE UPDATE ON public.r90_ratings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: scout_messages update_scout_messages_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_scout_messages_updated_at BEFORE UPDATE ON public.scout_messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: scouting_report_drafts update_scouting_report_drafts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_scouting_report_drafts_updated_at BEFORE UPDATE ON public.scouting_report_drafts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: scouting_reports update_scouting_reports_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_scouting_reports_updated_at BEFORE UPDATE ON public.scouting_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: scouts update_scouts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_scouts_updated_at BEFORE UPDATE ON public.scouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: staff_calendar_events update_staff_calendar_events_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_staff_calendar_events_updated_at BEFORE UPDATE ON public.staff_calendar_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: staff_goals update_staff_goals_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_staff_goals_updated_at BEFORE UPDATE ON public.staff_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: staff_tasks update_staff_tasks_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_staff_tasks_updated_at BEFORE UPDATE ON public.staff_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: staff_web_push_subscriptions update_staff_web_push_subscriptions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_staff_web_push_subscriptions_updated_at BEFORE UPDATE ON public.staff_web_push_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: tactical_schemes update_tactical_schemes_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_tactical_schemes_updated_at BEFORE UPDATE ON public.tactical_schemes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: translations update_translations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_translations_updated_at BEFORE UPDATE ON public.translations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: updates update_updates_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_updates_updated_at BEFORE UPDATE ON public.updates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: web_push_subscriptions update_web_push_subscriptions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_web_push_subscriptions_updated_at BEFORE UPDATE ON public.web_push_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: whatsapp_quick_messages update_whatsapp_quick_messages_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_whatsapp_quick_messages_updated_at BEFORE UPDATE ON public.whatsapp_quick_messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: analyses analyses_fixture_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT analyses_fixture_id_fkey FOREIGN KEY (fixture_id) REFERENCES public.fixtures(id) ON DELETE SET NULL;


--
-- Name: blog_posts blog_posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id);


--
-- Name: club_outreach club_outreach_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.club_outreach
    ADD CONSTRAINT club_outreach_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: club_outreach_updates club_outreach_updates_outreach_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.club_outreach_updates
    ADD CONSTRAINT club_outreach_updates_outreach_id_fkey FOREIGN KEY (outreach_id) REFERENCES public.club_outreach(id) ON DELETE CASCADE;


--
-- Name: coaching_chat_sessions coaching_chat_sessions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_chat_sessions
    ADD CONSTRAINT coaching_chat_sessions_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: component_locks component_locks_locked_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.component_locks
    ADD CONSTRAINT component_locks_locked_by_fkey FOREIGN KEY (locked_by) REFERENCES auth.users(id);


--
-- Name: notification_preferences fk_notif_prefs_player; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT fk_notif_prefs_player FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: player_programs fk_player_programs_player_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_programs
    ADD CONSTRAINT fk_player_programs_player_id FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: push_notification_tokens fk_push_tokens_player; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_notification_tokens
    ADD CONSTRAINT fk_push_tokens_player FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: highlight_projects highlight_projects_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.highlight_projects
    ADD CONSTRAINT highlight_projects_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE SET NULL;


--
-- Name: invoices invoices_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: marketing_gallery marketing_gallery_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_gallery
    ADD CONSTRAINT marketing_gallery_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE SET NULL;


--
-- Name: open_access_pages open_access_pages_issue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.open_access_pages
    ADD CONSTRAINT open_access_pages_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.open_access_issues(id) ON DELETE CASCADE;


--
-- Name: payments payments_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE SET NULL;


--
-- Name: payments payments_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE SET NULL;


--
-- Name: performance_report_actions performance_report_actions_analysis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_report_actions
    ADD CONSTRAINT performance_report_actions_analysis_id_fkey FOREIGN KEY (analysis_id) REFERENCES public.player_analysis(id) ON DELETE CASCADE;


--
-- Name: player_analysis player_analysis_analysis_writer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_analysis
    ADD CONSTRAINT player_analysis_analysis_writer_id_fkey FOREIGN KEY (analysis_writer_id) REFERENCES public.analyses(id) ON DELETE SET NULL;


--
-- Name: player_analysis player_analysis_fixture_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_analysis
    ADD CONSTRAINT player_analysis_fixture_id_fkey FOREIGN KEY (fixture_id) REFERENCES public.fixtures(id) ON DELETE SET NULL;


--
-- Name: player_analysis player_analysis_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_analysis
    ADD CONSTRAINT player_analysis_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: player_club_submissions player_club_submissions_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_club_submissions
    ADD CONSTRAINT player_club_submissions_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: player_fixtures player_fixtures_fixture_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_fixtures
    ADD CONSTRAINT player_fixtures_fixture_id_fkey FOREIGN KEY (fixture_id) REFERENCES public.fixtures(id) ON DELETE CASCADE;


--
-- Name: player_fixtures player_fixtures_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_fixtures
    ADD CONSTRAINT player_fixtures_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: player_hidden_stats player_hidden_stats_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_hidden_stats
    ADD CONSTRAINT player_hidden_stats_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: player_other_analysis player_other_analysis_analysis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_other_analysis
    ADD CONSTRAINT player_other_analysis_analysis_id_fkey FOREIGN KEY (analysis_id) REFERENCES public.coaching_analysis(id) ON DELETE CASCADE;


--
-- Name: player_other_analysis player_other_analysis_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_other_analysis
    ADD CONSTRAINT player_other_analysis_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: player_stats player_stats_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_stats
    ADD CONSTRAINT player_stats_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: player_test_results player_test_results_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_test_results
    ADD CONSTRAINT player_test_results_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: positional_guide_media positional_guide_media_guide_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.positional_guide_media
    ADD CONSTRAINT positional_guide_media_guide_id_fkey FOREIGN KEY (guide_id) REFERENCES public.positional_guides(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: scout_messages scout_messages_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scout_messages
    ADD CONSTRAINT scout_messages_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: scouting_report_drafts scouting_report_drafts_scout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scouting_report_drafts
    ADD CONSTRAINT scouting_report_drafts_scout_id_fkey FOREIGN KEY (scout_id) REFERENCES public.scouts(id) ON DELETE CASCADE;


--
-- Name: scouting_reports scouting_reports_linked_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scouting_reports
    ADD CONSTRAINT scouting_reports_linked_player_id_fkey FOREIGN KEY (linked_player_id) REFERENCES public.players(id) ON DELETE SET NULL;


--
-- Name: scouting_reports scouting_reports_prospect_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scouting_reports
    ADD CONSTRAINT scouting_reports_prospect_id_fkey FOREIGN KEY (prospect_id) REFERENCES public.prospects(id) ON DELETE SET NULL;


--
-- Name: scouting_reports scouting_reports_scout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scouting_reports
    ADD CONSTRAINT scouting_reports_scout_id_fkey FOREIGN KEY (scout_id) REFERENCES public.scouts(id);


--
-- Name: staff_availability staff_availability_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff_availability
    ADD CONSTRAINT staff_availability_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: staff_web_push_subscriptions staff_web_push_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff_web_push_subscriptions
    ADD CONSTRAINT staff_web_push_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: web_push_subscriptions web_push_subscriptions_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.web_push_subscriptions
    ADD CONSTRAINT web_push_subscriptions_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: players Admin can delete players; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can delete players" ON public.players FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: players Admin can insert players; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can insert players" ON public.players FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: r90_ratings Admin can manage R90 ratings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage R90 ratings" ON public.r90_ratings USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: action_r90_category_mappings Admin can manage action category mappings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage action category mappings" ON public.action_r90_category_mappings USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: player_analysis Admin can manage all analysis; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage all analysis" ON public.player_analysis TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: staff_calendar_events Admin can manage all calendar events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage all calendar events" ON public.staff_calendar_events USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: fixtures Admin can manage all fixtures; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage all fixtures" ON public.fixtures TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: invoices Admin can manage all invoices; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage all invoices" ON public.invoices TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: performance_report_actions Admin can manage all performance report actions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage all performance report actions" ON public.performance_report_actions TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: playlists Admin can manage all playlists; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage all playlists" ON public.playlists USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: player_programs Admin can manage all programs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage all programs" ON public.player_programs TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: scouts Admin can manage all scouts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage all scouts" ON public.scouts USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: updates Admin can manage all updates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage all updates" ON public.updates TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: analyses Admin can manage analyses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage analyses" ON public.analyses TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: analysis_point_examples Admin can manage analysis examples; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage analysis examples" ON public.analysis_point_examples USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: coaching_aphorisms Admin can manage aphorisms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage aphorisms" ON public.coaching_aphorisms TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: blog_posts Admin can manage blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage blog posts" ON public.blog_posts TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: club_map_positions Admin can manage club map positions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage club map positions" ON public.club_map_positions USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: club_network_contacts Admin can manage club network contacts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage club network contacts" ON public.club_network_contacts USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: coaching_analysis Admin can manage coaching analysis; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage coaching analysis" ON public.coaching_analysis TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: coaching_drills Admin can manage coaching drills; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage coaching drills" ON public.coaching_drills TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: coaching_exercises Admin can manage coaching exercises; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage coaching exercises" ON public.coaching_exercises TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: coaching_programmes Admin can manage coaching programmes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage coaching programmes" ON public.coaching_programmes TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: coaching_sessions Admin can manage coaching sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage coaching sessions" ON public.coaching_sessions TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: component_locks Admin can manage component locks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage component locks" ON public.component_locks USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: email_templates Admin can manage email templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage email templates" ON public.email_templates TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: legal_documents Admin can manage legal documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage legal documents" ON public.legal_documents USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: marketing_gallery Admin can manage marketing gallery; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage marketing gallery" ON public.marketing_gallery USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: marketing_templates Admin can manage marketing templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage marketing templates" ON public.marketing_templates TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: performance_statistics Admin can manage performance statistics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage performance statistics" ON public.performance_statistics TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: player_fixtures Admin can manage player fixtures; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage player fixtures" ON public.player_fixtures TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: player_other_analysis Admin can manage player other analysis; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage player other analysis" ON public.player_other_analysis USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: player_stats Admin can manage player stats; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage player stats" ON public.player_stats TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: prospects Admin can manage prospects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage prospects" ON public.prospects TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: psychological_sessions Admin can manage psychological sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage psychological sessions" ON public.psychological_sessions TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: scouting_reports Admin can manage scouting reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage scouting reports" ON public.scouting_reports USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: tactical_schemes Admin can manage tactical schemes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage tactical schemes" ON public.tactical_schemes USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: players Admin can update players; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can update players" ON public.players FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: site_visits Admin can update site visits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can update site visits" ON public.site_visits FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: profiles Admins can view all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can view all user roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all user roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: positional_guide_media Allow read access to positional guide media; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read access to positional guide media" ON public.positional_guide_media FOR SELECT USING (true);


--
-- Name: positional_guide_media Allow staff to manage positional guide media; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow staff to manage positional guide media" ON public.positional_guide_media USING ((auth.role() = 'authenticated'::text));


--
-- Name: player_club_submissions Anyone can delete player_club_submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete player_club_submissions" ON public.player_club_submissions FOR DELETE USING (true);


--
-- Name: player_club_submissions Anyone can insert player_club_submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert player_club_submissions" ON public.player_club_submissions FOR INSERT WITH CHECK (true);


--
-- Name: translations Anyone can read translations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read translations" ON public.translations FOR SELECT USING (true);


--
-- Name: form_submissions Anyone can submit forms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit forms" ON public.form_submissions FOR INSERT WITH CHECK (true);


--
-- Name: player_club_submissions Anyone can update player_club_submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update player_club_submissions" ON public.player_club_submissions FOR UPDATE USING (true);


--
-- Name: club_outreach Anyone can view club_outreach for players; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view club_outreach for players" ON public.club_outreach FOR SELECT USING (true);


--
-- Name: fixtures Anyone can view fixtures; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view fixtures" ON public.fixtures FOR SELECT USING (true);


--
-- Name: formation_positions Anyone can view formation positions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view formation positions" ON public.formation_positions FOR SELECT USING (true);


--
-- Name: invoices Anyone can view invoices; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view invoices" ON public.invoices FOR SELECT USING (true);


--
-- Name: open_access_pages Anyone can view pages of published issues; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view pages of published issues" ON public.open_access_pages FOR SELECT USING ((issue_id IN ( SELECT open_access_issues.id
   FROM public.open_access_issues
  WHERE (open_access_issues.published = true))));


--
-- Name: performance_report_actions Anyone can view performance report actions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view performance report actions" ON public.performance_report_actions FOR SELECT USING (true);


--
-- Name: player_analysis Anyone can view player analysis; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view player analysis" ON public.player_analysis FOR SELECT USING (true);


--
-- Name: player_stats Anyone can view player stats; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view player stats" ON public.player_stats FOR SELECT USING (true);


--
-- Name: player_club_submissions Anyone can view player_club_submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view player_club_submissions" ON public.player_club_submissions FOR SELECT USING (true);


--
-- Name: playlists Anyone can view playlists; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view playlists" ON public.playlists FOR SELECT USING (true);


--
-- Name: blog_posts Anyone can view published blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts FOR SELECT USING (((published = true) OR public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: open_access_issues Anyone can view published open_access_issues; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view published open_access_issues" ON public.open_access_issues FOR SELECT USING ((published = true));


--
-- Name: staff_availability Anyone can view staff availability; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view staff availability" ON public.staff_availability FOR SELECT USING (true);


--
-- Name: formation_positions Authenticated users can insert formation positions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can insert formation positions" ON public.formation_positions FOR INSERT WITH CHECK ((auth.uid() IS NOT NULL));


--
-- Name: formation_positions Authenticated users can update formation positions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can update formation positions" ON public.formation_positions FOR UPDATE USING ((auth.uid() IS NOT NULL));


--
-- Name: bank_details Authenticated users can view bank_details; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view bank_details" ON public.bank_details FOR SELECT USING ((auth.uid() IS NOT NULL));


--
-- Name: positional_guide_points Authenticated users can view positional_guide_points; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view positional_guide_points" ON public.positional_guide_points FOR SELECT USING ((auth.uid() IS NOT NULL));


--
-- Name: positional_guides Authenticated users can view positional_guides; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view positional_guides" ON public.positional_guides FOR SELECT USING ((auth.uid() IS NOT NULL));


--
-- Name: push_config Deny all access to push_config; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Deny all access to push_config" ON public.push_config USING (false);


--
-- Name: homepage_videos Homepage videos are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Homepage videos are viewable by everyone" ON public.homepage_videos FOR SELECT USING ((is_active = true));


--
-- Name: blog_posts Marketeers can manage blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketeers can manage blog posts" ON public.blog_posts TO authenticated USING (public.has_role(auth.uid(), 'marketeer'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'marketeer'::public.app_role));


--
-- Name: blog_posts Marketeers can manage blog_posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketeers can manage blog_posts" ON public.blog_posts TO authenticated USING ((public.has_role(auth.uid(), 'marketeer'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: club_network_contacts Marketeers can manage club network contacts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketeers can manage club network contacts" ON public.club_network_contacts TO authenticated USING (public.has_role(auth.uid(), 'marketeer'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'marketeer'::public.app_role));


--
-- Name: club_network_contacts Marketeers can manage club_network_contacts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketeers can manage club_network_contacts" ON public.club_network_contacts TO authenticated USING ((public.has_role(auth.uid(), 'marketeer'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: marketing_gallery Marketeers can manage marketing gallery; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketeers can manage marketing gallery" ON public.marketing_gallery TO authenticated USING (public.has_role(auth.uid(), 'marketeer'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'marketeer'::public.app_role));


--
-- Name: marketing_templates Marketeers can manage marketing templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketeers can manage marketing templates" ON public.marketing_templates TO authenticated USING (public.has_role(auth.uid(), 'marketeer'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'marketeer'::public.app_role));


--
-- Name: marketing_campaigns Marketeers can manage marketing_campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketeers can manage marketing_campaigns" ON public.marketing_campaigns TO authenticated USING ((public.has_role(auth.uid(), 'marketeer'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: marketing_gallery Marketeers can manage marketing_gallery; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketeers can manage marketing_gallery" ON public.marketing_gallery TO authenticated USING ((public.has_role(auth.uid(), 'marketeer'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: marketing_ideas Marketeers can manage marketing_ideas; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketeers can manage marketing_ideas" ON public.marketing_ideas USING ((public.has_role(auth.uid(), 'marketeer'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: marketing_templates Marketeers can manage marketing_templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketeers can manage marketing_templates" ON public.marketing_templates TO authenticated USING ((public.has_role(auth.uid(), 'marketeer'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: prospects Marketeers can manage prospects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketeers can manage prospects" ON public.prospects TO authenticated USING (public.has_role(auth.uid(), 'marketeer'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'marketeer'::public.app_role));


--
-- Name: form_submissions Marketeers can view form submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketeers can view form submissions" ON public.form_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'marketeer'::public.app_role));


--
-- Name: form_submissions Marketeers can view form_submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketeers can view form_submissions" ON public.form_submissions FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'marketeer'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: players Marketeers can view player profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketeers can view player profiles" ON public.players FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'marketeer'::public.app_role));


--
-- Name: scouting_reports Marketeers can view scouting reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketeers can view scouting reports" ON public.scouting_reports FOR SELECT USING (public.has_role(auth.uid(), 'marketeer'::public.app_role));


--
-- Name: scouting_reports Marketeers can view scouting_reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketeers can view scouting_reports" ON public.scouting_reports FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'marketeer'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: site_visits Marketeers can view site visits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketeers can view site visits" ON public.site_visits FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'marketeer'::public.app_role));


--
-- Name: playlists Players can create their own playlists; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can create their own playlists" ON public.playlists FOR INSERT WITH CHECK ((player_id IN ( SELECT players.id
   FROM public.players
  WHERE (players.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: playlists Players can delete their own playlists; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can delete their own playlists" ON public.playlists FOR DELETE USING ((player_id IN ( SELECT players.id
   FROM public.players
  WHERE (players.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: player_test_results Players can insert their own test results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can insert their own test results" ON public.player_test_results FOR INSERT WITH CHECK ((player_id IN ( SELECT players.id
   FROM public.players
  WHERE (players.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: player_hidden_stats Players can manage their own hidden stats; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can manage their own hidden stats" ON public.player_hidden_stats USING ((player_id IN ( SELECT players.id
   FROM public.players
  WHERE (players.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: notification_preferences Players can manage their own preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can manage their own preferences" ON public.notification_preferences USING ((player_id IN ( SELECT players.id
   FROM public.players
  WHERE (players.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: push_notification_tokens Players can manage their own tokens; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can manage their own tokens" ON public.push_notification_tokens USING ((player_id IN ( SELECT players.id
   FROM public.players
  WHERE (players.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: playlists Players can update their own playlists; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can update their own playlists" ON public.playlists FOR UPDATE USING ((player_id IN ( SELECT players.id
   FROM public.players
  WHERE (players.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: player_test_results Players can update their own test results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can update their own test results" ON public.player_test_results FOR UPDATE USING ((player_id IN ( SELECT players.id
   FROM public.players
  WHERE (players.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: coaching_aphorisms Players can view aphorisms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can view aphorisms" ON public.coaching_aphorisms FOR SELECT USING (true);


--
-- Name: analyses Players can view their linked analyses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can view their linked analyses" ON public.analyses FOR SELECT USING ((id IN ( SELECT player_analysis.analysis_writer_id
   FROM public.player_analysis
  WHERE ((player_analysis.player_id IN ( SELECT players.id
           FROM public.players
          WHERE (players.email = (auth.jwt() ->> 'email'::text)))) AND (player_analysis.analysis_writer_id IS NOT NULL)))));


--
-- Name: player_fixtures Players can view their own fixtures; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can view their own fixtures" ON public.player_fixtures FOR SELECT USING ((player_id IN ( SELECT players.id
   FROM public.players
  WHERE (players.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: player_other_analysis Players can view their own other analysis; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can view their own other analysis" ON public.player_other_analysis FOR SELECT USING ((player_id IN ( SELECT players.id
   FROM public.players
  WHERE (players.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: payments Players can view their own payments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can view their own payments" ON public.payments FOR SELECT USING ((player_id IN ( SELECT players.id
   FROM public.players
  WHERE (players.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: performance_report_actions Players can view their own performance report actions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can view their own performance report actions" ON public.performance_report_actions FOR SELECT USING ((analysis_id IN ( SELECT pa.id
   FROM (public.player_analysis pa
     JOIN public.players p ON ((pa.player_id = p.id)))
  WHERE (p.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: player_programs Players can view their own programs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can view their own programs" ON public.player_programs FOR SELECT USING (true);


--
-- Name: player_test_results Players can view their own test results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can view their own test results" ON public.player_test_results FOR SELECT USING ((player_id IN ( SELECT players.id
   FROM public.players
  WHERE (players.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: club_outreach_updates Players can view updates for their outreach; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can view updates for their outreach" ON public.club_outreach_updates FOR SELECT USING ((outreach_id IN ( SELECT co.id
   FROM (public.club_outreach co
     JOIN public.players p ON ((co.player_id = p.id)))
  WHERE (p.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: updates Players can view visible updates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can view visible updates" ON public.updates FOR SELECT USING (((visible = true) AND ((visible_to_player_ids IS NULL) OR (array_length(visible_to_player_ids, 1) IS NULL) OR (( SELECT players.id
   FROM public.players
  WHERE (players.email = (auth.jwt() ->> 'email'::text))
 LIMIT 1) = ANY (visible_to_player_ids)))));


--
-- Name: marketing_gallery Public can view all marketing gallery; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view all marketing gallery" ON public.marketing_gallery FOR SELECT USING (true);


--
-- Name: players Public can view player profiles (no email); Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view player profiles (no email)" ON public.players FOR SELECT USING (true);


--
-- Name: scouting_report_drafts Scouts can create drafts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Scouts can create drafts" ON public.scouting_report_drafts FOR INSERT WITH CHECK ((scout_id IN ( SELECT scouts.id
   FROM public.scouts
  WHERE (scouts.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: scouting_reports Scouts can create reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Scouts can create reports" ON public.scouting_reports FOR INSERT WITH CHECK ((scout_id IN ( SELECT scouts.id
   FROM public.scouts
  WHERE (scouts.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: scouting_report_drafts Scouts can delete their own drafts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Scouts can delete their own drafts" ON public.scouting_report_drafts FOR DELETE USING ((scout_id IN ( SELECT scouts.id
   FROM public.scouts
  WHERE (scouts.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: scouting_report_drafts Scouts can update their own drafts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Scouts can update their own drafts" ON public.scouting_report_drafts FOR UPDATE USING ((scout_id IN ( SELECT scouts.id
   FROM public.scouts
  WHERE (scouts.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: scouts Scouts can update their own record; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Scouts can update their own record" ON public.scouts FOR UPDATE USING ((email = (auth.jwt() ->> 'email'::text)));


--
-- Name: scout_messages Scouts can view messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Scouts can view messages" ON public.scout_messages FOR SELECT USING ((visible_to_scouts = true));


--
-- Name: scouting_report_drafts Scouts can view their own drafts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Scouts can view their own drafts" ON public.scouting_report_drafts FOR SELECT USING ((scout_id IN ( SELECT scouts.id
   FROM public.scouts
  WHERE (scouts.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: scouts Scouts can view their own record; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Scouts can view their own record" ON public.scouts FOR SELECT USING ((email = (auth.jwt() ->> 'email'::text)));


--
-- Name: scouting_reports Scouts can view their own reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Scouts can view their own reports" ON public.scouting_reports FOR SELECT USING ((scout_id IN ( SELECT scouts.id
   FROM public.scouts
  WHERE (scouts.email = (auth.jwt() ->> 'email'::text)))));


--
-- Name: marketing_campaigns Staff can create campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can create campaigns" ON public.marketing_campaigns FOR INSERT WITH CHECK (true);


--
-- Name: marketing_campaigns Staff can delete campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can delete campaigns" ON public.marketing_campaigns FOR DELETE USING (true);


--
-- Name: staff_web_push_subscriptions Staff can delete own subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can delete own subscription" ON public.staff_web_push_subscriptions FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: player_test_results Staff can delete test results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can delete test results" ON public.player_test_results FOR DELETE USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: staff_web_push_subscriptions Staff can insert own subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can insert own subscription" ON public.staff_web_push_subscriptions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: player_test_results Staff can insert test results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can insert test results" ON public.player_test_results FOR INSERT WITH CHECK ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: action_r90_category_mappings Staff can manage action_r90_category_mappings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage action_r90_category_mappings" ON public.action_r90_category_mappings TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: scouts Staff can manage all scouts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage all scouts" ON public.scouts USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: analyses Staff can manage analyses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage analyses" ON public.analyses TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: analysis_point_examples Staff can manage analysis_point_examples; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage analysis_point_examples" ON public.analysis_point_examples TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: bank_details Staff can manage bank_details; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage bank_details" ON public.bank_details USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: blog_posts Staff can manage blog_posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage blog_posts" ON public.blog_posts TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: club_map_positions Staff can manage club_map_positions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage club_map_positions" ON public.club_map_positions USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: club_network_contacts Staff can manage club_network_contacts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage club_network_contacts" ON public.club_network_contacts TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: club_outreach Staff can manage club_outreach; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage club_outreach" ON public.club_outreach USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role))) WITH CHECK ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: club_outreach_updates Staff can manage club_outreach_updates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage club_outreach_updates" ON public.club_outreach_updates USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role))) WITH CHECK ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: coaching_analysis Staff can manage coaching_analysis; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage coaching_analysis" ON public.coaching_analysis TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: coaching_aphorisms Staff can manage coaching_aphorisms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage coaching_aphorisms" ON public.coaching_aphorisms TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: coaching_chat_sessions Staff can manage coaching_chat_sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage coaching_chat_sessions" ON public.coaching_chat_sessions USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: coaching_drills Staff can manage coaching_drills; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage coaching_drills" ON public.coaching_drills TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: coaching_exercises Staff can manage coaching_exercises; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage coaching_exercises" ON public.coaching_exercises TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: coaching_programmes Staff can manage coaching_programmes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage coaching_programmes" ON public.coaching_programmes TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: coaching_sessions Staff can manage coaching_sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage coaching_sessions" ON public.coaching_sessions TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: email_templates Staff can manage email_templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage email_templates" ON public.email_templates TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: fixtures Staff can manage fixtures; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage fixtures" ON public.fixtures TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: staff_goals Staff can manage goals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage goals" ON public.staff_goals USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: highlight_projects Staff can manage highlight_projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage highlight_projects" ON public.highlight_projects USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: homepage_videos Staff can manage homepage videos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage homepage videos" ON public.homepage_videos USING (true) WITH CHECK (true);


--
-- Name: invoices Staff can manage invoices; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage invoices" ON public.invoices TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: legal_documents Staff can manage legal_documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage legal_documents" ON public.legal_documents TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: marketing_campaigns Staff can manage marketing_campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage marketing_campaigns" ON public.marketing_campaigns TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: marketing_gallery Staff can manage marketing_gallery; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage marketing_gallery" ON public.marketing_gallery TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: marketing_ideas Staff can manage marketing_ideas; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage marketing_ideas" ON public.marketing_ideas USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: marketing_templates Staff can manage marketing_templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage marketing_templates" ON public.marketing_templates TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: notification_preferences Staff can manage notification_preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage notification_preferences" ON public.notification_preferences TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: open_access_issues Staff can manage open_access_issues; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage open_access_issues" ON public.open_access_issues USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: open_access_pages Staff can manage open_access_pages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage open_access_pages" ON public.open_access_pages USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: payments Staff can manage payments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage payments" ON public.payments USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: performance_report_actions Staff can manage performance report actions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage performance report actions" ON public.performance_report_actions TO authenticated USING (public.has_role(auth.uid(), 'staff'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'staff'::public.app_role));


--
-- Name: performance_report_actions Staff can manage performance_report_actions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage performance_report_actions" ON public.performance_report_actions TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: performance_statistics Staff can manage performance_statistics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage performance_statistics" ON public.performance_statistics TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_analysis Staff can manage player analysis; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage player analysis" ON public.player_analysis TO authenticated USING (public.has_role(auth.uid(), 'staff'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'staff'::public.app_role));


--
-- Name: player_analysis Staff can manage player_analysis; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage player_analysis" ON public.player_analysis TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_club_submissions Staff can manage player_club_submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage player_club_submissions" ON public.player_club_submissions USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_fixtures Staff can manage player_fixtures; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage player_fixtures" ON public.player_fixtures TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_hidden_stats Staff can manage player_hidden_stats; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage player_hidden_stats" ON public.player_hidden_stats USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_other_analysis Staff can manage player_other_analysis; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage player_other_analysis" ON public.player_other_analysis TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_outreach_pro Staff can manage player_outreach_pro; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage player_outreach_pro" ON public.player_outreach_pro TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_outreach_youth Staff can manage player_outreach_youth; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage player_outreach_youth" ON public.player_outreach_youth TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_programs Staff can manage player_programs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage player_programs" ON public.player_programs TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_stats Staff can manage player_stats; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage player_stats" ON public.player_stats TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: players Staff can manage players; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage players" ON public.players TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: playlists Staff can manage playlists; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage playlists" ON public.playlists TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: positional_guide_points Staff can manage positional_guide_points; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage positional_guide_points" ON public.positional_guide_points USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: positional_guides Staff can manage positional_guides; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage positional_guides" ON public.positional_guides USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_outreach_pro Staff can manage pro outreach; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage pro outreach" ON public.player_outreach_pro USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role))) WITH CHECK ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: prospects Staff can manage prospects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage prospects" ON public.prospects TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: psychological_sessions Staff can manage psychological_sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage psychological_sessions" ON public.psychological_sessions TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: r90_ratings Staff can manage r90_ratings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage r90_ratings" ON public.r90_ratings TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: scout_messages Staff can manage scout messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage scout messages" ON public.scout_messages USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: scouting_reports Staff can manage scouting reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage scouting reports" ON public.scouting_reports USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role))) WITH CHECK ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: scouting_report_drafts Staff can manage scouting_report_drafts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage scouting_report_drafts" ON public.scouting_report_drafts USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: scouting_reports Staff can manage scouting_reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage scouting_reports" ON public.scouting_reports TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: staff_tasks Staff can manage tasks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage tasks" ON public.staff_tasks USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: staff_availability Staff can manage their own availability; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage their own availability" ON public.staff_availability USING ((auth.uid() = staff_id)) WITH CHECK ((auth.uid() = staff_id));


--
-- Name: staff_calendar_events Staff can manage their own calendar events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage their own calendar events" ON public.staff_calendar_events USING ((staff_id = auth.uid())) WITH CHECK ((staff_id = auth.uid()));


--
-- Name: translations Staff can manage translations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage translations" ON public.translations USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: whatsapp_quick_messages Staff can manage whatsapp_quick_messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage whatsapp_quick_messages" ON public.whatsapp_quick_messages USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_outreach_youth Staff can manage youth outreach; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage youth outreach" ON public.player_outreach_youth USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role))) WITH CHECK ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_test_results Staff can select test results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can select test results" ON public.player_test_results FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: marketing_campaigns Staff can update campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can update campaigns" ON public.marketing_campaigns FOR UPDATE USING (true);


--
-- Name: staff_web_push_subscriptions Staff can update own subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can update own subscription" ON public.staff_web_push_subscriptions FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: players Staff can update players; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can update players" ON public.players FOR UPDATE USING (public.has_role(auth.uid(), 'staff'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'staff'::public.app_role));


--
-- Name: player_test_results Staff can update test results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can update test results" ON public.player_test_results FOR UPDATE USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: r90_ratings Staff can view R90 ratings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view R90 ratings" ON public.r90_ratings FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: action_r90_category_mappings Staff can view action category mappings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view action category mappings" ON public.action_r90_category_mappings FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_analysis Staff can view all analysis; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view all analysis" ON public.player_analysis FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: staff_calendar_events Staff can view all calendar events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view all calendar events" ON public.staff_calendar_events FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: fixtures Staff can view all fixtures; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view all fixtures" ON public.fixtures FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: form_submissions Staff can view all form submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view all form submissions" ON public.form_submissions FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: invoices Staff can view all invoices; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view all invoices" ON public.invoices FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: performance_report_actions Staff can view all performance report actions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view all performance report actions" ON public.performance_report_actions FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: players Staff can view all player data including emails; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view all player data including emails" ON public.players FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: playlists Staff can view all playlists; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view all playlists" ON public.playlists FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: notification_preferences Staff can view all preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view all preferences" ON public.notification_preferences FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_programs Staff can view all programs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view all programs" ON public.player_programs FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: site_visits Staff can view all site visits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view all site visits" ON public.site_visits FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: push_notification_tokens Staff can view all tokens; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view all tokens" ON public.push_notification_tokens FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: updates Staff can view all updates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view all updates" ON public.updates FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: analyses Staff can view analyses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view analyses" ON public.analyses FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: analysis_point_examples Staff can view analysis examples; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view analysis examples" ON public.analysis_point_examples FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: coaching_aphorisms Staff can view aphorisms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view aphorisms" ON public.coaching_aphorisms FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: blog_posts Staff can view blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view blog posts" ON public.blog_posts FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: marketing_campaigns Staff can view campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view campaigns" ON public.marketing_campaigns FOR SELECT USING (true);


--
-- Name: club_map_positions Staff can view club map positions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view club map positions" ON public.club_map_positions FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: club_network_contacts Staff can view club network contacts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view club network contacts" ON public.club_network_contacts FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: coaching_analysis Staff can view coaching analysis; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view coaching analysis" ON public.coaching_analysis FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: coaching_drills Staff can view coaching drills; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view coaching drills" ON public.coaching_drills FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: coaching_exercises Staff can view coaching exercises; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view coaching exercises" ON public.coaching_exercises FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: coaching_programmes Staff can view coaching programmes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view coaching programmes" ON public.coaching_programmes FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: coaching_sessions Staff can view coaching sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view coaching sessions" ON public.coaching_sessions FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: component_locks Staff can view component locks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view component locks" ON public.component_locks FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: email_templates Staff can view email templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view email templates" ON public.email_templates FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: staff_goals Staff can view goals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view goals" ON public.staff_goals FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: highlight_projects Staff can view highlight_projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view highlight_projects" ON public.highlight_projects FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: legal_documents Staff can view legal documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view legal documents" ON public.legal_documents FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: marketing_templates Staff can view marketing templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view marketing templates" ON public.marketing_templates FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: staff_notification_events Staff can view notification events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view notification events" ON public.staff_notification_events FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: staff_web_push_subscriptions Staff can view own subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view own subscription" ON public.staff_web_push_subscriptions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: performance_statistics Staff can view performance statistics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view performance statistics" ON public.performance_statistics FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_fixtures Staff can view player fixtures; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view player fixtures" ON public.player_fixtures FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_other_analysis Staff can view player other analysis; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view player other analysis" ON public.player_other_analysis FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_stats Staff can view player stats; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view player stats" ON public.player_stats FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_outreach_pro Staff can view pro outreach; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view pro outreach" ON public.player_outreach_pro FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: prospects Staff can view prospects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view prospects" ON public.prospects FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: psychological_sessions Staff can view psychological sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view psychological sessions" ON public.psychological_sessions FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: tactical_schemes Staff can view tactical schemes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view tactical schemes" ON public.tactical_schemes FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: staff_tasks Staff can view tasks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view tasks" ON public.staff_tasks FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: translations Staff can view translations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view translations" ON public.translations FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: player_outreach_youth Staff can view youth outreach; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view youth outreach" ON public.player_outreach_youth FOR SELECT USING ((public.has_role(auth.uid(), 'staff'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: web_push_subscriptions Users can insert own subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own subscriptions" ON public.web_push_subscriptions FOR INSERT WITH CHECK ((player_id IN ( SELECT players.id
   FROM public.players
  WHERE (players.email = (( SELECT users.email
           FROM auth.users
          WHERE (users.id = auth.uid())))::text))));


--
-- Name: web_push_subscriptions Users can update own subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own subscriptions" ON public.web_push_subscriptions FOR UPDATE USING ((player_id IN ( SELECT players.id
   FROM public.players
  WHERE (players.email = (( SELECT users.email
           FROM auth.users
          WHERE (users.id = auth.uid())))::text))));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: web_push_subscriptions Users can view own subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own subscriptions" ON public.web_push_subscriptions FOR SELECT USING ((player_id IN ( SELECT players.id
   FROM public.players
  WHERE (players.email = (( SELECT users.email
           FROM auth.users
          WHERE (users.id = auth.uid())))::text))));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: action_r90_category_mappings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.action_r90_category_mappings ENABLE ROW LEVEL SECURITY;

--
-- Name: analyses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

--
-- Name: analysis_point_examples; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.analysis_point_examples ENABLE ROW LEVEL SECURITY;

--
-- Name: bank_details; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bank_details ENABLE ROW LEVEL SECURITY;

--
-- Name: blog_posts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

--
-- Name: club_map_positions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.club_map_positions ENABLE ROW LEVEL SECURITY;

--
-- Name: club_network_contacts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.club_network_contacts ENABLE ROW LEVEL SECURITY;

--
-- Name: club_outreach; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.club_outreach ENABLE ROW LEVEL SECURITY;

--
-- Name: club_outreach_updates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.club_outreach_updates ENABLE ROW LEVEL SECURITY;

--
-- Name: coaching_analysis; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.coaching_analysis ENABLE ROW LEVEL SECURITY;

--
-- Name: coaching_aphorisms; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.coaching_aphorisms ENABLE ROW LEVEL SECURITY;

--
-- Name: coaching_chat_sessions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.coaching_chat_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: coaching_drills; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.coaching_drills ENABLE ROW LEVEL SECURITY;

--
-- Name: coaching_exercises; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.coaching_exercises ENABLE ROW LEVEL SECURITY;

--
-- Name: coaching_programmes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.coaching_programmes ENABLE ROW LEVEL SECURITY;

--
-- Name: coaching_sessions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: component_locks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.component_locks ENABLE ROW LEVEL SECURITY;

--
-- Name: email_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: fixtures; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.fixtures ENABLE ROW LEVEL SECURITY;

--
-- Name: form_submissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

--
-- Name: formation_positions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.formation_positions ENABLE ROW LEVEL SECURITY;

--
-- Name: highlight_projects; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.highlight_projects ENABLE ROW LEVEL SECURITY;

--
-- Name: homepage_videos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.homepage_videos ENABLE ROW LEVEL SECURITY;

--
-- Name: invoices; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

--
-- Name: legal_documents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;

--
-- Name: marketing_campaigns; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

--
-- Name: marketing_gallery; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.marketing_gallery ENABLE ROW LEVEL SECURITY;

--
-- Name: marketing_ideas; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.marketing_ideas ENABLE ROW LEVEL SECURITY;

--
-- Name: marketing_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.marketing_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: notification_preferences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: open_access_issues; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.open_access_issues ENABLE ROW LEVEL SECURITY;

--
-- Name: open_access_pages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.open_access_pages ENABLE ROW LEVEL SECURITY;

--
-- Name: payments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

--
-- Name: performance_report_actions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.performance_report_actions ENABLE ROW LEVEL SECURITY;

--
-- Name: performance_statistics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.performance_statistics ENABLE ROW LEVEL SECURITY;

--
-- Name: player_analysis; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.player_analysis ENABLE ROW LEVEL SECURITY;

--
-- Name: player_club_submissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.player_club_submissions ENABLE ROW LEVEL SECURITY;

--
-- Name: player_fixtures; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.player_fixtures ENABLE ROW LEVEL SECURITY;

--
-- Name: player_hidden_stats; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.player_hidden_stats ENABLE ROW LEVEL SECURITY;

--
-- Name: player_other_analysis; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.player_other_analysis ENABLE ROW LEVEL SECURITY;

--
-- Name: player_outreach_pro; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.player_outreach_pro ENABLE ROW LEVEL SECURITY;

--
-- Name: player_outreach_youth; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.player_outreach_youth ENABLE ROW LEVEL SECURITY;

--
-- Name: player_programs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.player_programs ENABLE ROW LEVEL SECURITY;

--
-- Name: player_stats; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;

--
-- Name: player_test_results; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.player_test_results ENABLE ROW LEVEL SECURITY;

--
-- Name: players; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

--
-- Name: playlists; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

--
-- Name: positional_guide_media; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.positional_guide_media ENABLE ROW LEVEL SECURITY;

--
-- Name: positional_guide_points; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.positional_guide_points ENABLE ROW LEVEL SECURITY;

--
-- Name: positional_guides; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.positional_guides ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: prospects; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;

--
-- Name: psychological_sessions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.psychological_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: push_config; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.push_config ENABLE ROW LEVEL SECURITY;

--
-- Name: push_notification_tokens; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.push_notification_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: r90_ratings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.r90_ratings ENABLE ROW LEVEL SECURITY;

--
-- Name: scout_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.scout_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: scouting_report_drafts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.scouting_report_drafts ENABLE ROW LEVEL SECURITY;

--
-- Name: scouting_reports; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.scouting_reports ENABLE ROW LEVEL SECURITY;

--
-- Name: scouts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.scouts ENABLE ROW LEVEL SECURITY;

--
-- Name: site_visits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

--
-- Name: staff_availability; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.staff_availability ENABLE ROW LEVEL SECURITY;

--
-- Name: staff_calendar_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.staff_calendar_events ENABLE ROW LEVEL SECURITY;

--
-- Name: staff_goals; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.staff_goals ENABLE ROW LEVEL SECURITY;

--
-- Name: staff_notification_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.staff_notification_events ENABLE ROW LEVEL SECURITY;

--
-- Name: staff_tasks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.staff_tasks ENABLE ROW LEVEL SECURITY;

--
-- Name: staff_web_push_subscriptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.staff_web_push_subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: tactical_schemes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tactical_schemes ENABLE ROW LEVEL SECURITY;

--
-- Name: translations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

--
-- Name: updates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: web_push_subscriptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.web_push_subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: whatsapp_quick_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.whatsapp_quick_messages ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


