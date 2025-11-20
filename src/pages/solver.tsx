
import React, { useState } from "react";
import Solver from "javascript-lp-solver";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LpModel = any;

type Matrix = number[][];

function buildLpModel(costs: Matrix, supply: number[], demand: number[]): LpModel {
  const numSources = supply.length;
  const numDestinations = demand.length;

  const model: LpModel = {
    optimize: "cost",
    opType: "min",
    constraints: {},
    variables: {},
  };

  // Restricciones de oferta (supply)
  for (let i = 0; i < numSources; i++) {
    model.constraints[`supply_${i}`] = { equal: supply[i] };
  }

  // Restricciones de demanda (demand)
  for (let j = 0; j < numDestinations; j++) {
    model.constraints[`demand_${j}`] = { equal: demand[j] };
  }

  // Variables x_i_j
  for (let i = 0; i < numSources; i++) {
    for (let j = 0; j < numDestinations; j++) {
      const name = `x_${i}_${j}`;
      const cost = costs[i]?.[j] ?? 0;

      model.variables[name] = {
        cost,
        [`supply_${i}`]: 1,
        [`demand_${j}`]: 1,
      };
    }
  }

  return model;
}

const App: React.FC = () => {
  const [numSources, setNumSources] = useState<number>(3);
  const [numDestinations, setNumDestinations] = useState<number>(3);

  const [costs, setCosts] = useState<Matrix>(
    Array.from({ length: 3 }, () => Array(3).fill(0))
  );
  const [supply, setSupply] = useState<number[]>([100, 300, 300]);
  const [demand, setDemand] = useState<number[]>([300, 200, 200]);

  const [solution, setSolution] = useState<Matrix | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const totalSupply = supply.reduce((a, b) => a + (Number(b) || 0), 0);
  const totalDemand = demand.reduce((a, b) => a + (Number(b) || 0), 0);

  const handleResize = (rows: number, cols: number) => {
    const newCosts: Matrix = Array.from({ length: rows }, (_, i) =>
      Array.from({ length: cols }, (_, j) =>
        costs[i]?.[j] !== undefined ? costs[i][j] : 0
      )
    );

    const newSupply = Array.from({ length: rows }, (_, i) =>
      supply[i] !== undefined ? supply[i] : 0
    );
    const newDemand = Array.from({ length: cols }, (_, j) =>
      demand[j] !== undefined ? demand[j] : 0
    );

    setCosts(newCosts);
    setSupply(newSupply);
    setDemand(newDemand);
  };

  const handleSolve = () => {
    setError("");
    setSolution(null);
    setTotalCost(null);

    if (totalSupply !== totalDemand) {
      setError(
        `El problema debe estar balanceado. Oferta total = ${totalSupply}, Demanda total = ${totalDemand}.`
      );
      return;
    }

    const numericCosts = costs.map((row) => row.map((c) => Number(c) || 0));
    const numericSupply = supply.map((s) => Number(s) || 0);
    const numericDemand = demand.map((d) => Number(d) || 0);

    const model = buildLpModel(numericCosts, numericSupply, numericDemand);
    const result = Solver.Solve(model);

    if (!result.feasible) {
      setError("El modelo no es factible. Revisa los datos.");
      return;
    }

    const sol: Matrix = Array.from(
      { length: numSources },
      () => Array(numDestinations).fill(0)
    );

    Object.keys(result)
      .filter((k) => k.startsWith("x_"))
      .forEach((key) => {
        const [, iStr, jStr] = key.split("_");
        const i = Number(iStr);
        const j = Number(jStr);
        const value = Number(result[key] as number);
        sol[i][j] = value;
      });

    setSolution(sol);
    setTotalCost(result.result as number);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center items-start py-8 px-4">
      <div className="w-full max-w-5xl bg-slate-900 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">
            Modelo de Transporte – Solver
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            Ingresa los costos de transporte, la capacidad de cada fábrica
            (supply) y la demanda de cada almacén (demand). El sistema calcula
            la solución óptima de costo mínimo.
          </p>
        </header>

        {/* Controles de tamaño */}
        <section className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">
              Fábricas (filas / rows)
            </label>
            <input
              type="number"
              min={1}
              value={numSources}
              onChange={(e) => {
                const v = Math.max(1, Number(e.target.value) || 1);
                setNumSources(v);
                handleResize(v, numDestinations);
              }}
              className="w-20 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">
              Almacenes (columnas / cols)
            </label>
            <input
              type="number"
              min={1}
              value={numDestinations}
              onChange={(e) => {
                const v = Math.max(1, Number(e.target.value) || 1);
                setNumDestinations(v);
                handleResize(numSources, v);
              }}
              className="w-20 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </section>

        {/* Tabla de entrada */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Matriz de costos y capacidades
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[550px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-slate-700 bg-slate-800 px-2 py-2 text-left">
                    Fábrica / Almacén
                  </th>
                  {Array.from({ length: numDestinations }, (_, j) => (
                    <th
                      key={j}
                      className="border border-slate-700 bg-slate-800 px-2 py-2"
                    >
                      Almacén {j + 1}
                    </th>
                  ))}
                  <th className="border border-slate-700 bg-slate-800 px-2 py-2">
                    Capacidad (Supply)
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: numSources }, (_, i) => (
                  <tr key={i}>
                    <td className="border border-slate-700 bg-slate-900 px-2 py-2 font-semibold">
                      Fábrica {i + 1}
                    </td>
                    {Array.from({ length: numDestinations }, (_, j) => (
                      <td
                        key={j}
                        className="border border-slate-700 bg-slate-900 px-1 py-1"
                      >
                        <input
                          type="number"
                          value={costs[i][j]}
                          onChange={(e) => {
                            const value = Number(e.target.value) || 0;
                            const newCosts = costs.map((row) => [...row]);
                            newCosts[i][j] = value;
                            setCosts(newCosts);
                          }}
                          className="w-20 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </td>
                    ))}
                    <td className="border border-slate-700 bg-slate-900 px-1 py-1">
                      <input
                        type="number"
                        value={supply[i]}
                        onChange={(e) => {
                          const value = Number(e.target.value) || 0;
                          const newSupply = [...supply];
                          newSupply[i] = value;
                          setSupply(newSupply);
                        }}
                        className="w-24 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </td>
                  </tr>
                ))}

                {/* Fila de demanda */}
                <tr>
                  <td className="border border-slate-700 bg-slate-800 px-2 py-2 font-semibold">
                    Demanda (Demand)
                  </td>
                  {Array.from({ length: numDestinations }, (_, j) => (
                    <td
                      key={j}
                      className="border border-slate-700 bg-slate-900 px-1 py-1"
                    >
                      <input
                        type="number"
                        value={demand[j]}
                        onChange={(e) => {
                          const value = Number(e.target.value) || 0;
                          const newDemand = [...demand];
                          newDemand[j] = value;
                          setDemand(newDemand);
                        }}
                        className="w-20 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </td>
                  ))}
                  <td className="border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-slate-300">
                    <div>Oferta total: {totalSupply}</div>
                    <div>Demanda total: {totalDemand}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Botón resolver */}
        <section className="space-y-3">
          <button
            onClick={handleSolve}
            className="rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 px-6 py-2 text-sm font-semibold text-white shadow-lg hover:from-emerald-400 hover:via-emerald-500 hover:to-emerald-400 transition"
          >
            Resolver modelo de transporte
          </button>

          {error && (
            <div className="rounded-lg bg-red-900/60 px-3 py-2 text-sm text-red-100">
              {error}
            </div>
          )}
        </section>

        {/* Resultado */}
        {solution && totalCost !== null && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Solución óptima</h2>
            <p className="text-sm">
              Costo mínimo (min Z):{" "}
              <span className="font-bold text-emerald-400">
                ${totalCost.toFixed(2)}
              </span>
            </p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[550px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border border-slate-700 bg-slate-800 px-2 py-2 text-left">
                      Fábrica / Almacén
                    </th>
                    {Array.from({ length: numDestinations }, (_, j) => (
                      <th
                        key={j}
                        className="border border-slate-700 bg-slate-800 px-2 py-2"
                      >
                        Almacén {j + 1}
                      </th>
                    ))}
                    <th className="border border-slate-700 bg-slate-800 px-2 py-2">
                      Suma fila
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {solution.map((row, i) => {
                    const rowSum = row.reduce((a, b) => a + b, 0);
                    return (
                      <tr key={i}>
                        <td className="border border-slate-700 bg-slate-900 px-2 py-2 font-semibold">
                          Fábrica {i + 1}
                        </td>
                        {row.map((value, j) => (
                          <td
                            key={j}
                            className="border border-slate-700 bg-slate-900 px-2 py-2 bg-emerald-900/20"
                          >
                            {value.toFixed(2)}
                          </td>
                        ))}
                        <td className="border border-slate-700 bg-slate-900 px-2 py-2">
                          {rowSum.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="border border-slate-700 bg-slate-800 px-2 py-2 font-semibold">
                      Suma columna
                    </td>
                    {Array.from({ length: numDestinations }, (_, j) => {
                      const colSum = solution.reduce((acc, row) => acc + row[j], 0);
                      return (
                        <td
                          key={j}
                          className="border border-slate-700 bg-slate-900 px-2 py-2"
                        >
                          {colSum.toFixed(2)}
                        </td>
                      );
                    })}
                    <td className="border border-slate-700 bg-slate-900 px-2 py-2">
                      {totalSupply.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default App;
