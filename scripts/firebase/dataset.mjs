/**
 * Canonical dataset for The Tree Health Project.
 * Used by export-dataset.mjs (local JSON) and seed-schema.mjs (Realtime Database).
 */

export const ROLES = ['admin', 'management', 'field_team']

export const ROLE_PERMISSIONS = {
  admin: [
    'trees:read', 'trees:write', 'trees:delete', 'soil:read', 'soil:write',
    'images:upload', 'images:annotate', 'disease:tag', 'disease:approve',
    'pest:tag', 'pest:approve', 'maintenance:create', 'maintenance:assign',
    'maintenance:complete', 'maintenance:approve', 'reports:view', 'reports:export',
    'admin:config', 'admin:users', 'alerts:manage',
  ],
  management: [
    'trees:read', 'soil:read', 'images:upload', 'disease:tag', 'pest:tag',
    'maintenance:create', 'reports:view', 'reports:export', 'alerts:manage',
  ],
  field_team: [
    'trees:read', 'trees:write', 'soil:read', 'soil:write', 'images:upload',
    'images:annotate', 'disease:tag', 'disease:approve', 'pest:tag', 'pest:approve',
    'maintenance:create', 'maintenance:assign', 'maintenance:complete', 'maintenance:approve',
    'reports:view', 'alerts:manage',
  ],
}

export const MODULE_ACCESS = [
  { moduleId: 'dashboard', permissionsAny: [], allowedRoles: [] },
  { moduleId: 'inventory', permissionsAny: ['trees:read'], allowedRoles: [] },
  { moduleId: 'map', permissionsAny: ['trees:read'], allowedRoles: [] },
  { moduleId: 'soil', permissionsAny: ['soil:read'], allowedRoles: [] },
  { moduleId: 'images', permissionsAny: ['images:upload', 'images:annotate'], allowedRoles: [] },
  { moduleId: 'disease-pest', permissionsAny: ['disease:tag', 'pest:tag', 'disease:approve', 'pest:approve'], allowedRoles: [] },
  { moduleId: 'growth', permissionsAny: [], allowedRoles: ['admin', 'management', 'field_team'] },
  { moduleId: 'recommendations', permissionsAny: ['maintenance:create', 'reports:view'], allowedRoles: [] },
  { moduleId: 'maintenance', permissionsAny: ['maintenance:create', 'maintenance:assign', 'maintenance:complete', 'maintenance:approve'], allowedRoles: [] },
  { moduleId: 'alerts', permissionsAny: ['alerts:manage', 'trees:read'], allowedRoles: [] },
  { moduleId: 'reports', permissionsAny: ['reports:view'], allowedRoles: [] },
  { moduleId: 'admin', permissionsAny: ['admin:config'], allowedRoles: [] },
  { moduleId: 'users', permissionsAny: ['admin:users'], allowedRoles: [] },
  { moduleId: 'audit', permissionsAny: [], allowedRoles: ['admin', 'management'] },
  { moduleId: 'field', permissionsAny: [], allowedRoles: ['field_team'] },
]

export const MODULE_FEATURES = {
  dashboard: [
    { label: 'KPI cards', permission: 'trees:read' },
    { label: 'Health distribution', permission: 'trees:read' },
    { label: 'Zone risk scores', permission: 'reports:view' },
    { label: 'Role-based views', permission: 'admin:config' },
  ],
  inventory: [
    { label: 'Add/edit trees', permission: 'trees:write' },
    { label: 'Auto Tree ID', permission: 'trees:write' },
    { label: 'Search & filter', permission: 'trees:read' },
    { label: 'Tree history', permission: 'trees:read' },
    { label: 'QR codes', permission: 'trees:read' },
    { label: 'Delete records', permission: 'trees:delete' },
  ],
  map: [
    { label: 'Tree markers', permission: 'trees:read' },
    { label: 'Health colors', permission: 'trees:read' },
    { label: 'Layer filters', permission: 'trees:read' },
    { label: 'Add tree by map click', permission: 'trees:write' },
    { label: 'GPS coordinates', permission: 'trees:read' },
  ],
  soil: [
    { label: 'Manual entry', permission: 'soil:write' },
    { label: 'CSV/Excel upload', permission: 'soil:write' },
    { label: 'Health score', permission: 'soil:read' },
    { label: 'Trends', permission: 'soil:read' },
    { label: 'GIS heatmap', permission: 'soil:read' },
  ],
  images: [
    { label: 'Multi-category upload', permission: 'images:upload' },
    { label: 'Before/after', permission: 'images:upload' },
    { label: 'Timeline', permission: 'images:upload' },
    { label: 'Annotations', permission: 'images:annotate' },
    { label: 'Object storage URLs', permission: 'images:upload' },
  ],
  'disease-pest': [
    { label: 'Manual tagging', permission: 'disease:tag' },
    { label: 'AI API', permission: 'disease:tag' },
    { label: 'Confidence scores', permission: 'disease:tag' },
    { label: 'Verification workflow', permission: 'disease:approve' },
    { label: 'Spread maps', permission: 'pest:tag' },
    { label: 'Approve pest records', permission: 'pest:approve' },
  ],
  growth: [
    { label: 'Growth timeline', permission: 'trees:read' },
    { label: 'Rate calculation', permission: 'trees:read' },
    { label: 'Anomaly detection', permission: 'trees:write' },
    { label: 'Species comparison', permission: 'reports:view' },
  ],
  recommendations: [
    { label: 'Rule engine', permission: 'maintenance:create' },
    { label: 'Priority levels', permission: 'maintenance:create' },
    { label: 'Explanations', permission: 'reports:view' },
    { label: 'Suggested actions', permission: 'maintenance:create' },
  ],
  maintenance: [
    { label: 'Create tasks', permission: 'maintenance:create' },
    { label: 'Assign crews', permission: 'maintenance:assign' },
    { label: 'Status workflow', permission: 'maintenance:complete' },
    { label: 'Proof images', permission: 'maintenance:complete' },
    { label: 'Overdue alerts', permission: 'maintenance:approve' },
    { label: 'Approve completion', permission: 'maintenance:approve' },
  ],
  alerts: [
    { label: 'In-app alerts', permission: 'trees:read' },
    { label: 'Severity levels', permission: 'alerts:manage' },
    { label: 'Email/SMS hooks', permission: 'alerts:manage' },
    { label: 'Notification center', permission: 'alerts:manage' },
  ],
  reports: [
    { label: 'Daily/weekly/monthly', permission: 'reports:view' },
    { label: 'Zone reports', permission: 'reports:view' },
    { label: 'PDF export', permission: 'reports:export' },
    { label: 'Excel/CSV export', permission: 'reports:export' },
  ],
  admin: [
    { label: 'Species', permission: 'admin:config' },
    { label: 'Zones', permission: 'admin:config' },
    { label: 'Disease/pest categories', permission: 'admin:config' },
    { label: 'Soil thresholds', permission: 'admin:config' },
    { label: 'Recommendation rules', permission: 'admin:config' },
  ],
  users: [
    { label: 'User CRUD', permission: 'admin:users' },
    { label: 'Role assignment', permission: 'admin:users' },
    { label: 'Permission control', permission: 'admin:users' },
    { label: 'Activity logs', permission: 'admin:users' },
  ],
  audit: [
    { label: 'Who did what', permission: 'reports:view' },
    { label: 'Timestamps', permission: 'reports:view' },
    { label: 'Old/new values', permission: 'admin:config' },
    { label: 'Critical edit tracking', permission: 'admin:config' },
  ],
  field: [
    { label: 'Responsive UI', permission: 'trees:read' },
    { label: 'GPS capture', permission: 'trees:write' },
    { label: 'Camera upload', permission: 'images:upload' },
    { label: 'QR scan', permission: 'trees:read' },
    { label: 'Quick inspection', permission: 'maintenance:complete' },
  ],
}

export const DASHBOARD_WIDGETS = [
  { id: 'kpis', permissionsAny: ['trees:read'], allowedRoles: [] },
  { id: 'map', permissionsAny: ['trees:read'], allowedRoles: [] },
  { id: 'inventory', permissionsAny: ['trees:read'], allowedRoles: [] },
  { id: 'alerts', permissionsAny: ['trees:read', 'alerts:manage'], allowedRoles: [] },
  { id: 'soil', permissionsAny: ['soil:read'], allowedRoles: [] },
  { id: 'vision', permissionsAny: ['disease:tag', 'pest:tag', 'disease:approve', 'pest:approve'], allowedRoles: [] },
  { id: 'recommendations', permissionsAny: ['maintenance:create', 'reports:view'], allowedRoles: [] },
  { id: 'maintenance', permissionsAny: ['maintenance:create', 'maintenance:assign', 'maintenance:complete', 'maintenance:approve'], allowedRoles: [] },
  { id: 'reporting', permissionsAny: ['reports:view'], allowedRoles: [] },
]

export function buildDataset(now = new Date().toISOString()) {
  const zones = [
    { id: 'zone-a1', name: 'Zone A-1', code: 'A-1', block: 'North Sector', reach: 'Reach 12' },
    { id: 'zone-b4', name: 'Zone B-4', code: 'B-4', block: 'North Sector', reach: 'Reach 12' },
    { id: 'zone-c2', name: 'Zone C-2', code: 'C-2', block: 'East Sector', reach: 'Reach 12' },
  ]

  const users = [
    { uid: 'seed-admin', email: 'admin@tthp.local', displayName: 'Dr. Niladri Dey', role: 'admin' },
    { uid: 'seed-management', email: 'manager@tthp.local', displayName: 'Ops Manager', role: 'management' },
    { uid: 'seed-field', email: 'field@tthp.local', displayName: 'Field & Operations', role: 'field_team' },
  ].map((u) => ({
    ...u,
    permissions: ROLE_PERMISSIONS[u.role],
    active: true,
    createdAt: now,
    updatedAt: now,
  }))

  const trees = [
    { treeId: 'TH-4821', speciesId: 'quercus-robur', speciesName: 'Quercus robur', ageEstimate: 45, height: 12.5, trunkDiameter: 62, canopySize: 8.2, plantationDate: '1980-04-15', location: { lat: 51.423, lng: -0.381 }, zoneId: 'zone-a1', healthStatus: 'healthy', riskLevel: 'low', qrCode: 'TH-4821' },
    { treeId: 'TH-3102', speciesId: 'fraxinus-excelsior', speciesName: 'Fraxinus excelsior', ageEstimate: 30, height: 10.2, trunkDiameter: 45, canopySize: 6.5, plantationDate: '1995-06-20', location: { lat: 51.421, lng: -0.376 }, zoneId: 'zone-b4', healthStatus: 'diseased', riskLevel: 'high', qrCode: 'TH-3102' },
    { treeId: 'TH-7744', speciesId: 'betula-pendula', speciesName: 'Betula pendula', ageEstimate: 20, height: 8.1, trunkDiameter: 28, canopySize: 4.8, plantationDate: '2005-03-10', location: { lat: 51.425, lng: -0.389 }, zoneId: 'zone-b4', healthStatus: 'moderate_risk', riskLevel: 'medium', qrCode: 'TH-7744' },
    { treeId: 'TH-1190', speciesId: 'acer-pseudoplatanus', speciesName: 'Acer pseudoplatanus', ageEstimate: 35, height: 11.0, trunkDiameter: 51, canopySize: 7.1, plantationDate: '1990-09-12', location: { lat: 51.420, lng: -0.370 }, zoneId: 'zone-a1', healthStatus: 'healthy', riskLevel: 'low', qrCode: 'TH-1190' },
    { treeId: 'TH-9033', speciesId: 'tilia-cordata', speciesName: 'Tilia cordata', ageEstimate: 55, height: 14.2, trunkDiameter: 70, canopySize: 9.5, plantationDate: '1970-05-01', location: { lat: 51.426, lng: -0.385 }, zoneId: 'zone-c2', healthStatus: 'pest_affected', riskLevel: 'critical', qrCode: 'TH-9033' },
    { treeId: 'TH-5510', speciesId: 'fagus-sylvatica', speciesName: 'Fagus sylvatica', ageEstimate: 40, height: 13.1, trunkDiameter: 58, canopySize: 8.0, plantationDate: '1985-11-22', location: { lat: 51.418, lng: -0.392 }, zoneId: 'zone-b4', healthStatus: 'requires_inspection', riskLevel: 'medium', qrCode: 'TH-5510' },
    { treeId: 'TH-2201', speciesId: 'quercus-robur', speciesName: 'Quercus robur', ageEstimate: 25, height: 9.5, trunkDiameter: 38, canopySize: 5.5, plantationDate: '2000-02-14', location: { lat: 51.424, lng: -0.378 }, zoneId: 'zone-a1', healthStatus: 'healthy', riskLevel: 'low', qrCode: 'TH-2201' },
    { treeId: 'TH-6612', speciesId: 'betula-pendula', speciesName: 'Betula pendula', ageEstimate: 15, height: 7.2, trunkDiameter: 22, canopySize: 3.9, plantationDate: '2010-08-30', location: { lat: 51.427, lng: -0.375 }, zoneId: 'zone-c2', healthStatus: 'healthy', riskLevel: 'low', qrCode: 'TH-6612' },
  ].map((t) => ({ ...t, createdBy: 'seed-field', createdAt: now, updatedAt: now }))

  const soil_readings = trees.map((t) => ({
    treeId: t.treeId,
    zoneId: t.zoneId,
    samplingPoint: `SP-${t.treeId}`,
    moisture: t.treeId === 'TH-7744' ? 18 : t.treeId === 'TH-3102' ? 22 : 42,
    ph: t.treeId === 'TH-3102' ? 5.9 : t.treeId === 'TH-9033' ? 6.1 : 6.8,
    electricalConductivity: 1.2,
    nitrogen: t.healthStatus === 'healthy' ? 24 : 14,
    phosphorus: 15,
    potassium: 18,
    temperature: 18.5,
    organicMatter: 4.2,
    healthScore: t.healthStatus === 'healthy' ? 85 : t.healthStatus === 'diseased' ? 42 : 58,
    classification: t.healthStatus === 'healthy' ? 'good' : t.healthStatus === 'diseased' ? 'poor' : 'moderate',
    source: 'manual',
    recordedAt: now,
    recordedBy: 'seed-field',
  }))

  const images = [
    { treeId: 'TH-3102', storageUrl: 'https://storage.example.com/tthp/th-3102-bark.jpg', storagePath: 'images/th-3102-bark.jpg', imageType: 'pest_damage', category: 'stem_trunk', capturedAt: now, location: { lat: 51.421, lng: -0.376 }, uploadedBy: 'seed-field', inspectionNotes: 'Bark galleries visible' },
    { treeId: 'TH-9033', storageUrl: 'https://storage.example.com/tthp/th-9033-leaf.jpg', storagePath: 'images/th-9033-leaf.jpg', imageType: 'leaf_disease', category: 'leaf', capturedAt: now, location: { lat: 51.426, lng: -0.385 }, uploadedBy: 'seed-field', inspectionNotes: 'Leaf curling and yellowing' },
    { treeId: 'TH-4821', storageUrl: 'https://storage.example.com/tthp/th-4821-full.jpg', storagePath: 'images/th-4821-full.jpg', imageType: 'full_tree', category: 'full_tree', capturedAt: now, uploadedBy: 'seed-field' },
  ].map((i) => ({ ...i, annotations: [], createdAt: now }))

  const disease_records = [
    { treeId: 'TH-3102', diseaseCategoryId: 'defoliation', diseaseName: 'Ash Dieback', severity: 'high', confidence: 0.87, verificationStatus: 'ai_detected', detectedAt: now, notes: 'Canopy thinning' },
    { treeId: 'TH-9033', diseaseCategoryId: 'leaf-spot', diseaseName: 'Leaf Spot (Fungal)', severity: 'medium', confidence: 0.76, verificationStatus: 'field_verified', detectedAt: now, reviewedBy: 'seed-field' },
  ].map((d) => ({ ...d, createdAt: now }))

  const pest_records = [
    { treeId: 'TH-3102', pestCategoryId: 'eab', pestName: 'Emerald Ash Borer', severity: 'critical', confidence: 0.94, verificationStatus: 'ai_detected', detectedAt: now, notes: 'D-shaped exit holes' },
    { treeId: 'TH-9033', pestCategoryId: 'aphid', pestName: 'Aphid Infestation', severity: 'medium', confidence: 0.81, verificationStatus: 'ai_detected', detectedAt: now },
  ].map((p) => ({ ...p, createdAt: now }))

  const growth_records = [
    { treeId: 'TH-4821', height: 12.5, canopySize: 8.2, trunkDiameter: 62, growthRate: 0.15, anomalyFlags: [], recordedAt: now, recordedBy: 'seed-field' },
    { treeId: 'TH-7744', height: 8.1, canopySize: 4.8, trunkDiameter: 28, growthRate: 0.08, anomalyFlags: ['slow_growth'], recordedAt: now, recordedBy: 'seed-field' },
  ].map((g) => ({ ...g, createdAt: now }))

  const recommendations = [
    { treeId: 'TH-3102', zoneId: 'zone-b4', type: 'pesticide', priority: 'urgent', rationale: 'Pest confidence 94% — EAB above threshold', suggestedActions: ['Apply systemic insecticide', 'Re-inspect in 14 days'], basedOn: { pestConfidence: 0.94 }, status: 'active', createdBy: 'system' },
    { treeId: 'TH-7744', zoneId: 'zone-b4', type: 'irrigation', priority: 'high', rationale: 'Soil moisture 18% — below minimum threshold', suggestedActions: ['Increase irrigation frequency'], basedOn: { moisture: 18 }, status: 'active', createdBy: 'system' },
    { treeId: 'TH-9033', zoneId: 'zone-c2', type: 'fungicide', priority: 'medium', rationale: 'Leaf disease severity high', suggestedActions: ['Apply fungicide treatment'], basedOn: { diseaseConfidence: 0.76 }, status: 'active', createdBy: 'system' },
  ].map((r) => ({ ...r, createdAt: now }))

  const maintenance_tasks = [
    { treeId: 'TH-3102', zoneId: 'zone-b4', category: 'pesticide', title: 'Apply systemic insecticide — EAB protocol', assignedTo: 'seed-field', assignedBy: 'seed-supervisor', dueDate: new Date(Date.now() + 2 * 86400000).toISOString(), priority: 'urgent', status: 'assigned', proofImageUrls: [] },
    { treeId: 'TH-7744', zoneId: 'zone-b4', category: 'irrigation', title: 'Increase irrigation — Zone B-4', assignedTo: 'seed-field', assignedBy: 'seed-supervisor', dueDate: new Date(Date.now() - 1 * 86400000).toISOString(), priority: 'high', status: 'overdue', proofImageUrls: [] },
    { treeId: 'TH-9033', zoneId: 'zone-c2', category: 'pruning', title: 'Prune deadwood — crown reduction', assignedTo: 'seed-field', assignedBy: 'seed-supervisor', dueDate: new Date().toISOString(), priority: 'high', status: 'in_progress', proofImageUrls: [] },
    { treeId: 'TH-4821', zoneId: 'zone-a1', category: 'inspection', title: 'Post-treatment re-inspection', assignedTo: 'seed-field', assignedBy: 'seed-supervisor', dueDate: new Date(Date.now() + 7 * 86400000).toISOString(), priority: 'low', status: 'completed', proofImageUrls: [], completedAt: now },
  ].map((t) => ({ ...t, createdAt: now, updatedAt: now }))

  const alerts = [
    { type: 'pest', severity: 'critical', title: 'Emerald ash borer detected', message: 'TH-3102 — 94% confidence from bark imagery', treeId: 'TH-3102', zoneId: 'zone-b4', acknowledged: false },
    { type: 'soil', severity: 'warning', title: 'Low soil moisture', message: 'Zone B-4 avg 20% — irrigation recommended', zoneId: 'zone-b4', acknowledged: false },
    { type: 'inspection', severity: 'warning', title: 'Inspection overdue', message: 'TH-5510 exceeds 30-day inspection window', treeId: 'TH-5510', acknowledged: false },
    { type: 'disease', severity: 'info', title: 'Disease verified', message: 'Leaf spot on TH-9033 confirmed by field team', treeId: 'TH-9033', acknowledged: true },
  ].map((a) => ({ ...a, createdAt: now }))

  const notifications = [
    { userId: 'seed-supervisor', type: 'maintenance_assigned', title: 'Task overdue', message: 'Irrigation task for TH-7744 is overdue', read: false },
    { userId: 'seed-field', type: 'alert', title: 'New pest alert', message: 'EAB detected on TH-3102', read: false },
    { userId: 'seed-management', type: 'report', title: 'Weekly report ready', message: 'Q2 weekly summary available', read: true },
  ].map((n) => ({ ...n, createdAt: now }))

  const config = {
    species: { items: [
      { id: 'quercus-robur', name: 'Quercus robur', commonName: 'English Oak' },
      { id: 'fraxinus-excelsior', name: 'Fraxinus excelsior', commonName: 'European Ash' },
      { id: 'betula-pendula', name: 'Betula pendula', commonName: 'Silver Birch' },
      { id: 'tilia-cordata', name: 'Tilia cordata', commonName: 'Small-leaved Lime' },
      { id: 'fagus-sylvatica', name: 'Fagus sylvatica', commonName: 'European Beech' },
    ], updatedAt: now },
    disease_categories: { items: [
      { id: 'leaf-spot', name: 'Leaf Spot' }, { id: 'root-rot', name: 'Root Rot' },
      { id: 'canker', name: 'Canker' }, { id: 'defoliation', name: 'Defoliation' },
    ], updatedAt: now },
    pest_categories: { items: [
      { id: 'eab', name: 'Emerald Ash Borer' }, { id: 'aphid', name: 'Aphid Infestation' },
      { id: 'scale', name: 'Scale Insects' },
    ], updatedAt: now },
    soil_thresholds: {
      moisture: { min: 25, ideal: 40, critical: 15 },
      ph: { min: 5.5, ideal: 6.5, max: 7.5 },
      electricalConductivity: { max: 2.0 },
      updatedAt: now,
    },
    recommendation_rules: {
      rules: [
        { id: 'low-ph', condition: 'ph < 5.5', action: 'Apply lime', priority: 'high' },
        { id: 'low-moisture', condition: 'moisture < 20', action: 'Irrigation required', priority: 'urgent' },
      ],
      updatedAt: now,
    },
    task_categories: {
      items: ['irrigation', 'fertilization', 'pesticide', 'fungicide', 'pruning', 'soil_treatment', 'inspection', 'tree_replacement'],
      statuses: ['open', 'assigned', 'in_progress', 'completed', 'verified', 'rejected'],
      updatedAt: now,
    },
    roles: { roles: ROLES, permissions: ROLE_PERMISSIONS, updatedAt: now },
    module_access: { items: MODULE_ACCESS, updatedAt: now },
    module_features: { items: MODULE_FEATURES, updatedAt: now },
    dashboard_widgets: { items: DASHBOARD_WIDGETS, updatedAt: now },
  }

  return {
    _schema: { version: '1.0.0', updatedAt: now, projectId: 'tthp-ec0a9' },
    zones: zones.map((z) => ({ ...z, createdAt: now, updatedAt: now })),
    users,
    trees,
    soil_readings,
    images,
    disease_records,
    pest_records,
    growth_records,
    recommendations,
    maintenance_tasks,
    alerts,
    notifications,
    activity_logs: [
      { userId: 'seed-field', action: 'tree.create', entityType: 'tree', entityId: 'TH-4821', timestamp: now },
      { userId: 'seed-field', action: 'image.upload', entityType: 'image', entityId: 'th-3102-bark', timestamp: now },
    ],
    audit_trail: [
      { userId: 'seed-field', action: 'update', entityType: 'tree', entityId: 'TH-7744', field: 'healthStatus', oldValue: 'healthy', newValue: 'moderate_risk', timestamp: now },
    ],
    reports: [
      { type: 'weekly', title: 'Weekly Tree Health Summary', filters: { zone: 'Reach 12' }, format: 'pdf', status: 'ready', generatedBy: 'seed-management', createdAt: now },
    ],
    config,
  }
}
