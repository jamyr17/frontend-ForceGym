import { formatDate } from "../shared/utils/format";
import useMeasurementStore from "./Store";

function DataInfo() {
    const { measurements, activeEditingId } = useMeasurementStore();
    if (!activeEditingId) return <></>;

    const measurement = measurements.find(m => m.idMeasurement === activeEditingId);
    if (!measurement) return <></>;

    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Medición</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>FECHA DE MEDICIÓN</strong></p>
                    <p>{formatDate(new Date(measurement.measurementDate))}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>PESO</strong></p>
                    <p>{measurement.weight} kg</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>ALTURA</strong></p>
                    <p>{measurement.height} cm</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>MÚSCULO (%)</strong></p>
                    <p>{measurement.muscleMass} %</p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Medidas Corporales</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>GRASA CORPORAL (%)</strong></p>
                    <p>{measurement.bodyFatPercentage} %</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>GRASA VISCERAL (%)</strong></p>
                    <p>{measurement.visceralFatPercentage} %</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>TALLA DE CUELLO (cm)</strong></p>
                    <p>{measurement.neckSize}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>TALLA DE HOMBROS (cm)</strong></p>
                    <p>{measurement.shoulderSize}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>TALLA DE PECHO (cm)</strong></p>
                    <p>{measurement.chestSize}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>CINTURA (cm)</strong></p>
                    <p>{measurement.waistSize}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>PIERNA (cm)</strong></p>
                    <p>{measurement.thighSize}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>PANTORRILLA (cm)</strong></p>
                    <p>{measurement.calfSize}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>ANTEBRAZO (cm)</strong></p>
                    <p>{measurement.forearmSize}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>BRAZO (cm)</strong></p>
                    <p>{measurement.armSize}</p>
                </div>
            </div>
        </div>
    );
}

export default DataInfo;
