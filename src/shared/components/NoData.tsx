import { CiWarning } from "react-icons/ci";
import { ReactNode } from "react";

type NoDataProps = {
  module: string;
  children?: ReactNode;
};

function NoData({ module, children }: NoDataProps) {
  const mod = module?.trim() || 'datos';

  return (
    <div className="self-center flex flex-col text-center flex-center gap-2 my-8 m-4">
      <CiWarning className="text-red-500 text-8xl self-center" />
      <span className="text-2xl">No hay {mod} para mostrar</span>
      <span className="text-1xl font-bold">Intenta agregando</span>

      {children && (
        <div data-testid="custom-children">{children}</div>
      )}
    </div>
  );
}

export default NoData;
