import { useFormContext } from "react-hook-form";

export const StepHealthInfo = () => {
  const { register } = useFormContext();
  
  return (
    <div className="space-y-5">
      <div className="mb-3">
        <label className="block text-sm font-bold">¿Tiene diabetes?</label>
        <input type="checkbox" {...register('diabetes')} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-bold">¿Tiene hipertensión?</label>
        <input type="checkbox" {...register('hypertension')} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-bold">¿Tiene lesiones musculares?</label>
        <input type="checkbox" {...register('muscleInjuries')} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-bold">¿Tiene problemas óseos o en articulaciones?</label>
        <input type="checkbox" {...register('boneJointIssues')} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-bold">¿Sufre de pérdida de equilibrio?</label>
        <input type="checkbox" {...register('balanceLoss')} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-bold">¿Tiene enfermedades cardiovasculares?</label>
        <input type="checkbox" {...register('cardiovascularDisease')} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-bold">¿Tiene problemas respiratorios?</label>
        <input type="checkbox" {...register('breathingIssues')} />
      </div>
    </div>
  );
};