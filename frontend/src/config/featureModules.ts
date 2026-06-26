import type { ComponentType } from 'react'
import type { Permission } from '../types/firestore'
import {
  IconMap, IconTree, IconSoil, IconCamera, IconLightbulb,
  IconWrench, IconBell, IconChart,
} from '../components/icons'

export interface FeatureModule {
  id: string
  path: string
  title: string
  shortTitle: string
  description: string
  permissions?: Permission[]
  icon: ComponentType<{ className?: string }>
}

export const featureModules: FeatureModule[] = [
  {
    id: 'dashboard',
    path: '/dashboard',
    title: 'Dashboard & KPIs',
    shortTitle: 'Dashboard',
    description: 'Management KPIs, charts, and role-based dashboard views.',
    icon: IconChart,
  },
  {
    id: 'inventory',
    path: '/inventory',
    title: 'Tree Inventory',
    shortTitle: 'Inventory',
    description: 'Central tree registry with search, history, and QR codes.',
    permissions: ['trees:read'],
    icon: IconTree,
  },
  {
    id: 'map',
    path: '/map',
    title: 'GPS / GIS Mapping',
    shortTitle: 'GIS Map',
    description: 'Interactive map with health-coded markers and layer filters.',
    permissions: ['trees:read'],
    icon: IconMap,
  },
  {
    id: 'soil',
    path: '/soil',
    title: 'Soil Data Collection',
    shortTitle: 'Soil',
    description: 'Soil parameters, bulk upload, IoT integration, and heatmaps.',
    permissions: ['soil:read'],
    icon: IconSoil,
  },
  {
    id: 'images',
    path: '/images',
    title: 'Image & Visual Monitoring',
    shortTitle: 'Images',
    description: 'Upload and annotate tree, leaf, pest, and soil images.',
    permissions: ['images:upload'],
    icon: IconCamera,
  },
  {
    id: 'disease-pest',
    path: '/disease-pest',
    title: 'Disease & Pest Detection',
    shortTitle: 'Disease/Pest',
    description: 'Manual tagging, AI classification, and verification workflow.',
    icon: IconCamera,
  },
  {
    id: 'growth',
    path: '/growth',
    title: 'Growth Monitoring',
    shortTitle: 'Growth',
    description: 'Track height, canopy, diameter, and growth anomalies.',
    permissions: ['trees:read'],
    icon: IconTree,
  },
  {
    id: 'recommendations',
    path: '/recommendations',
    title: 'Recommendation Engine',
    shortTitle: 'Recommend',
    description: 'Rule-based remedial actions from soil, disease, and pest data.',
    permissions: ['maintenance:create'],
    icon: IconLightbulb,
  },
  {
    id: 'maintenance',
    path: '/maintenance',
    title: 'Maintenance Workflow',
    shortTitle: 'Maintenance',
    description: 'Task assignment, completion proof, and supervisor approval.',
    permissions: ['maintenance:create'],
    icon: IconWrench,
  },
  {
    id: 'alerts',
    path: '/alerts',
    title: 'Alerts & Notifications',
    shortTitle: 'Alerts',
    description: 'Disease, pest, soil, and maintenance alerts with notification center.',
    icon: IconBell,
  },
  {
    id: 'reports',
    path: '/reports',
    title: 'Reports',
    shortTitle: 'Reports',
    description: 'Generate and export PDF/Excel reports with filters.',
    permissions: ['reports:view'],
    icon: IconChart,
  },
  {
    id: 'admin',
    path: '/admin',
    title: 'Admin Configuration',
    shortTitle: 'Admin',
    description: 'Manage species, zones, thresholds, rules, and categories.',
    permissions: ['admin:config'],
    icon: IconChart,
  },
  {
    id: 'users',
    path: '/users',
    title: 'User Management',
    shortTitle: 'Users',
    description: 'Manage users, roles, and permissions.',
    permissions: ['admin:users'],
    icon: IconTree,
  },
  {
    id: 'audit',
    path: '/audit',
    title: 'Audit Trail',
    shortTitle: 'Audit',
    description: 'Full accountability log with old/new value tracking.',
    icon: IconChart,
  },
  {
    id: 'field',
    path: '/field',
    title: 'Field Interface',
    shortTitle: 'Field',
    description: 'Mobile-friendly quick inspection, GPS capture, and QR scan.',
    icon: IconMap,
  },
]
