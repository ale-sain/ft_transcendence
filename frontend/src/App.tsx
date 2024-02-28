import { useLocation, Outlet, Navigate, createBrowserRouter, RouterProvider, useRouteError } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Chat from './chat/page';
import { NavBar } from './components/NavBar';
import { Game } from './game/page';
import { AuthProvider, useAuth } from './components/AuthProvider';
import './App.css';
import './styles/chat.css';
import Settings from './pages/Settings';
import { Channels } from './chat/Channels';
import { Friends } from './chat/Friends';
import { ChatBox } from './chat/ChatBox';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PrivateMessagesPage } from './chat/PrivateMessagesPage.tsx'
import { Settings_game } from './game/Settings_game.tsx';
// import { Ball } from './game/settings_ball';
// import { Paddle } from './game/settings_paddle';
import { MatchmakingView } from './game/MatchmakingView';
import { GameProvider } from './components/GameProvider.tsx';
import { InGame } from './game/InGame';

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "",
				element: <div className='chatArea'></div>
			},
			{
				path: "chat",
				element: <RequireAuth><Chat /></RequireAuth>,
				children: [
					{
						path: 'channels',
						element: <Channels />,
					},
					{
						path: 'channels/:name',
						element: <ChatBox />,
					},
					{
						path: 'friends',
						element: <Friends />,
					},
					{
						path: "private-messages",
						element: <PrivateMessagesPage />,
					}
				]
			},
			{
				path: "login",
				element: <Login />
			},
			{
				path: "settings",
				element: <RequireAuth><Settings /></RequireAuth>
			},
			{
				path: "game",
				element: <RequireAuth><GameProvider><Game /></GameProvider></RequireAuth>,
				children: [
					{
						path: "settings",
						element: <Settings_game />,
					},
					{
						path: "matchmaking",
						element: <MatchmakingView />,
					},
					{
						path: "in_game",
						element: <InGame />,
					},
					{
						path: "finish_game",
						// element: <FinishGame />,
					}
						// children: [
						// 	{
						// 		path: "matchmaking",
						// 		element: <MatchmakingView />,
						// 		children: [
						// 			{
						// 				path: "in_game",
						// 				element: <InGame />,
						// 				children: [
						// 					{
						// 						path: "finish_game",
						// 						// element: <FinishGame />,
						// 					}
						// 				]
						// 			}
						// 		]
						// 	}
						// ]
					// }
				]
			}


		],
	},
])

export default function ErrorPage() {
	const error = useRouteError();

	return (
		<div id="error-page">
			<h1>Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<p>
				<i>{error?.error?.toString() ?? error?.toString()}</i>
			</p>
		</div>
	);
}

function Layout() {
	return (
		<AuthProvider>
			<NavBar />
			<div className='container'>
				<Outlet />
			</div>
			<ToastContainer theme='dark' />
		</AuthProvider>
	)
}

function RequireAuth({ children }: { children: JSX.Element }) {
	let auth = useAuth();
	let location = useLocation();

	if (auth?.loading) {
		return <div>Loading...</div>
	}

	if (!auth?.user) {
		return <Navigate to="/login" state={{ from: location }} replace />
	}

	return children;
}

export function App() {
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get('token');

		if (token) {
			localStorage.setItem('jwtToken', token);
			document.location.search = '';
		}
	}, []);

	return (
		<RouterProvider router={router} />
	);
}

