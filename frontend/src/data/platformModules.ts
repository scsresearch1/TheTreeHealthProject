export type ModuleId =
  | 'inventory'
  | 'gis'
  | 'soil'
  | 'disease'
  | 'recommendations'
  | 'maintenance'
  | 'alerts'
  | 'reporting'

export interface PlatformModule {
  id: ModuleId
  title: string
  shortTitle: string
  description: string
  href: string
}

export const platformModules: PlatformModule[] = [
  {
    id: 'gis',
    title: 'GIS Tree Mapping',
    shortTitle: 'GIS Map',
    description:
      'Interactive reach-based maps with canopy layers, stand boundaries, and georeferenced tree assets.',
    href: '#gis',
  },
  {
    id: 'inventory',
    title: 'Tree Inventory',
    shortTitle: 'Inventory',
    description:
      'Centralized registry of species, DBH, age class, condition scores, and spatial attributes per tree.',
    href: '#inventory',
  },
  {
    id: 'soil',
    title: 'Soil Analytics',
    shortTitle: 'Soil',
    description:
      'pH, moisture, NPK, and microbiome indicators correlated with canopy stress and growth patterns.',
    href: '#soil',
  },
  {
    id: 'disease',
    title: 'Disease & Pest Vision',
    shortTitle: 'Vision AI',
    description:
      'Upload canopy and bark imagery for ML classification of pathogens, defoliation, and insect damage.',
    href: '#disease',
  },
  {
    id: 'recommendations',
    title: 'Recommendation Engine',
    shortTitle: 'Recommend',
    description:
      'Rule-based and model-driven treatment plans prioritized by risk score, season, and resource constraints.',
    href: '#recommendations',
  },
  {
    id: 'maintenance',
    title: 'Maintenance Workflows',
    shortTitle: 'Workflows',
    description:
      'Assign pruning, treatment, and replanting tasks with status tracking and field crew scheduling.',
    href: '#maintenance',
  },
  {
    id: 'alerts',
    title: 'Alerts & Monitoring',
    shortTitle: 'Alerts',
    description:
      'Real-time threshold alerts for drought stress, pest outbreaks, soil anomalies, and inspection due dates.',
    href: '#alerts',
  },
  {
    id: 'reporting',
    title: 'Management Reporting',
    shortTitle: 'Reports',
    description:
      'Executive dashboards and exportable PDF/Excel reports for compliance, budgets, and research publication.',
    href: '#reporting',
  },
]

export const workflowSteps = [
  { step: '01', title: 'Survey & Inventory', desc: 'GIS capture and tree asset registration' },
  { step: '02', title: 'Analyze', desc: 'Soil labs, imagery upload, ML inference' },
  { step: '03', title: 'Recommend', desc: 'Prioritized treatment and care plans' },
  { step: '04', title: 'Execute', desc: 'Maintenance workflows and field dispatch' },
  { step: '05', title: 'Report', desc: 'Alerts, KPIs, and management exports' },
]
