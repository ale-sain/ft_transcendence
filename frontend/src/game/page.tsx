import { ClassGame } from './classGame';
import { useEffect } from 'react';
import { useState, useRef } from 'react';
import React from 'react';
import './game.css';
import './page.css';
import './button.css';
import './matchmaking.css'
import { SettingsMenu } from './settingsMenu';
import { EndGameMenu } from './endGameMenu';
import { Matchmaking } from './Matchmaking';
import { useAuth } from '../components/AuthProvider';
import { MatchHistory } from './matchHistory';
import { fetchUrl } from '../fetch';
import { StartGame } from './game';
import BoobaImg from './booba.jpeg';
import profil from './profil.jpeg';

export function Game() {
    const [gameStarted, setGameStarted] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [settingsToDo, setSettingsToDo] = useState(false);
    const [firstPlayer, setFirstPlayer] = useState(false);
    const [ballSpeed, setBallSpeed] = useState(5);
    const [paddleHeight, setPaddleHeight] = useState(200);
    const [paddleSpeed, setPaddleSpeed] = useState(5);
    const [increasedBallSpeed, setIncreasedBallSpeed] = useState(0.003);
    const [ballSize, setBallSize] = useState(15);
    const [Winner, setWinner] = useState(false);
    
    const [showEndGameModal, setShowEndGameModal] = useState(false);
    const [playerStats, setPlayerStats] = useState([]);
    const [isAbandon, setIsAbandon] = useState(false);
    const [letsGO, setLetsGO] = useState(false);
    
    const [playerOne, setPlayerOne] = useState([]);
    const [playerTwo, setPlayerTwo] = useState([]);
    
    const [historyAll, setHistoryAll] = useState([]);
    const [isSpectator, setIsSpectator] = useState(false);
    const [spectatorsBase, setSpectatorsBase] = useState([]);
    
    const gameInstance = useRef<ClassGame | null>(null);
    const auth = useAuth();

    function handleQuit() {
        setLetsGO(false);
        setGameStarted(false);
        setShowButton(true);
        setFirstPlayer(false);
        setSettingsToDo(false);
        setBallSpeed(5);
        setPaddleHeight(200);
        setPaddleSpeed(5);
        setIncreasedBallSpeed(0.003);
        setBallSize(15);
        setShowEndGameModal(false);
        setPlayerStats([]);
        setWinner(false);
        setPlayerOne([]);
        setPlayerTwo([]);
    }

    function handletsart() {
        auth?.socket?.emit('clickPlay');
        setShowButton(false);
    }

    function handleSaveSettings() {
        console.log('ballSpeed : ' + ballSpeed);
        auth?.socket?.emit('clickSaveSettings', {
            ballSpeed: ballSpeed,
            paddleSpeed: paddleSpeed,
            paddleHeight: paddleHeight,
            ballSize: ballSize,
            increasedBallSpeed: increasedBallSpeed
        });
        setSettingsToDo(false);
    }

    useEffect(() => {
        // Définition de la fonction asynchrone pour récupérer les matchs
        const fetchMatchHistory = async () => {
            try {
                const data = await fetchUrl('/game/history', {
                    method: "GET"
                });
                setHistoryAll(data);
            } catch (error) {
                console.error("Failed to fetch match history:", error);
            }
        };
        console.log("fetMatchHistory")
        fetchMatchHistory();
    }, []);

    function quitBack() {
        console.log(`showButton : ${showButton}, game: ${gameStarted}`);
        console.log(`${letsGO}, ${playerOne}`)
        console.log(`gameCurrent: ${gameInstance.current}`);
        if (!gameInstance.current)
        {
            auth?.socket?.emit('returnBack', { gameInstance: gameInstance.current });
        }
        else if (gameInstance.current)
        {
            auth?.socket?.emit('quitInGame');
            handleQuit();
        }
    }

    useEffect(() => {
        auth?.socket?.on('gameMatchmaking', (data) => {
            if (data.firstPlayer) {
                setFirstPlayer(true);
                if (!data.settingDone)
                    setSettingsToDo(true);
            }
        })

        auth?.socket?.on('matchmakingStats', (data) => {
            setPlayerOne(data.playerOne);
            setPlayerTwo(data.playerTwo);
        })

        auth?.socket?.on('gameLaunch', (data) => {
            console.log('GameLaunch');
            if (!gameStarted) {
                gameInstance.current = new ClassGame(React.createRef(), data.gameState, auth?.socket, { width:800, height:600 });
                setGameStarted(true);
                setSettingsToDo(false);
                if (data.spectators)
                    setSpectatorsBase(data.spectators);
            }
        })

        auth?.socket?.on('gameFinishedShowStats', (data) => {
            setWinner(data.winner);
            setPlayerStats(data.stats);
            setIsAbandon(data.isAbandon);
            setIsSpectator(data.isSpectator);
            setShowEndGameModal(true);
        })

        auth?.socket?.on('backToMenu', () => {
            setShowButton(true);
            setSettingsToDo(false);
            setFirstPlayer(false);
            setPlayerOne([]);
            setPlayerTwo([]);
        })

        auth?.socket?.on('letsGO', () => {
            setLetsGO(true);
        })

        auth?.socket?.on('matchs', (data) => {
            setHistoryAll(data);
        })

        return () => {
            auth?.socket?.off('gameLaunch');
            auth?.socket?.off('gameMatchmaking');
            auth?.socket?.off('backToMenu');
            auth?.socket?.off('gameFinishedShowStats');
            auth?.socket?.off('letsGO');
            auth?.socket?.off('matchs');
            auth?.socket?.off('matchmakingStats');
            quitBack();
        }
    }, []);

    return (
        <div className="page">
            {!gameStarted && showButton && historyAll && (
                <>
                    <div className="loading-animation">
                        <div className="boxxx">
                            <div className='div_start_game'>
                                <div className='StartButton' onClick={handletsart}>Start Game</div>
                            </div>
                        </div>
                    </div>
                    <MatchHistory matchs={historyAll} />
                </>
            )}
            {!gameStarted && !showButton && settingsToDo && (
                <>
                    <div className='CrossIcon' onClick={() => {
                        auth?.socket?.emit('crossMatchmaking');
                        }}>&#10006;</div>
                    <SettingsMenu
                        ballSpeed={ballSpeed}
                        setBallSpeed={setBallSpeed}
                        ballSize={ballSize}
                        setBallSize={setBallSize}
                        paddleHeight={paddleHeight}
                        setPaddleHeight={setPaddleHeight}
                        paddleSpeed={paddleSpeed}
                        setPaddleSpeed={setPaddleSpeed}
                        increasedBallSpeed={increasedBallSpeed}
                        setIncreasedBallSpeed={setIncreasedBallSpeed}
                        onSaveSettings={handleSaveSettings}
                    />
                </>
            )}
            {!gameStarted && !showButton && !settingsToDo && (
                <Matchmaking
                    playerOne={playerOne} 
                    playerTwo={playerTwo} 
                    letsgo={letsGO}
                />
            )}
            {gameStarted && gameInstance.current && (
                <StartGame gameInstance={gameInstance.current} spectatorBase={spectatorsBase}/>
            )}
            {gameStarted && !showEndGameModal && gameInstance.current && (
                <>
                    <div className='CrossIcon' onClick={() => {
                        auth?.socket?.emit('quitInGame');
                        handleQuit();
                    }} >&#10006;</div>
                </>
            )}
            {showEndGameModal && (
                <EndGameMenu
                    Winner={Winner}
                    isAbandon={isAbandon}
                    playerStats={playerStats}
                    isSpect={isSpectator}
                    onQuit={handleQuit}
                />
            )}
        </div>
    );
}
