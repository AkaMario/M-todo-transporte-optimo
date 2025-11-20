
import React from "react";

const DocsPage: React.FC = () => {
	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
			<div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl p-8 space-y-6 shadow-lg">
				<h1 className="text-3xl font-bold">Documentación — Solver (Modelo de Transporte)</h1>

				<section className="space-y-2">
					<h2 className="text-xl font-semibold">Resumen</h2>
					<p className="text-slate-300">
						Esta aplicación implementa un solucionador del problema de transporte (transportation
						problem). Dado un conjunto de orígenes (fábricas) con capacidades (supply), un conjunto
						de destinos (almacenes) con demandas (demand) y una matriz de costos por unidad entre
						cada par origen-destino, el objetivo es asignar cantidades para satisfacer la demanda
						minimizando el costo total.
					</p>
				</section>

				<section className="space-y-2">
					<h2 className="text-xl font-semibold">Arquitectura y archivos clave</h2>
					<ul className="list-disc ml-5 text-slate-300 space-y-1">
						<li><code>src/pages/solver.tsx</code>: Interfaz de usuario y la lógica principal del solver.</li>
						<li><code>src/pages/docs.tsx</code>: Esta página de documentación.</li>
						<li><code>src/components/navbar.tsx</code>: Componente de navegación (placeholder en este proyecto).</li>
						<li><code>types/javascript-lp-solver.d.ts</code>: definiciones de tipos para <code>javascript-lp-solver</code>.</li>
						<li><code>package.json</code>: dependencias y scripts (Vite, Tailwind, React, javascript-lp-solver, etc.).</li>
					</ul>
				</section>

				<section className="space-y-2">
					<h2 className="text-xl font-semibold">Lógica matemática (modelo de programación lineal)</h2>
					<p className="text-slate-300">
						El problema se modela como un problema lineal con las siguientes características:
					</p>
					<ul className="list-disc ml-5 text-slate-300 space-y-1">
						<li>
							Variables: para cada par origen (i) y destino (j) se define una variable{' '}
							<code>x_i_j</code> que indica la cantidad enviada desde i hacia j.
						</li>
						<li>
							Función objetivo: minimizar el costo total Z. En términos simples, Z es la suma
							sobre i y j del producto coste × cantidad (por ejemplo, cost_i_j * x_i_j).
						</li>
						<li>
							Restricciones de oferta: para cada origen i, la suma sobre j de <code>x_i_j</code> debe ser igual
							a la capacidad (<code>supply_i</code>) de ese origen.
						</li>
						<li>
							Restricciones de demanda: para cada destino j, la suma sobre i de <code>x_i_j</code> debe ser igual
							a la demanda (<code>demand_j</code>) de ese destino.
						</li>
						<li>
							Balance: el modelo asume que la oferta total = demanda total. Si no están balanceadas,
							la interfaz muestra un error y no intenta resolver.
						</li>
					</ul>
				</section>

				<section className="space-y-2">
					<h2 className="text-xl font-semibold">Funciones principales en el código</h2>
					<p className="text-slate-300">
						A continuación se describen las funciones clave que implementan el modelo y la resolución:
					</p>
					<ul className="list-disc ml-5 text-slate-300 space-y-1">
						<li>
							<strong>buildLpModel(costs, supply, demand)</strong>: Construye el objeto modelo esperado por
							<code>javascript-lp-solver</code>. Crea las variables nombradas como <code>x_i_j</code>, añade los
							coeficientes de coste y define las restricciones de oferta y demanda como igualdades.
						</li>
						<li>
							<strong>handleSolve()</strong>: Valida balance de oferta/demanda, convierte entradas a números,
							llama a <code>Solver.Solve(model)</code> y parsea el resultado.
						</li>
						<li>
							Parseo de resultado: el objeto que devuelve <code>javascript-lp-solver</code> contiene las
							variables por nombre (por ejemplo <code>x_0_1</code>) y la clave <code>result</code> con el valor
							del objetivo. El código filtra las claves que empiezan por <code>x_</code> y las transforma
							a una matriz para mostrar la solución en tablas.
						</li>
						<li>
							<strong>handleResize(rows, cols)</strong>: Ajusta los arrays de <code>costs</code>, <code>supply</code>
							y <code>demand</code> cuando el usuario cambia el número de filas/columnas.
						</li>
					</ul>
				</section>

				<section className="space-y-2">
					<h2 className="text-xl font-semibold">Dependencias y herramientas</h2>
					<ul className="list-disc ml-5 text-slate-300 space-y-1">
						<li><strong>React</strong>: librería UI (componentes y estado).</li>
						<li><strong>Vite</strong>: bundler / dev server usado en este proyecto.</li>
						<li><strong>Tailwind CSS</strong>: utilidades CSS para estilos (clases usadas en los componentes).</li>
						<li><strong>javascript-lp-solver</strong>: librería que resuelve modelos de programación lineal.
							El código construye el objeto con variables/constraints y llama <code>Solver.Solve(model)</code>.
						</li>
						<li><strong>TypeScript</strong>: tipado estático. Hay un archivo de tipos en
							<code>src/types/javascript-lp-solver.d.ts</code> para mejorar la experiencia de desarrollo.
						</li>
						<li><strong>ESLint</strong>: linter configurado en el proyecto.</li>
					</ul>
				</section>

				<section className="space-y-2">
					<h2 className="text-xl font-semibold">Notas de implementación y buenas prácticas</h2>
					<ul className="list-disc ml-5 text-slate-300 space-y-1">
						<li>
							Asegúrate de que la oferta total y la demanda total están balanceadas antes de resolver.
						</li>
						<li>
							El modelo actual usa igualdades en las restricciones; si quieres permitir sobredemanda u
							ofertas no cumplidas, tendrías que cambiar las restricciones a &lt;= o &gt;= y ajustar el modelo.
						</li>
						<li>
							Para datasets grandes, considera validar y normalizar entradas (evitar NaN) y manejar límites
							numéricos o performance en la construcción del modelo.
						</li>
					</ul>
				</section>

				<section className="space-y-2">
					<h2 className="text-xl font-semibold">Cómo ejecutar el proyecto</h2>
					<p className="text-slate-300">Ejecuta los comandos en el directorio del proyecto:</p>
					<pre className="bg-slate-800 rounded-md p-3 text-sm text-slate-200">
						<code>pnpm install
pnpm dev</code>
					</pre>
				</section>

				<section className="space-y-2">
					<h2 className="text-xl font-semibold">Dónde mirar si necesitas extenderlo</h2>
					<ul className="list-disc ml-5 text-slate-300 space-y-1">
						<li>Editar la función <code>buildLpModel</code> para cambiar el tipo de restricciones.</li>
						<li>Reemplazar el solver por uno diferente si necesitas características avanzadas.</li>
						<li>Agregar validaciones UI para inputs (valores negativos, no numéricos, etc.).</li>
					</ul>
				</section>

				<footer className="text-sm text-slate-400">
					Página generada: explicación del código y dependencias usadas en el proyecto <code>solver</code>.
				</footer>
			</div>
		</div>
	);
};

export default DocsPage;
