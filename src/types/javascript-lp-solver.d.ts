declare module "javascript-lp-solver" {
  interface LpResult {
    feasible: boolean;
    result: number; // valor óptimo de la función objetivo
    [key: string]: number | boolean;
  }

  interface LpModel {
    optimize: string;
    opType: "min" | "max";
    constraints: {
      [name: string]: {
        equal?: number;
        max?: number;
        min?: number;
      };
    };
    variables: {
      [name: string]: {
        [key: string]: number;
      };
    };
  }

  const Solver: {
    Solve: (model: LpModel) => LpResult;
  };

  export default Solver;
}
