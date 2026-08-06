import { z } from 'zod';

// 1. Lead Scoring & Analysis Schema
export const scoreLeadSchema = z.object({
  leadName: z.string().describe('Full name of the prospective lead or client contact'),
  companyName: z.string().describe('Target organization or business entity'),
  industry: z.enum(['FinTech', 'HealthTech', 'Enterprise SaaS', 'E-Commerce', 'AI Infrastructure']).describe('Target industry sector'),
  estimatedBudget: z.number().positive().describe('Estimated deal value in USD ($)'),
  urgency: z.enum(['Immediate (0-30 days)', 'Quarterly (30-90 days)', 'Exploratory']).describe('Implementation timeline requirement'),
});

// 2. SEO & Website Metadata Fetcher Schema
export const fetchMetaSchema = z.object({
  targetUrl: z.string().url().describe('Target domain or webpage URL to audit and scrape'),
  checkSecurityHeaders: z.boolean().default(true).describe('Verify SSL, CORS, CSP, and HSTS headers'),
  extractOpenGraph: z.boolean().default(true).describe('Extract OG social cards, twitter card meta, and favicons'),
});

// 3. System Analytics & Performance Chart Schema
export const generateChartSchema = z.object({
  metricTitle: z.string().describe('Title of the performance benchmark metric'),
  timeframe: z.enum(['Past 24 Hours', 'Past 7 Days', 'Past 30 Days', 'Year-to-Date']).describe('Aggregated time window'),
  chartType: z.enum(['Line Trend', 'Bar Comparison', 'Area Fill']).describe('Visual representation model'),
  dataPointsCount: z.number().min(5).max(12).default(7).describe('Number of sampled data points'),
});

// 4. Critical Action Confirmation Tool Schema (User Interactive Tool)
export const confirmActionSchema = z.object({
  actionName: z.string().describe('Name of the destructive or high-impact administrative action'),
  targetEnvironment: z.enum(['Production (us-east-1)', 'Staging Cluster', 'Global CDN Edge']).describe('Impacted infrastructure deployment environment'),
  impactScope: z.enum(['Critical System State Change', 'High Load Configuration', 'Standard Sync']).describe('Risk profile'),
  requireMfa: z.boolean().default(true).describe('Whether secondary authentication token is required'),
});

// Tool Contracts Registry export for documentation UI
export const TOOL_CONTRACTS = [
  {
    id: 'score_lead_analysis',
    name: 'score_lead_analysis',
    description: 'Calculates lead quality score, deal probability, key risk factors, and recommended sales strategy.',
    schema: scoreLeadSchema,
    sampleInput: {
      leadName: 'Sarah Jenkins',
      companyName: 'Apex Health Systems',
      industry: 'HealthTech',
      estimatedBudget: 85000,
      urgency: 'Immediate (0-30 days)',
    },
  },
  {
    id: 'fetch_metadata_tags',
    name: 'fetch_metadata_tags',
    description: 'Inspects remote web pages, extracts OpenGraph metadata, security status, and SEO health index.',
    schema: fetchMetaSchema,
    sampleInput: {
      targetUrl: 'https://antigravity.google.com/docs/sdk',
      checkSecurityHeaders: true,
      extractOpenGraph: true,
    },
  },
  {
    id: 'generate_performance_chart',
    name: 'generate_performance_chart',
    description: 'Generates structured telemetry time-series dataset and renders an interactive SVG benchmark chart.',
    schema: generateChartSchema,
    sampleInput: {
      metricTitle: 'API P99 Latency (ms) & Throughput',
      timeframe: 'Past 7 Days',
      chartType: 'Area Fill',
      dataPointsCount: 7,
    },
  },
  {
    id: 'confirm_action',
    name: 'confirm_action',
    description: 'Prompts user for interactive confirmation before initiating critical infrastructure mutations.',
    schema: confirmActionSchema,
    sampleInput: {
      actionName: 'Promote Multi-Region Cluster v2.4 to Active Traffic',
      targetEnvironment: 'Production (us-east-1)',
      impactScope: 'Critical System State Change',
      requireMfa: true,
    },
  },
];
