// Demo AI engine for SAMMY Wellness Spa.
// Generates realistic, context-aware mock responses (no external API required).

export const DISCLAIMER =
  "Responsible AI Notice: AI-generated responses are provided for productivity and informational support. AI may produce inaccurate or incomplete information. Always review AI-generated content before using it or sending it to clients. SAMMY AI does not provide medical diagnosis or professional medical advice.";

export function think<T>(value: T, ms = 1100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/* ---------------- Email generator ---------------- */

export const EMAIL_PURPOSES = [
  "Appointment confirmation",
  "Appointment reminder",
  "Client enquiry",
  "Follow-up",
  "Thank-you email",
  "Cancellation response",
  "Promotional email",
  "Supplier email",
  "Staff communication",
  "General email",
] as const;

export const RECIPIENTS = [
  "Client",
  "Manager",
  "Staff",
  "Supplier",
  "Business partner",
  "Other",
] as const;

export const TONES = ["Professional", "Friendly", "Warm", "Formal", "Persuasive"] as const;

export type EmailInput = {
  purpose: string;
  recipient: string;
  tone: string;
  details: string;
};

export type GeneratedEmail = {
  subject: string;
  greeting: string;
  body: string;
  closing: string;
};

const SUBJECTS: Record<string, string> = {
  "Appointment confirmation": "Your SAMMY Wellness Spa appointment is confirmed",
  "Appointment reminder": "A gentle reminder about your SAMMY Wellness Spa visit",
  "Client enquiry": "Thank you for your enquiry — SAMMY Wellness Spa",
  "Follow-up": "Following up on your recent visit to SAMMY Wellness Spa",
  "Thank-you email": "Thank you for choosing SAMMY Wellness Spa",
  "Cancellation response": "Your SAMMY Wellness Spa booking — cancellation received",
  "Promotional email": "A little something for you from SAMMY Wellness Spa",
  "Supplier email": "SAMMY Wellness Spa — supplies and order enquiry",
  "Staff communication": "Team update — SAMMY Wellness Spa",
  "General email": "A message from SAMMY Wellness Spa",
};

const TONE_OPENERS: Record<string, string> = {
  Professional: "Thank you for taking the time to read this message.",
  Friendly: "We hope this message finds you relaxed and well!",
  Warm: "It is always a pleasure to hear from you.",
  Formal: "We write to you regarding the matter set out below.",
  Persuasive: "We would love to welcome you back for something truly restorative.",
};

const TONE_CLOSERS: Record<string, string> = {
  Professional: "Kind regards,\nThe SAMMY Wellness Spa Team",
  Friendly: "Warmly,\nThe SAMMY Wellness Spa Team",
  Warm: "With care,\nThe SAMMY Wellness Spa Team",
  Formal: "Yours sincerely,\nSAMMY Wellness Spa",
  Persuasive: "See you soon,\nThe SAMMY Wellness Spa Team",
};

const PURPOSE_BODY: Record<string, string> = {
  "Appointment confirmation":
    "We are delighted to confirm your upcoming treatment with us. Please arrive 10 minutes early so you can settle in, complete any wellness preferences and enjoy a calm start to your session.",
  "Appointment reminder":
    "This is a friendly reminder of your upcoming appointment at SAMMY Wellness Spa. If anything has changed, simply reply to this email and we will happily rearrange a time that suits you better.",
  "Client enquiry":
    "Thank you for reaching out to us. We have noted the details of your enquiry and one of our wellness consultants will confirm the specifics with you shortly.",
  "Follow-up":
    "We wanted to check in after your recent visit and hear how you are feeling. Your comfort matters to us, and any feedback helps us shape your next treatment around you.",
  "Thank-you email":
    "Thank you sincerely for choosing SAMMY Wellness Spa. It was a genuine pleasure to welcome you, and we look forward to caring for you again soon.",
  "Cancellation response":
    "We have received your cancellation and it has been processed — no further action is needed from your side. Whenever you are ready, we would be glad to find you a new time.",
  "Promotional email":
    "We have curated a seasonal wellness moment for our valued guests, designed to help you slow down and reset. Reply to this email and we will reserve a place for you.",
  "Supplier email":
    "We are writing regarding our current supply requirements. Please could you confirm availability, lead times and pricing so that we can align it with our treatment schedule.",
  "Staff communication":
    "Please read the update below ahead of the coming shifts so that we all stay aligned on treatment room readiness, client care and daily priorities.",
  "General email":
    "We are getting in touch with the details below and are happy to clarify anything further if it would be helpful.",
};

export function generateEmail(input: EmailInput): GeneratedEmail {
  const who =
    input.recipient === "Client"
      ? "Dear valued guest,"
      : input.recipient === "Staff"
        ? "Hi team,"
        : input.recipient === "Manager"
          ? "Dear Manager,"
          : input.recipient === "Supplier"
            ? "Dear Supplier,"
            : input.recipient === "Business partner"
              ? "Dear Partner,"
              : "Hello,";

  const details = input.details.trim();
  const detailBlock = details
    ? `\n\nDetails you shared with us:\n${details
        .split("\n")
        .filter(Boolean)
        .map((line) => `• ${line.trim()}`)
        .join("\n")}`
    : "";

  const body = [
    TONE_OPENERS[input.tone] ?? TONE_OPENERS["Professional"]!,
    "",
    PURPOSE_BODY[input.purpose] ?? PURPOSE_BODY["General email"]!,
    detailBlock.trim(),
    "",
    "If you have any questions at all, simply reply to this email and a member of our team will assist you personally.",
  ]
    .filter((l) => l !== undefined)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");

  return {
    subject: SUBJECTS[input.purpose] ?? SUBJECTS["General email"]!,
    greeting: who,
    body,
    closing: TONE_CLOSERS[input.tone] ?? TONE_CLOSERS["Professional"]!,
  };
}

export function emailToText(email: GeneratedEmail) {
  return `Subject: ${email.subject}\n\n${email.greeting}\n\n${email.body}\n\n${email.closing}`;
}

/* ---------------- Chatbot ---------------- */

export const SUGGESTED_PROMPTS = [
  "What services does SAMMY Wellness Spa offer?",
  "Help me respond to a client.",
  "Help me plan today's spa tasks.",
  "Write an appointment reminder.",
  "How can I improve the client experience?",
];

export const OPENING_MESSAGE =
  "Hello! I'm Sammy AI, your virtual assistant for SAMMY Wellness Spa. How can I help you today?";

export function chatReply(message: string): string {
  const q = message.toLowerCase();

  if (/(service|treatment|offer|menu)/.test(q)) {
    return `SAMMY Wellness Spa typically offers these treatment categories:

- **Massage therapy** — Swedish, deep tissue, hot stone and aromatherapy
- **Facials & skincare** — hydrating, deep-cleansing and anti-ageing rituals
- **Body treatments** — scrubs, wraps and detox rituals
- **Hands & feet** — manicures, pedicures and paraffin care
- **Wellness rituals** — sauna, steam and guided relaxation

Please confirm the exact treatments, durations and prices against your own service menu before sharing them with clients — I don't invent pricing or availability.`;
  }

  if (/(respond|reply|client message|complaint|customer)/.test(q)) {
    return `Here is a professional reply you can adapt:

"Thank you so much for getting in touch with SAMMY Wellness Spa. I completely understand, and I'd love to help. I've noted your request and will confirm the details shortly. In the meantime, please let me know if there is anything that would make your visit more comfortable."

Tips: acknowledge first, confirm the next step, and give a clear timeframe. Review and personalise before sending.`;
  }

  if (/(plan|task|organise|organize|schedule|today)/.test(q)) {
    return `Here's a calm, workable structure for a spa day:

1. **08:30 – 09:00** Confirm today's appointments and check for cancellations
2. **09:00 – 09:30** Prepare and check treatment rooms (linen, oils, ambience)
3. **09:30 – 10:00** Respond to client messages and enquiries
4. **Midday** Reception cover and walk-in handling
5. **15:00 – 15:30** Order supplies and check stock levels
6. **16:30 – 17:00** Follow up with yesterday's clients and close off admin

Start with anything time-bound and client-facing; keep admin for quieter windows. Open the AI Task Planner to turn this into a live checklist.`;
  }

  if (/(reminder|appointment|booking|confirm)/.test(q)) {
    return `Here's an appointment reminder draft:

**Subject:** A gentle reminder about your SAMMY Wellness Spa visit

Dear valued guest,

This is a friendly reminder of your upcoming treatment at SAMMY Wellness Spa. Please arrive 10 minutes early so you can settle in and enjoy a calm start.

If you'd like to reschedule, simply reply to this email.

Warmly,
The SAMMY Wellness Spa Team

Add the real date, time and treatment before sending — I don't create bookings.`;
  }

  if (/(experience|improve|feedback|retention|loyalty)/.test(q)) {
    return `A few practical ways to lift the client experience:

- **Before the visit:** a short, warm confirmation message with arrival guidance
- **On arrival:** greet by name, offer water or herbal tea, keep waiting time short
- **During:** confirm pressure, temperature and comfort at least once
- **After:** a same-day thank-you note and a gentle rebooking invitation
- **Ongoing:** log preferences (favourite therapist, allergies noted by the client) so care feels personal

Small, consistent touches usually matter more than large gestures.`;
  }

  if (/(health|pain|medical|injury|pregnan|condition|diagnos)/.test(q)) {
    return `I can help with wording, admin and general wellness information, but I can't provide medical diagnosis or advice.

For anything health-related, please encourage the client to consult an appropriately qualified healthcare professional, and record any contraindications on their consultation form before treatment.`;
  }

  return `Happy to help with that. As your spa assistant I can support you with:

- Client communication and customer-service wording
- Drafting emails, reminders and follow-ups
- Organising daily and weekly spa tasks
- General spa and administrative information

Tell me a little more — for example the client, the situation or the outcome you want — and I'll draft something you can review and send.`;
}

/* ---------------- Task planner ---------------- */

export const PRIORITIES = ["Urgent", "High", "Medium", "Low"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const CATEGORIES = [
  "Client care",
  "Admin",
  "Treatment rooms",
  "Supplies",
  "Marketing",
  "Team",
] as const;

export type Task = {
  id: string;
  title: string;
  priority: Priority;
  deadline: string;
  duration: string;
  category: string;
  done: boolean;
};

export const PRIORITY_RANK: Record<Priority, number> = {
  Urgent: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

export type Plan = {
  priorities: string[];
  schedule: { time: string; task: string }[];
  week: { day: string; tasks: string[] }[];
  tips: string[];
};

const SLOTS = [
  "08:30 – 09:15",
  "09:15 – 10:00",
  "10:15 – 11:00",
  "11:15 – 12:00",
  "13:30 – 14:15",
  "14:30 – 15:15",
  "15:30 – 16:15",
  "16:30 – 17:15",
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function generatePlan(tasks: Task[]): Plan {
  const open = tasks.filter((t) => !t.done);
  const sorted = [...open].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);

  return {
    priorities: sorted.slice(0, 3).map((t) => `${t.title} — ${t.priority} (${t.category})`),
    schedule: sorted.slice(0, SLOTS.length).map((t, i) => ({
      time: SLOTS[i]!,
      task: `${t.title} · approx. ${t.duration || "30 min"}`,
    })),
    week: DAYS.map((day, i) => ({
      day,
      tasks: sorted.filter((_, idx) => idx % DAYS.length === i).map((t) => t.title),
    })),
    tips: [
      "Handle client-facing and time-bound tasks first — they protect the guest experience.",
      "Batch admin and supplier work into one quiet window instead of spreading it through the day.",
      "Reset treatment rooms between guests rather than in one large block at closing.",
      "Leave a 15-minute buffer before the last appointment for overruns and follow-ups.",
    ],
  };
}

export const DEMO_TASKS: Task[] = [
  {
    id: "t1",
    title: "Confirm today's appointments",
    priority: "Urgent",
    deadline: "09:00",
    duration: "30 min",
    category: "Client care",
    done: true,
  },
  {
    id: "t2",
    title: "Respond to client messages",
    priority: "High",
    deadline: "10:30",
    duration: "45 min",
    category: "Client care",
    done: true,
  },
  {
    id: "t3",
    title: "Check treatment rooms",
    priority: "High",
    deadline: "11:00",
    duration: "30 min",
    category: "Treatment rooms",
    done: true,
  },
  {
    id: "t4",
    title: "Order spa supplies",
    priority: "Medium",
    deadline: "15:00",
    duration: "20 min",
    category: "Supplies",
    done: true,
  },
  {
    id: "t5",
    title: "Follow up with yesterday's clients",
    priority: "Medium",
    deadline: "16:00",
    duration: "30 min",
    category: "Client care",
    done: false,
  },
  {
    id: "t6",
    title: "Update the seasonal treatment offer",
    priority: "Low",
    deadline: "Friday",
    duration: "40 min",
    category: "Marketing",
    done: false,
  },
  {
    id: "t7",
    title: "Brief the team on weekend shifts",
    priority: "High",
    deadline: "17:00",
    duration: "15 min",
    category: "Team",
    done: false,
  },
];
