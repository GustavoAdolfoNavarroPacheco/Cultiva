CREATE TABLE "agent_ia_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text DEFAULT 'KHC Bot' NOT NULL,
	"tono" text DEFAULT 'PROFESIONAL' NOT NULL,
	"modelo" text DEFAULT 'deepseek-v4-pro' NOT NULL,
	"max_tokens" integer DEFAULT 2048 NOT NULL,
	"temperatura" text DEFAULT '0.7' NOT NULL,
	"system_prompt" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "whatsapp_business_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone_number" text DEFAULT '' NOT NULL,
	"business_name" text DEFAULT '' NOT NULL,
	"waba_id" text DEFAULT '' NOT NULL,
	"phone_number_id" text DEFAULT '' NOT NULL,
	"quality_rating" text DEFAULT '' NOT NULL,
	"messaging_tier" text DEFAULT '' NOT NULL,
	"webhook_url" text DEFAULT '' NOT NULL,
	"webhook_token" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "whatsapp_conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" text NOT NULL,
	"name" text,
	"student_id" integer,
	"mode" text DEFAULT 'AGENTE_IA' NOT NULL,
	"etapa_actual" text DEFAULT 'INICIO' NOT NULL,
	"unread_count" integer DEFAULT 0 NOT NULL,
	"last_message_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "whatsapp_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"author" text NOT NULL,
	"type" text DEFAULT 'TEXTO' NOT NULL,
	"content" text NOT NULL,
	"file_name" text,
	"file_url" text,
	"file_mime_type" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "whatsapp_conversations" ADD CONSTRAINT "whatsapp_conversations_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_conversation_id_whatsapp_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."whatsapp_conversations"("id") ON DELETE cascade ON UPDATE no action;