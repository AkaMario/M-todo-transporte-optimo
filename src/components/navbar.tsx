
import { Link } from 'react-router-dom'
import { FaCogs, FaGithub } from 'react-icons/fa';

function navbar() {
  return (
    <div className="bg-slate-950 shadow-md">
        <nav className="mx-auto p-4 flex justify-center items-center bg-slate-900 rounded-b-2xl shadow-md max-w-4xl">
            <ul className="flex items-center justify-center space-x-6 text-slate-100 font-medium gap-2">
                <li className="hover:scale-105 transition-transform">
                    <Link to="/" className="flex items-center">
                        <FaCogs style={{ verticalAlign: 'middle', marginRight: 8 }} />
                        Solver
                    </Link>
                </li>
                <li className="flex items-center hover:scale-105 transition-transform">
                    <Link to="/docs" className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"><path fill="#fff" d="M240 216V32H92a12 12 0 0 0-12 12v424a12 12 0 0 0 12 12h328a12 12 0 0 0 12-12V224H248a8 8 0 0 1-8-8"/><path fill="#fff" d="M272 41.69V188a4 4 0 0 0 4 4h146.31a2 2 0 0 0 1.42-3.41L275.41 40.27a2 2 0 0 0-3.41 1.42"/></svg>
                        Documentación
                    </Link>
                </li>
                <li className="flex items-center hover:scale-105 transition-transform">
                    <Link to="https://github.com/AkaMario/M-todo-transporte-optimo" className="flex items-center">
                        <FaGithub style={{ verticalAlign: 'middle', marginRight: 8 }} />
                        Github
                    </Link>
                </li>
            </ul>
        </nav>
    </div>
        
  )
}

export default navbar