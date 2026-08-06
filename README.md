# Motion Stateful Buttons & Generative UI Tool Lifecycle Application

An interactive web application showcasing **Intentional Motion Button Choreography** and a **Generative UI AI Tool Execution Engine** with full 4-state lifecycle rendering.

---

## 🎨 Motion Design Tokens & Easing Rationale

Every state change in the button system is a deliberate transition designed with compositor-friendly GPU properties (`transform`, `opacity`) to eliminate layout thrashing:

| State Transition | Duration & Curve | Design Rationale |
| :--- | :--- | :--- |
| **Idle → Hover / Focus** | `150ms cubic-bezier(0.4, 0, 0.2, 1)` | Rapid micro-lift (`scale: 1.02, y: -1px`) & aura glow expansion for immediate tactile feedback. |
| **Idle → Loading** | `320ms cubic-bezier(0.16, 1, 0.3, 1)` | Smooth deceleration curve morphing structural button shape into a spinner state without snap jumps. |
| **Loading → Success** | `Spring (stiffness: 450, damping: 25)` | Physics-based spring pop for checkmark icon confirmation. |
| **Loading → Error** | `450ms keyframe shake` | Spatial horizontal shake (`[-8px, 8px, -6px, 6px, 0]`) to signal rejection. Automatically suppressed when `prefers-reduced-motion` is enabled. |

---

## 🛠️ Generative UI Tool Contracts (Zod Schemas)

### 1. `score_lead_analysis`
- **Description**: Evaluates prospective lead deal size, win probability, and recommended sales strategy.
- **Zod Schema**:
  ```ts
  z.object({
    leadName: z.string(),
    companyName: z.string(),
    industry: z.enum(['FinTech', 'HealthTech', 'Enterprise SaaS', 'E-Commerce', 'AI Infrastructure']),
    estimatedBudget: z.number().positive(),
    urgency: z.enum(['Immediate (0-30 days)', 'Quarterly (30-90 days)', 'Exploratory']),
  })
  ```
- **Return Component**: `ToolScoreCard` (Score gauge, ARR projection, win probability, risk highlights).

### 2. `fetch_metadata_tags`
- **Description**: Crawls remote URLs, extracts OpenGraph cards, SSL status, and SEO health index.
- **Zod Schema**:
  ```ts
  z.object({
    targetUrl: z.string().url(),
    checkSecurityHeaders: z.boolean().default(true),
    extractOpenGraph: z.boolean().default(true),
  })
  ```
- **Return Component**: `ToolMetaCard` (SEO score, OG image preview, SSL/CORS security grid).

### 3. `generate_performance_chart`
- **Description**: Aggregates time-series telemetry data and renders an interactive SVG benchmark chart.
- **Zod Schema**:
  ```ts
  z.object({
    metricTitle: z.string(),
    timeframe: z.enum(['Past 24 Hours', 'Past 7 Days', 'Past 30 Days', 'Year-to-Date']),
    chartType: z.enum(['Line Trend', 'Bar Comparison', 'Area Fill']),
    dataPointsCount: z.number().min(5).max(12),
  })
  ```
- **Return Component**: `ToolChartCard` (Interactive SVG Area Chart with hover tooltips).

### 4. `confirm_action` (User Interactive Tool)
- **Description**: Prompts user for interactive confirmation before initiating critical system changes.
- **Zod Schema**:
  ```ts
  z.object({
    actionName: z.string(),
    targetEnvironment: z.enum(['Production (us-east-1)', 'Staging Cluster', 'Global CDN Edge']),
    impactScope: z.enum(['Critical System State Change', 'High Load Configuration', 'Standard Sync']),
    requireMfa: z.boolean().default(true),
  })
  ```
- **Return Component**: `ConfirmationToolCard` (Interactive user approval prompt tool).

---

## ⚡ Key Features & Accessibility
- **Interruptible State Machine**: Spam-clicking or hover mid-transition handled gracefully without race conditions.
- **Accessibility**: Visible focus rings (`ring-2 ring-indigo-400`), `aria-live="polite"` status announcements.
- **Reduced Motion Support**: Detects OS preference and provides a manual toggle to replace spatial motion with smooth crossfades.
- **System Flex**: Secondary `DeployButton` proves motion system scalability across different component types.
