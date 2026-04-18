/**
 * Standard Blood Pressure Categories (AHA Guidelines)
 */
export const getBPStatus = (systolic, diastolic) => {
  if (systolic >= 180 || diastolic >= 120) {
    return { 
      label: 'Hypertensive Crisis', 
      key: 'crisis',
      color: 'bg-red-50 text-red-600 border-red-100',
      badge: 'bg-red-100 text-red-700'
    };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return { 
      label: 'Stage 2 High', 
      key: 'high-stage-2',
      color: 'bg-orange-50 text-orange-600 border-orange-100',
      badge: 'bg-orange-100 text-orange-700'
    };
  }
  if (systolic >= 130 || diastolic >= 80) {
    return { 
      label: 'Stage 1 High', 
      key: 'high-stage-1',
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      badge: 'bg-amber-100 text-amber-700'
    };
  }
  if (systolic >= 120 && diastolic < 80) {
    return { 
      label: 'Elevated', 
      key: 'elevated',
      color: 'bg-yellow-50 text-yellow-600 border-yellow-100',
      badge: 'bg-yellow-100 text-yellow-700'
    };
  }
  return { 
    label: 'Normal', 
    key: 'normal',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    badge: 'bg-emerald-100 text-emerald-700'
  };
};
